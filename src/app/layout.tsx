import type { Metadata } from 'next';
import { Rajdhani, Inter } from 'next/font/google';
import './globals.css';
import SiteHeader from './components/SiteHeader';

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
        <SiteHeader />
        {children}
        <footer className="footer">
          <div><strong>Gurizada Champions</strong><span>Temporada 01 · CS2</span></div>
          <p>Campeonato, estatísticas e resenha da gurizada.</p>
        </footer>
      </body>
    </html>
  );
}
