import { matches, getTeam, players } from './data';
import Link from 'next/link';

export default function Home() {
  const nextMatch = matches[0];
  const teamA = getTeam(nextMatch.teamA);
  const teamB = getTeam(nextMatch.teamB);

  return (
    <main>
      <section className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">GURIZADA<br/><span className="text-cyan">CHAMPIONS CUP</span></h1>
          <p className="hero-subtitle">
            O MAIOR CAMPEONATO AMADOR DE CS2
          </p>
          <Link href="/ranking" className="btn-primary">Acompanhar Tabela</Link>
        </div>
      </section>

      <section className="container" style={{ padding: '4rem 2rem' }}>
        <div className="grid-2">
          <div className="glass-card">
            <h3 className="card-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              Último Jogo / Destaque
            </h3>
            <div style={{ marginTop: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.4)', padding: '2rem 1rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="team-logo-square" style={{ marginBottom: '1rem' }}>{teamA.initials}</div>
                  <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-rajdhani)' }}>{teamA.name}</strong>
                </div>
                <div style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-main)', textShadow: '0 0 15px rgba(255,255,255,0.3)', fontFamily: 'var(--font-rajdhani)' }}>
                    {nextMatch.scoreA} <span className="text-cyan">-</span> {nextMatch.scoreB}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-red)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px', marginTop: '0.5rem' }}>{nextMatch.status}</span>
                </div>
                <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="team-logo-square" style={{ marginBottom: '1rem' }}>{teamB.initials}</div>
                  <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-rajdhani)' }}>{teamB.name}</strong>
                </div>
              </div>
              <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {nextMatch.date} • Grupo {nextMatch.group}
              </p>
            </div>
          </div>

          <div className="glass-card">
            <h3 className="card-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
              Top 3 Jogadores (MVP)
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
              {players.slice(0, 3).map((player, index) => {
                const team = getTeam(player.teamId);
                return (
                  <li key={player.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', borderLeft: index === 0 ? '4px solid #FFD700' : index === 1 ? '4px solid #C0C0C0' : '4px solid #CD7F32' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <span style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '1.5rem', fontWeight: 'bold', color: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32' }}>#{index + 1}</span>
                      <div>
                        <p style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#fff' }}>{player.name}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{team.name}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--cyan)', fontSize: '1.2rem', fontFamily: 'var(--font-rajdhani)' }}>{player.kills} K</span>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{player.assists} A</p>
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
