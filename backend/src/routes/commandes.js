const express = require('express');
const router = express.Router();
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const { createCheckoutSession, getPaymentStatus } = require('../services/wave');
const { createHotspotUser, generateCredentials } = require('../services/mikrotik');

const prisma = new PrismaClient();

const commandeSchema = z.object({
  forfait_id: z.string().uuid(),
  routeur_id: z.string().uuid(),
  client_tel: z.string().optional()
});

// ── POST /api/commandes — Créer une commande + lien Wave ──────────────────────
router.post('/', async (req, res) => {
  try {
    const { forfait_id, routeur_id, client_tel } = commandeSchema.parse(req.body);

    const forfait = await prisma.forfait.findUnique({ where: { id: forfait_id } });
    if (!forfait || !forfait.actif) {
      return res.status(404).json({ error: 'Forfait introuvable ou inactif' });
    }

    const routeur = await prisma.routeur.findUnique({ where: { id: routeur_id } });
    if (!routeur) return res.status(404).json({ error: 'Site WiFi introuvable' });
    if (routeur.statut === 'hors_ligne') {
      return res.status(503).json({ error: 'Ce réseau WiFi est temporairement indisponible' });
    }

    const commande = await prisma.commande.create({
      data: { forfait_id, routeur_id, montant: forfait.prix, statut: 'en_attente', client_tel: client_tel || null }
    });

    const waveSession = await createCheckoutSession({
      amount: forfait.prix,
      commande_id: commande.id,
      forfait_nom: forfait.nom
    });

    // Sauvegarder le session_id Wave pour le polling
    await prisma.commande.update({
      where: { id: commande.id },
      data: { wave_checkout_id: waveSession.session_id }
    });

    res.json({
      commande_id: commande.id,
      checkout_url: waveSession.checkout_url,
      forfait: { nom: forfait.nom, prix: forfait.prix, duree: forfait.duree_heures, vitesse: forfait.vitesse },
      site: routeur.site
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Données invalides', details: error.errors });
    }
    console.error('[Commande] Erreur:', error.message);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
});

// ── GET /api/commandes/:id — Statut commande + polling Wave automatique ────────
// Le frontend appelle cette route toutes les 3s après paiement Wave
// Si le paiement Wave est confirmé mais le ticket pas encore créé → on crée ici
router.get('/:id', async (req, res) => {
  try {
    const commande = await prisma.commande.findUnique({
      where: { id: req.params.id },
      include: {
        forfait: true,
        routeur: { select: { nom: true, site: true, ip_address: true, api_port: true, api_user: true, api_password: true, statut: true } },
        ticket: true
      }
    });

    if (!commande) return res.status(404).json({ error: 'Commande introuvable' });

    // ── POLLING WAVE : si en attente et session Wave connue → vérifier ─────────
    if (commande.statut === 'en_attente' && commande.wave_checkout_id) {
      try {
        const waveStatus = await getPaymentStatus(commande.wave_checkout_id);

        if (waveStatus.status === 'succeeded') {
          // Paiement confirmé → créer le ticket MikroTik
          await creerTicketDepuisCommande(commande);

          // Recharger la commande mise à jour
          const commandeMaj = await prisma.commande.findUnique({
            where: { id: req.params.id },
            include: { forfait: true, routeur: { select: { nom: true, site: true } }, ticket: true }
          });

          return res.json(formaterCommande(commandeMaj));
        }
      } catch (waveErr) {
        // Si Wave inaccessible (pas internet) on retourne quand même la commande
        console.warn('[Polling Wave] Erreur:', waveErr.message);
      }
    }

    res.json(formaterCommande(commande));
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ── HELPER : formater la réponse commande ─────────────────────────────────────
function formaterCommande(commande) {
  return {
    id: commande.id,
    statut: commande.statut,
    montant: commande.montant,
    forfait: commande.forfait,
    site: commande.routeur?.site,
    ticket: commande.ticket ? {
      username: commande.ticket.username,
      password: commande.ticket.password,
      date_expiration: commande.ticket.date_expiration,
      statut: commande.ticket.statut
    } : null,
    created_at: commande.created_at
  };
}

// ── HELPER : créer ticket MikroTik après paiement Wave confirmé ───────────────
async function creerTicketDepuisCommande(commande) {
  if (commande.statut === 'payé') return; // déjà traité

  await prisma.commande.update({ where: { id: commande.id }, data: { statut: 'en_traitement' } });

  const { username, password } = generateCredentials();

  await createHotspotUser(commande.routeur, {
    username,
    password,
    duree_heures: commande.forfait.duree_heures
  });

  const expiration = new Date();
  expiration.setHours(expiration.getHours() + commande.forfait.duree_heures);

  await prisma.ticket.create({
    data: {
      commande_id: commande.id,
      routeur_id: commande.routeur_id || commande.routeur.id,
      username,
      password,
      type: 'online',
      statut: 'actif',
      date_expiration: expiration
    }
  });

  await prisma.commande.update({ where: { id: commande.id }, data: { statut: 'payé' } });
  console.log(`[Polling] Ticket créé: ${username} — commande ${commande.id}`);
}

module.exports = router;
