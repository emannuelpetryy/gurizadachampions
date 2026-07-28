import { getTeam, matches, matchDetails } from '../../data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const match = matches.find(m => m.id === parseInt(resolvedParams.id));
  if (!match) return notFound();

  const details = matchDetails[resolvedParams.id];
  const teamA = getTeam(match.teamA);
  const teamB = getTeam(match.teamB);

  // Se não tiver detalhes estáticos mockados (ex: partidas 1,2,3), mostrar fallback
  if (!details) {
    return (
      <main style={{ padding: '4rem 0' }}>
        <section className="container">
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
            <h2 className="hero-title" style={{ fontSize: '2rem' }}>Detalhes não disponíveis</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>As estatísticas desta partida ainda não foram processadas.</p>
            <Link href="/" className="btn-primary" style={{ fontSize: '1rem' }}>Voltar ao Início</Link>
          </div>
        </section>
      </main>
    );
  }

  const renderStatsTable = (stats: any[], teamInitials: string) => (
    <div style={{ overflowX: 'auto', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
      <table className="ranking-table">
        <thead>
          <tr>
            <th style={{ paddingLeft: '1.5rem' }}>Jogador</th>
            <th style={{ textAlign: 'center', color: 'var(--cyan)' }}>Kills</th>
            <th style={{ textAlign: 'center', color: 'var(--accent-red)' }}>Deaths</th>
            <th style={{ textAlign: 'center' }}>Assists</th>
            <th style={{ textAlign: 'center', color: 'var(--primary)' }}>KDA</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((player) => {
            const kda = ((player.kills + player.assists) / (player.deaths || 1)).toFixed(2);
            return (
              <tr key={player.name}>
                <td style={{ paddingLeft: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="team-logo-square" style={{ width: '28px', height: '28px', fontSize: '0.6rem' }}>{teamInitials}</div>
                    <strong style={{ color: '#fff' }}>{player.name}</strong>
                  </div>
                </td>
                <td style={{ textAlign: 'center', color: 'var(--cyan)', fontWeight: 'bold' }}>{player.kills}</td>
                <td style={{ textAlign: 'center', color: 'var(--accent-red)' }}>{player.deaths}</td>
                <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{player.assists}</td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{ background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.3)', color: 'var(--cyan)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontFamily: 'var(--font-rajdhani)', fontWeight: 'bold' }}>
                    {kda}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <main style={{ padding: '4rem 0' }}>
      <section className="container">
        
        {/* Match Header */}
        <div className="glass-card" style={{ marginBottom: '2rem', padding: '0', overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(45deg, rgba(0,240,255,0.1), transparent)', padding: '3rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem' }}>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                {teamA.logo ? <img src={teamA.logo} alt={teamA.name} style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover', boxShadow: '0 0 20px rgba(0,240,255,0.2)' }} /> : <div className="team-logo-square" style={{ width: '80px', height: '80px', fontSize: '2rem', boxShadow: '0 0 20px rgba(0,240,255,0.2)' }}>{teamA.initials}</div>}
                <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-rajdhani)', color: '#fff', textAlign: 'center' }}>{teamA.name}</h2>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>GRUPO {match.group}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(0,0,0,0.5)', padding: '1rem 2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-main)', fontFamily: 'var(--font-rajdhani)' }}>{match.scoreA}</span>
                  <span style={{ fontSize: '1.5rem', color: 'var(--cyan)' }}>-</span>
                  <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-main)', fontFamily: 'var(--font-rajdhani)' }}>{match.scoreB}</span>
                </div>
                <span style={{ background: 'var(--accent-red)', color: '#fff', padding: '0.2rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', marginTop: '1rem', textTransform: 'uppercase' }}>
                  {match.status}
                </span>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                {teamB.logo ? <img src={teamB.logo} alt={teamB.name} style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover', boxShadow: '0 0 20px rgba(0,240,255,0.2)' }} /> : <div className="team-logo-square" style={{ width: '80px', height: '80px', fontSize: '2rem', boxShadow: '0 0 20px rgba(0,240,255,0.2)' }}>{teamB.initials}</div>}
                <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-rajdhani)', color: '#fff', textAlign: 'center' }}>{teamB.name}</h2>
              </div>

            </div>
          </div>

          {/* Placar de Rounds */}
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3rem' }}>
            <span style={{ color: 'var(--cyan)', fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'var(--font-rajdhani)' }}>{details.roundsA}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              <span>Mapa: <strong>{details.map}</strong></span>
            </div>
            <span style={{ color: 'var(--cyan)', fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'var(--font-rajdhani)' }}>{details.roundsB}</span>
          </div>
        </div>

        {/* Estatísticas Individuais */}
        <h3 className="hero-title" style={{ fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem', textShadow: 'none' }}>SCOREBOARD</h3>
        
        <div className="grid-2">
          <div>
            <h4 style={{ color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="team-logo-square" style={{ width: '20px', height: '20px', fontSize: '0.5rem' }}>{teamA.initials}</div>
              {teamA.name}
            </h4>
            {renderStatsTable(details.teamA_stats, teamA.initials)}
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="team-logo-square" style={{ width: '20px', height: '20px', fontSize: '0.5rem' }}>{teamB.initials}</div>
              {teamB.name}
            </h4>
            {renderStatsTable(details.teamB_stats, teamB.initials)}
          </div>
        </div>

      </section>
    </main>
  );
}
