'use client';
import { useState, useEffect } from 'react';
import { Wifi, ArrowRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/forfaits', label: 'Forfaits' },
    { href: '/#fonctionnement', label: 'Fonctionnement' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 transition-all duration-400
        ${scrolled ? 'backdrop-blur-xl bg-[#0f0f0f]/85 border-b border-white/8' : 'bg-transparent'}`}>

        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.5)]">
            <Wifi size={15} className="text-white" />
          </div>
          <span className="text-white font-semibold text-sm">NetPass</span>
          <span className="text-blue-500 font-light text-sm tracking-widest">PRO</span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className={`text-sm transition-colors ${path === l.href ? 'text-white' : 'text-zinc-500 hover:text-zinc-200'}`}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin" className="hidden md:flex text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-3 py-1.5 rounded-lg border border-white/8 hover:border-white/15">
            Admin
          </Link>
          <Link href="/forfaits"
            className="text-xs font-medium px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all duration-200 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center gap-1.5">
            Acheter <ArrowRight size={12} />
          </Link>
          <button className="md:hidden text-zinc-400" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-[#0a0a0a]/98 backdrop-blur-xl border-b border-white/8 px-6 py-4 flex flex-col gap-3">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className="text-sm text-zinc-400 hover:text-white py-1 border-b border-white/4 transition-colors">
              {l.label}
            </Link>
          ))}
          <Link href="/admin" onClick={() => setMenuOpen(false)}
            className="text-sm text-zinc-400 hover:text-white py-1 transition-colors">
            Administration
          </Link>
        </div>
      )}
    </>
  );
}
