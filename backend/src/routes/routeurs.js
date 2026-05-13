const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middlewares/auth');
const { testConnection, getActiveUsers, getRouterStats } = require('../services/mikrotik');

const prisma = new PrismaClient();

// ── GET /api/routeurs — Liste tous les routeurs (public, sans credentials) ────
router.get('/', async (req, res) => {
  const routeurs = await prisma.routeur.findMany({
    where: { statut: { not: 'supprimé' } },
    select: { id: true, nom: true, site: true, statut: true }
  });
  res.json(routeurs);
});

// ── POST /api/routeurs — Ajouter un routeur ───────────────────────────────────
router.post('/', auth, async (req, res) => {
  try {
    const routeur = await prisma.routeur.create({ data: req.body });
    const test = await testConnection(routeur);
    await prisma.routeur.update({
      where: { id: routeur.id },
      data: { statut: test.connected ? 'actif' : 'hors_ligne' }
    });
    res.json({ ...routeur, connected: test.connected });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── PUT /api/routeurs/:id ─────────────────────────────────────────────────────
router.put('/:id', auth, async (req, res) => {
  try {
    const routeur = await prisma.routeur.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(routeur);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── GET /api/routeurs/:id/test — Tester la connexion ─────────────────────────
router.get('/:id/test', auth, async (req, res) => {
  const routeur = await prisma.routeur.findUnique({ where: { id: req.params.id } });
  if (!routeur) return res.status(404).json({ error: 'Routeur introuvable' });
  const result = await testConnection(routeur);
  await prisma.routeur.update({
    where: { id: req.params.id },
    data: { statut: result.connected ? 'actif' : 'hors_ligne' }
  });
  res.json(result);
});

// ── GET /api/routeurs/:id/actifs — Clients connectés ─────────────────────────
router.get('/:id/actifs', auth, async (req, res) => {
  const routeur = await prisma.routeur.findUnique({ where: { id: req.params.id } });
  if (!routeur) return res.status(404).json({ error: 'Routeur introuvable' });
  const users = await getActiveUsers(routeur);
  res.json(users);
});

// ── GET /api/routeurs/:id/stats — Stats système routeur ──────────────────────
router.get('/:id/stats', auth, async (req, res) => {
  const routeur = await prisma.routeur.findUnique({ where: { id: req.params.id } });
  if (!routeur) return res.status(404).json({ error: 'Routeur introuvable' });
  const stats = await getRouterStats(routeur);
  res.json(stats);
});

module.exports = router;
