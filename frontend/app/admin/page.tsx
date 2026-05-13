'use client';
import { useEffect, useState } from 'react';
import { Users, TrendingUp, Ticket, Activity, RefreshCw } from 'lucide-react';
import { getStats } from '@/lib/api';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-3 text-xs">
        <p className="text-zinc-400 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: {p.value?.toLocaleString('fr')}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await getStats();
      setStats(data);
    } catch {
      // Données mockées si backend pas encore connecté
      setStats({
        ticketsActifs: 247,
        ticketsAujourdhui: 38,
        revenusAujourdhui: 87500,
        totalTickets: 1482,
        revenus7j: [
          { date: 'Lun', revenus: 45000, commandes: 15 },
          { date: 'Mar', revenus: 62000, commandes: 21 },
          { date: 'Mer', revenus: 78000, commandes: 26 },
          { date: 'Jeu', revenus: 55000, commandes: 18 },
          { date: 'Ven', revenus: 91000, commandes: 30 },
          { date: 'Sam', revenus: 112000, commandes: 37 },
          { date: 'Dim', revenus: 87500, commandes: 29 },
        ],
        commandesRecentes: []
      });
    } finally { setLoading(false); }
  };

  const trafficData = [
    { t: '00h', dl: 45, ul: 12 }, { t: '04h', dl: 23, ul: 8 },
    { t: '08h', dl: 89, ul: 34 }, { t: '12h', dl: 156, ul: 67 },
    { t: '16h', dl: 134, ul: 54 }, { t: '20h', dl: 178, ul: 89 },
    { t: '24h', dl: 98, ul: 43 },
  ];

  const kpis = stats ? [
    { label: 'Connexions actives', value: stats.ticketsActifs, change: '+12%', icon: Users, color: 'blue' },
    { label: "Revenus aujourd'hui", value: `${stats.revenusAujourdhui?.toLocaleString('fr')} F`, change: '+8%', icon: TrendingUp, color: 'emerald' },
    { label: 'Tickets generes', value: stats.totalTickets?.toLocaleString('fr'), change: '+23%', icon: Ticket, color: 'violet' },
    { label: 'Uptime reseau', value: '99.9%', change: 'stable', icon: Activity, color: 'amber' },
  ] : [];

  const colorMap: any = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
    violet: { bg: 'bg-violet-500/10', text: 'text-violet-400' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-zinc-500 text-sm">Vue d'ensemble en temps reel</p>
        <button onClick={loadStats} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Actualiser
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, change, icon: Icon, color }) => (
          <div key={label} className="gcard !p-4">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colorMap[color].bg}`}>
                <Icon size={16} className={colorMap[color].text} />
              </div>
              <span className={`text-xs font-medium ${change.startsWith('+') ? 'text-emerald-400' : 'text-zinc-500'}`}>{change}</span>
            </div>
            <p className="text-2xl font-bold mb-1">{loading ? '—' : value}</p>
            <p className="text-zinc-500 text-xs">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="gcard lg:col-span-2 !p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-white font-semibold text-sm">Revenus — 7 jours</p>
              <p className="text-zinc-500 text-xs">Evolution du chiffre d'affaires</p>
            </div>
            <span className="text-emerald-400 text-xs font-medium">+18% vs semaine precedente</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={stats?.revenus7j || []}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#52525b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#52525b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenus" name="FCFA" stroke="#3b82f6" strokeWidth={2} fill="url(#revGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="gcard !p-5">
          <div className="mb-5">
            <p className="text-white font-semibold text-sm">Commandes / jour</p>
            <p className="text-zinc-500 text-xs">Nombre de transactions</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={stats?.revenus7j || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#52525b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#52525b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="commandes" name="Commandes" fill="#2563eb" radius={[4, 4, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="gcard !p-5">
          <p className="text-white font-semibold text-sm mb-1">Trafic reseau</p>
          <p className="text-zinc-500 text-xs mb-4">Download / Upload (Mbps)</p>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="t" tick={{ fill: '#52525b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#52525b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="dl" name="Download" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="ul" name="Upload" stroke="#16a34a" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Transactions recentes */}
        <div className="gcard lg:col-span-2 !p-5">
          <p className="text-white font-semibold text-sm mb-4">Activite recente</p>
          {(stats?.commandesRecentes?.length > 0) ? (
            <div className="space-y-2">
              {stats.commandesRecentes.slice(0, 5).map((c: any) => (
                <div key={c.id} className="flex items-center justify-between py-2.5 border-b border-white/4 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/4 border border-white/6 flex items-center justify-center">
                      <Ticket size={12} className="text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-medium">{c.forfait?.nom}</p>
                      <p className="text-zinc-600 text-xs">{c.routeur?.site}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-xs font-semibold">{c.montant?.toLocaleString('fr')} F</p>
                    <p className="text-zinc-600 text-xs">{new Date(c.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-zinc-600 text-sm">
              <Ticket size={24} className="mb-3 opacity-30" />
              Aucune transaction aujourd'hui
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
