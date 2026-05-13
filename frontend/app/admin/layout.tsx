'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Wifi, BarChart2, Ticket, Users, CreditCard,
  Package, Settings, LogOut, Menu, Bell, Search
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: BarChart2 },
  { href: '/admin/tickets', label: 'Tickets', icon: Ticket },
  { href: '/admin/utilisateurs', label: 'Utilisateurs', icon: Users },
  { href: '/admin/paiements', label: 'Paiements', icon: CreditCard },
  { href: '/admin/forfaits', label: 'Forfaits', icon: Package },
  { href: '/admin/routeurs', label: 'Routeurs', icon: Wifi },
  { href: '/admin/parametres', label: 'Parametres', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [admin, setAdmin] = useState<any>(null);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('netpass_token');
    const adminData = localStorage.getItem('netpass_admin');
    if (!token) { router.push('/admin/login'); return; }
    if (adminData) setAdmin(JSON.parse(adminData));
  }, []);

  const logout = () => {
    localStorage.removeItem('netpass_token');
    localStorage.removeItem('netpass_admin');
    router.push('/admin/login');
  };

  const pageTitle = navItems.find(n => n.href === path)?.label || 'Administration';

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">

      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-56'} flex-shrink-0 bg-[#0f0f0f] border-r border-white/6 flex flex-col transition-all duration-300 h-screen sticky top-0`}>

        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-white/6 gap-3 overflow-hidden">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <Wifi size={14} className="text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-white text-sm font-semibold leading-none">NetPass</p>
              <p className="text-blue-500 text-xs font-light tracking-widest mt-0.5">ADMIN</p>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="ml-auto text-zinc-600 hover:text-zinc-400 transition-colors flex-shrink-0">
            <Menu size={14} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = path === href;
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 overflow-hidden whitespace-nowrap border
                  ${active ? 'bg-blue-600/10 text-blue-400 border-blue-500/20' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/4 border-transparent'}`}>
                <Icon size={15} className="flex-shrink-0" />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-2 border-t border-white/6">
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-600 hover:text-zinc-400 text-sm transition-colors overflow-hidden whitespace-nowrap">
            <LogOut size={14} className="flex-shrink-0" />
            {!collapsed && <span>Deconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/6 bg-[#0a0a0a] sticky top-0 z-10 flex-shrink-0">
          <div>
            <p className="text-white font-semibold text-sm">{pageTitle}</p>
            <p className="text-zinc-600 text-xs">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex relative">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input placeholder="Rechercher..." className="bg-white/3 border border-white/8 rounded-xl pl-8 pr-4 py-2 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-blue-500/40 w-44 font-sans" />
            </div>
            <div className="relative w-8 h-8 rounded-xl bg-white/3 border border-white/8 flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
              <Bell size={13} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
            </div>
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <span className="text-blue-400 text-xs font-bold">{admin?.nom?.[0]?.toUpperCase() || 'A'}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
