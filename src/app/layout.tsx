import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Gurizada Champions | CS2 Tournament',
  description: 'O campeonato definitivo de CS2. Acompanhe as partidas, ranking (VRS) e estatísticas.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <nav className="navbar">
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="brand">
              Gurizada <span>Champions</span>
            </div>
            <div className="nav-links">
              <a href="/" className="nav-link">Home</a>
              <a href="/ranking" className="nav-link">Ranking (VRS)</a>
              <a href="/sobre" className="nav-link">Sobre</a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
