'use client';
import { useEffect, useState } from 'react';
import { Plus, Wifi, CheckCircle, XCircle, RefreshCw, Pencil } from 'lucide-react';
import { getRouteursAdmin, ajouterRouteur, testerRouteur } from '@/lib/api';

export default function RouteursPage() {
  const [routeurs, setRouteurs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nom: '', site: '', ip_address: '',
    api_port: 8728, api_user: 'admin', api_password: ''
  });

  useEffect(() => {
    getRouteursAdmin().then(setRouteurs).catch(() => {
      setRouteurs([
        { id: '1', nom: 'MikroTik RB951', site: 'Hotel Le Ran', ip_address: '192.168.1.1', api_port: 8728, statut: 'actif' },
        { id: '2', nom: 'MikroTik hAP ac', site: 'Cafe du Centre', ip_address: '10.0.0.1', api_port: 8728, statut: 'actif' },
        { id: '3', nom: 'MikroTik RB750', site: 'Gare Routiere', ip_address: '172.16.0.1', api_port: 8728, statut: 'hors_ligne' },
      ]);
    });
  }, []);

  const handleTest = async (id: string) => {
    setTesting(id);
    try {
      const result = await testerRouteur(id);
      setRouteurs(prev => prev.map(r => r.id === id ? { ...r, statut: result.connected ? 'actif' : 'hors_ligne' } : r));
    } catch {
      setRouteurs(prev => prev.map(r => r.id === id ? { ...r, statut: 'hors_ligne' } : r));
    } finally { setTesting(null); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const r = await ajouterRouteur(form);
      setRouteurs(prev => [...prev, r]);
      setShowForm(false);
      setForm({ nom: '', site: '', ip_address: '', api_port: 8728, api_user: 'admin', api_password: '' });
    } catch (e: any) { alert(e.response?.data?.error || 'Erreur'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <p className="text-zinc-500 text-sm">{routeurs.length} routeur{routeurs.length > 1 ? 's' : ''} configure{routeurs.length > 1 ? 's' : ''}</p>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-xs py-2 px-3">
          <Plus size={13} /> Ajouter un routeur
        </button>
      </div>

      {showForm && (
        <div className="gcard space-y-4">
          <p className="text-white font-semibold text-sm">Nouveau routeur MikroTik</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Nom du routeur', key: 'nom', placeholder: 'ex: MikroTik RB951' },
              { label: 'Site / Emplacement', key: 'site', placeholder: 'ex: Hotel du Centre' },
              { label: 'Adresse IP', key: 'ip_address', placeholder: '192.168.88.1' },
              { label: 'Port API', key: 'api_port', placeholder: '8728', type: 'number' },
              { label: 'Utilisateur API', key: 'api_user', placeholder: 'admin' },
              { label: 'Mot de passe API', key: 'api_password', placeholder: '••••••••', type: 'password' },
            ].map(({ label, key, placeholder, type = 'text' }) => (
              <div key={key}>
                <label className="block text-xs text-zinc-500 mb-1.5">{label}</label>
                <input type={type} className="form-input" placeholder={placeholder}
                  value={(form as any)[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: type === 'number' ? parseInt(e.target.value) : e.target.value }))} />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="btn-ghost flex-1 justify-center py-2.5 text-xs">Annuler</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center py-2.5 text-xs">
              {saving ? 'Ajout en cours...' : 'Ajouter le routeur'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {routeurs.map(r => (
          <div key={r.id} className="gcard !p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border
                  ${r.statut === 'actif' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                  <Wifi size={16} className={r.statut === 'actif' ? 'text-emerald-400' : 'text-red-400'} />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{r.nom}</p>
                  <p className="text-zinc-500 text-xs">{r.site}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {r.statut === 'actif'
                  ? <span className="badge-active">En ligne</span>
                  : <span className="badge-disabled">Hors ligne</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Adresse IP', value: r.ip_address },
                { label: 'Port API', value: r.api_port },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/2 rounded-xl px-3 py-2 border border-white/5">
                  <p className="text-zinc-600 text-xs mb-0.5">{label}</p>
                  <p className="text-zinc-300 text-xs font-mono">{value}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={() => handleTest(r.id)} disabled={testing === r.id}
                className="btn-ghost flex-1 justify-center py-2 text-xs">
                <RefreshCw size={12} className={testing === r.id ? 'animate-spin' : ''} />
                {testing === r.id ? 'Test en cours...' : 'Tester la connexion'}
              </button>
              <button className="w-9 h-9 rounded-xl bg-white/3 border border-white/8 flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
                <Pencil size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
