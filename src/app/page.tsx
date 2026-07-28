import { matches, getTeam, players } from './data';

export default function Home() {
  const nextMatch = matches[0]; // Pegando a primeira partida para destaque
  const teamA = getTeam(nextMatch.teamA);
  const teamB = getTeam(nextMatch.teamB);

  return (
    <main>
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">1º Gurizada Champions Cup</h1>
          <p className="hero-subtitle">
            Campeonatinho de CS2 entre amigos, pura resenha e entretenimento.
          </p>
          <a href="/ranking" className="btn-primary">Ver Ranking e Estatísticas</a>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: '4rem' }}>
        <div className="grid-2">
          <div className="glass-card">
            <h3 className="card-title">Último Jogo / Destaque</h3>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div className="team-logo-placeholder" style={{ margin: '0 auto 0.5rem', background: '#333' }}>{teamA.logo}</div>
                  <strong style={{ fontSize: '0.9rem' }}>{teamA.name}</strong>
                </div>
                <div style={{ padding: '0 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{nextMatch.scoreA} - {nextMatch.scoreB}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--primary)', textTransform: 'uppercase' }}>{nextMatch.status}</span>
                </div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div className="team-logo-placeholder" style={{ margin: '0 auto 0.5rem', background: '#333' }}>{teamB.logo}</div>
                  <strong style={{ fontSize: '0.9rem' }}>{teamB.name}</strong>
                </div>
              </div>
              <p style={{ textAlign: 'center', marginTop: '1rem', color: '#999', fontSize: '0.85rem' }}>{nextMatch.date} - Grupo {nextMatch.group}</p>
            </div>
          </div>

          <div className="glass-card">
            <h3 className="card-title">Top 3 Jogadores (Kills)</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {players.slice(0, 3).map((player, index) => {
                const team = getTeam(player.teamId);
                return (
                  <li key={player.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontWeight: 'bold', color: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32' }}>#{index + 1}</span>
                      <div>
                        <p style={{ fontWeight: 'bold' }}>{player.name}</p>
                        <p style={{ fontSize: '0.75rem', color: '#999' }}>{team.name}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{player.kills} K</span>
                      <p style={{ fontSize: '0.75rem', color: '#999' }}>{player.assists} A</p>
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
