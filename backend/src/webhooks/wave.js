const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { verifyWebhookSignature } = require('../services/wave');
const { createHotspotUser, generateCredentials } = require('../services/mikrotik');

const prisma = new PrismaClient();

// ── WEBHOOK WAVE ──────────────────────────────────────────────────────────────
// Wave appelle cette route dès qu'un paiement est confirmé
router.post('/wave', async (req, res) => {
  const signature = req.headers['wave-signature'] || req.headers['x-wave-signature'];
  const payload = req.body; // raw buffer grâce à express.raw()

  // 1. Vérifier la signature Wave
  const isValid = verifyWebhookSignature(payload, signature);
  if (!isValid) {
    console.warn('[Webhook] Signature invalide — requête rejetée');
    return res.status(401).json({ error: 'Signature invalide' });
  }

  let event;
  try {
    event = JSON.parse(payload.toString());
  } catch {
    return res.status(400).json({ error: 'Payload invalide' });
  }

  console.log(`[Webhook] Événement reçu: ${event.type}`);

  // 2. Traiter uniquement les paiements réussis
  if (event.type !== 'checkout.session.completed') {
    return res.status(200).json({ received: true });
  }

  const { client_reference: commande_id, payment_status } = event.data || {};

  if (payment_status !== 'succeeded' || !commande_id) {
    return res.status(200).json({ received: true });
  }

  // Répondre à Wave immédiatement (max 5s) avant traitement
  res.status(200).json({ received: true });

  // 3. Traitement asynchrone
  processPayment(commande_id, event.data).catch(err => {
    console.error(`[Webhook] Erreur traitement commande ${commande_id}:`, err.message);
  });
});

// ── TRAITEMENT DU PAIEMENT ────────────────────────────────────────────────────
async function processPayment(commande_id, waveData) {
  // Vérifier que la commande n'a pas déjà été traitée (idempotence)
  const commande = await prisma.commande.findUnique({
    where: { id: commande_id },
    include: { forfait: true, routeur: true }
  });

  if (!commande) {
    console.error(`[Webhook] Commande introuvable: ${commande_id}`);
    return;
  }

  if (commande.statut === 'payé') {
    console.log(`[Webhook] Commande ${commande_id} déjà traitée — ignorée`);
    return;
  }

  console.log(`[Webhook] Traitement commande ${commande_id} — ${commande.forfait.nom}`);

  // Mettre à jour le statut Wave
  await prisma.commande.update({
    where: { id: commande_id },
    data: {
      statut: 'en_traitement',
      wave_checkout_id: waveData.id
    }
  });

  // Créer le ticket MikroTik avec retry
  let ticket = null;
  let lastError = null;
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { username, password } = generateCredentials();

      await createHotspotUser(commande.routeur, {
        username,
        password,
        duree_heures: commande.forfait.duree_heures
      });

      // Calculer date d'expiration
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + commande.forfait.duree_heures);

      // Enregistrer le ticket en base
      ticket = await prisma.ticket.create({
        data: {
          commande_id: commande.id,
          routeur_id: commande.routeur_id,
          username,
          password,
          type: 'online',
          statut: 'actif',
          date_expiration: expiration
        }
      });

      // Marquer la commande comme payée
      await prisma.commande.update({
        where: { id: commande_id },
        data: { statut: 'payé' }
      });

      console.log(`[Webhook] Ticket créé avec succès: ${username} — expire le ${expiration.toISOString()}`);
      break;

    } catch (error) {
      lastError = error;
      console.error(`[Webhook] Tentative ${attempt}/${maxRetries} échouée:`, error.message);

      if (attempt < maxRetries) {
        // Attendre 30s avant de réessayer
        await new Promise(r => setTimeout(r, 30000));
      }
    }
  }

  // Si toutes les tentatives ont échoué
  if (!ticket) {
    await prisma.commande.update({
      where: { id: commande_id },
      data: { statut: 'erreur_mikrotik' }
    });
    console.error(`[Webhook] Échec création ticket après ${maxRetries} tentatives:`, lastError?.message);
  }
}

module.exports = router;
