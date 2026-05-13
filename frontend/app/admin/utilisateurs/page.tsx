'use client';
// ── UTILISATEURS ──────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import { Monitor, RefreshCw, Power, Eye, Wifi } from 'lucide-react';
import { getRouteurs, getClientsActifs } from '@/lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const MOCK_USERS = [
  { username: 'usr_k9x2m', ip: '192.168.1.45', mac: 'AA:BB:CC:DD:EE:01', uptime: '2h 14m', bytesIn: '2457862144', bytesOut: '124456960', sessionTime: '18h 32m' },
  { username: 'usr_p3n8q', ip: '192.168.1.67', mac: 'AA:BB:CC:DD:EE:02', uptime: '5h 48m', bytesIn: '9345024000', bytesOut: '892928000', sessionTime: '4h 15m' },
  { username: 'usr_v5k4z', ip: '192.168.1.89', mac: 'AA:BB:CC:DD:EE:03', uptime: '45m', bytesIn: '1288490189', bytesOut: '62914560', sessionTime: '6j 14h' },
  { username: 'usr_h6p3s', ip: '192.168.1.34', mac: 'AA:BB:CC:DD:EE:04', uptime: '1h 02m', bytesIn: '536870912', bytesOut: '26214400', sessionTime: '1h 48m' },
  { username: 'usr_m2x9y', ip: '192.168.1.156', mac: 'AA:BB:CC:DD:EE:05', uptime: '8h 22m', bytesIn: '4404019200', bytesOut: '285212672', sessionTime: '22h 07m' },
];

function formatBytes(bytes: string) {
  const n = parseInt(bytes) || 0;
  if (n > 1e9) return (n / 1e9).toFixed(1) + ' GB';
  if (n > 1e6) return (n / 1e6).toFixed(0) + ' MB';
  return (n / 1e3).toFixed(0) + ' KB';
}

const trafficData = [
  { t: '00h', dl: 45, ul: 12 }, { t: '04h', dl: 23, ul: 8 },
  { t: '08h', dl: 89, ul: 34 }, { t: '12h', dl: 156, ul: 67 },
  { t: '16h', dl: 134, ul: 54 }, { t: '20h', dl: 178, ul: 89 },
  { t: '24h', dl: 98, ul: 43 },
];

export default function UtilisateursPage() {
  const [routeurs, setRouteurs] = useState<any[]>([]);
  const [selectedRouteur, setSelectedRouteur] = useState('');
  const [users, setUsers] = useState(MOCK_USERS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRouteurs().then(data => {
      setRouteurs(data);
      if (data.length > 0) setSelectedRouteur(data[0].id);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedRouteur) return;
    loadUsers();
  }, [selectedRouteur]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getClientsActifs(selectedRouteur);
      if (data.length > 0) setUsers(data);
    } catch {
      setUsers(MOCK_USERS);
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          {routeurs.length > 1 && (
            <select value={selectedRouteur} onChange={e => setSelectedRouteur(e.target.value)}
              className="bg-[#141414] border border-white/8 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-blue-500/40 font-sans">
              {routeurs.map(r => <option key={r.id} value={r.id}>{r.site}</option>)}
            </select>
          )}
          <span className="text-zinc-500 text-xs">{users.length} client{users.length > 1 ? 's' : ''} connecte{users.length > 1 ? 's' : ''}</span>
        </div>
        <button onClick={loadUsers} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Actualiser
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u, i) => (
          <div key={i} className="gcard !p-4 hover:border-blue-500/20">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/4 border border-white/6 flex items-center justify-center">
                  <Monitor size={14} className="text-zinc-400" />
                </div>
                <div>
                  <p className="text-white text-xs font-mono font-medium">{u.username}</p>
                  <p className="text-zinc-600 text-xs">{u.mac}</p>
                </div>
              </div>
              <span className="badge-active">En ligne</span>
            </div>

            <div className="space-y-2 mb-3">
              {[
                { label: 'Adresse IP', value: u.ip, mono: true },
                { label: 'Temps restant', value: u.sessionTime, blue: true },
                { label: 'Consommation', value: `${formatBytes(u.bytesIn)} / ${formatBytes(u.bytesOut)}` },
                { label: 'Connexion depuis', value: u.uptime },
              ].map(({ label, value, mono, blue }) => (
                <div key={label} className="flex justify-between text-xs">
                  <span className="text-zinc-600">{label}</span>
                  <span className={`${mono ? 'font-mono' : ''} ${blue ? 'text-blue-400 font-medium' : 'text-zinc-300'}`}>{value}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/4">
              <button className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs border border-white/8 text-zinc-500 hover:text-white hover:border-white/15 transition-all">
                <Eye size={11} /> Details
              </button>
              <button className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40 transition-all">
                <Power size={11} /> Deconnecter
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="gcard !p-5">
        <p className="text-white font-semibold text-sm mb-1">Trafic reseau en temps reel</p>
        <p className="text-zinc-500 text-xs mb-4">Download / Upload (Mbps)</p>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={trafficData}>
            <defs>
              <linearGradient id="dlG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} /><stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ulG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} /><stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="t" tick={{ fill: '#52525b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#52525b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 11 }} />
            <Area type="monotone" dataKey="dl" name="Download" stroke="#3b82f6" strokeWidth={1.5} fill="url(#dlG)" dot={false} />
            <Area type="monotone" dataKey="ul" name="Upload" stroke="#16a34a" strokeWidth={1.5} fill="url(#ulG)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
