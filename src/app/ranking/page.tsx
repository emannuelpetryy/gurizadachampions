import { groupA, groupB, getTeam, players } from '../data';
import Link from 'next/link';
import PlayerAvatar from '../jogador/[name]/PlayerAvatar';
import TeamLogo from '../components/TeamLogo';

export default function Ranking() {
  const renderGroupTable = (groupName: string, groupData: any[]) => (
    <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
      <h3 className="card-title" style={{ textAlign: 'center', justifyContent: 'center' }}>GRUPO {groupName}</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="ranking-table">
          <thead>
            <tr>
              <th style={{ width: '60px', textAlign: 'center' }}>POS</th>
              <th>EQUIPE</th>
              <th style={{ textAlign: 'center', color: 'var(--primary)' }}>PTS</th>
              <th style={{ textAlign: 'center' }}>J</th>
              <th style={{ textAlign: 'center' }}>V</th>
              <th style={{ textAlign: 'center' }}>D</th>
              <th style={{ textAlign: 'center', color: '#2ed573' }}>RD</th>
            </tr>
          </thead>
          <tbody>
            {groupData.map((row, index) => {
              const team = getTeam(row.teamId);
              return (
                <tr key={team.id} className={`rank-${index + 1}`}>
                  <td style={{ textAlign: 'center' }}>
                    <span className="rank-number" style={{ fontSize: index < 2 ? '1.5rem' : '1.2rem', color: index < 2 ? 'var(--cyan)' : '#fff', textShadow: index < 2 ? '0 0 10px rgba(0,240,255,0.5)' : 'none' }}>
                      {index + 1}
                    </span>
                  </td>
                  <td>
                    <Link href={`/time/${team.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="team-info" style={{ cursor: 'pointer' }}>
                        <TeamLogo logo={team.logo} name={team.name} initials={team.initials} size={40} borderRadius="8px" />
                        <strong style={{ fontSize: '1.1rem' }}>{team.name}</strong>
                      </div>
                    </Link>
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>{row.p}</td>
                  <td style={{ textAlign: 'center' }}>{row.pj}</td>
                  <td style={{ textAlign: 'center', color: '#00F0FF' }}>{row.v}</td>
                  <td style={{ textAlign: 'center', color: '#ff3366' }}>{row.d}</td>
                  <td style={{ textAlign: 'center', color: row.rd > 0 ? '#2ed573' : row.rd < 0 ? '#ff4757' : 'var(--text-muted)', fontWeight: 'bold' }}>
                    {row.rd > 0 ? `+${row.rd}` : row.rd}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>* Top 2 classificam para as semifinais | RD = Saldo de Rounds</p>
    </div>
  );

  return (
    <main style={{ padding: '4rem 0' }}>
      <section className="container">
        <h1 className="hero-title" style={{ fontSize: '3.5rem', textAlign: 'center', textShadow: 'none' }}>TABELA DE <span className="text-cyan">CLASSIFICAÇÃO</span></h1>
        <p className="hero-subtitle" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          FASE DE GRUPOS - 1ª ETAPA
        </p>

        <div className="grid-2">
          {renderGroupTable('A', groupA)}
          {renderGroupTable('B', groupB)}
        </div>

        <h2 className="hero-title" style={{ fontSize: '2.5rem', textAlign: 'center', marginTop: '5rem', marginBottom: '2rem', textShadow: 'none' }}>RANKING GERAL DE <span className="text-gold">DESEMPENHO</span></h2>
        
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="ranking-table">
              <thead>
                <tr>
                  <th style={{ width: '80px', textAlign: 'center' }}>RANK</th>
                  <th>JOGADOR</th>
                  <th>EQUIPE</th>
                  <th style={{ textAlign: 'center' }}>J</th>
                  <th style={{ textAlign: 'center', color: 'var(--cyan)' }}>KILLS</th>
                  <th style={{ textAlign: 'center', color: 'var(--accent-red)' }}>DEATHS</th>
                  <th style={{ textAlign: 'center' }}>ASSISTS</th>
                  <th style={{ textAlign: 'center', color: 'var(--gold)' }}>K/D</th>
                  <th style={{ textAlign: 'center', color: 'var(--cyan)' }}>KDA</th>
                </tr>
              </thead>
              <tbody>
                {[...players].sort((a, b) => (b.kills / (b.deaths || 1)) - (a.kills / (a.deaths || 1))).map((player, index) => {
                  const team = getTeam(player.teamId);
                  const kd = (player.kills / (player.deaths || 1)).toFixed(2);
                  const kda = ((player.kills + player.assists) / (player.deaths || 1)).toFixed(2);
                  return (
                    <tr key={player.name} className={`rank-${index + 1}`}>
                      <td style={{ textAlign: 'center' }}><span className="rank-number" style={{ fontSize: index < 3 ? '1.5rem' : '1.2rem' }}>#{index + 1}</span></td>
                      <td>
                        <Link href={`/jogador/${encodeURIComponent(player.name)}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem' }} className="match-card-hover">
                          <PlayerAvatar teamName={team.name} playerName={player.name} badgeColor="rgba(255,255,255,0.1)" size={40} />
                          <strong style={{ fontSize: '1.1rem', color: '#fff' }}>{player.name}</strong>
                        </Link>
                      </td>
                      <td>
                        <Link href={`/time/${team.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <div className="team-info" style={{ gap: '0.5rem', cursor: 'pointer' }}>
                            <TeamLogo logo={team.logo} name={team.name} initials={team.initials} size={24} borderRadius="4px" />
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{team.name}</span>
                          </div>
                        </Link>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{player.matches || 1}</td>
                      <td style={{ textAlign: 'center', color: 'var(--cyan)', fontWeight: 'bold', fontSize: '1.2rem' }}>{player.kills}</td>
                      <td style={{ textAlign: 'center', color: 'var(--accent-red)' }}>{player.deaths}</td>
                      <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{player.assists}</td>
                      <td style={{ textAlign: 'center', color: 'var(--gold)', fontWeight: 'bold', fontSize: '1.2rem' }}>{kd}</td>
                      <td style={{ textAlign: 'center', color: 'var(--cyan)', fontWeight: 'bold', fontSize: '1.2rem' }}>{kda}</td>
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
