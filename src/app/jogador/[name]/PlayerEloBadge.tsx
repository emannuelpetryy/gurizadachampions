'use client';

import { useEffect, useState } from 'react';

export default function PlayerEloBadge({ playerName }: { playerName: string }) {
  const [playerElo, setPlayerElo] = useState<{ elo: number; wins: number; losses: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchElo() {
      try {
        const res = await fetch('/api/lobby', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.eloMap) {
            const cleanSlug = playerName.toLowerCase().replace(/[^a-z0-9]/g, '');
            const stats = data.eloMap[cleanSlug];
            if (stats) setPlayerElo(stats);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchElo();
  }, [playerName]);

  if (loading) return null;

  const elo = playerElo ? playerElo.elo : 1000;
  const wins = playerElo ? playerElo.wins : 0;
  const losses = playerElo ? playerElo.losses : 0;
  const totalMatches = wins + losses;
  const winrate = totalMatches > 0 ? ((wins / totalMatches) * 100).toFixed(1) : '0.0';

  const faceitLevel = elo >= 1500 ? 10 : elo >= 1350 ? 9 : elo >= 1200 ? 8 : elo >= 1100 ? 6 : elo >= 1000 ? 4 : 2;
  const badgeColor = elo >= 1400 ? '#ffd700' : elo >= 1200 ? '#00f0ff' : '#a4b0be';

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(10,15,29,0.9), rgba(5,10,20,0.95))',
        border: `1.5px solid ${badgeColor}`,
        borderRadius: '16px',
        padding: '0.7rem 1.4rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.2rem',
        boxShadow: `0 0 20px ${badgeColor}30`,
        marginTop: '0.6rem',
      }}
    >
      <div
        style={{
          background: badgeColor,
          color: '#080d1a',
          fontWeight: 900,
          fontSize: '0.8rem',
          padding: '0.4rem 0.8rem',
          borderRadius: '10px',
          letterSpacing: '0.5px',
        }}
      >
        FACEIT LVL {faceitLevel}
      </div>

      <div style={{ textAlign: 'left' }}>
        <strong style={{ fontSize: '1.35rem', color: badgeColor, fontFamily: 'var(--font-rajdhani)', display: 'block', lineHeight: 1.1 }}>
          {elo} ELO
        </strong>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {wins}V - {losses}D Amistosos ({winrate}% WR)
        </span>
      </div>
    </div>
  );
}
