import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 15000
});

// Injecter le token JWT dans chaque requête admin
API.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('netpass_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── PUBLIC ────────────────────────────────────────────────────────────────────
export const getForfaits = () =>
  API.get('/api/forfaits').then(r => r.data);

export const getRouteurs = () =>
  API.get('/api/routeurs').then(r => r.data);

export const creerCommande = (data: {
  forfait_id: string;
  routeur_id: string;
  client_tel?: string;
}) => API.post('/api/commandes', data).then(r => r.data);

export const getCommande = (id: string) =>
  API.get(`/api/commandes/${id}`).then(r => r.data);

// ── ADMIN — AUTH ──────────────────────────────────────────────────────────────
export const login = (email: string, password: string) =>
  API.post('/api/auth/login', { email, password }).then(r => r.data);

export const getMe = () =>
  API.get('/api/auth/me').then(r => r.data);

export const setupAdmin = (data: { email: string; password: string; nom: string }) =>
  API.post('/api/auth/setup', data).then(r => r.data);

// ── ADMIN — TICKETS ───────────────────────────────────────────────────────────
export const getTickets = (params?: {
  statut?: string;
  routeur_id?: string;
  search?: string;
  page?: number;
}) => API.get('/api/tickets', { params }).then(r => r.data);

export const genererTicketsManuel = (data: {
  forfait_id: string;
  routeur_id: string;
  quantite: number;
}) => API.post('/api/tickets/manuel', data).then(r => r.data);

export const desactiverTicket = (id: string) =>
  API.put(`/api/tickets/${id}/desactiver`).then(r => r.data);

export const supprimerTicket = (id: string) =>
  API.delete(`/api/tickets/${id}`).then(r => r.data);

// ── ADMIN — ROUTEURS ──────────────────────────────────────────────────────────
export const getRouteursAdmin = () =>
  API.get('/api/routeurs').then(r => r.data);

export const ajouterRouteur = (data: object) =>
  API.post('/api/routeurs', data).then(r => r.data);

export const modifierRouteur = (id: string, data: object) =>
  API.put(`/api/routeurs/${id}`, data).then(r => r.data);

export const testerRouteur = (id: string) =>
  API.get(`/api/routeurs/${id}/test`).then(r => r.data);

export const getClientsActifs = (id: string) =>
  API.get(`/api/routeurs/${id}/actifs`).then(r => r.data);

// ── ADMIN — STATS ─────────────────────────────────────────────────────────────
export const getStats = () =>
  API.get('/api/stats/overview').then(r => r.data);

export const getRevenus = (periode: string) =>
  API.get('/api/stats/revenus', { params: { periode } }).then(r => r.data);

// ── ADMIN — FORFAITS ──────────────────────────────────────────────────────────
export const creerForfait = (data: object) =>
  API.post('/api/forfaits', data).then(r => r.data);

export const modifierForfait = (id: string, data: object) =>
  API.put(`/api/forfaits/${id}`, data).then(r => r.data);

export default API;
