// ── FORFAITS ──────────────────────────────────────────────────────────────────
const express = require('express');
const forfaitsRouter = express.Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middlewares/auth');
const prisma = new PrismaClient();

forfaitsRouter.get('/', async (req, res) => {
  const forfaits = await prisma.forfait.findMany({
    where: { actif: true },
    orderBy: { prix: 'asc' }
  });
  res.json(forfaits);
});

forfaitsRouter.post('/', auth, async (req, res) => {
  try {
    const forfait = await prisma.forfait.create({ data: req.body });
    res.json(forfait);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

forfaitsRouter.put('/:id', auth, async (req, res) => {
  try {
    const forfait = await prisma.forfait.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(forfait);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

forfaitsRouter.delete('/:id', auth, async (req, res) => {
  await prisma.forfait.update({
    where: { id: req.params.id },
    data: { actif: false }
  });
  res.json({ message: 'Forfait désactivé' });
});

module.exports.forfaitsRouter = forfaitsRouter;
