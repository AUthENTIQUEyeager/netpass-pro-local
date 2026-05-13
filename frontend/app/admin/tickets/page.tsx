'use client';
import { useEffect, useState } from 'react';
import { Search, RefreshCw, Power, Trash2, Plus, Printer, Wifi } from 'lucide-react';
import { getTickets, desactiverTicket, supprimerTicket, getForfaits, getRouteurs, genererTicketsManuel } from '@/lib/api';

const Badge = ({ status }: { status: string }) => {
  const map: any = {
    actif: 'badge-active', expiré: 'badge-expired',
    désactivé: 'badge-disabled', en_attente: 'badge-pending'
  };
  const labels: any = { actif: 'Actif', expiré: 'Expiré', désactivé: 'Désactivé', en_attente: 'En attente' };
  return <span className={map[status] || 'badge-expired'}>{labels[status] || status}</span>;
};

// ── IMPRESSION VOUCHERS ────────────────────────────────────────────────────────
function imprimerVouchers(tickets: any[]) {
  const formatDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const cartes = tickets.map(t => `
    <div class="voucher">
      <div class="voucher-header">
        <div class="wifi-icon">📶</div>
        <div>
          <div class="reseau">${t.nom_reseau || 'NetPass WiFi'}</div>
          <div class="site">${t.site || ''}</div>
        </div>
      </div>
      <div class="voucher-body">
        <div class="label">Identifiant</div>
        <div class="value username">${t.username}</div>
        <div class="label">Mot de passe</div>
        <div class="value password">${t.password}</div>
      </div>
      <div class="voucher-footer">
        <div class="forfait-info">
          <span class="badge-forfait">${t.forfait || ''}</span>
          <span class="badge-prix">${t.prix ? t.prix.toLocaleString('fr') + ' FCFA' : ''}</span>
        </div>
        <div class="expiration">Expire le : ${t.date_expiration ? formatDate(t.date_expiration) : ''}</div>
      </div>
    </div>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Vouchers WiFi — NetPass Pro</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #fff; padding: 10mm; }
    .page-title { text-align: center; font-size: 14px; color: #666; margin-bottom: 8mm; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6mm; }
    .voucher {
      border: 2px dashed #4f46e5;
      border-radius: 10px;
      padding: 5mm;
      background: #fff;
      break-inside: avoid;
    }
    .voucher-header {
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 4mm;
      margin-bottom: 4mm;
    }
    .wifi-icon { font-size: 22px; }
    .reseau { font-weight: 700; font-size: 13px; color: #1e1b4b; }
    .site { font-size: 10px; color: #6b7280; }
    .voucher-body { margin-bottom: 4mm; }
    .label { font-size: 9px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 3mm; }
    .value { font-size: 15px; font-weight: 700; letter-spacing: 1px; color: #111827; font-family: 'Courier New', monospace; }
    .username { color: #4f46e5; }
    .password { color: #059669; }
    .voucher-footer { border-top: 1px solid #e5e7eb; padding-top: 3mm; }
    .forfait-info { display: flex; gap: 6px; margin-bottom: 2mm; }
    .badge-forfait {
      background: #ede9fe; color: #4f46e5;
      font-size: 9px; font-weight: 600;
      padding: 2px 7px; border-radius: 20px;
    }
    .badge-prix {
      background: #d1fae5; color: #065f46;
      font-size: 9px; font-weight: 600;
      padding: 2px 7px; border-radius: 20px;
    }
    .expiration { font-size: 9px; color: #9ca3af; }
    @media print {
      body { padding: 5mm; }
      .grid { gap: 4mm; }
    }
  </style>
</head>
<body>
  <div class="page-title">NetPass Pro — Vouchers WiFi (${tickets.length} ticket${tickets.length > 1 ? 's' : ''})</div>
  <div class="grid">${cartes}</div>
  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`;

  const fenetre = window.open('', '_blank', 'width=900,height=700');
  if (fenetre) {
    fenetre.document.write(html);
    fenetre.document.close();
  }
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [forfaits, setForfaits] = useState<any[]>([]);
  const [routeurs, setRouteurs] = useState<any[]>([]);
  const [genForm, setGenForm] = useState({ forfait_id: '', routeur_id: '', quantite: 1 });
  const [generating, setGenerating] = useState(false);
  const [generatedTickets, setGeneratedTickets] = useState<any[]>([]);

  useEffect(() => {
    loadTickets();
    getForfaits().then(setForfaits).catch(() => {});
    getRouteurs().then(setRouteurs).catch(() => {});
  }, [search, filter, page]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await getTickets({ search, statut: filter, page });
      setTickets(data.tickets);
      setTotal(data.total);
    } catch {
      setTickets([]);
      setTotal(0);
    } finally { setLoading(false); }
  };

  const handleDesactiver = async (id: string) => {
    if (!confirm('Désactiver ce ticket ?')) return;
    try { await desactiverTicket(id); loadTickets(); } catch {}
  };

  const handleSupprimer = async (id: string) => {
    if (!confirm('Supprimer définitivement ce ticket ?')) return;
    try { await supprimerTicket(id); loadTickets(); } catch {}
  };

  const handleGenerer = async () => {
    if (!genForm.forfait_id || !genForm.routeur_id) return;
    setGenerating(true);
    try {
      const result = await genererTicketsManuel(genForm);
      setGeneratedTickets(result.tickets);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erreur lors de la génération');
    } finally { setGenerating(false); }
  };

  const filters = [
    { label: 'Tous', value: '' },
    { label: 'Actifs', value: 'actif' },
    { label: 'Expirés', value: 'expiré' },
    { label: 'Désactivés', value: 'désactivé' },
  ];

  return (
    <div className="space-y-4">
      {/* Actions bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map(f => (
            <button key={f.value} onClick={() => { setFilter(f.value); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all
                ${filter === f.value ? 'border-blue-500 bg-blue-600/10 text-blue-400' : 'border-white/8 text-zinc-500 hover:border-white/15'}`}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Rechercher..." className="bg-white/3 border border-white/8 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/40 w-40 font-sans" />
          </div>
          <button onClick={() => { setShowModal(true); setGeneratedTickets([]); }}
            className="btn-primary text-xs py-2 px-3">
            <Plus size={13} /> Générer vouchers
          </button>
          <button onClick={loadTickets} className="w-8 h-8 rounded-xl bg-white/3 border border-white/8 flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/8 bg-[#141414] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/6">
                {['Utilisateur', 'Statut', 'Type', 'Site', 'Montant', 'Expiration', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-zinc-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-zinc-600">Chargement...</td></tr>
              ) : tickets.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-zinc-600">Aucun ticket</td></tr>
              ) : tickets.map(t => (
                <tr key={t.id} className="border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium text-white">{t.username}</td>
                  <td className="px-4 py-3"><Badge status={t.statut} /></td>
                  <td className="px-4 py-3 text-zinc-500 capitalize">{t.type}</td>
                  <td className="px-4 py-3 text-zinc-400">{t.routeur?.site}</td>
                  <td className="px-4 py-3 text-white font-medium">{t.commande?.montant?.toLocaleString('fr')} F</td>
                  <td className="px-4 py-3 text-zinc-500">
                    {new Date(t.date_expiration).toLocaleDateString('fr-FR')} {new Date(t.date_expiration).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => handleDesactiver(t.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 hover:text-amber-400 hover:bg-amber-500/10 transition-all" title="Désactiver">
                        <Power size={12} />
                      </button>
                      <button onClick={() => handleSupprimer(t.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Supprimer">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-white/6 flex items-center justify-between text-xs text-zinc-500">
          <span>{total} ticket{total > 1 ? 's' : ''}</span>
          <div className="flex gap-1">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="px-2.5 py-1 rounded-lg border border-white/8 text-zinc-400 disabled:opacity-40 hover:border-white/15 transition-colors">
              Précédent
            </button>
            <button className="px-2.5 py-1 rounded-lg bg-blue-600/15 border border-blue-500/30 text-blue-400">{page}</button>
            <button disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)}
              className="px-2.5 py-1 rounded-lg border border-white/8 text-zinc-400 disabled:opacity-40 hover:border-white/15 transition-colors">
              Suivant
            </button>
          </div>
        </div>
      </div>

      {/* Modal Génération */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { if (generatedTickets.length === 0) setShowModal(false); }} />
          <div className="relative z-10 w-full max-w-md bg-[#141414] border border-white/10 rounded-2xl p-6">

            {generatedTickets.length === 0 ? (
              <>
                <h3 className="text-white font-semibold text-sm mb-1">Générer des vouchers cash</h3>
                <p className="text-zinc-500 text-xs mb-5">Les tickets seront créés dans MikroTik et prêts à être vendus en cash.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-2">Forfait</label>
                    <select value={genForm.forfait_id} onChange={e => setGenForm(f => ({ ...f, forfait_id: e.target.value }))}
                      className="form-input" style={{ background: '#1a1a1a' }}>
                      <option value="">Sélectionner un forfait</option>
                      {forfaits.map(f => <option key={f.id} value={f.id}>{f.nom} — {f.prix.toLocaleString('fr')} FCFA</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-2">Site WiFi</label>
                    <select value={genForm.routeur_id} onChange={e => setGenForm(f => ({ ...f, routeur_id: e.target.value }))}
                      className="form-input" style={{ background: '#1a1a1a' }}>
                      <option value="">Sélectionner un site</option>
                      {routeurs.map(r => <option key={r.id} value={r.id}>{r.site} — {r.nom}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-2">Quantité (max 200)</label>
                    <input type="number" min={1} max={200} value={genForm.quantite}
                      onChange={e => setGenForm(f => ({ ...f, quantite: parseInt(e.target.value) || 1 }))}
                      className="form-input" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setShowModal(false)} className="btn-ghost flex-1 justify-center py-2.5">Annuler</button>
                    <button onClick={handleGenerer} disabled={generating || !genForm.forfait_id || !genForm.routeur_id}
                      className="btn-primary flex-1 justify-center py-2.5">
                      {generating
                        ? <><div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />Génération...</>
                        : <><Plus size={13} />Générer</>}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 text-xs">✓</div>
                  <h3 className="text-white font-semibold text-sm">
                    {generatedTickets.length} voucher{generatedTickets.length > 1 ? 's' : ''} généré{generatedTickets.length > 1 ? 's' : ''}
                  </h3>
                </div>
                <p className="text-zinc-500 text-xs mb-4">Tickets créés dans MikroTik et prêts à vendre.</p>

                {/* Aperçu des tickets */}
                <div className="max-h-52 overflow-y-auto space-y-2 mb-4">
                  {generatedTickets.map((t, i) => (
                    <div key={i} className="bg-white/3 border border-white/6 rounded-xl px-3 py-2.5 flex justify-between items-center">
                      <div>
                        <p className="font-mono text-blue-400 text-xs font-bold">{t.username}</p>
                        <p className="font-mono text-emerald-400 text-xs">{t.password}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-zinc-400 text-xs">{t.forfait}</p>
                        <p className="text-zinc-600 text-xs">{t.prix?.toLocaleString('fr')} F</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => imprimerVouchers(generatedTickets)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-blue-500/30 bg-blue-600/10 text-blue-400 text-xs font-medium hover:bg-blue-600/20 transition-all">
                    <Printer size={13} /> Imprimer les vouchers
                  </button>
                  <button onClick={() => { setShowModal(false); setGeneratedTickets([]); loadTickets(); }}
                    className="btn-primary flex-1 justify-center py-2.5 text-xs">
                    Terminer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
