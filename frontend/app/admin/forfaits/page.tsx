'use client';
import { useEffect, useState } from 'react';
import { Plus, Pencil, Power, Wifi, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { getForfaits, creerForfait, modifierForfait, getRouteursAdmin, ajouterRouteur, testerRouteur } from '@/lib/api';

// ── FORFAITS ──────────────────────────────────────────────────────────────────
export default function ForfaitsPage() {
  const [forfaits, setForfaits] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nom: '', duree_heures: 1, prix: 0, vitesse: '', description: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getForfaits().then(setForfaits).catch(() => {
      setForfaits([
        { id: '1', nom: '1 Heure', duree_heures: 1, prix: 500, vitesse: '10 Mbps', actif: true },
        { id: '2', nom: '6 Heures', duree_heures: 6, prix: 1500, vitesse: '20 Mbps', actif: true },
        { id: '3', nom: '24 Heures', duree_heures: 24, prix: 3000, vitesse: '30 Mbps', actif: true },
        { id: '4', nom: '7 Jours', duree_heures: 168, prix: 12000, vitesse: '50 Mbps', actif: true },
      ]);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const f = await creerForfait(form);
      setForfaits(prev => [...prev, f]);
      setShowForm(false);
      setForm({ nom: '', duree_heures: 1, prix: 0, vitesse: '', description: '' });
    } catch (e: any) { alert(e.response?.data?.error || 'Erreur'); }
    finally { setSaving(false); }
  };

  const toggleActif = async (f: any) => {
    try {
      await modifierForfait(f.id, { actif: !f.actif });
      setForfaits(prev => prev.map(p => p.id === f.id ? { ...p, actif: !p.actif } : p));
    } catch {}
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <p className="text-zinc-500 text-sm">{forfaits.length} forfait{forfaits.length > 1 ? 's' : ''} configures</p>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-xs py-2 px-3">
          <Plus size={13} /> Ajouter
        </button>
      </div>

      {showForm && (
        <div className="gcard space-y-4">
          <p className="text-white font-semibold text-sm">Nouveau forfait</p>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs text-zinc-500 mb-1.5">Nom</label>
              <input className="form-input" placeholder="ex: 3 Heures" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} /></div>
            <div><label className="block text-xs text-zinc-500 mb-1.5">Duree (heures)</label>
              <input type="number" className="form-input" value={form.duree_heures} onChange={e => setForm(f => ({ ...f, duree_heures: parseInt(e.target.value) }))} /></div>
            <div><label className="block text-xs text-zinc-500 mb-1.5">Prix (FCFA)</label>
              <input type="number" className="form-input" value={form.prix} onChange={e => setForm(f => ({ ...f, prix: parseInt(e.target.value) }))} /></div>
            <div><label className="block text-xs text-zinc-500 mb-1.5">Vitesse</label>
              <input className="form-input" placeholder="ex: 25 Mbps" value={form.vitesse} onChange={e => setForm(f => ({ ...f, vitesse: e.target.value }))} /></div>
          </div>
          <div><label className="block text-xs text-zinc-500 mb-1.5">Description (separee par virgules)</label>
            <input className="form-input" placeholder="Connexion immediate, 2 appareils, Support inclus" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="btn-ghost flex-1 justify-center py-2.5 text-xs">Annuler</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center py-2.5 text-xs">
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {forfaits.map(f => (
          <div key={f.id} className="gcard !p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full ${f.actif ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
              <div>
                <p className="text-white font-semibold text-sm">{f.nom}</p>
                <p className="text-zinc-500 text-xs">{f.vitesse} — {f.duree_heures}h</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white font-bold">{f.prix.toLocaleString('fr')} FCFA</span>
              <div className="flex gap-1">
                <button className="w-7 h-7 rounded-lg bg-white/3 border border-white/8 flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
                  <Pencil size={12} />
                </button>
                <button onClick={() => toggleActif(f)} className="w-7 h-7 rounded-lg bg-white/3 border border-white/8 flex items-center justify-center text-zinc-500 hover:text-amber-400 transition-colors">
                  <Power size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
