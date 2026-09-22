'use client';

import Link from 'next/link';
import { matchDetails, matches, getTeam } from '../data';
import TeamLogo from './TeamLogo';

const mapColors: Record<string, string> = {
  'Mirage': '#00f0ff',
  'Inferno': '#ff4757',
  'Nuke': '#ffa502',
  'Anúbis': '#2ed573',
  'Dust II': '#e2e8f0',
  'Ancient': '#a29bfe',
  'Vertigo': '#fd79a8',
  'Cache': '#00d2d3',
  'Overpass': '#6c5ce7',
};

export default function MapPoolStats() {
  // Construir dados dinâmicos a partir dos matchDetails reais
  const mapData: Record<string, {
    played: number;
    matchInfo: {
      teamA: ReturnType<typeof getTeam>;
      teamB: ReturnType<typeof getTeam>;
      scoreA: number;
      scoreB: number;
      matchId: number;
    }[];
  }> = {};

  matches.forEach(match => {
    const detail = matchDetails[String(match.id)];
    if (!detail || !detail.map) return;

    const mapName = detail.map;
    if (!mapData[mapName]) mapData[mapName] = { played: 0, matchInfo: [] };
    mapData[mapName].played++;

    const teamA = getTeam(match.teamA);
    const teamB = getTeam(match.teamB);
    mapData[mapName].matchInfo.push({
      teamA,
      teamB,
      scoreA: detail.teamARounds,
      scoreB: detail.teamBRounds,
      matchId: match.id,
    });
  });

  const totalMatches = matches.length || 1;
  const sortedMaps = Object.entries(mapData).sort((a, b) => b[1].played - a[1].played);

  return (
    <div className="glass-card" style={{ gridColumn: '1 / -1', marginTop: '2.5rem', border: '1px solid rgba(0,240,255,0.2)', boxShadow: '0 0 25px rgba(0,240,255,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '0.8rem' }}>
        <div>
          <span className="section-eyebrow">ESTATÍSTICAS DE ARENAS</span>
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', margin: '0.2rem 0 0' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            MAP POOL DO CAMPEONATO
          </h3>
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
          {sortedMaps.length} mapas jogados em {totalMatches} partidas
        </span>
      </div>
      
      {/* Chips dos mapas */}
      <div style={{ display: 'flex', gap: '0.45rem', marginTop: '0.4rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
        {sortedMaps.map(([mapName, data]) => {
          const color = mapColors[mapName] || '#00f0ff';
          return (
            <span
              key={mapName}
              style={{
                background: `${color}18`,
                border: `1px solid ${color}44`,
                color: color,
                fontSize: '0.75rem',
                fontWeight: 'bold',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }} />
              {mapName}
              <small style={{ opacity: 0.8, fontWeight: 'normal' }}>({data.played}x)</small>
            </span>
          );
        })}
      </div>

      {/* Grid dos Cards de Mapas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.2rem' }}>
        {sortedMaps.map(([mapName, data]) => {
          const pct = Math.round((data.played / totalMatches) * 100);
          const color = mapColors[mapName] || '#00f0ff';

          return (
            <div
              key={mapName}
              style={{
                background: 'rgba(10, 16, 30, 0.7)',
                padding: '1.1rem',
                borderRadius: '14px',
                border: `1px solid ${color}28`,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              {/* Header do Mapa */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '1.35rem', color: '#fff', fontFamily: 'var(--font-rajdhani)', letterSpacing: '0.5px' }}>
                  {mapName}
                </strong>
                <span
                  style={{
                    background: `${color}22`,
                    border: `1px solid ${color}55`,
                    color: color,
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.65rem',
                    borderRadius: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {data.played}x jogado
                </span>
              </div>
              
              {/* Barra de Frequência do Mapa */}
              <div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: color, transition: 'width 0.4s ease-in-out' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  <span>{pct}% de frequência</span>
                  <span>{data.matchInfo.length} {data.matchInfo.length === 1 ? 'confronto' : 'confrontos'}</span>
                </div>
              </div>

              {/* Lista de Partidas do Mapa (Layout Broadcast anti-quebra) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.65rem' }}>
                {data.matchInfo.map((info, i) => {
                  const aWon = info.scoreA > info.scoreB;
                  const bWon = info.scoreB > info.scoreA;

                  return (
                    <Link
                      key={i}
                      href={`/partida/${info.matchId}`}
                      title={`Ver súmula da partida #${info.matchId}: ${info.teamA.name} vs ${info.teamB.name}`}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '9px',
                        background: 'rgba(255, 255, 255, 0.025)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 240, 255, 0.06)';
                        e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.025)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                      }}
                    >
                      {/* Linha Time A */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0, flex: 1 }}>
                          <TeamLogo logo={info.teamA.logo} name={info.teamA.name} initials={info.teamA.initials} size={20} borderRadius="4px" />
                          <span
                            style={{
                              color: aWon ? '#fff' : '#8fa0b8',
                              fontWeight: aWon ? '700' : '500',
                              fontSize: '0.8rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                            title={info.teamA.name}
                          >
                            {info.teamA.name}
                          </span>
                          {aWon && <span style={{ fontSize: '0.72rem', lineHeight: 1 }} title="Vencedor">🏆</span>}
                        </div>
                        <span
                          style={{
                            fontFamily: 'var(--font-rajdhani)',
                            fontWeight: 'bold',
                            fontSize: '0.95rem',
                            color: aWon ? '#2ed573' : '#64748b',
                            minWidth: '22px',
                            textAlign: 'right',
                          }}
                        >
                          {info.scoreA}
                        </span>
                      </div>

                      {/* Linha Time B */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0, flex: 1 }}>
                          <TeamLogo logo={info.teamB.logo} name={info.teamB.name} initials={info.teamB.initials} size={20} borderRadius="4px" />
                          <span
                            style={{
                              color: bWon ? '#fff' : '#8fa0b8',
                              fontWeight: bWon ? '700' : '500',
                              fontSize: '0.8rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                            title={info.teamB.name}
                          >
                            {info.teamB.name}
                          </span>
                          {bWon && <span style={{ fontSize: '0.72rem', lineHeight: 1 }} title="Vencedor">🏆</span>}
                        </div>
                        <span
                          style={{
                            fontFamily: 'var(--font-rajdhani)',
                            fontWeight: 'bold',
                            fontSize: '0.95rem',
                            color: bWon ? '#2ed573' : '#64748b',
                            minWidth: '22px',
                            textAlign: 'right',
                          }}
                        >
                          {info.scoreB}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
