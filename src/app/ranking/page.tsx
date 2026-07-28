export default function Ranking() {
  return (
    <main style={{ padding: '4rem 0' }}>
      <section className="container">
        <h1 className="hero-title" style={{ fontSize: '3rem', textAlign: 'center' }}>Ranking VRS</h1>
        <p className="hero-subtitle" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          A classificação oficial do Gurizada Champions.
        </p>

        <div className="glass-card">
          <div style={{ overflowX: 'auto' }}>
            <table className="ranking-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Equipe</th>
                  <th>Pontos</th>
                  <th>V-D</th>
                  <th>+/- Rounds</th>
                </tr>
              </thead>
              <tbody>
                <tr className="rank-1">
                  <td><span className="rank-number">1</span></td>
                  <td>
                    <div className="team-info">
                      <div className="team-logo-placeholder">A</div>
                      <strong>Team Alpha</strong>
                    </div>
                  </td>
                  <td style={{ color: 'var(--primary)', fontWeight: 'bold' }}>1250</td>
                  <td>12-2</td>
                  <td style={{ color: '#2de2e6' }}>+45</td>
                </tr>
                <tr className="rank-2">
                  <td><span className="rank-number">2</span></td>
                  <td>
                    <div className="team-info">
                      <div className="team-logo-placeholder">B</div>
                      <strong>Team Bravo</strong>
                    </div>
                  </td>
                  <td style={{ color: 'var(--primary)', fontWeight: 'bold' }}>1100</td>
                  <td>10-4</td>
                  <td style={{ color: '#2de2e6' }}>+28</td>
                </tr>
                <tr className="rank-3">
                  <td><span className="rank-number">3</span></td>
                  <td>
                    <div className="team-info">
                      <div className="team-logo-placeholder">C</div>
                      <strong>Team Charlie</strong>
                    </div>
                  </td>
                  <td style={{ color: 'var(--primary)', fontWeight: 'bold' }}>980</td>
                  <td>8-6</td>
                  <td style={{ color: '#2de2e6' }}>+12</td>
                </tr>
                <tr>
                  <td><span className="rank-number" style={{ fontSize: '1.2rem' }}>4</span></td>
                  <td>
                    <div className="team-info">
                      <div className="team-logo-placeholder">D</div>
                      <strong>Team Delta</strong>
                    </div>
                  </td>
                  <td style={{ color: 'var(--primary)', fontWeight: 'bold' }}>850</td>
                  <td>7-7</td>
                  <td style={{ color: '#e03a45' }}>-5</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
