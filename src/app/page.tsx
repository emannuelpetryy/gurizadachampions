import { getTeam, matches, players } from './data';
import Link from 'next/link';

export default function Home() {
  // Ordenar jogadores pelo KDA: (K + A) / D
  const topKDA = [...players].sort((a, b) => {
    const kdaA = (a.kills + a.assists) / (a.deaths || 1);
    const kdaB = (b.kills + b.assists) / (b.deaths || 1);
    return kdaB - kdaA; // Decrescente
  }).slice(0, 5);

  // Ordenar jogadores por Kills (Top Fraggers)
  const topFraggers = [...players].sort((a, b) => b.kills - a.kills).slice(0, 5);

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
          
          <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
            <h3 className="card-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              Últimos Jogos
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
              {matches.map((match) => {
                const teamA = getTeam(match.teamA);
                const teamB = getTeam(match.teamB);
                return (
                  <Link href={`/partida/${match.id}`} key={match.id} style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.4)', padding: '1rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', transition: 'all 0.2s', cursor: 'pointer' }} className="match-card-hover">
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {teamA.logo ? (
                          <img src={teamA.logo} alt={teamA.name} style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }} />
                        ) : (
                          <div className="team-logo-square" style={{ width: '36px', height: '36px', fontSize: '0.8rem' }}>{teamA.initials}</div>
                        )}
                        <strong style={{ fontSize: '1rem', fontFamily: 'var(--font-rajdhani)', color: '#fff' }}>{teamA.name}</strong>
                      </div>
                      
                      <div style={{ padding: '0 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100px' }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)', fontFamily: 'var(--font-rajdhani)' }}>
                          {match.scoreA} <span className="text-cyan">-</span> {match.scoreB}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--accent-red)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>{match.status}</span>
                      </div>

                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem' }}>
                        <strong style={{ fontSize: '1rem', fontFamily: 'var(--font-rajdhani)', textAlign: 'right', color: '#fff' }}>{teamB.name}</strong>
                        {teamB.logo ? (
                          <img src={teamB.logo} alt={teamB.name} style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }} />
                        ) : (
                          <div className="team-logo-square" style={{ width: '36px', height: '36px', fontSize: '0.8rem' }}>{teamB.initials}</div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="glass-card">
            <h3 className="card-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
              Top 5 KDA (MVP)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Ranqueados por maior KDA</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {topKDA.map((player, index) => {
                const team = getTeam(player.teamId);
                const kdaRaw = (player.kills + player.assists) / (player.deaths || 1);
                const kda = kdaRaw.toFixed(2);
                let badgeColor = '#666';
                if (kdaRaw >= 1.5) badgeColor = 'var(--cyan)';
                else if (kdaRaw >= 1.0) badgeColor = '#4caf50';
                else if (kdaRaw >= 0.7) badgeColor = '#f57c00';
                else badgeColor = 'var(--accent-red)';
                
                return (
                  <li key={player.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '0.8rem 1rem', borderRadius: '8px', borderLeft: index === 0 ? '4px solid #FFD700' : index === 1 ? '4px solid #C0C0C0' : index === 2 ? '4px solid #CD7F32' : '4px solid transparent' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '1.2rem', fontWeight: 'bold', color: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : 'var(--text-muted)' }}>#{index + 1}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        {team.logo ? <img src={team.logo} alt={team.name} style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover' }} /> : <div className="team-logo-square" style={{ width: '24px', height: '24px', fontSize: '0.6rem' }}>{team.initials}</div>}
                        <div>
                          <p style={{ fontWeight: 'bold', fontSize: '1rem', color: '#fff' }}>{player.name}</p>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{player.kills}K / {player.deaths}D / {player.assists}A</span>
                      </div>
                      <div style={{ background: badgeColor, padding: '0.2rem 0.8rem', borderRadius: '6px' }}>
                        <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '1rem', fontFamily: 'var(--font-rajdhani)' }}>{kda}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="glass-card">
            <h3 className="card-title" style={{ color: '#ff3366' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="22" y1="12" x2="18" y2="12"></line><line x1="6" y1="12" x2="2" y2="12"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="12" y1="22" x2="12" y2="18"></line></svg>
              Top 5 Fraggers (Kills)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Ranqueados por maior número de Kills</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {topFraggers.map((player, index) => {
                const team = getTeam(player.teamId);
                
                return (
                  <li key={player.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '0.8rem 1rem', borderRadius: '8px', borderLeft: index === 0 ? '4px solid #FFD700' : index === 1 ? '4px solid #C0C0C0' : index === 2 ? '4px solid #CD7F32' : '4px solid transparent' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '1.2rem', fontWeight: 'bold', color: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : 'var(--text-muted)' }}>#{index + 1}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        {team.logo ? <img src={team.logo} alt={team.name} style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover' }} /> : <div className="team-logo-square" style={{ width: '24px', height: '24px', fontSize: '0.6rem' }}>{team.initials}</div>}
                        <div>
                          <p style={{ fontWeight: 'bold', fontSize: '1rem', color: '#fff' }}>{player.name}</p>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ background: 'rgba(255, 51, 102, 0.15)', padding: '0.2rem 1rem', borderRadius: '6px', border: '1px solid rgba(255, 51, 102, 0.3)' }}>
                        <span style={{ fontWeight: 'bold', color: '#ff3366', fontSize: '1.2rem', fontFamily: 'var(--font-rajdhani)' }}>{player.kills}</span>
                        <span style={{ fontSize: '0.7rem', color: '#ff3366', marginLeft: '4px' }}>KILLS</span>
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
