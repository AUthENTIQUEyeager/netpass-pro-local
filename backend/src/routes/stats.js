const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middlewares/auth');

const prisma = new PrismaClient();

// ── GET /api/stats/overview — Vue d'ensemble dashboard ───────────────────────
router.get('/overview', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      ticketsActifs,
      ticketsAujourdhui,
      revenusAujourdhui,
      totalTickets,
      commandesRecentes
    ] = await Promise.all([
      prisma.ticket.count({ where: { statut: 'actif' } }),
      prisma.ticket.count({ where: { date_creation: { gte: today } } }),
      prisma.commande.aggregate({
        where: { statut: 'payé', created_at: { gte: today, lte: todayEnd } },
        _sum: { montant: true }
      }),
      prisma.ticket.count(),
      prisma.commande.findMany({
        where: { statut: 'payé' },
        include: { forfait: true, routeur: { select: { site: true } } },
        orderBy: { created_at: 'desc' },
        take: 10
      })
    ]);

    // Revenus 7 derniers jours
    const revenus7j = await getRevenus7Jours();

    res.json({
      ticketsActifs,
      ticketsAujourdhui,
      revenusAujourdhui: revenusAujourdhui._sum.montant || 0,
      totalTickets,
      revenus7j,
      commandesRecentes
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── GET /api/stats/revenus — Revenus par période ──────────────────────────────
router.get('/revenus', auth, async (req, res) => {
  try {
    const { periode = '7j' } = req.query;
    let jours = 7;
    if (periode === '30j') jours = 30;
    if (periode === '90j') jours = 90;

    const data = await getRevenusPeriode(jours);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Revenus 7 derniers jours ──────────────────────────────────────────────────
async function getRevenus7Jours() {
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const dateFin = new Date(date);
    dateFin.setHours(23, 59, 59, 999);

    const rev = await prisma.commande.aggregate({
      where: { statut: 'payé', created_at: { gte: date, lte: dateFin } },
      _sum: { montant: true },
      _count: true
    });

    result.push({
      date: date.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit' }),
      revenus: rev._sum.montant || 0,
      commandes: rev._count || 0
    });
  }
  return result;
}

async function getRevenusPeriode(jours) {
  return getRevenus7Jours();
}

module.exports = router;
