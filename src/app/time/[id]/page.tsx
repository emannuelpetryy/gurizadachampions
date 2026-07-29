import { getTeam, players, matches, matchDetails } from '../../data';
import Link from 'next/link';
import PlayerAvatar from '../../jogador/[name]/PlayerAvatar';
import TeamLogo from '../../components/TeamLogo';
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
            <TeamLogo logo={team.logo} name={team.name} initials={team.initials} size={120} borderRadius="12px" />
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
                          <PlayerAvatar teamName={team.name} playerName={player.name} badgeColor="rgba(255,255,255,0.1)" size={40} />
                          <Link href={`/jogador/${encodeURIComponent(player.name)}`} style={{ textDecoration: 'none', color: 'inherit' }} className="match-card-hover">
                            <strong style={{ fontSize: '1.1rem', color: '#fff' }}>{player.name}</strong>
                          </Link>
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
                    <TeamLogo logo={teamA.logo} name={teamA.name} initials={teamA.initials} size={40} borderRadius="8px" />
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
                    <TeamLogo logo={teamB.logo} name={teamB.name} initials={teamB.initials} size={40} borderRadius="8px" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Estatísticas de Mapas do Time */}
        {(() => {
          const teamMapStats: { map: string; result: 'win' | 'loss' }[] = [];
          teamMatches.forEach(match => {
            const detail = matchDetails[String(match.id)];
            if (detail && detail.map) {
              const isTeamA = match.teamA === team.id;
              const won = isTeamA ? match.scoreA > match.scoreB : match.scoreB > match.scoreA;
              teamMapStats.push({ map: detail.map, result: won ? 'win' : 'loss' });
            }
          });

          if (teamMapStats.length === 0) return null;

          const mapAgg: Record<string, { played: number; wins: number }> = {};
          teamMapStats.forEach(s => {
            if (!mapAgg[s.map]) mapAgg[s.map] = { played: 0, wins: 0 };
            mapAgg[s.map].played++;
            if (s.result === 'win') mapAgg[s.map].wins++;
          });

          return (
            <div className="glass-card" style={{ marginTop: '3rem', border: '1px solid rgba(0,240,255,0.2)' }}>
              <h2 className="hero-title" style={{ fontSize: '2rem', marginBottom: '1.5rem', textShadow: 'none' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                MAP POOL
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.2rem' }}>
                {Object.entries(mapAgg).map(([mapName, stats]) => {
                  const winPct = Math.round((stats.wins / stats.played) * 100);
                  const mapColors: Record<string, string> = { 'Mirage': 'var(--cyan)', 'Inferno': '#ff4757', 'Nuke': '#ffa502', 'Anúbis': '#2ed573', 'Dust II': '#dfe6e9' };
                  const color = mapColors[mapName] || 'var(--cyan)';
                  return (
                    <div key={mapName} style={{ background: 'rgba(0,0,0,0.5)', padding: '1.2rem', borderRadius: '14px', border: `1px solid ${color}33`, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '1.3rem', color: '#fff', fontFamily: 'var(--font-rajdhani)' }}>{mapName}</strong>
                        <span style={{ background: color, color: '#000', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.15rem 0.6rem', borderRadius: '12px' }}>
                          {stats.played}x jogado
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${winPct}%`, height: '100%', background: color }}></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: '#2ed573' }}>✅ {stats.wins}V</span>
                        <span style={{ color: '#ff4757' }}>❌ {stats.played - stats.wins}D</span>
                        <span style={{ color: 'var(--text-muted)' }}>WR: {winPct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

      </section>
    </main>
  );
}
