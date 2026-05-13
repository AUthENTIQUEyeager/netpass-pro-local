'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wifi, Lock, Eye, EyeOff } from 'lucide-react';
import { login } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(email, password);
      localStorage.setItem('netpass_token', data.token);
      localStorage.setItem('netpass_admin', JSON.stringify(data.admin));
      router.push('/admin');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-6">
      <div className="fixed inset-0 pointer-events-none"
        style={{ backgroundImage: `linear-gradient(rgba(37,99,235,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,0.03) 1px,transparent 1px)`, backgroundSize: '60px 60px' }} />
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-blue-600/4 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(37,99,235,0.5)]">
            <Wifi size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Administration</h1>
          <p className="text-zinc-500 text-sm">NetPass Pro — Acces securise</p>
        </div>

        <div className="rounded-2xl border border-white/8 bg-[#141414] p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-500 font-medium mb-2">Adresse email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@netpass.pro" required
                className="form-input" />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 font-medium mb-2">Mot de passe</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="form-input pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/5 border border-red-500/20 px-3 py-2.5 text-red-400 text-xs text-center">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3 rounded-xl mt-2 disabled:opacity-60">
              {loading ? (
                <><div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" /> Connexion...</>
              ) : (
                <><Lock size={13} /> Se connecter</>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-zinc-600 text-xs mt-5">
          <a href="/" className="hover:text-zinc-400 transition-colors">Retour au site public</a>
        </p>
      </div>
    </div>
  );
}
