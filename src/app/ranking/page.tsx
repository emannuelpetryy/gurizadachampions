import { groupA, groupB, getTeam, players } from '../data';

export default function Ranking() {
  const renderGroupTable = (groupName: string, groupData: any[]) => (
    <div className="glass-card" style={{ marginBottom: '2rem' }}>
      <h3 className="card-title" style={{ textAlign: 'center' }}>Grupo {groupName}</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="ranking-table">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Equipe</th>
              <th>P</th>
              <th>J</th>
              <th>V</th>
              <th>E</th>
              <th>D</th>
              <th>K</th>
              <th>D (Rounds)</th>
            </tr>
          </thead>
          <tbody>
            {groupData.map((row, index) => {
              const team = getTeam(row.teamId);
              return (
                <tr key={team.id} className={`rank-${index + 1}`}>
                  <td><span className="rank-number" style={{ fontSize: index < 3 ? '1.5rem' : '1.2rem' }}>{index + 1}</span></td>
                  <td>
                    <div className="team-info">
                      <div className="team-logo-placeholder">{team.logo}</div>
                      <strong>{team.name}</strong>
                    </div>
                  </td>
                  <td style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{row.p}</td>
                  <td>{row.pj}</td>
                  <td>{row.v}</td>
                  <td>{row.e}</td>
                  <td>{row.d}</td>
                  <td style={{ color: '#2de2e6' }}>{row.k}</td>
                  <td style={{ color: '#e03a45' }}>{row.d_rounds}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <main style={{ padding: '4rem 0' }}>
      <section className="container">
        <h1 className="hero-title" style={{ fontSize: '3rem', textAlign: 'center' }}>Classificação</h1>
        <p className="hero-subtitle" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          Tabela Oficial da 1ª Fase do Gurizada Champions Cup.
        </p>

        <div className="grid-2">
          {renderGroupTable('A', groupA)}
          {renderGroupTable('B', groupB)}
        </div>

        <h2 className="hero-title" style={{ fontSize: '2.5rem', textAlign: 'center', marginTop: '4rem', marginBottom: '2rem' }}>Estatísticas Individuais</h2>
        
        <div className="glass-card">
          <div style={{ overflowX: 'auto' }}>
            <table className="ranking-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Jogador</th>
                  <th>Equipe</th>
                  <th>Kills</th>
                  <th>Deaths</th>
                  <th>Assists</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => {
                  const team = getTeam(player.teamId);
                  return (
                    <tr key={player.name} className={`rank-${index + 1}`}>
                      <td><span className="rank-number" style={{ fontSize: index < 3 ? '1.5rem' : '1.2rem' }}>{index + 1}</span></td>
                      <td><strong>{player.name}</strong></td>
                      <td style={{ color: '#999', fontSize: '0.85rem' }}>{team.name}</td>
                      <td style={{ color: '#2de2e6', fontWeight: 'bold' }}>{player.kills}</td>
                      <td style={{ color: '#e03a45' }}>{player.deaths}</td>
                      <td style={{ color: 'var(--primary)' }}>{player.assists}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
