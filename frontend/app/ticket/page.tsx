'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Copy, Download, Wifi, AlertCircle, Loader } from 'lucide-react';
import { getCommande } from '@/lib/api';
import Navbar from '@/components/ui/Navbar';

export default function TicketPage() {
  const params = useSearchParams();
  const ref = params.get('ref');
  const [commande, setCommande] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [polling, setPolling] = useState(0);

  useEffect(() => {
    if (!ref) { setError('Reference de commande manquante'); setLoading(false); return; }
    fetchCommande();
  }, [ref]);

  // Polling si ticket pas encore prêt (MikroTik en cours)
  useEffect(() => {
    if (!commande) return;
    if (commande.statut === 'en_traitement' && polling < 10) {
      const t = setTimeout(() => {
        setPolling(p => p + 1);
        fetchCommande();
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [commande, polling]);

  const fetchCommande = async () => {
    try {
      const data = await getCommande(ref!);
      setCommande(data);
    } catch {
      setError('Commande introuvable');
    } finally {
      setLoading(false);
    }
  };

  const copy = (key: string, value: string) => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = () => {
    if (!commande?.ticket) return;
    copy('all', `Reseau: NetPass-WiFi\nUtilisateur: ${commande.ticket.username}\nMot de passe: ${commande.ticket.password}`);
  };

  // Générer QR visuel simple
  const QRCode = () => {
    const cells = Array.from({ length: 100 }, (_, i) => {
      const seed = (i * 2654435761) % 100;
      return seed > 40;
    });
    return (
      <div className="w-32 h-32 bg-white rounded-xl p-2 grid"
        style={{ gridTemplateColumns: 'repeat(10, 1fr)', gap: '1.5px' }}>
        {cells.map((filled, i) => (
          <div key={i} className="rounded-[1px]"
            style={{ background: filled ? '#000' : '#fff', aspectRatio: '1' }} />
        ))}
      </div>
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 border-2 border-blue-600/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-5" />
        <p className="text-white font-medium">Chargement de votre ticket...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
          <AlertCircle size={24} className="text-red-400" />
        </div>
        <p className="text-white font-semibold mb-2">Erreur</p>
        <p className="text-zinc-500 text-sm mb-6">{error}</p>
        <a href="/forfaits" className="btn-primary">Retour aux forfaits</a>
      </div>
    </div>
  );

  // Paiement en attente ou en traitement
  if (commande && !commande.ticket) {
    if (commande.statut === 'en_attente') return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5">
            <AlertCircle size={24} className="text-amber-400" />
          </div>
          <p className="text-white font-semibold mb-2">Paiement en attente</p>
          <p className="text-zinc-500 text-sm mb-6">Le paiement n'a pas encore ete confirme.<br/>Si vous avez paye, votre ticket arrivera sous peu.</p>
          <button onClick={fetchCommande} className="btn-primary">Verifier le statut</button>
        </div>
      </div>
    );

    if (commande.statut === 'en_traitement') return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-14 h-14 border-2 border-blue-600/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-5" />
          <p className="text-white font-semibold mb-2">Creation du ticket en cours</p>
          <p className="text-zinc-500 text-sm">Paiement confirme. Generation des identifiants...</p>
        </div>
      </div>
    );
  }

  const ticket = commande?.ticket;
  const expDate = ticket ? new Date(ticket.date_expiration) : null;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      {/* Grid bg */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: `linear-gradient(rgba(37,99,235,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,0.6) 1px,transparent 1px)`, backgroundSize: '60px 60px' }} />

      <div className="relative z-10 max-w-md mx-auto px-6 pt-24 pb-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/12 border border-emerald-500/25 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={22} className="text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Ticket WiFi genere</h1>
          <p className="text-zinc-500 text-sm">Vos identifiants de connexion sont prets.</p>
        </div>

        {/* Ticket Card */}
        <div className="rounded-2xl border border-blue-500/20 overflow-hidden shadow-[0_0_60px_rgba(37,99,235,0.1)]"
          style={{ background: 'linear-gradient(145deg,#141414 0%,#0c1526 100%)' }}>

          {/* Top bar */}
          <div className="px-5 py-4 border-b border-white/6 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600/20 flex items-center justify-center">
                <Wifi size={13} className="text-blue-400" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">NetPass Pro</p>
                <p className="text-zinc-500 text-xs">NetPass-WiFi — {commande?.site}</p>
              </div>
            </div>
            <span className="badge-active">Actif</span>
          </div>

          <div className="px-5 py-5 space-y-3">
            {/* Username */}
            <div className="flex items-center justify-between bg-white/3 border border-white/6 rounded-xl px-4 py-3">
              <div>
                <p className="text-zinc-500 text-xs mb-0.5">Nom d'utilisateur</p>
                <p className="text-white font-mono font-semibold text-base">{ticket?.username}</p>
              </div>
              <button onClick={() => copy('user', ticket?.username)} className="text-zinc-500 hover:text-blue-400 transition-colors p-1">
                {copied === 'user' ? <CheckCircle size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>

            {/* Password */}
            <div className="flex items-center justify-between bg-white/3 border border-white/6 rounded-xl px-4 py-3">
              <div>
                <p className="text-zinc-500 text-xs mb-0.5">Mot de passe</p>
                <p className="text-white font-mono font-semibold text-base tracking-wider">{ticket?.password}</p>
              </div>
              <button onClick={() => copy('pass', ticket?.password)} className="text-zinc-500 hover:text-blue-400 transition-colors p-1">
                {copied === 'pass' ? <CheckCircle size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>

            {/* QR Code */}
            <div className="flex justify-center py-2"><QRCode /></div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/3 border border-white/6 rounded-xl px-3 py-2.5 text-center">
                <p className="text-zinc-500 text-xs mb-1">Forfait</p>
                <p className="text-white font-semibold text-sm">{commande?.forfait?.nom}</p>
              </div>
              <div className="bg-white/3 border border-white/6 rounded-xl px-3 py-2.5 text-center">
                <p className="text-zinc-500 text-xs mb-1">Vitesse</p>
                <p className="text-white font-semibold text-sm">{commande?.forfait?.vitesse}</p>
              </div>
            </div>

            <div className="bg-white/3 border border-white/6 rounded-xl px-4 py-3 text-center">
              <p className="text-zinc-500 text-xs mb-1">Expiration</p>
              <p className="text-white text-sm font-medium">
                {expDate?.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })} a {expDate?.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button onClick={copyAll}
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 hover:border-white/20 text-zinc-300 text-sm transition-all">
                {copied === 'all' ? <CheckCircle size={13} className="text-emerald-400" /> : <Copy size={13} />}
                {copied === 'all' ? 'Copie !' : 'Tout copier'}
              </button>
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm transition-all shadow-[0_4px_20px_rgba(37,99,235,0.3)]">
                <Download size={13} /> Telecharger
              </button>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 flex gap-3">
          <AlertCircle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-amber-400/80 text-xs leading-relaxed">
            Connectez-vous au reseau <strong className="text-amber-400">NetPass-WiFi</strong> puis saisissez vos identifiants sur la page qui s'affiche.
          </p>
        </div>

        <a href="/" className="w-full mt-4 py-3 rounded-xl border border-white/8 text-zinc-500 hover:text-zinc-300 text-sm transition-colors block text-center">
          Retour a l'accueil
        </a>
      </div>
    </div>
  );
}
