'use client';
import { useState } from 'react';
import { Save, Eye, EyeOff } from 'lucide-react';

export default function ParametresPage() {
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-5 max-w-2xl">

      {/* Réseau */}
      <div className="gcard">
        <p className="text-white font-semibold text-sm mb-5">Configuration reseau</p>
        <div className="space-y-4">
          {[
            { label: 'Nom du reseau WiFi (SSID)', placeholder: 'NetPass-WiFi', default: 'NetPass-WiFi' },
            { label: 'Nom de la plateforme', placeholder: 'NetPass Pro', default: 'NetPass Pro' },
            { label: 'URL du site', placeholder: 'https://netpass-pro.vercel.app', default: 'https://netpass-pro.vercel.app' },
          ].map(({ label, placeholder, default: def }) => (
            <div key={label}>
              <label className="block text-xs text-zinc-500 mb-1.5">{label}</label>
              <input className="form-input" placeholder={placeholder} defaultValue={def} />
            </div>
          ))}
        </div>
      </div>

      {/* Wave */}
      <div className="gcard">
        <p className="text-white font-semibold text-sm mb-5">Configuration Wave Business</p>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">Cle API Wave</label>
            <div className="relative">
              <input type={showKey ? 'text' : 'password'} className="form-input pr-10"
                placeholder="wave_sn_prod_xxxxxxxxxxxx" defaultValue="wave_sn_prod_●●●●●●●●●●●●" />
              <button onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors">
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5">Secret Webhook Wave</label>
            <input type="password" className="form-input" placeholder="whsec_xxxxxxxxxxxx" defaultValue="whsec_●●●●●●●●●●●●" />
          </div>
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-xs text-blue-400 leading-relaxed">
            URL de webhook a configurer dans votre dashboard Wave Business :<br />
            <span className="font-mono text-blue-300 mt-1 block">https://netpass-api.onrender.com/webhooks/wave</span>
          </div>
        </div>
      </div>

      {/* Compte admin */}
      <div className="gcard">
        <p className="text-white font-semibold text-sm mb-5">Compte administrateur</p>
        <div className="space-y-4">
          <div><label className="block text-xs text-zinc-500 mb-1.5">Nom complet</label>
            <input className="form-input" defaultValue="Administrateur" /></div>
          <div><label className="block text-xs text-zinc-500 mb-1.5">Adresse email</label>
            <input type="email" className="form-input" defaultValue="admin@netpass.pro" /></div>
          <div><label className="block text-xs text-zinc-500 mb-1.5">Nouveau mot de passe</label>
            <input type="password" className="form-input" placeholder="Laisser vide pour ne pas changer" /></div>
        </div>
      </div>

      <button onClick={handleSave}
        className={`btn-primary py-3 px-6 ${saved ? 'bg-emerald-600 shadow-[0_0_25px_rgba(22,163,74,0.4)]' : ''}`}>
        <Save size={14} />
        {saved ? 'Parametres sauvegardes !' : 'Sauvegarder les parametres'}
      </button>
    </div>
  );
}
