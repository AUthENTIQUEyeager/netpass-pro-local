'use client';
import { useEffect, useState } from 'react';
import { CheckCircle, Zap, Shield, Star } from 'lucide-react';
import { getForfaits, getRouteurs, creerCommande } from '@/lib/api';
import Navbar from '@/components/ui/Navbar';

export default function ForfaitsPage() {
  const [forfaits, setForfaits] = useState<any[]>([]);
  const [routeurs, setRouteurs] = useState<any[]>([]);
  const [selectedRouteur, setSelectedRouteur] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getForfaits().then(setForfaits).catch(() => setError('Erreur chargement forfaits'));
    getRouteurs().then(data => {
      setRouteurs(data);
      if (data.length === 1) setSelectedRouteur(data[0].id);
    }).catch(() => {});
  }, []);

  const handleAchat = async (forfait: any) => {
    if (!selectedRouteur) {
      setError('Veuillez selectionner un site WiFi');
      return;
    }
    setLoading(forfait.id);
    setError('');
    try {
      const result = await creerCommande({
        forfait_id: forfait.id,
        routeur_id: selectedRouteur
      });
      // Rediriger vers Wave pour le paiement
      window.location.href = result.checkout_url;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la creation de la commande');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-20">

        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Choisissez votre forfait</h1>
          <p className="text-zinc-500 text-lg font-light">Connexion immediate apres paiement Wave. Sans inscription.</p>
        </div>

        {/* Sélecteur de site */}
        {routeurs.length > 1 && (
          <div className="mb-10 max-w-sm mx-auto">
            <label className="block text-xs text-zinc-500 font-medium mb-2 uppercase tracking-widest">
              Site WiFi
            </label>
            <select
              value={selectedRouteur}
              onChange={e => setSelectedRouteur(e.target.value)}
              className="form-input"
              style={{ background: '#141414' }}
            >
              <option value="">Selectionnez un site</option>
              {routeurs.map(r => (
                <option key={r.id} value={r.id} disabled={r.statut !== 'actif'}>
                  {r.site} — {r.nom} {r.statut !== 'actif' ? '(Hors ligne)' : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {error && (
          <div className="mb-6 max-w-md mx-auto rounded-xl border border-red-500/25 bg-red-500/5 px-4 py-3 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Grille forfaits */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {forfaits.map((plan, i) => (
            <div key={plan.id}
              className={`relative rounded-2xl border p-6 flex flex-col transition-all duration-300 hover:-translate-y-1
                ${i === 1
                  ? 'border-blue-500/50 bg-gradient-to-b from-blue-600/8 to-transparent shadow-[0_0_50px_rgba(37,99,235,0.12)]'
                  : 'border-white/8 bg-[#141414] hover:border-white/15'}`}>

              {i === 1 && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5
                  px-3 py-1 rounded-full bg-blue-600 text-xs font-semibold shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                  <Star size={9} fill="currentColor" /> Populaire
                </div>
              )}

              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4
                ${i === 1 ? 'bg-blue-600/20' : 'bg-white/4 border border-white/6'}`}>
                <Zap size={17} className={i === 1 ? 'text-blue-400' : 'text-zinc-500'} />
              </div>

              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-1">{plan.nom}</p>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-3xl font-bold">{plan.prix.toLocaleString('fr')}</span>
                <span className="text-zinc-500 text-sm">FCFA</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs mb-5">
                <Zap size={11} className="text-blue-400" />
                <span className="text-blue-400 font-medium">{plan.vitesse}</span>
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {(plan.description ? plan.description.split(',') : [`${plan.duree_heures}h de connexion`, 'Connexion immediate', 'Support inclus']).map((f: string, fi: number) => (
                  <li key={fi} className="flex items-start gap-2 text-zinc-400 text-sm">
                    <CheckCircle size={13} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    {f.trim()}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleAchat(plan)}
                disabled={loading === plan.id}
                className={`w-full py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${i === 1
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_4px_20px_rgba(37,99,235,0.4)] disabled:opacity-60'
                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 disabled:opacity-60'}`}>
                {loading === plan.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
                    Redirection Wave...
                  </span>
                ) : 'Payer avec Wave'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-white/6 bg-[#141414] p-5 flex items-center gap-4 max-w-xl mx-auto">
          <Shield size={26} className="text-blue-400 flex-shrink-0" />
          <div>
            <p className="text-white text-sm font-semibold mb-1">Paiement 100% securise via Wave</p>
            <p className="text-zinc-500 text-xs">Ticket delivre instantanement apres confirmation du paiement.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
