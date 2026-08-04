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

  const totalKillsLeague = players.reduce((sum, p) => sum + p.kills, 0);

  return (
    <main>
      {/* Hero Showcase Section com Efeito Parallax & Gradient Overlay */}
      <section className="hero-section" style={{ position: 'relative', width: '100%', minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/copafacil-web.appspot.com/o/events%2F-zfhvn%2Finfo.png?alt=media&token=1&m=1784675443770)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(6px) brightness(0.25)', transform: 'scale(1.05)' }}></div>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 30%, rgba(0, 240, 255, 0.15), rgba(3, 7, 18, 0.95) 85%)' }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'center', padding: '4rem 1rem' }}>
          
          <div className="shimmer-container" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 1.6rem', background: 'rgba(0, 240, 255, 0.12)', border: '1px solid var(--cyan)', borderRadius: '30px', color: 'var(--cyan)', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem', boxShadow: '0 0 25px rgba(0, 240, 255, 0.25)' }}>
            <span className="status-pulse-dot"></span> TEMPORADA 1 — FASE DE GRUPOS
          </div>

          <h1 style={{ fontSize: 'clamp(3.2rem, 8vw, 5.5rem)', fontFamily: 'var(--font-rajdhani)', fontWeight: 900, lineHeight: 1, color: '#fff', textTransform: 'uppercase', margin: 0, textShadow: '0 0 50px rgba(0, 240, 255, 0.6)' }}>
            GURIZADA <span className="text-cyan">CHAMPIONS</span>
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: '#cbd5e1', maxWidth: '680px', lineHeight: 1.6, marginTop: '0.5rem' }}>
            Portal oficial de estatísticas, ranking individual de ELO, tabela de classificação e partidas 5v5 da liga.
          </p>

          <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
            <Link href="/ranking" className="btn-primary" style={{ padding: '1rem 2.6rem', fontSize: '1.15rem' }}>
              🏆 Ver Classificação & Ranking
            </Link>
            <Link href="/lobby" className="btn-secondary" style={{ padding: '1rem 2.6rem', fontSize: '1.15rem' }}>
              🎮 Jogar Amistoso no Lobby
            </Link>
          </div>

          {/* Stats Ticker Bar */}
          <div className="stats-ticker-grid">
            <div className="stats-ticker-item">
              <div className="stats-ticker-val">{matches.length}</div>
              <div className="stats-ticker-label">Partidas Disputadas</div>
            </div>
            <div className="stats-ticker-item">
              <div className="stats-ticker-val" style={{ color: 'var(--cyan)' }}>{players.length}</div>
              <div className="stats-ticker-label">Jogadores Ativos</div>
            </div>
            <div className="stats-ticker-item">
              <div className="stats-ticker-val" style={{ color: 'var(--primary)' }}>{totalKillsLeague}</div>
              <div className="stats-ticker-label">Kills Acumuladas</div>
            </div>
            <div className="stats-ticker-item">
              <div className="stats-ticker-val" style={{ color: '#10b981' }}>{topKD[0] ? (topKD[0].kills / (topKD[0].deaths || 1)).toFixed(2) : '0.0'}</div>
              <div className="stats-ticker-label">Maior K/D Ratio</div>
            </div>
          </div>

        </div>
      </section>

      {/* Conteúdo Principal do Portal */}
      <section className="container" style={{ padding: '4rem 1.5rem' }}>
        
        {/* Banner de Live Stream Minimizado */}
        <TwitchLiveStream />

        {/* PRÓXIMOS CONFRONTOS - CARDS ESPORTS */}
        {upcomingMatches.length > 0 && (
          <div className="glass-card shimmer-container" style={{ marginBottom: '3rem' }}>
            <h3 className="card-title">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              PRÓXIMOS CONFRONTOS — RODADA 3
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.6rem', marginTop: '1.5rem' }}>
              {upcomingMatches.map((match) => {
                const teamA = getTeam(match.teamA);
                const teamB = getTeam(match.teamB);
                return (
                  <div key={match.id} style={{ background: 'linear-gradient(135deg, rgba(15,25,48,0.85) 0%, rgba(7,14,28,0.95) 100%)', padding: '1.8rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(0,240,255,0.25)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'center', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 900 }}>{match.group}</span>
                      <span style={{ fontSize: '0.75rem', background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid #10b981', padding: '0.15rem 0.6rem', borderRadius: '10px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span className="status-pulse-dot"></span> AGENDADO
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '1rem', margin: '0.5rem 0' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
                        <TeamLogo logo={teamA.logo} name={teamA.name} initials={teamA.initials} size={54} borderRadius="12px" />
                        <strong style={{ fontSize: '1.1rem', color: '#fff', textAlign: 'center', fontFamily: 'var(--font-rajdhani)', letterSpacing: '0.5px' }}>{teamA.name}</strong>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                        <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--cyan)', fontFamily: 'var(--font-rajdhani)', textShadow: '0 0 20px rgba(0,240,255,0.7)' }}>VS</span>
                      </div>

                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
                        <TeamLogo logo={teamB.logo} name={teamB.name} initials={teamB.initials} size={54} borderRadius="12px" />
                        <strong style={{ fontSize: '1.1rem', color: '#fff', textAlign: 'center', fontFamily: 'var(--font-rajdhani)', letterSpacing: '0.5px' }}>{teamB.name}</strong>
                      </div>
                    </div>

                    <Countdown targetDate={match.date} />
                    {match.dateDisplay && (
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>{match.dateDisplay}</span>
                    )}
                    
                    {/* Sistema de Palpites / Votação da Torcida */}
                    <MatchPrediction matchId={match.id} teamAName={teamA.name} teamBName={teamB.name} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MAP POOL STATS & ÚLTIMOS JOGOS */}
        <MapPoolStats />
        
        {/* ÚLTIMAS PARTIDAS FINALIZADAS (GRID FIXO SEM WRAP DE PLACAR) */}
        <div className="glass-card" style={{ marginBottom: '3rem' }}>
          <h3 className="card-title">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            ÚLTIMAS PARTIDAS FINALIZADAS
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.2rem', marginTop: '1.5rem' }}>
            {matches.map((match) => {
              const teamA = getTeam(match.teamA);
              const teamB = getTeam(match.teamB);
              const detail = matchDetails[String(match.id)];
              const mapName = detail?.map || 'Mirage';
              
              return (
                <Link href={`/partida/${match.id}`} key={match.id} style={{ textDecoration: 'none' }}>
                  <div className="match-card-hltv" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', padding: '1.2rem' }}>
                    
                    {/* Time A */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', minWidth: 0, zIndex: 1 }}>
                      <TeamLogo logo={teamA.logo} name={teamA.name} initials={teamA.initials} size={38} borderRadius="8px" />
                      <strong style={{ fontSize: '1rem', fontFamily: 'var(--font-rajdhani)', color: match.scoreA > match.scoreB ? 'var(--cyan)' : '#e2e8f0', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {teamA.name}
                      </strong>
                    </div>
                    
                    {/* Placar Central Fixado */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, minWidth: '95px' }}>
                      <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-rajdhani)', letterSpacing: '2px', textShadow: '0 0 15px rgba(0,240,255,0.4)', whiteSpace: 'nowrap' }}>
                        {match.scoreA} <span style={{ color: '#64748b', fontSize: '1rem', margin: '0 0.15rem' }}>×</span> {match.scoreB}
                      </span>
                      <span style={{ fontSize: '0.65rem', background: 'rgba(0, 240, 255, 0.15)', border: '1px solid var(--cyan)', color: 'var(--cyan)', padding: '0.12rem 0.55rem', borderRadius: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, marginTop: '0.15rem', whiteSpace: 'nowrap' }}>
                        🗺️ {mapName}
                      </span>
                    </div>

                    {/* Time B */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.8rem', minWidth: 0, zIndex: 1 }}>
                      <strong style={{ fontSize: '1rem', fontFamily: 'var(--font-rajdhani)', textAlign: 'right', color: match.scoreB > match.scoreA ? 'var(--cyan)' : '#e2e8f0', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {teamB.name}
                      </strong>
                      <TeamLogo logo={teamB.logo} name={teamB.name} initials={teamB.initials} size={38} borderRadius="8px" />
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* SELEÇÕES DA COMUNIDADE */}
        <CommunitySelection />

        {/* DASHBOARD DE TOP FRAGGERS COM BARRAS DE PROGRESSO DE K/D */}
        <div className="glass-card" style={{ marginTop: '3rem' }}>
          <h3 className="card-title">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
            RANKING GERAL DE DESEMPENHO (TOP FRAGGERS)
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem' }}>Todos os jogadores ativos ordenados pelo maior K/D Ratio</p>
          
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '600px', overflowY: 'auto', paddingRight: '0.5rem' }} className="custom-scrollbar">
            {topKD.map((player, index) => {
              const team = getTeam(player.teamId);
              const kdRaw = player.kills / (player.deaths || 1);
              const kdaRaw = (player.kills + player.assists) / (player.deaths || 1);
              const kd = kdRaw.toFixed(2);
              const kda = kdaRaw.toFixed(2);

              const progressPct = Math.min(100, Math.max(15, (kdRaw / 2.2) * 100));

              let badgeBg = 'rgba(0, 240, 255, 0.15)';
              let badgeBorder = '1px solid var(--cyan)';
              let badgeText = 'var(--cyan)';

              if (kdRaw >= 2.0) {
                badgeBg = 'linear-gradient(135deg, #ffd700, #ffaa00)';
                badgeBorder = 'none';
                badgeText = '#030712';
              } else if (kdRaw >= 1.5) {
                badgeBg = 'rgba(0, 240, 255, 0.2)';
                badgeBorder = '1px solid var(--cyan)';
                badgeText = '#00f0ff';
              } else if (kdRaw >= 1.0) {
                badgeBg = 'rgba(16, 185, 129, 0.2)';
                badgeBorder = '1px solid #10b981';
                badgeText = '#10b981';
              } else {
                badgeBg = 'rgba(255, 51, 102, 0.2)';
                badgeBorder = '1px solid #ff3366';
                badgeText = '#ff3366';
              }
              
              return (
                <li key={player.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(15, 25, 48, 0.6) 0%, rgba(7, 14, 28, 0.75) 100%)', padding: '1rem 1.2rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)', borderLeft: index === 0 ? '4px solid #FFD700' : index === 1 ? '4px solid #C0C0C0' : index === 2 ? '4px solid #CD7F32' : '4px solid transparent', transition: 'all 0.25s ease' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                    <span style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '1.35rem', fontWeight: 900, color: index === 0 ? '#ffd700' : index === 1 ? '#e2e8f0' : index === 2 ? '#cd7f32' : '#64748b', minWidth: '35px' }}>#{index + 1}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                      <TeamLogo logo={team.logo} name={team.name} initials={team.initials} size={34} borderRadius="8px" />
                      <PlayerAvatar teamName={team.name} playerName={player.name} badgeColor="rgba(255,255,255,0.1)" size={40} />
                      <div>
                        <Link href={`/jogador/${encodeURIComponent(player.name)}`} style={{ textDecoration: 'none' }} className="match-card-hover">
                          <p style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff', margin: 0, letterSpacing: '0.5px' }}>{player.name}</p>
                        </Link>
                        <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>{team.name} • {player.matches || 1} Partidas</p>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    
                    {/* Barra de Progresso Visual de K/D */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }} className="mobile-hide">
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>Nível K/D ({progressPct.toFixed(0)}%)</span>
                      <div className="kd-progress-bar-bg">
                        <div className="kd-progress-bar-fill" style={{ width: `${progressPct}%`, background: badgeText === '#030712' ? '#ffd700' : badgeText }}></div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 700 }}>{player.kills}K / {player.deaths}D / {player.assists}A</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--cyan)', fontWeight: 'bold' }}>KDA {kda}</span>
                    </div>

                    <div style={{ background: badgeBg, border: badgeBorder, padding: '0.4rem 1rem', borderRadius: '10px', minWidth: '80px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: kdRaw >= 2.0 ? '0 0 18px rgba(255,215,0,0.5)' : 'none' }}>
                      <span style={{ fontSize: '0.62rem', color: badgeText === '#030712' ? '#030712' : 'rgba(255,255,255,0.7)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>K/D</span>
                      <span style={{ fontWeight: '900', color: badgeText, fontSize: '1.25rem', fontFamily: 'var(--font-rajdhani)', lineHeight: 1 }}>{kd}</span>
                    </div>
                  </div>

                </li>
              );
            })}
          </ul>
        </div>

      </section>

      {/* Seção Equipes com Logos reluzentes */}
      <section className="container" style={{ padding: '0 1.5rem 4rem' }}>
        <h3 className="hero-title" style={{ fontSize: '2.2rem', marginBottom: '1.5rem', textShadow: 'none', textAlign: 'left' }}>EQUIPES PARTICIPANTES</h3>
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '2rem', justifyItems: 'center' }}>
            {teams.map(team => (
              <Link href={`/time/${team.id}`} key={team.id} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }} className="match-card-hover">
                <TeamLogo logo={team.logo} name={team.name} initials={team.initials} size={84} borderRadius="14px" />
                <span style={{ color: '#fff', fontSize: '0.95rem', textAlign: 'center', fontWeight: 'bold', fontFamily: 'var(--font-rajdhani)' }}>{team.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Premiações - TODAS AS 3 POSIÇÕES */}
      <section className="container" style={{ padding: '0 1.5rem 4rem' }}>
        <h3 className="hero-title" style={{ fontSize: '2.2rem', marginBottom: '1.5rem', textShadow: 'none', textAlign: 'left' }}>PREMIAÇÕES DA TEMPORADA</h3>
        <div className="glass-card" style={{ padding: '3rem 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            
            {/* 1º Lugar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,215,0,0.06)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,215,0,0.3)' }}>
              <span style={{ background: '#FFD700', color: '#030712', fontWeight: 900, padding: '0.4rem 1.6rem', borderRadius: '20px', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>🥇 1º Colocado (Campeão)</span>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80px', height: '80px', background: 'rgba(255, 215, 0, 0.25)', filter: 'blur(20px)', borderRadius: '50%' }}></div>
                <svg width="70" height="70" viewBox="0 0 24 24" fill="#FFD700" stroke="#B8860B" strokeWidth="1" style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 4px 10px rgba(255,215,0,0.4))' }}>
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                  <path d="M4 22h16"></path>
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                  <text x="12" y="7" textAnchor="middle" fill="#000" fontSize="4" fontWeight="bold" stroke="none">1</text>
                </svg>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>R$ <strong style={{ color: '#ffd700', fontSize: '1.8rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 900 }}>250,00</strong></span>
            </div>

            {/* 2º Lugar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', background: 'rgba(192,192,192,0.06)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(192,192,192,0.3)' }}>
              <span style={{ background: '#C0C0C0', color: '#030712', fontWeight: 900, padding: '0.4rem 1.6rem', borderRadius: '20px', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>🥈 2º Colocado</span>
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
              <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>R$ <strong style={{ color: '#fff', fontSize: '1.6rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 900 }}>100,00</strong></span>
            </div>

            {/* 3º Lugar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', background: 'rgba(205,127,50,0.06)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(205,127,50,0.3)' }}>
              <span style={{ background: '#CD7F32', color: '#030712', fontWeight: 900, padding: '0.4rem 1.6rem', borderRadius: '20px', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>🥉 3º Colocado</span>
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
              <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>R$ <strong style={{ color: '#fff', fontSize: '1.6rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 900 }}>50,00</strong></span>
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
