import type { Metadata } from 'next';
import { Rajdhani, Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

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
            <Link href="/" className="nav-brand">GURIZADA<span className="text-cyan">CHAMPIONS</span></Link>
            <div className="nav-links">
              <Link href="/">INÍCIO</Link>
              <Link href="/ranking">RANKING & STATS</Link>
              <Link href="/jogadores">JOGADORES (TIERS)</Link>
              <Link href="/sobre">REGULAMENTO</Link>
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
