require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testAllRouters } = require('./services/mikrotik');

const app = express();
const PORT = process.env.PORT || 3001;
const SERVEUR_IP = process.env.SERVEUR_IP || '192.168.11.109';

app.use(cors({
  origin: true,
  credentials: true
}));

app.use('/webhooks', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',      require('./routes/auth'));
app.use('/api/forfaits',  require('./routes/forfaits'));
app.use('/api/commandes', require('./routes/commandes'));
app.use('/api/tickets',   require('./routes/tickets'));
app.use('/api/routeurs',  require('./routes/routeurs'));
app.use('/api/stats',     require('./routes/stats'));
app.use('/webhooks',      require('./webhooks/wave'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'NetPass Pro API (Local)', ip: SERVEUR_IP });
});

app.use(require('./middlewares/errorHandler'));

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`\n╔══════════════════════════════════════════╗`);
  console.log(`║   NetPass Pro API — Déploiement Local    ║`);
  console.log(`║   http://localhost:${PORT}                  ║`);
  console.log(`║   http://${SERVEUR_IP}:${PORT}       ║`);
  console.log(`╚══════════════════════════════════════════╝\n`);
  await testAllRouters();
});

module.exports = app;