import { getTeam, matches, players } from './data';
import Link from 'next/link';

export default function Home() {
  // Ordenar jogadores pelo KDA: (K + A) / D
  const topPlayers = [...players].sort((a, b) => {
    const kdaA = (a.kills + a.assists) / (a.deaths || 1);
    const kdaB = (b.kills + b.assists) / (b.deaths || 1);
    return kdaB - kdaA; // Decrescente
  }).slice(0, 3);

  return (
    <main>
      <section className="hero-section">
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          {/* Usando a imagem diretamente em vez de background para não bugar com texto por cima */}
          <img 
            src="https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-zfhvn%2Finfo.png?alt=media&token=1&m=1784675443770" 
            alt="Gurizada Champions" 
            style={{ width: '100%', maxWidth: '800px', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0, 240, 255, 0.2)' }}
          />
          <Link href="/ranking" className="btn-primary">VER CLASSIFICAÇÃO COMPLETA</Link>
        </div>
      </section>

      <section className="container" style={{ padding: '4rem 2rem' }}>
        <div className="grid-2">
          
          <div className="glass-card">
            <h3 className="card-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              Últimos Jogos
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
              {matches.map((match) => {
                const teamA = getTeam(match.teamA);
                const teamB = getTeam(match.teamB);
                return (
                  <div key={match.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.4)', padding: '1rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div className="team-logo-square" style={{ width: '36px', height: '36px', fontSize: '0.8rem' }}>{teamA.initials}</div>
                      <strong style={{ fontSize: '1rem', fontFamily: 'var(--font-rajdhani)' }}>{teamA.name}</strong>
                    </div>
                    
                    <div style={{ padding: '0 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100px' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)', fontFamily: 'var(--font-rajdhani)' }}>
                        {match.scoreA} <span className="text-cyan">-</span> {match.scoreB}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--accent-red)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>{match.status}</span>
                    </div>

                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem' }}>
                      <strong style={{ fontSize: '1rem', fontFamily: 'var(--font-rajdhani)', textAlign: 'right' }}>{teamB.name}</strong>
                      <div className="team-logo-square" style={{ width: '36px', height: '36px', fontSize: '0.8rem' }}>{teamB.initials}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-card">
            <h3 className="card-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
              Top 3 Jogadores (MVP)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Ranqueados pelo KDA: (Kills + Assists) / Deaths</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {topPlayers.map((player, index) => {
                const team = getTeam(player.teamId);
                const kda = ((player.kills + player.assists) / (player.deaths || 1)).toFixed(2);
                
                return (
                  <li key={player.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', borderLeft: index === 0 ? '4px solid #FFD700' : index === 1 ? '4px solid #C0C0C0' : '4px solid #CD7F32' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <span style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '1.5rem', fontWeight: 'bold', color: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32' }}>#{index + 1}</span>
                      <div>
                        <p style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#fff' }}>{player.name}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{team.name}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{player.kills}K / {player.deaths}D / {player.assists}A</span>
                      </div>
                      <div style={{ background: 'rgba(0, 240, 255, 0.1)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--cyan)', fontSize: '1.2rem', fontFamily: 'var(--font-rajdhani)' }}>{kda}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '-4px' }}>KDA</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          
        </div>
      </section>
    </main>
  );
}
