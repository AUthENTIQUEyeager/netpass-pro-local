const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middlewares/auth');
const { createHotspotUser, deleteHotspotUser, disconnectActiveUser, generateCredentials } = require('../services/mikrotik');

const prisma = new PrismaClient();

// ── GET /api/tickets ──────────────────────────────────────────────────────────
router.get('/', auth, async (req, res) => {
  try {
    const { statut, routeur_id, search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (statut) where.statut = statut;
    if (routeur_id) where.routeur_id = routeur_id;
    // SQLite: pas de mode 'insensitive', on utilise contains simple
    if (search) {
      where.OR = [
        { username: { contains: search } }
      ];
    }

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        include: {
          routeur: { select: { nom: true, site: true } },
          commande: { select: { montant: true } }
        },
        orderBy: { date_creation: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.ticket.count({ where })
    ]);

    res.json({ tickets, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ── POST /api/tickets/manuel — Générer tickets manuellement (cash) ────────────
router.post('/manuel', auth, async (req, res) => {
  try {
    const { forfait_id, routeur_id, quantite = 1 } = req.body;

    if (quantite > 200) {
      return res.status(400).json({ error: 'Maximum 200 tickets par génération' });
    }

    const [forfait, routeur] = await Promise.all([
      prisma.forfait.findUnique({ where: { id: forfait_id } }),
      prisma.routeur.findUnique({ where: { id: routeur_id } })
    ]);

    if (!forfait) return res.status(404).json({ error: 'Forfait introuvable' });
    if (!routeur) return res.status(404).json({ error: 'Routeur introuvable' });

    const ticketsCrees = [];
    const erreurs = [];

    for (let i = 0; i < quantite; i++) {
      try {
        const { username, password } = generateCredentials();

        const commande = await prisma.commande.create({
          data: {
            forfait_id,
            routeur_id,
            montant: forfait.prix,
            statut: 'payé',
            wave_ref: `CASH-${Date.now()}-${i}`
          }
        });

        // Créer l'utilisateur dans MikroTik
        await createHotspotUser(routeur, {
          username,
          password,
          duree_heures: forfait.duree_heures
        });

        const expiration = new Date();
        expiration.setHours(expiration.getHours() + forfait.duree_heures);

        const ticket = await prisma.ticket.create({
          data: {
            commande_id: commande.id,
            routeur_id,
            username,
            password,
            type: 'manuel',
            statut: 'actif',
            date_expiration: expiration
          }
        });

        ticketsCrees.push({
          id: ticket.id,
          username: ticket.username,
          password: ticket.password,
          date_expiration: ticket.date_expiration,
          forfait: forfait.nom,
          duree: forfait.duree_heures,
          prix: forfait.prix,
          vitesse: forfait.vitesse,
          site: routeur.site,
          nom_reseau: routeur.nom
        });
      } catch (err) {
        erreurs.push({ index: i, error: err.message });
      }
    }

    res.json({
      success: ticketsCrees.length,
      erreurs: erreurs.length,
      tickets: ticketsCrees
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── PUT /api/tickets/:id/desactiver ───────────────────────────────────────────
router.put('/:id/desactiver', auth, async (req, res) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: req.params.id },
      include: { routeur: true }
    });
    if (!ticket) return res.status(404).json({ error: 'Ticket introuvable' });

    await deleteHotspotUser(ticket.routeur, ticket.username);
    await disconnectActiveUser(ticket.routeur, ticket.username);

    await prisma.ticket.update({
      where: { id: req.params.id },
      data: { statut: 'désactivé' }
    });

    res.json({ message: 'Ticket désactivé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── DELETE /api/tickets/:id ───────────────────────────────────────────────────
router.delete('/:id', auth, async (req, res) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: req.params.id },
      include: { routeur: true }
    });
    if (!ticket) return res.status(404).json({ error: 'Ticket introuvable' });

    await deleteHotspotUser(ticket.routeur, ticket.username).catch(() => {});
    await prisma.ticket.delete({ where: { id: req.params.id } });

    res.json({ message: 'Ticket supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
