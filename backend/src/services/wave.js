const axios = require('axios');
const crypto = require('crypto');

const WAVE_API_URL = 'https://api.wave.com/v1';
const WAVE_API_KEY = process.env.WAVE_API_KEY;
const WAVE_WEBHOOK_SECRET = process.env.WAVE_WEBHOOK_SECRET;

// ── CRÉER UNE SESSION DE PAIEMENT ─────────────────────────────────────────────
async function createCheckoutSession({ amount, commande_id, forfait_nom }) {
  try {
    const response = await axios.post(
      `${WAVE_API_URL}/checkout/sessions`,
      {
        amount: amount.toString(),
        currency: 'XOF',
        error_url: `${process.env.FRONTEND_URL}/paiement/erreur?ref=${commande_id}`,
        success_url: `${process.env.FRONTEND_URL}/ticket?ref=${commande_id}`,
        client_reference: commande_id,
        payment_reasons: `NetPass Pro — ${forfait_nom}`
      },
      {
        headers: {
          Authorization: `Bearer ${WAVE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    console.log(`[Wave] Session créée pour commande ${commande_id}`);
    return {
      success: true,
      checkout_url: response.data.wave_launch_url,
      session_id: response.data.id
    };
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    console.error(`[Wave] Erreur création session:`, msg);
    throw new Error(`Erreur Wave: ${msg}`);
  }
}

// ── VÉRIFIER SIGNATURE WEBHOOK ────────────────────────────────────────────────
function verifyWebhookSignature(payload, signature) {
  if (!WAVE_WEBHOOK_SECRET) {
    console.warn('[Wave] WAVE_WEBHOOK_SECRET non défini');
    return false;
  }

  const expectedSig = crypto
    .createHmac('sha256', WAVE_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  const providedSig = signature?.replace('sha256=', '') || '';

  return crypto.timingSafeEqual(
    Buffer.from(expectedSig, 'hex'),
    Buffer.from(providedSig, 'hex')
  );
}

// ── VÉRIFIER STATUT PAIEMENT ──────────────────────────────────────────────────
async function getPaymentStatus(session_id) {
  try {
    const response = await axios.get(
      `${WAVE_API_URL}/checkout/sessions/${session_id}`,
      {
        headers: {
          Authorization: `Bearer ${WAVE_API_KEY}`
        },
        timeout: 10000
      }
    );

    return {
      success: true,
      status: response.data.payment_status,
      amount: response.data.amount,
      currency: response.data.currency,
      client_reference: response.data.client_reference
    };
  } catch (error) {
    console.error(`[Wave] Erreur statut paiement:`, error.message);
    throw error;
  }
}

module.exports = {
  createCheckoutSession,
  verifyWebhookSignature,
  getPaymentStatus
};
