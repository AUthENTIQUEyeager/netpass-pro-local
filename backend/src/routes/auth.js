const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      admin: { id: admin.id, email: admin.email, nom: admin.nom, role: admin.role }
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Données invalides', details: error.errors });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ── POST /api/auth/setup — Créer le premier admin ─────────────────────────────
router.post('/setup', async (req, res) => {
  try {
    const count = await prisma.admin.count();
    if (count > 0) {
      return res.status(403).json({ error: 'Admin déjà configuré' });
    }

    const { email, password, nom } = req.body;
    const hash = await bcrypt.hash(password, 12);

    const admin = await prisma.admin.create({
      data: { email, password: hash, nom }
    });

    res.json({ message: 'Admin créé', id: admin.id });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get('/me', require('../middlewares/auth'), async (req, res) => {
  const admin = await prisma.admin.findUnique({
    where: { id: req.admin.id },
    select: { id: true, email: true, nom: true, role: true }
  });
  res.json(admin);
});

module.exports = router;
