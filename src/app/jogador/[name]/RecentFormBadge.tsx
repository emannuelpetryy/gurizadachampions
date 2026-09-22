'use client';

import { RecentMatchRecord } from '../../../types/champions';

interface RecentFormBadgeProps {
  matches: RecentMatchRecord[];
}

export default function RecentFormBadge({ matches }: RecentFormBadgeProps) {
  if (!matches || matches.length === 0) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.8rem' }}>
        <span>Sem histórico recente</span>
      </div>
    );
  }

  // Pegar as últimas até 5 partidas
  const recentSlice = matches.slice(-5);
  const wins = recentSlice.filter(m => m.won).length;
  const losses = recentSlice.length - wins;
  const winrate = Math.round((wins / recentSlice.length) * 100);

  let formStatus = 'Estável ⚡';
  let formColor = '#00f0ff';
  if (winrate >= 75) {
    formStatus = 'Em Grande Fase 🔥';
    formColor = '#ffd700';
  } else if (winrate <= 30) {
    formStatus = 'Buscando Recuperação 🛡️';
    formColor = '#ff3366';
  }

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.75rem',
      background: 'rgba(11, 18, 33, 0.8)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '24px',
      padding: '0.35rem 0.85rem',
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
      flexWrap: 'wrap',
    }}>
      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Forma:
      </span>

      {/* Círculos de Vitória e Derrota com Tooltip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        {recentSlice.map((m, idx) => (
          <div
            key={idx}
            title={`${m.won ? 'VITÓRIA' : 'DERROTA'} vs ${m.enemyTeamName} (${m.map}) • K/D: ${m.kd} (${m.kills}K/${m.deaths}D)`}
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.72rem',
              fontWeight: 900,
              fontFamily: 'var(--font-rajdhani)',
              color: '#fff',
              background: m.won
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              boxShadow: m.won
                ? '0 0 10px rgba(16, 185, 129, 0.4)'
                : '0 0 10px rgba(239, 68, 68, 0.4)',
              cursor: 'help',
              transition: 'transform 0.15s ease',
            }}
          >
            {m.won ? 'V' : 'D'}
          </div>
        ))}
      </div>

      {/* Winrate e Trend Tag */}
      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: formColor, borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '0.6rem' }}>
        {wins}V - {losses}D ({winrate}%) · {formStatus}
      </span>
    </div>
  );
}
