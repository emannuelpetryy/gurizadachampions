'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getTeam, getPlayerTier } from '../data';
import TeamLogo from './TeamLogo';
import PlayerAvatar from '../jogador/[name]/PlayerAvatar';

interface HomeTopFraggersProps {
  topKD: any[];
}

export default function HomeTopFraggers({ topKD }: HomeTopFraggersProps) {
  const [showAll, setShowAll] = useState(false);

  const displayedPlayers = showAll ? topKD : topKD.slice(0, 10);

  return (
    <div className="topfraggers-card">
      <div className="topfraggers-header">
        <div>
          <span className="section-eyebrow">ESTATÍSTICAS INDIVIDUAIS</span>
          <h3 className="card-title" style={{ margin: '0.2rem 0 0', fontSize: '1.25rem' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="7"></circle>
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
            </svg>
            TOP FRAGGERS (DESEMPENHO)
          </h3>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Ordenado por K/D oficial (2 casas decimais) · Desempate por KDA e kills
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span className="recent-matches-count">
            {showAll ? `${topKD.length} JOGADORES` : `TOP 10 DE ${topKD.length}`}
          </span>
          <Link
            href="/ranking"
            style={{
              color: 'var(--cyan)',
              fontSize: '0.78rem',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            Tabela Completa ➔
          </Link>
        </div>
      </div>
      
      <ul className="topfraggers-list custom-scrollbar">
        {displayedPlayers.map((player, index) => {
          const team = getTeam(player.teamId);
          const kdRaw = player.kills / (player.deaths || 1);
          const kdaRaw = (player.kills + player.assists) / (player.deaths || 1);
          const kd = kdRaw.toFixed(2);
          const kda = kdaRaw.toFixed(2);

          const progressPct = Math.min(100, Math.max(15, (kdRaw / 2.2) * 100));

          let badgeBg = 'rgba(0, 240, 255, 0.12)';
          let badgeBorder = '1px solid rgba(0, 240, 255, 0.4)';
          let badgeText = 'var(--cyan)';

          if (kdRaw >= 2.0) {
            badgeBg = 'linear-gradient(135deg, #ffd700, #ffaa00)';
            badgeBorder = 'none';
            badgeText = '#030712';
          } else if (kdRaw >= 1.5) {
            badgeBg = 'rgba(0, 240, 255, 0.18)';
            badgeBorder = '1px solid #00f0ff';
            badgeText = '#00f0ff';
          } else if (kdRaw >= 1.0) {
            badgeBg = 'rgba(16, 185, 129, 0.18)';
            badgeBorder = '1px solid #10b981';
            badgeText = '#10b981';
          } else {
            badgeBg = 'rgba(255, 51, 102, 0.18)';
            badgeBorder = '1px solid #ff3366';
            badgeText = '#ff3366';
          }
          
          const playerTier = getPlayerTier(player.name);
          const podiumClass = index === 0 ? 'podium-1' : index === 1 ? 'podium-2' : index === 2 ? 'podium-3' : '';
          const rankColorClass = index === 0 ? 'rank-gold' : index === 1 ? 'rank-silver' : index === 2 ? 'rank-bronze' : 'rank-default';

          return (
            <li key={player.name} className={`topfragger-item ${podiumClass}`}>
              
              <div className="topfragger-profile">
                <span className={`topfragger-rank ${rankColorClass}`}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </span>
                <TeamLogo logo={team.logo} name={team.name} initials={team.initials} size={32} borderRadius="6px" />
                <PlayerAvatar teamName={team.name} playerName={player.name} badgeColor="rgba(255,255,255,0.1)" size={34} />
                <div>
                  <Link href={`/jogador/${encodeURIComponent(player.name)}`} style={{ textDecoration: 'none' }} className="match-card-hover">
                    <p className="topfragger-name">
                      <span>{player.name}</span>
                      {playerTier && (
                        <span style={{
                          fontSize: '0.58rem',
                          fontWeight: 800,
                          padding: '0.1rem 0.35rem',
                          borderRadius: '5px',
                          background: playerTier === 'S' ? 'rgba(255, 215, 0, 0.18)' : playerTier === 'A' ? 'rgba(0, 240, 255, 0.18)' : playerTier === 'B' ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.08)',
                          color: playerTier === 'S' ? '#ffd700' : playerTier === 'A' ? '#00f0ff' : playerTier === 'B' ? '#10b981' : '#94a3b8',
                          border: `1px solid ${playerTier === 'S' ? '#ffd70060' : playerTier === 'A' ? '#00f0ff60' : playerTier === 'B' ? '#10b98160' : '#ffffff20'}`,
                          letterSpacing: '0.5px',
                          lineHeight: 1,
                        }}>
                          TIER {playerTier}
                        </span>
                      )}
                    </p>
                  </Link>
                  <p className="topfragger-team">
                    <span>{team.name}</span>
                    <span>•</span>
                    <span>{player.matches || 1} {player.matches === 1 ? 'jogo' : 'jogos'}</span>
                  </p>
                </div>
              </div>

              <div className="topfragger-metrics">
                <div className="topfragger-meter mobile-hide">
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.5px' }}>
                    NÍVEL K/D ({progressPct.toFixed(0)}%)
                  </span>
                  <div className="kd-progress-bar-bg" style={{ width: '80px', height: '5px' }}>
                    <div className="kd-progress-bar-fill" style={{ width: `${progressPct}%`, background: badgeText === '#030712' ? '#ffd700' : badgeText }}></div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.1rem' }}>
                  <span style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 800, fontFamily: 'var(--font-rajdhani)', letterSpacing: '0.5px' }}>
                    {player.kills}K / {player.deaths}D / {player.assists}A
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--cyan)', fontWeight: 800, letterSpacing: '0.5px' }}>
                    KDA {kda}
                  </span>
                </div>

                <div className="topfragger-badge-kd" style={{ background: badgeBg, border: badgeBorder, boxShadow: kdRaw >= 2.0 ? '0 0 16px rgba(255,215,0,0.45)' : 'none' }}>
                  <span style={{ fontSize: '0.54rem', color: badgeText === '#030712' ? '#030712' : 'rgba(255,255,255,0.7)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px' }}>K/D</span>
                  <span style={{ fontWeight: '900', color: badgeText, fontSize: '1.15rem', fontFamily: 'var(--font-rajdhani)', lineHeight: 1 }}>{kd}</span>
                </div>
              </div>

            </li>
          );
        })}
      </ul>

      {/* Botão de Expansão / Alternância Top 10 vs Todos */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          style={{
            background: 'rgba(0, 240, 255, 0.08)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            color: 'var(--cyan)',
            padding: '0.45rem 1.1rem',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'var(--font-rajdhani)',
            letterSpacing: '0.5px',
          }}
        >
          {showAll ? '▲ Recolher para Top 10' : `▼ Mostrar todos os ${topKD.length} jogadores`}
        </button>
      </div>
    </div>
  );
}
