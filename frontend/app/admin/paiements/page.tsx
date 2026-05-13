'use client';
import { CheckCircle, XCircle } from 'lucide-react';

const MOCK_PAYMENTS = [
  { id: 'P-9021', forfait: '6 Heures', montant: 1500, methode: 'Wave', site: 'Hotel Le Ran', heure: '14:28', statut: 'success' },
  { id: 'P-9020', forfait: '24 Heures', montant: 3000, methode: 'Wave', site: 'Cafe du Centre', heure: '13:55', statut: 'success' },
  { id: 'P-9019', forfait: '1 Heure', montant: 500, methode: 'Wave', site: 'Gare Routiere', heure: '13:42', statut: 'success' },
  { id: 'P-9018', forfait: '7 Jours', montant: 12000, methode: 'Wave', site: 'Hotel Le Ran', heure: '12:10', statut: 'success' },
  { id: 'P-9017', forfait: '6 Heures', montant: 1500, methode: 'Wave', site: 'Cafe du Centre', heure: '11:48', statut: 'failed' },
  { id: 'P-9016', forfait: '24 Heures', montant: 3000, methode: 'Wave', site: 'Hotel Le Ran', heure: '10:33', statut: 'success' },
  { id: 'P-9015', forfait: '1 Heure', montant: 500, methode: 'Wave', site: 'Gare Routiere', heure: '09:15', statut: 'success' },
];

export default function PaiementsPage() {
  const total = MOCK_PAYMENTS.filter(p => p.statut === 'success').reduce((s, p) => s + p.montant, 0);
  const success = MOCK_PAYMENTS.filter(p => p.statut === 'success').length;

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Revenus aujourd'hui", value: `${total.toLocaleString('fr')} FCFA`, color: 'text-blue-400' },
          { label: 'Transactions reussies', value: success.toString(), color: 'text-emerald-400' },
          { label: 'Taux de succes', value: `${Math.round((success / MOCK_PAYMENTS.length) * 100)}%`, color: 'text-violet-400' },
          { label: 'Ticket moyen', value: `${Math.round(total / success).toLocaleString('fr')} FCFA`, color: 'text-amber-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="gcard !p-4">
            <p className="text-zinc-500 text-xs mb-1.5">{label}</p>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/8 bg-[#141414] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/6 flex items-center justify-between">
          <p className="text-white font-semibold text-sm">Historique des paiements Wave</p>
          <button className="btn-ghost text-xs py-1.5 px-3">Exporter CSV</button>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/6">
              {['Reference', 'Forfait', 'Montant', 'Site', 'Methode', 'Heure', 'Statut'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-zinc-500 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_PAYMENTS.map(p => (
              <tr key={p.id} className="border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors">
                <td className="px-4 py-3 font-mono text-zinc-500">{p.id}</td>
                <td className="px-4 py-3 text-zinc-300">{p.forfait}</td>
                <td className="px-4 py-3 text-white font-semibold">{p.montant.toLocaleString('fr')} F</td>
                <td className="px-4 py-3 text-zinc-400">{p.site}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">{p.methode}</span>
                </td>
                <td className="px-4 py-3 text-zinc-500">{p.heure}</td>
                <td className="px-4 py-3">
                  {p.statut === 'success'
                    ? <span className="flex items-center gap-1 text-emerald-400"><CheckCircle size={10} />Reussi</span>
                    : <span className="flex items-center gap-1 text-red-400"><XCircle size={10} />Echoue</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
