import { getTeam, matches, players } from '../../data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const team = getTeam(resolvedParams.id);
  
  if (!team || team.id !== resolvedParams.id) return notFound();

  const teamMatches = matches.filter(m => m.teamA === team.id || m.teamB === team.id);
  const teamPlayers = players.filter(p => p.teamId === team.id);

  return (
    <main style={{ padding: '4rem 0' }}>
      <section className="container">
        
        {/* Team Banner */}
        <div className="glass-card" style={{ marginBottom: '3rem', padding: '0', overflow: 'hidden', position: 'relative' }}>
          <div style={{ height: '200px', background: 'url(https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-zfhvn%2Finfo.png?alt=media&token=1&m=1784675443770)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(3px) brightness(0.3)' }}></div>
          
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', gap: '2rem', padding: '2rem' }}>
            {team.logo ? (
              <img src={team.logo} alt={team.name} style={{ width: '120px', height: '120px', borderRadius: '12px', objectFit: 'cover', border: '2px solid var(--cyan)', boxShadow: '0 0 20px rgba(0,240,255,0.3)' }} />
            ) : (
              <div className="team-logo-square" style={{ width: '120px', height: '120px', fontSize: '2.5rem', borderRadius: '12px' }}>{team.initials}</div>
            )}
            <div>
              <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-rajdhani)', color: '#fff', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{team.name}</h1>
              <span style={{ background: 'var(--cyan)', color: '#000', padding: '0.2rem 1rem', borderRadius: '20px', fontWeight: 'bold' }}>GRUPO DA EQUIPE</span>
            </div>
          </div>
        </div>

        {/* Players / Roster */}
        <h2 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '2rem', textShadow: 'none' }}>JOGADORES</h2>
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '3rem' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="ranking-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: '1.5rem' }}>Jogadores</th>
                  <th style={{ textAlign: 'center' }}>J</th>
                  <th style={{ textAlign: 'center', color: 'var(--cyan)' }}>K</th>
                  <th style={{ textAlign: 'center', color: 'var(--accent-red)' }}>D</th>
                  <th style={{ textAlign: 'center' }}>ASS</th>
                </tr>
              </thead>
              <tbody>
                {teamPlayers.length > 0 ? (
                  teamPlayers.map(player => (
                    <tr key={player.name}>
                      <td style={{ paddingLeft: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                          </div>
                          <strong style={{ fontSize: '1.1rem', color: '#fff' }}>{player.name}</strong>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>1</td>
                      <td style={{ textAlign: 'center', color: 'var(--cyan)', fontWeight: 'bold' }}>{player.kills}</td>
                      <td style={{ textAlign: 'center', color: 'var(--accent-red)' }}>{player.deaths}</td>
                      <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{player.assists}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Estatísticas não disponíveis para esta equipe.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Matches */}
        <h2 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '2rem', textShadow: 'none' }}>PARTIDAS</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {teamMatches.map(match => {
            const teamA = getTeam(match.teamA);
            const teamB = getTeam(match.teamB);
            return (
              <Link href={`/partida/${match.id}`} key={match.id} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.4)', padding: '1rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', transition: 'all 0.2s', cursor: 'pointer' }} className="match-card-hover">
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {teamA.logo ? <img src={teamA.logo} alt={teamA.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} /> : <div className="team-logo-square" style={{ width: '40px', height: '40px' }}>{teamA.initials}</div>}
                    <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-rajdhani)', color: '#fff' }}>{teamA.name}</strong>
                  </div>
                  
                  <div style={{ padding: '0 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '120px' }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-main)', fontFamily: 'var(--font-rajdhani)' }}>
                      {match.scoreA} <span className="text-cyan">-</span> {match.scoreB}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-red)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>{match.status}</span>
                  </div>

                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem' }}>
                    <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-rajdhani)', textAlign: 'right', color: '#fff' }}>{teamB.name}</strong>
                    {teamB.logo ? <img src={teamB.logo} alt={teamB.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} /> : <div className="team-logo-square" style={{ width: '40px', height: '40px' }}>{teamB.initials}</div>}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

      </section>
    </main>
  );
}
