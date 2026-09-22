'use client';

import { useState } from 'react';
import { SEASONS, CURRENT_SEASON_ID } from '../../lib/seasons';

export default function SeasonSelector() {
  const [selectedSeasonId, setSelectedSeasonId] = useState(CURRENT_SEASON_ID);
  const [isOpen, setIsOpen] = useState(false);

  const currentSeason = SEASONS.find(s => s.id === selectedSeasonId) || SEASONS[0];

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(0, 240, 255, 0.35)',
          color: '#fff',
          padding: '0.45rem 1rem',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontFamily: 'var(--font-rajdhani)',
          fontWeight: 800,
          letterSpacing: '0.5px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(0, 240, 255, 0.15)',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.2s ease',
        }}
        title="Alternar entre Temporadas do Gurizada Champions"
      >
        <span className="status-pulse-dot" style={{ background: currentSeason.status === 'playoffs' ? '#10b981' : '#ffd700' }} />
        <span>{currentSeason.shortName}</span>
        <span style={{ fontSize: '0.65rem', color: 'var(--cyan)' }}>▼</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            background: 'rgba(8, 14, 28, 0.98)',
            border: '1px solid rgba(0, 240, 255, 0.4)',
            borderRadius: '14px',
            padding: '0.5rem',
            minWidth: '240px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(0,240,255,0.15)',
            zIndex: 100,
            backdropFilter: 'blur(12px)',
          }}
        >
          <div style={{ padding: '0.4rem 0.6rem', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>
              SELECIONAR EDIÇÃO
            </span>
          </div>

          {SEASONS.map((season) => {
            const isSelected = season.id === selectedSeasonId;
            const isPlayoffs = season.status === 'playoffs';
            const isUpcoming = season.status === 'upcoming';

            return (
              <div
                key={season.id}
                onClick={() => {
                  if (isUpcoming) {
                    alert('A Temporada 2 está em fase de planejamento! O draft e os novos times serão divulgados após a Grande Final da T1.');
                    return;
                  }
                  setSelectedSeasonId(season.id);
                  setIsOpen(false);
                }}
                style={{
                  padding: '0.6rem 0.8rem',
                  borderRadius: '10px',
                  background: isSelected ? 'rgba(0, 240, 255, 0.12)' : 'transparent',
                  cursor: isUpcoming ? 'not-allowed' : 'pointer',
                  opacity: isUpcoming ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'background 0.15s ease',
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.85rem', color: isSelected ? 'var(--cyan)' : '#fff', display: 'block', fontFamily: 'var(--font-rajdhani)' }}>
                    {season.name}
                  </strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {season.stageDescription}
                  </span>
                </div>

                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.45rem',
                  borderRadius: '8px',
                  background: isPlayoffs ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                  color: isPlayoffs ? '#10b981' : '#94a3b8',
                }}>
                  {isPlayoffs ? 'ATUAL' : 'EM BREVE'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
