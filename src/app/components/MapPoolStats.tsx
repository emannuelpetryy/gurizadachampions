'use client';

import { matchDetails, matches, getTeam } from '../data';

const mapColors: Record<string, string> = {
  'Mirage': '#00f0ff',
  'Inferno': '#ff4757',
  'Nuke': '#ffa502',
  'Anúbis': '#2ed573',
  'Dust II': '#dfe6e9',
  'Ancient': '#a29bfe',
  'Vertigo': '#fd79a8',
  'Overpass': '#6c5ce7',
};

export default function MapPoolStats() {
  // Construir dados dinâmicos a partir dos matchDetails reais
  const mapData: Record<string, { played: number; matchInfo: { teamAName: string; teamBName: string; scoreA: number; scoreB: number; matchId: number }[] }> = {};

  matches.forEach(match => {
    const detail = matchDetails[String(match.id)];
    if (!detail || !detail.map) return;

    const mapName = detail.map;
    if (!mapData[mapName]) mapData[mapName] = { played: 0, matchInfo: [] };
    mapData[mapName].played++;

    const teamA = getTeam(match.teamA);
    const teamB = getTeam(match.teamB);
    mapData[mapName].matchInfo.push({
      teamAName: teamA.name,
      teamBName: teamB.name,
      scoreA: detail.teamARounds,
      scoreB: detail.teamBRounds,
      matchId: match.id
    });
  });

  const totalMatches = matches.length || 1;
  const sortedMaps = Object.entries(mapData).sort((a, b) => b[1].played - a[1].played);

  return (
    <div className="glass-card" style={{ gridColumn: '1 / -1', marginTop: '2rem', border: '1px solid rgba(0,240,255,0.2)', boxShadow: '0 0 25px rgba(0,240,255,0.05)' }}>
      <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
        MAP POOL DO CAMPEONATO
      </h3>
      
      {/* Resumo visual */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
        {sortedMaps.map(([mapName]) => {
          const color = mapColors[mapName] || '#00f0ff';
          return (
            <span key={mapName} style={{ background: `${color}22`, border: `1px solid ${color}55`, color: color, fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.8rem', borderRadius: '20px' }}>
              {mapName}
            </span>
          );
        })}
        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', alignSelf: 'center', marginLeft: '0.5rem' }}>
          {sortedMaps.length} mapas jogados em {totalMatches} partida{totalMatches !== 1 ? 's' : ''}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.2rem', marginTop: '1rem' }}>
        {sortedMaps.map(([mapName, data]) => {
          const pct = Math.round((data.played / totalMatches) * 100);
          const color = mapColors[mapName] || '#00f0ff';
          return (
            <div key={mapName} style={{ background: 'rgba(0,0,0,0.5)', padding: '1.2rem', borderRadius: '14px', border: `1px solid ${color}33`, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '1.4rem', color: '#fff', fontFamily: 'var(--font-rajdhani)' }}>{mapName}</strong>
                <span style={{ background: color, color: '#000', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.2rem 0.7rem', borderRadius: '12px' }}>
                  {data.played}x jogado
                </span>
              </div>
              
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: color, transition: 'width 0.4s ease-in-out' }}></div>
              </div>
              
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {pct}% do total de partidas
              </span>

              {/* Partidas jogadas neste mapa */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.6rem', marginTop: '0.2rem' }}>
                {data.matchInfo.map((info, i) => {
                  const aWon = info.scoreA > info.scoreB;
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', padding: '0.3rem 0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.03)' }}>
                      <span style={{ color: aWon ? '#2ed573' : 'var(--text-muted)', fontWeight: aWon ? 'bold' : 'normal' }}>
                        {aWon ? '🏆 ' : ''}{info.teamAName}
                      </span>
                      <span style={{ fontFamily: 'var(--font-rajdhani)', fontWeight: 'bold', color: color, fontSize: '0.9rem' }}>
                        {info.scoreA}-{info.scoreB}
                      </span>
                      <span style={{ color: !aWon ? '#2ed573' : 'var(--text-muted)', fontWeight: !aWon ? 'bold' : 'normal' }}>
                        {!aWon ? '🏆 ' : ''}{info.teamBName}
                      </span>
                    </div>
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
