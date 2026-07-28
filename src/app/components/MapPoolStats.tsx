'use client';

import { matchDetails } from '../data';

export default function MapPoolStats() {
  const mapCounts: Record<string, number> = {};
  Object.values(matchDetails).forEach(detail => {
    if (detail.map) {
      mapCounts[detail.map] = (mapCounts[detail.map] || 0) + 1;
    }
  });

  const totalMatches = Object.keys(matchDetails).length || 1;

  const mapsData = [
    { name: 'Mirage', count: mapCounts['Mirage'] || 0, color: 'var(--cyan)' },
    { name: 'Inferno', count: mapCounts['Inferno'] || 0, color: '#ff4757' },
    { name: 'Nuke', count: mapCounts['Nuke'] || 0, color: '#ffa502' },
    { name: 'Anúbis', count: mapCounts['Anúbis'] || 0, color: '#2ed573' },
  ];

  return (
    <div className="glass-card" style={{ gridColumn: '1 / -1', marginTop: '2rem', border: '1px solid rgba(0,240,255,0.2)', boxShadow: '0 0 25px rgba(0,240,255,0.05)' }}>
      <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
        ESTATÍSTICAS DE MAPAS (MAP POOL DO CAMPEONATO)
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', marginTop: '1.5rem' }}>
        {mapsData.map(m => {
          const pct = Math.round((m.count / totalMatches) * 100) || 0;
          return (
            <div key={m.name} style={{ background: 'rgba(0,0,0,0.5)', padding: '1.2rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '1.3rem', color: '#fff', fontFamily: 'var(--font-rajdhani)' }}>{m.name}</strong>
                <span style={{ background: m.color, color: '#000', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.2rem 0.7rem', borderRadius: '12px' }}>
                  {m.count} Jogo{m.count !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: m.color, transition: 'width 0.4s ease-in-out' }}></div>
              </div>
              
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                {pct}% dos jogos disputados
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
