import { getTeam, matches, matchDetails, players, teams, getPlayerTier } from './data';
import Link from 'next/link';
import PlayerAvatar from './jogador/[name]/PlayerAvatar';
import Comments from '../components/Comments';
import TeamLogo from './components/TeamLogo';
import MapPoolStats from './components/MapPoolStats';
import CommunitySelection from './components/CommunitySelection';
import TwitchLiveStream from './components/TwitchLiveStream';
import PlayoffBracket from './components/PlayoffBracket';
import GrandFinalShowdown from './components/GrandFinalShowdown';

export default function Home() {
  // Ranking oficial: K/D acumulado; em empate, KDA acumulado.
  const topKD = [...players].sort((a, b) => {
    const kdA = a.kills / (a.deaths || 1);
    const kdB = b.kills / (b.deaths || 1);
    if (kdB !== kdA) return kdB - kdA;
    const kdaA = (a.kills + a.assists) / (a.deaths || 1);
    const kdaB = (b.kills + b.assists) / (b.deaths || 1);
    return kdaB - kdaA;
  });

  const totalKillsLeague = players.reduce((sum, p) => sum + p.kills, 0);

  return (
    <main>
      <section className="home-hero">
        <div className="home-hero-backdrop" aria-hidden="true" />
        <div className="home-hero-scanlines" aria-hidden="true" />
        <div className="container home-hero-content">
          <div className="home-hero-copy">
          <div className="season-status-badge">
            <span className="status-pulse-dot"></span> TEMPORADA 1 — GRANDE FINAL DEFINIDA
          </div>

          <p className="home-hero-kicker">CS2 · CAMPEONATO DA GURIZADA</p>
          <h1 className="home-hero-title">
            GURIZADA <span className="text-cyan">CHAMPIONS</span>
          </h1>
          <p className="home-hero-description">
            Portal oficial de estatísticas, ranking individual de ELO, tabela de classificação e partidas 5v5 da liga.
          </p>

          <div className="home-hero-actions">
            <Link href="/ranking" className="btn-primary home-hero-action-primary">
              🏆 Ver Classificação & Ranking
            </Link>
            <Link href="/lobby" className="btn-secondary home-hero-action-secondary">
              🎮 Jogar Amistoso no Lobby
            </Link>
          </div>
          </div>

          <div className="home-stats-ticker" aria-label="Resumo da temporada">
            <div className="home-stat-card" data-stat="MATCHES">
              <span className="home-stat-index">01</span>
              <div className="stats-ticker-val">{matches.length}</div>
              <div className="stats-ticker-label">Partidas Disputadas</div>
            </div>
            <div className="home-stat-card home-stat-cyan" data-stat="PLAYERS">
              <span className="home-stat-index">02</span>
              <div className="stats-ticker-val">{players.length}</div>
              <div className="stats-ticker-label">Jogadores Ativos</div>
            </div>
            <div className="home-stat-card home-stat-gold" data-stat="KILLS">
              <span className="home-stat-index">03</span>
              <div className="stats-ticker-val">{totalKillsLeague}</div>
              <div className="stats-ticker-label">Kills Acumuladas</div>
            </div>
            <div className="home-stat-card home-stat-green" data-stat="BEST K/D">
              <span className="home-stat-index">04</span>
              <div className="stats-ticker-val">{topKD[0] ? (topKD[0].kills / (topKD[0].deaths || 1)).toFixed(2) : '0.0'}</div>
              <div className="stats-ticker-label">Maior K/D Ratio</div>
            </div>
          </div>

        </div>
      </section>

      {/* Conteúdo Principal do Portal */}
      <section className="container" style={{ padding: '4rem 1.5rem' }}>
        
        {/* Banner de Live Stream Minimizado */}
        <TwitchLiveStream />

        {/* GRANDE FINAL: CONFRONTO POR NÍVEL + VOTAÇÃO DA TORCIDA */}
        <GrandFinalShowdown />

        {/* MAP POOL STATS & ÚLTIMOS JOGOS */}
        <MapPoolStats />
        
        {/* ÚLTIMAS PARTIDAS FINALIZADAS (GRID FIXO SEM WRAP DE PLACAR) */}
        <section className="recent-matches-section">
          <div className="recent-matches-heading">
            <div>
              <span className="section-eyebrow">ARQUIVO DA TEMPORADA</span>
              <h3 className="card-title">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            ÚLTIMAS PARTIDAS FINALIZADAS
          </h3>
            </div>
            <span className="recent-matches-count">{matches.length} RESULTADOS</span>
          </div>
          <div className="recent-matches-grid">
            {matches.map((match) => {
              const teamA = getTeam(match.teamA);
              const teamB = getTeam(match.teamB);
              const detail = matchDetails[String(match.id)];
              const mapName = detail?.map || 'Mirage';
              
              return (
                <Link href={`/partida/${match.id}`} key={match.id} className="recent-match-card">
                  <div className="recent-match-team recent-match-team-a">
                      <TeamLogo logo={teamA.logo} name={teamA.name} initials={teamA.initials} size={38} borderRadius="8px" />
                      <strong className={match.scoreA > match.scoreB ? 'is-winner' : ''}>
                        {teamA.name}
                      </strong>
                    </div>
                    <div className="recent-match-score">
                      <span className="recent-match-scoreline">
                        {match.scoreA} <span>×</span> {match.scoreB}
                      </span>
                      <span className={`recent-match-map map-${mapName.toLowerCase().replace(/\s+/g, '-')}`}>◈ {mapName}</span>
                    </div>
                    <div className="recent-match-team recent-match-team-b">
                      <strong className={match.scoreB > match.scoreA ? 'is-winner' : ''}>
                        {teamB.name}
                      </strong>
                      <TeamLogo logo={teamB.logo} name={teamB.name} initials={teamB.initials} size={38} borderRadius="8px" />
                    </div>
                </Link>
              );
            })}
          </div>
        </section>

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
              
              const playerTier = getPlayerTier(player.name);

              return (
                <li key={player.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(15, 25, 48, 0.6) 0%, rgba(7, 14, 28, 0.75) 100%)', padding: '1rem 1.2rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)', borderLeft: index === 0 ? '4px solid #FFD700' : index === 1 ? '4px solid #C0C0C0' : index === 2 ? '4px solid #CD7F32' : '4px solid transparent', transition: 'all 0.25s ease' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                    <span style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '1.35rem', fontWeight: 900, color: index === 0 ? '#ffd700' : index === 1 ? '#e2e8f0' : index === 2 ? '#cd7f32' : '#64748b', minWidth: '35px' }}>#{index + 1}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                      <TeamLogo logo={team.logo} name={team.name} initials={team.initials} size={34} borderRadius="8px" />
                      <PlayerAvatar teamName={team.name} playerName={player.name} badgeColor="rgba(255,255,255,0.1)" size={40} />
                      <div>
                        <Link href={`/jogador/${encodeURIComponent(player.name)}`} style={{ textDecoration: 'none' }} className="match-card-hover">
                          <p style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff', margin: 0, letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span>{player.name}</span>
                            {playerTier && (
                              <span style={{
                                fontSize: '0.62rem',
                                fontWeight: 800,
                                padding: '0.1rem 0.4rem',
                                borderRadius: '6px',
                                background: playerTier === 'S' ? 'rgba(255, 215, 0, 0.15)' : playerTier === 'A' ? 'rgba(0, 240, 255, 0.15)' : playerTier === 'B' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                                color: playerTier === 'S' ? '#ffd700' : playerTier === 'A' ? '#00f0ff' : playerTier === 'B' ? '#10b981' : '#94a3b8',
                                border: `1px solid ${playerTier === 'S' ? '#ffd70050' : playerTier === 'A' ? '#00f0ff50' : playerTier === 'B' ? '#10b98150' : '#ffffff20'}`,
                                letterSpacing: '0.5px',
                                lineHeight: 1,
                              }}>
                                TIER {playerTier}
                              </span>
                            )}
                          </p>
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

      {/* Seção Mata-Mata / Playoff Bracket */}
      <section className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
        <PlayoffBracket />
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
