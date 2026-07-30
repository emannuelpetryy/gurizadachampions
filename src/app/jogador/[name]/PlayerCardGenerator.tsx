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
  const cardRef = useRef<HTMLDivElement>(null);

  const playerLvl = lvl || 15;

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setDownloading(true);

    try {
      // Import html2canvas dinamicamente ou renderizar canvas via Web API
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const width = 450;
      const height = 620;
      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        // Fundo Cyberpunk Dark
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, '#0a0f1d');
        grad.addColorStop(0.5, '#050a14');
        grad.addColorStop(1, '#080d1a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Borda Neon Cyan/Gold
        ctx.strokeStyle = badgeColor || '#00f0ff';
        ctx.lineWidth = 6;
        ctx.strokeRect(10, 10, width - 20, height - 20);

        // Header Marca
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🏆 GURIZADA CHAMPIONS CS2 🏆', width / 2, 45);

        // Nome do Jogador
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText(playerName.toUpperCase(), width / 2, 90);

        // Time
        ctx.fillStyle = '#00f0ff';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(`${teamName} • LEVEL ${playerLvl}`, width / 2, 120);

        // Retângulo de Stats
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fillRect(40, 420, width - 80, 140);
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1;
        ctx.strokeRect(40, 420, width - 80, 140);

        // Textos dos Stats
        ctx.fillStyle = '#b0bec5';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText('KILLS', 90, 455);
        ctx.fillText('DEATHS', 180, 455);
        ctx.fillText('ASSISTS', 270, 455);
        ctx.fillText('K/D RATIO', 360, 455);

        ctx.fillStyle = '#00f0ff';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText(kills.toString(), 90, 495);

        ctx.fillStyle = '#ff4757';
        ctx.fillText(deaths.toString(), 180, 495);

        ctx.fillStyle = '#ffffff';
        ctx.fillText(assists.toString(), 270, 495);

        ctx.fillStyle = '#ffd700';
        ctx.fillText(kd.toString(), 360, 495);

        // Rodapé
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = '12px sans-serif';
        ctx.fillText('gurizadachampions.vercel.app', width / 2, 590);

        // Converter para PNG e baixar
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `card_cs2_${playerName.toLowerCase().replace(/\s+/g, '_')}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (e) {
      console.error(e);
      alert('Erro ao gerar imagem.');
    } finally {
      setDownloading(false);
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
          <div style={{ background: '#0a0f1d', border: '1px solid rgba(0,240,255,0.3)', borderRadius: '24px', padding: '2rem', maxWidth: '500px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', boxShadow: '0 0 50px rgba(0,240,255,0.3)', position: 'relative' }}>
            
            {/* Botão de Fechar */}
            <button onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>
              ✕
            </button>

            <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 800, color: '#fff', margin: 0 }}>
              🎴 CARD GAMER CS2 OFICIAL
            </h3>

            {/* PREVIEW DO CARD CS2 */}
            <div
              ref={cardRef}
              style={{
                width: '100%',
                maxWidth: '380px',
                background: 'radial-gradient(circle at 50% 20%, rgba(0,240,255,0.15) 0%, rgba(8,13,26,0.98) 80%)',
                border: `2px solid ${badgeColor}`,
                borderRadius: '20px',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                boxShadow: `0 0 30px ${badgeColor}30`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.2rem',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Marca D'água */}
              <span style={{ fontSize: '0.7rem', color: '#ffd700', background: 'rgba(255,215,0,0.15)', border: '1px solid #ffd700', padding: '0.2rem 0.8rem', borderRadius: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                🏆 GURIZADA CHAMPIONS CS2
              </span>

              {/* Avatar do Jogador */}
              <PlayerAvatar teamName={teamName} playerName={playerName} badgeColor={badgeColor} size={110} />

              {/* Nome & Time */}
              <div>
                <h2 style={{ fontSize: '2rem', color: '#fff', margin: 0, fontFamily: 'var(--font-rajdhani)', fontWeight: 800, lineHeight: 1.1 }}>
                  {playerName}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
                  <TeamLogo logo={teamLogo} name={teamName} initials={teamInitials} size={20} borderRadius="50%" />
                  <span style={{ fontSize: '0.85rem', color: 'var(--cyan)', fontWeight: 700 }}>{teamName}</span>
                </div>
              </div>

              {/* Badges de Nível & Patente */}
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ background: 'linear-gradient(135deg, #ffd700, #ffaa00)', color: '#080d1a', padding: '0.3rem 0.8rem', borderRadius: '12px', fontWeight: 800, fontSize: '0.75rem' }}>
                  🎯 LEVEL {playerLvl}
                </span>
                {tierName && (
                  <span style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '0.3rem 0.8rem', borderRadius: '12px', fontWeight: 800, fontSize: '0.75rem' }}>
                    {tierName}
                  </span>
                )}
              </div>

              {/* Grid de Estatísticas do Card */}
              <div style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '0.8rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', textAlign: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', fontWeight: 800 }}>KILLS</span>
                  <strong style={{ fontSize: '1.2rem', color: 'var(--cyan)', fontFamily: 'var(--font-rajdhani)' }}>{kills}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', fontWeight: 800 }}>DEATHS</span>
                  <strong style={{ fontSize: '1.2rem', color: 'var(--accent-red)', fontFamily: 'var(--font-rajdhani)' }}>{deaths}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', fontWeight: 800 }}>ASSISTS</span>
                  <strong style={{ fontSize: '1.2rem', color: '#fff', fontFamily: 'var(--font-rajdhani)' }}>{assists}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', fontWeight: 800 }}>K/D RATIO</span>
                  <strong style={{ fontSize: '1.2rem', color: '#ffd700', fontFamily: 'var(--font-rajdhani)' }}>{kd}</strong>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
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
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(0,240,255,0.4)',
                }}
              >
                {downloading ? '⏳ GERANDO IMAGEM...' : '📥 BAIXAR CARD EM PNG'}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
