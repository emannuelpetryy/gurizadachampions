'use client';

import { useState, useRef } from 'react';
import PlayerAvatar from './PlayerAvatar';
import TeamLogo from '../../components/TeamLogo';

export default function PlayerCardGenerator({
  playerName,
  teamName,
  teamLogo,
  teamInitials,
  kills,
  deaths,
  assists,
  kd,
  lvl,
  tierName,
  badgeColor,
}: {
  playerName: string;
  teamName: string;
  teamLogo?: string;
  teamInitials: string;
  kills: number;
  deaths: number;
  assists: number;
  kd: string;
  lvl?: number;
  tierName?: string;
  badgeColor: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const playerLvl = lvl || 15;

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setDownloading(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#080d1a',
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `card_cs2_${playerName.toLowerCase().replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
      alert('Erro ao gerar imagem em alta resolução.');
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          background: 'linear-gradient(135deg, #ffd700, #ffaa00)',
          color: '#080d1a',
          border: 'none',
          padding: '0.6rem 1.6rem',
          borderRadius: '20px',
          fontWeight: 800,
          fontSize: '0.9rem',
          fontFamily: 'var(--font-rajdhani)',
          cursor: 'pointer',
          boxShadow: '0 0 20px rgba(255,215,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          marginTop: '0.5rem',
          transition: 'transform 0.2s',
        }}
      >
        <span>🎴</span> GERAR CARD CS2 DO JOGADOR
      </button>

      {isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
          <div style={{ background: '#0a0f1d', border: '1px solid rgba(0,240,255,0.3)', borderRadius: '24px', padding: '2rem', maxWidth: '480px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem', boxShadow: '0 0 50px rgba(0,240,255,0.3)', position: 'relative' }}>
            
            {/* Botão de Fechar */}
            <button onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>
              ✕
            </button>

            <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 800, color: '#fff', margin: 0 }}>
              🎴 CARD CS2 OFICIAL DA GURIZADA
            </h3>

            {/* PREVIEW DO CARD CS2 EXATAMENTE COMO VAI SER EXPORTADO */}
            <div
              ref={cardRef}
              style={{
                width: '100%',
                maxWidth: '360px',
                background: 'radial-gradient(circle at 50% 15%, rgba(0,240,255,0.2) 0%, rgba(8,13,26,0.98) 75%)',
                border: `2px solid ${badgeColor}`,
                borderRadius: '20px',
                padding: '1.8rem 1.4rem',
                textAlign: 'center',
                boxShadow: `0 0 30px ${badgeColor}40`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.1rem',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Marca D'água Topo */}
              <span style={{ fontSize: '0.7rem', color: '#ffd700', background: 'rgba(255,215,0,0.15)', border: '1px solid #ffd700', padding: '0.2rem 0.8rem', borderRadius: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                🏆 GURIZADA CHAMPIONS CS2
              </span>

              {/* Avatar do Jogador */}
              <PlayerAvatar teamName={teamName} playerName={playerName} badgeColor={badgeColor} size={110} />

              {/* Nome & Time */}
              <div>
                <h2 style={{ fontSize: '2.2rem', color: '#fff', margin: 0, fontFamily: 'var(--font-rajdhani)', fontWeight: 800, lineHeight: 1.1 }}>
                  {playerName}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
                  <TeamLogo logo={teamLogo} name={teamName} initials={teamInitials} size={22} borderRadius="50%" />
                  <span style={{ fontSize: '0.9rem', color: 'var(--cyan)', fontWeight: 800 }}>{teamName}</span>
                </div>
              </div>

              {/* Badges de Nível & Patente */}
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ background: 'linear-gradient(135deg, #ffd700, #ffaa00)', color: '#080d1a', padding: '0.35rem 0.9rem', borderRadius: '12px', fontWeight: 800, fontSize: '0.8rem' }}>
                  🎯 LEVEL {playerLvl}
                </span>
                {tierName && (
                  <span style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '0.35rem 0.9rem', borderRadius: '12px', fontWeight: 800, fontSize: '0.8rem' }}>
                    {tierName}
                  </span>
                )}
              </div>

              {/* Grid de Estatísticas do Card */}
              <div style={{ width: '100%', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px', padding: '0.8rem 0.4rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.3rem', textAlign: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', fontWeight: 800 }}>KILLS</span>
                  <strong style={{ fontSize: '1.25rem', color: 'var(--cyan)', fontFamily: 'var(--font-rajdhani)' }}>{kills}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', fontWeight: 800 }}>DEATHS</span>
                  <strong style={{ fontSize: '1.25rem', color: 'var(--accent-red)', fontFamily: 'var(--font-rajdhani)' }}>{deaths}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', fontWeight: 800 }}>ASSISTS</span>
                  <strong style={{ fontSize: '1.25rem', color: '#fff', fontFamily: 'var(--font-rajdhani)' }}>{assists}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', fontWeight: 800 }}>K/D RATIO</span>
                  <strong style={{ fontSize: '1.25rem', color: '#ffd700', fontFamily: 'var(--font-rajdhani)' }}>{kd}</strong>
                </div>
              </div>

              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem' }}>
                gurizadachampions.vercel.app/jogador/{encodeURIComponent(playerName)}
              </span>
            </div>

            {/* Ações */}
            <div style={{ display: 'flex', gap: '0.8rem', width: '100%' }}>
              <button
                onClick={handleDownloadImage}
                disabled={downloading}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #00f0ff, #0099ff)',
                  color: '#080d1a',
                  border: 'none',
                  padding: '0.8rem',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(0,240,255,0.4)',
                }}
              >
                {downloading ? '⏳ GERANDO PNG...' : '📥 BAIXAR CARD (PNG)'}
              </button>

              <button
                onClick={handleCopyLink}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.2)',
                  padding: '0.8rem 1.2rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                {copied ? '✓ COPIADO!' : '🔗 COPIAR LINK'}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
