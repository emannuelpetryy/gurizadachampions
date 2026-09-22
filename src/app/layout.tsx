import type { Metadata } from 'next';
import { Rajdhani, Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import NavItem from './components/NavItem';

const rajdhani = Rajdhani({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani' 
});
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'Gurizada Champions CS2',
  description: 'Campeonato oficial de CS2 - Gurizada Champions Cup',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${rajdhani.variable} ${inter.variable}`}>
        <nav className="top-nav">
          <div className="nav-container">
            <Link href="/" className="nav-brand">
              <span className="nav-brand-icon animate-glow">🏆</span> GURIZADA<span className="text-cyan">CHAMPIONS</span>
              <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '0.15rem 0.5rem', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginLeft: '0.5rem', fontWeight: 800 }}>
                <span className="status-pulse-dot"></span> TEMPORADA 1
              </span>
            </Link>
            <div className="nav-links">
              <NavItem href="/" className="nav-item">INÍCIO</NavItem>
              <NavItem href="/ranking" className="nav-item">RANKING & STATS</NavItem>
              <NavItem href="/selecao" className="nav-item nav-item-gold">🌟 SELEÇÕES</NavItem>
              <NavItem href="/lobby" className="nav-item nav-item-lobby">🎮 LOBBY (5v5)</NavItem>
              <NavItem href="/comparacao" className="nav-item">COMPARAR 1V1</NavItem>
              <NavItem href="/jogadores" className="nav-item">JOGADORES</NavItem>
              <NavItem href="/sobre" className="nav-item">REGULAMENTO</NavItem>
            </div>
          </div>
        </nav>
        {children}
        <footer className="footer">
          <p>© 2026 Gurizada Champions Cup. Todos os direitos reservados.</p>
        </footer>
      </body>
    </html>
  );
}
