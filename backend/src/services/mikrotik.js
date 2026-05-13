const RouterOSAPI = require('node-routeros').RouterOSAPI;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ── CONNEXION À UN ROUTEUR ────────────────────────────────────────────────────
async function connectToRouter(routeur) {
  return new Promise((resolve, reject) => {
    const conn = new RouterOSAPI({
      host: routeur.ip_address,
      user: routeur.api_user,
      password: routeur.api_password,
      port: routeur.api_port || 8728,
      timeout: 10
    });

    conn.connect()
      .then(() => resolve(conn))
      .catch(err => reject(new Error(`Impossible de connecter au routeur ${routeur.nom}: ${err.message}`)));
  });
}

// ── CRÉER UN UTILISATEUR HOTSPOT ──────────────────────────────────────────────
async function createHotspotUser(routeur, { username, password, duree_heures }) {
  let conn;
  try {
    conn = await connectToRouter(routeur);

    // Convertir durée en format MikroTik (ex: 24h = "1d", 6h = "6h", 1h = "1h")
    const limitUptime = formatDuration(duree_heures);

    await conn.write('/ip/hotspot/user/add', [
      `=name=${username}`,
      `=password=${password}`,
      `=limit-uptime=${limitUptime}`,
      `=profile=default`
    ]);

    console.log(`[MikroTik] Utilisateur créé: ${username} sur ${routeur.nom} (${limitUptime})`);

    conn.close();
    return { success: true, username, password, limitUptime };
  } catch (error) {
    if (conn) conn.close();
    console.error(`[MikroTik] Erreur création utilisateur:`, error.message);
    throw error;
  }
}

// ── SUPPRIMER UN UTILISATEUR HOTSPOT ─────────────────────────────────────────
async function deleteHotspotUser(routeur, username) {
  let conn;
  try {
    conn = await connectToRouter(routeur);

    // Trouver l'ID de l'utilisateur
    const users = await conn.write('/ip/hotspot/user/print', [
      `?name=${username}`
    ]);

    if (users.length === 0) {
      conn.close();
      return { success: true, message: 'Utilisateur inexistant dans MikroTik' };
    }

    await conn.write('/ip/hotspot/user/remove', [
      `=.id=${users[0]['.id']}`
    ]);

    console.log(`[MikroTik] Utilisateur supprimé: ${username} sur ${routeur.nom}`);
    conn.close();
    return { success: true };
  } catch (error) {
    if (conn) conn.close();
    console.error(`[MikroTik] Erreur suppression:`, error.message);
    throw error;
  }
}

// ── DÉSACTIVER (déconnecter session active) ───────────────────────────────────
async function disconnectActiveUser(routeur, username) {
  let conn;
  try {
    conn = await connectToRouter(routeur);

    const activeSessions = await conn.write('/ip/hotspot/active/print', [
      `?user=${username}`
    ]);

    for (const session of activeSessions) {
      await conn.write('/ip/hotspot/active/remove', [
        `=.id=${session['.id']}`
      ]);
    }

    conn.close();
    return { success: true, sessionsRemoved: activeSessions.length };
  } catch (error) {
    if (conn) conn.close();
    throw error;
  }
}

// ── LISTE DES SESSIONS ACTIVES ────────────────────────────────────────────────
async function getActiveUsers(routeur) {
  let conn;
  try {
    conn = await connectToRouter(routeur);

    const active = await conn.write('/ip/hotspot/active/print');

    conn.close();
    return active.map(u => ({
      username: u.user,
      ip: u.address,
      mac: u['mac-address'],
      uptime: u.uptime,
      bytesIn: u['bytes-in'],
      bytesOut: u['bytes-out'],
      sessionTime: u['session-time-left']
    }));
  } catch (error) {
    if (conn) conn.close();
    console.error(`[MikroTik] Erreur sessions actives:`, error.message);
    return [];
  }
}

// ── STATISTIQUES DU ROUTEUR ───────────────────────────────────────────────────
async function getRouterStats(routeur) {
  let conn;
  try {
    conn = await connectToRouter(routeur);

    const [resources, identity] = await Promise.all([
      conn.write('/system/resource/print'),
      conn.write('/system/identity/print')
    ]);

    conn.close();

    const res = resources[0] || {};
    return {
      connected: true,
      identity: identity[0]?.name || routeur.nom,
      uptime: res.uptime,
      cpuLoad: res['cpu-load'],
      freeMemory: res['free-memory'],
      totalMemory: res['total-memory'],
      version: res.version
    };
  } catch (error) {
    if (conn) conn.close();
    return { connected: false, error: error.message };
  }
}

// ── TEST CONNEXION ────────────────────────────────────────────────────────────
async function testConnection(routeur) {
  let conn;
  try {
    conn = await connectToRouter(routeur);
    conn.close();
    console.log(`[MikroTik] ${routeur.nom} (${routeur.ip_address}) — Connecté`);
    return { connected: true };
  } catch (error) {
    console.log(`[MikroTik] ${routeur.nom} (${routeur.ip_address}) — Hors ligne`);
    return { connected: false, error: error.message };
  }
}

// ── TEST TOUS LES ROUTEURS AU DÉMARRAGE ───────────────────────────────────────
async function testAllRouters() {
  try {
    const routeurs = await prisma.routeur.findMany({
      where: { statut: 'actif' }
    });

    if (routeurs.length === 0) {
      console.log('[MikroTik] Aucun routeur configuré.');
      return;
    }

    for (const routeur of routeurs) {
      const result = await testConnection(routeur);
      await prisma.routeur.update({
        where: { id: routeur.id },
        data: { statut: result.connected ? 'actif' : 'hors_ligne' }
      });
    }
  } catch (error) {
    console.error('[MikroTik] Erreur test démarrage:', error.message);
  }
}

// ── UTILITAIRE — FORMAT DURÉE ─────────────────────────────────────────────────
function formatDuration(heures) {
  if (heures >= 24) {
    const jours = Math.floor(heures / 24);
    const reste = heures % 24;
    return reste > 0 ? `${jours}d${reste}h` : `${jours}d`;
  }
  return `${heures}h`;
}

// ── GÉNÉRATEUR DE CREDENTIALS ─────────────────────────────────────────────────
function generateCredentials() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const passChars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!';

  let username = 'usr_';
  for (let i = 0; i < 6; i++) {
    username += chars[Math.floor(Math.random() * chars.length)];
  }

  let password = '';
  for (let i = 0; i < 8; i++) {
    password += passChars[Math.floor(Math.random() * passChars.length)];
  }

  return { username, password };
}

module.exports = {
  createHotspotUser,
  deleteHotspotUser,
  disconnectActiveUser,
  getActiveUsers,
  getRouterStats,
  testConnection,
  testAllRouters,
  generateCredentials
};
