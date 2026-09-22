'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const championship = [
  { href: '/', label: 'Início' },
  { href: '/ranking', label: 'Ranking' },
  { href: '/sobre', label: 'Regulamento' },
];

const community = [
  { href: '/selecao', label: 'Seleções' },
  { href: '/jogadores', label: 'Jogadores' },
  { href: '/lobby', label: 'Lobby 5v5' },
  { href: '/comparacao', label: 'Comparar' },
];

function NavigationGroup({ title, items, pathname, onNavigate }: {
  title: string;
  items: typeof championship;
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <div className="site-nav-group">
      <span className="site-nav-label">{title}</span>
      <div className="site-nav-links">
        {items.map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={active ? 'site-nav-link is-active' : 'site-nav-link'} onClick={onNavigate}>
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-brand" aria-label="Gurizada Champions — início" onClick={() => setOpen(false)}>
          <span className="site-brand-mark" aria-hidden="true">GC</span>
          <span>
            <strong>Gurizada</strong>
            <em>Champions</em>
          </span>
          <small>CS2 · S01</small>
        </Link>

        <button className="site-menu-toggle" type="button" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>
          <span className="sr-only">{open ? 'Fechar' : 'Abrir'} menu</span>
          <span></span><span></span>
        </button>

        <nav id="primary-navigation" className={open ? 'site-nav is-open' : 'site-nav'} aria-label="Navegação principal">
          <NavigationGroup title="Campeonato" items={championship} pathname={pathname} onNavigate={() => setOpen(false)} />
          <NavigationGroup title="Comunidade" items={community} pathname={pathname} onNavigate={() => setOpen(false)} />
        </nav>
      </div>
    </header>
  );
}
