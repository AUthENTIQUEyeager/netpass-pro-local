require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { testAllRouters } = require('./services/mikrotik');

const app = express();
const PORT = process.env.PORT || 3001;
const SERVEUR_IP = process.env.SERVEUR_IP || '10.10.10.2';

// ── MIDDLEWARES ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3000',
    `http://${SERVEUR_IP}:3000`,
    // Autoriser tout le sous-réseau local 10.10.10.x
    /^http:\/\/10\.10\.10\.\d{1,3}(:\d+)?$/,
    /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/,
  ],
  credentials: true
}));

// Raw body pour vérification signature Wave webhook
app.use('/webhooks', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Trop de requêtes. Réessayez dans 15 minutes.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Trop de tentatives de connexion.' }
});

// ── ROUTES ────────────────────────────────────────────────────────────────────
app.use('/api/auth',      authLimiter,   require('./routes/auth'));
app.use('/api/forfaits',  publicLimiter, require('./routes/forfaits'));
app.use('/api/commandes', publicLimiter, require('./routes/commandes'));
app.use('/api/tickets',                  require('./routes/tickets'));
app.use('/api/routeurs',                 require('./routes/routeurs'));
app.use('/api/stats',                    require('./routes/stats'));
app.use('/webhooks',                     require('./webhooks/wave'));

// ── HEALTH CHECK ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'NetPass Pro API (Local)',
    ip: SERVEUR_IP,
    timestamp: new Date().toISOString()
  });
});

app.use(require('./middlewares/errorHandler'));

// ── START ─────────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`\n╔══════════════════════════════════════════╗`);
  console.log(`║   NetPass Pro API — Déploiement Local    ║`);
  console.log(`║   http://localhost:${PORT}                  ║`);
  console.log(`║   http://${SERVEUR_IP}:${PORT}           ║`);
  console.log(`╚══════════════════════════════════════════╝\n`);
  console.log('Vérification des routeurs MikroTik...');
  await testAllRouters();
});

module.exports = app;
