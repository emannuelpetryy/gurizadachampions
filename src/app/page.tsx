import { getTeam, matches, matchDetails, players, teams, upcomingMatches } from './data';
import Link from 'next/link';
import PlayerAvatar from './jogador/[name]/PlayerAvatar';
import Comments from '../components/Comments';
import Countdown from '../components/Countdown';
import TeamLogo from './components/TeamLogo';
import MatchPrediction from './components/MatchPrediction';
import MapPoolStats from './components/MapPoolStats';
import CommunitySelection from './components/CommunitySelection';
import TwitchLiveStream from './components/TwitchLiveStream';

export default function Home() {
  // Ordenar jogadores pelo K/D ratio (principal)
  const topKD = [...players].sort((a, b) => {
    const kdA = a.kills / (a.deaths || 1);
    const kdB = b.kills / (b.deaths || 1);
    return kdB - kdA; // Decrescente
  });

  return (
    <main>
      <section className="hero-section" style={{ position: 'relative', width: '100%', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* Background Image with Parallax & Blur */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-zfhvn%2Finfo.png?alt=media&token=1&m=1784675443770)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(5px) brightness(0.25)', transform: 'scale(1.05)' }}></div>
        
        {/* Gradient Overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(5, 10, 20, 0.2) 0%, rgba(5, 10, 20, 1) 100%)' }}></div>
        
        {/* Content */}
        <div className="container" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'center', padding: '4rem 1rem' }}>
          
          <div style={{ display: 'inline-block', padding: '0.5rem 1.5rem', background: 'rgba(0, 240, 255, 0.1)', border: '1px solid var(--cyan)', borderRadius: '30px', color: 'var(--cyan)', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem', boxShadow: '0 0 20px rgba(0, 240, 255, 0.2)' }}>
            Temporada 1 - Fase de Grupos
          </div>

          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontFamily: 'var(--font-rajdhani)', fontWeight: 800, lineHeight: 1, color: '#fff', textTransform: 'uppercase', margin: 0, textShadow: '0 0 40px rgba(0, 240, 255, 0.5)' }}>
            GURIZADA <span style={{ color: 'transparent', WebkitTextStroke: '2px var(--cyan)', textShadow: 'none' }}>CHAMPIONS</span>
          </h1>
          
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', lineHeight: 1.6, marginTop: '1rem' }}>
            Acompanhe as estatísticas, tabela de classificação e o desempenho individual dos melhores jogadores da liga.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/ranking" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', margin: 0 }}>
              Ver Classificação
            </Link>
            <Link href="/jogadores" className="btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', margin: 0 }}>
              Lista de Jogadores
            </Link>
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: '4rem 2rem' }}>
        <div className="grid-2">
          
          {/* Twitch Live Stream Minimizable Banner */}
          <TwitchLiveStream />

          {/* Próximos Confrontos com Countdown & Palpites */}
          {upcomingMatches.length > 0 && (
            <div className="glass-card" style={{ gridColumn: '1 / -1', marginBottom: '2rem', border: '1px solid rgba(0,240,255,0.2)', boxShadow: '0 0 25px rgba(0,240,255,0.05)' }}>
              <h3 className="card-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                Próximos Confrontos da Rodada 2
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                {upcomingMatches.map((match) => {
                  const teamA = getTeam(match.teamA);
                  const teamB = getTeam(match.teamB);
                  return (
                    <div key={match.id} style={{ background: 'linear-gradient(135deg, rgba(11,20,38,0.9) 0%, rgba(6,12,24,0.95) 100%)', padding: '1.6rem', borderRadius: '16px', border: '1px solid rgba(0,240,255,0.25)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'center', transition: 'all 0.3s ease' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 800 }}>{match.group}</span>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '1rem' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                          <TeamLogo logo={teamA.logo} name={teamA.name} initials={teamA.initials} size={48} borderRadius="10px" />
                          <strong style={{ fontSize: '1.05rem', color: '#fff', textAlign: 'center', fontFamily: 'var(--font-rajdhani)', letterSpacing: '0.5px' }}>{teamA.name}</strong>
                        </div>

                        <span style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--cyan)', fontFamily: 'var(--font-rajdhani)', textShadow: '0 0 15px rgba(0,240,255,0.6)' }}>VS</span>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                          <TeamLogo logo={teamB.logo} name={teamB.name} initials={teamB.initials} size={48} borderRadius="10px" />
                          <strong style={{ fontSize: '1.05rem', color: '#fff', textAlign: 'center', fontFamily: 'var(--font-rajdhani)', letterSpacing: '0.5px' }}>{teamB.name}</strong>
                        </div>
                      </div>

                      <Countdown targetDate={match.date} />
                      {match.dateDisplay && (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>{match.dateDisplay}</span>
                      )}
                      
                      {/* Sistema de Palpites / Votação da Torcida */}
                      <MatchPrediction matchId={match.id} teamAName={teamA.name} teamBName={teamB.name} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Estatísticas de Mapas do Campeonato */}
          <MapPoolStats />
          
          <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
            <h3 className="card-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              Últimos Jogos
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
              {matches.map((match) => {
                const teamA = getTeam(match.teamA);
                const teamB = getTeam(match.teamB);
                const detail = matchDetails[String(match.id)];
                return (
                  <Link href={`/partida/${match.id}`} key={match.id} style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(6,12,24,0.9))', padding: '1.2rem', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '14px', transition: 'all 0.25s ease', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }} className="match-card-hover">
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <TeamLogo logo={teamA.logo} name={teamA.name} initials={teamA.initials} size={36} borderRadius="8px" />
                        <strong style={{ fontSize: '1.05rem', fontFamily: 'var(--font-rajdhani)', color: '#fff' }}>{teamA.name}</strong>
                      </div>
                      
                      <div style={{ padding: '0 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '120px' }}>
                        <span style={{ fontSize: '1.7rem', fontWeight: '900', color: 'var(--cyan)', fontFamily: 'var(--font-rajdhani)', letterSpacing: '2px', textShadow: '0 0 15px rgba(0,240,255,0.5)' }}>
                          {match.scoreA} <span style={{ color: '#64748b', fontSize: '1.1rem', margin: '0 0.2rem' }}>x</span> {match.scoreB}
                        </span>
                        {detail?.map && (
                          <span style={{ fontSize: '0.7rem', background: 'rgba(0, 240, 255, 0.15)', border: '1px solid var(--cyan)', color: 'var(--cyan)', padding: '0.15rem 0.6rem', borderRadius: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', marginTop: '0.2rem' }}>
                            {detail.map}
                          </span>
                        )}
                      </div>

                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem' }}>
                        <strong style={{ fontSize: '1.05rem', fontFamily: 'var(--font-rajdhani)', textAlign: 'right', color: '#fff' }}>{teamB.name}</strong>
                        <TeamLogo logo={teamB.logo} name={teamB.name} initials={teamB.initials} size={36} borderRadius="8px" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Votação das Seleções da Torcida (Dream Team & Top 5 Bagres) */}
          <CommunitySelection />

          <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
            <h3 className="card-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
              Ranking Geral de K/D Ratio
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>Todos os jogadores ranqueados por maior K/D (Kills / Deaths)</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '600px', overflowY: 'auto', paddingRight: '0.5rem' }} className="custom-scrollbar">
              {topKD.map((player, index) => {
                const team = getTeam(player.teamId);
                const kdRaw = player.kills / (player.deaths || 1);
                const kdaRaw = (player.kills + player.assists) / (player.deaths || 1);
                const kd = kdRaw.toFixed(2);
                const kda = kdaRaw.toFixed(2);

                let badgeBg = 'rgba(0, 240, 255, 0.15)';
                let badgeBorder = '1px solid var(--cyan)';
                let badgeText = 'var(--cyan)';

                if (kdRaw >= 2.0) {
                  badgeBg = 'linear-gradient(135deg, #ffd700, #ffaa00)';
                  badgeBorder = 'none';
                  badgeText = '#080d1a';
                } else if (kdRaw >= 1.5) {
                  badgeBg = 'rgba(0, 240, 255, 0.2)';
                  badgeBorder = '1px solid var(--cyan)';
                  badgeText = '#00f0ff';
                } else if (kdRaw >= 1.0) {
                  badgeBg = 'rgba(46, 213, 115, 0.2)';
                  badgeBorder = '1px solid #2ed573';
                  badgeText = '#2ed573';
                } else {
                  badgeBg = 'rgba(255, 71, 87, 0.2)';
                  badgeBorder = '1px solid #ff4757';
                  badgeText = '#ff4757';
                }
                
                return (
                  <li key={player.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.6)', padding: '0.9rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)', borderLeft: index === 0 ? '4px solid #FFD700' : index === 1 ? '4px solid #C0C0C0' : index === 2 ? '4px solid #CD7F32' : '4px solid transparent', transition: 'all 0.2s ease' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '1.3rem', fontWeight: 800, color: index === 0 ? '#ffd700' : index === 1 ? '#e2e8f0' : index === 2 ? '#cd7f32' : 'var(--text-muted)', minWidth: '35px' }}>#{index + 1}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <TeamLogo logo={team.logo} name={team.name} initials={team.initials} size={32} borderRadius="6px" />
                        <PlayerAvatar teamName={team.name} playerName={player.name} badgeColor="rgba(255,255,255,0.1)" size={36} />
                        <div>
                          <Link href={`/jogador/${encodeURIComponent(player.name)}`} style={{ textDecoration: 'none' }} className="match-card-hover">
                            <p style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff', margin: 0 }}>{player.name}</p>
                          </Link>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>{team.name} • {player.matches || 1} J</p>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{player.kills}K / {player.deaths}D / {player.assists}A</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--cyan)', fontWeight: 'bold' }}>KDA {kda}</span>
                      </div>
                      <div style={{ background: badgeBg, border: badgeBorder, padding: '0.35rem 0.9rem', borderRadius: '8px', minWidth: '75px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: kdRaw >= 2.0 ? '0 0 15px rgba(255,215,0,0.5)' : 'none' }}>
                        <span style={{ fontSize: '0.6rem', color: badgeText === '#080d1a' ? '#080d1a' : 'rgba(255,255,255,0.7)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>K/D</span>
                        <span style={{ fontWeight: '900', color: badgeText, fontSize: '1.2rem', fontFamily: 'var(--font-rajdhani)', lineHeight: 1 }}>{kd}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          
        </div>
      </section>

      {/* Seção Equipes */}
      <section className="container" style={{ padding: '0 2rem 4rem' }}>
        <h3 className="hero-title" style={{ fontSize: '2rem', marginBottom: '1.5rem', textShadow: 'none', textAlign: 'left' }}>EQUIPES</h3>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '2rem', justifyItems: 'center' }}>
            {teams.map(team => (
              <Link href={`/time/${team.id}`} key={team.id} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }} className="match-card-hover">
                <TeamLogo logo={team.logo} name={team.name} initials={team.initials} size={80} borderRadius="12px" />
                <span style={{ color: '#fff', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold' }}>{team.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Premiações */}
      <section className="container" style={{ padding: '0 2rem 4rem' }}>
        <h3 className="hero-title" style={{ fontSize: '2rem', marginBottom: '1.5rem', textShadow: 'none', textAlign: 'left' }}>PREMIAÇÕES</h3>
        <div className="glass-card" style={{ padding: '3rem 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ background: '#FFD700', color: '#000', fontWeight: 'bold', padding: '0.3rem 1.5rem', borderRadius: '20px', fontSize: '0.9rem' }}>Campeão</span>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80px', height: '80px', background: 'rgba(255, 215, 0, 0.2)', filter: 'blur(20px)', borderRadius: '50%' }}></div>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="#FFD700" stroke="#B8860B" strokeWidth="1" style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }}>
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                  <path d="M4 22h16"></path>
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                  <text x="12" y="7" textAnchor="middle" fill="#000" fontSize="4" fontWeight="bold" stroke="none">1</text>
                </svg>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>R$ <strong style={{ color: '#fff', fontSize: '1.8rem', fontFamily: 'var(--font-rajdhani)' }}>250,00</strong></span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ background: '#C0C0C0', color: '#000', fontWeight: 'bold', padding: '0.3rem 1.5rem', borderRadius: '20px', fontSize: '0.9rem' }}>2º Colocado</span>
              <div style={{ position: 'relative' }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="#C0C0C0" stroke="#808080" strokeWidth="1" style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }}>
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                  <path d="M4 22h16"></path>
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                  <text x="12" y="7" textAnchor="middle" fill="#000" fontSize="4" fontWeight="bold" stroke="none">2</text>
                </svg>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>R$ <strong style={{ color: '#fff', fontSize: '1.5rem', fontFamily: 'var(--font-rajdhani)' }}>100,00</strong></span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ background: '#CD7F32', color: '#000', fontWeight: 'bold', padding: '0.3rem 1.5rem', borderRadius: '20px', fontSize: '0.9rem' }}>3º Colocado</span>
              <div style={{ position: 'relative' }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="#CD7F32" stroke="#8B4513" strokeWidth="1" style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }}>
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                  <path d="M4 22h16"></path>
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                  <text x="12" y="7" textAnchor="middle" fill="#000" fontSize="4" fontWeight="bold" stroke="none">3</text>
                </svg>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>R$ <strong style={{ color: '#fff', fontSize: '1.5rem', fontFamily: 'var(--font-rajdhani)' }}>50,00</strong></span>
            </div>

          </div>
        </div>
      </section>

      {/* Seção Mural de Resenha (Comentários) */}
      <section className="container" style={{ padding: '0 2rem 6rem' }}>
        <Comments />
      </section>
    </main>
  );
}
