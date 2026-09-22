import { getTeam, matches, matchDetails, players, teams, getPlayerTier, playoffMatches } from './data';
import Link from 'next/link';
import PlayerAvatar from './jogador/[name]/PlayerAvatar';
import Comments from '../components/Comments';
import TeamLogo from './components/TeamLogo';
import CommunitySelection from './components/CommunitySelection';
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
        {/* GRANDE FINAL: CONFRONTO POR NÍVEL + VOTAÇÃO DA TORCIDA */}
        <GrandFinalShowdown />

        {/* ÚLTIMAS PARTIDAS: SEMIFINAIS DOS PLAYOFFS (O CAMINHO ATÉ A FINAL) */}
        <section className="recent-matches-section" style={{ marginTop: '2.5rem' }}>
          <div className="recent-matches-heading">
            <div>
              <span className="section-eyebrow">MATA-MATA · PLAYOFFS</span>
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', margin: '0.2rem 0 0' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                  <path d="M4 22h16"></path>
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                </svg>
                ÚLTIMAS PARTIDAS · SEMIFINAIS
              </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span className="recent-matches-count">MD3 OFICIAL</span>
              <Link
                href="/ranking"
                style={{
                  color: 'var(--cyan)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                Ver jogos da fase de grupos no Ranking ➔
              </Link>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.2rem', marginTop: '1.2rem' }}>
            {playoffMatches.filter(m => m.id === 'semi-1' || m.id === 'semi-2').map((semi) => {
              const teamA = getTeam(semi.teamAId || '');
              const teamB = getTeam(semi.teamBId || '');
              const aWon = (semi.scoreA || 0) > (semi.scoreB || 0);
              const winnerTeam = aWon ? teamA : teamB;

              return (
                <div
                  key={semi.id}
                  className="glass-card"
                  style={{
                    padding: '1.35rem',
                    borderRadius: '16px',
                    border: '1px solid rgba(0, 240, 255, 0.25)',
                    background: 'linear-gradient(135deg, rgba(13, 20, 36, 0.9) 0%, rgba(6, 11, 24, 0.95) 100%)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  {/* Header do Card da Semi */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.6rem' }}>
                    <span style={{ color: 'var(--cyan)', fontWeight: 800, fontSize: '0.78rem', letterSpacing: '1px' }}>
                      ⚔️ {semi.stage} · MD3
                    </span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '12px', background: 'rgba(46, 213, 115, 0.15)', color: '#2ed573', border: '1px solid rgba(46, 213, 115, 0.3)' }}>
                      FINALIZADA
                    </span>
                  </div>

                  {/* Confronto Visual */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    {/* Time A */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                      <TeamLogo logo={teamA.logo} name={teamA.name} initials={teamA.initials} size={44} borderRadius="8px" />
                      <div style={{ minWidth: 0 }}>
                        <strong style={{ color: aWon ? '#fff' : '#8fa0b8', fontSize: '1.05rem', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-rajdhani)', fontWeight: 900 }}>
                          {teamA.name}
                        </strong>
                        <span style={{ fontSize: '0.7rem', color: aWon ? 'var(--cyan)' : '#64748b', fontWeight: 700 }}>
                          {semi.labelA}
                        </span>
                      </div>
                    </div>

                    {/* Placar Central MD3 */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '76px' }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.35rem 0.85rem',
                        borderRadius: '10px',
                        background: 'rgba(0, 0, 0, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        fontFamily: 'var(--font-rajdhani)',
                        fontSize: '1.5rem',
                        fontWeight: 900,
                        letterSpacing: '2px',
                      }}>
                        <span style={{ color: aWon ? '#2ed573' : '#64748b' }}>{semi.scoreA}</span>
                        <span style={{ color: '#64748b', fontSize: '1rem' }}>×</span>
                        <span style={{ color: !aWon ? '#2ed573' : '#64748b' }}>{semi.scoreB}</span>
                      </div>
                      <span style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 800, marginTop: '0.25rem', letterSpacing: '0.5px' }}>
                        MD3
                      </span>
                    </div>

                    {/* Time B */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', flex: 1, minWidth: 0, textAlign: 'right' }}>
                      <div style={{ minWidth: 0 }}>
                        <strong style={{ color: !aWon ? '#fff' : '#8fa0b8', fontSize: '1.05rem', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-rajdhani)', fontWeight: 900 }}>
                          {teamB.name}
                        </strong>
                        <span style={{ fontSize: '0.7rem', color: !aWon ? 'var(--cyan)' : '#64748b', fontWeight: 700 }}>
                          {semi.labelB}
                        </span>
                      </div>
                      <TeamLogo logo={teamB.logo} name={teamB.name} initials={teamB.initials} size={44} borderRadius="8px" />
                    </div>
                  </div>

                  {/* Rodapé do Card: Desfecho */}
                  <div style={{
                    marginTop: '0.2rem',
                    padding: '0.5rem 0.8rem',
                    borderRadius: '8px',
                    background: 'rgba(46, 213, 115, 0.08)',
                    border: '1px solid rgba(46, 213, 115, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                  }}>
                    <span style={{ color: '#2ed573', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      🏆 Vencedor: {winnerTeam.name}
                    </span>
                    <span style={{ color: '#ffd700', fontWeight: 700, fontSize: '0.72rem' }}>
                      Classificado para a Grande Final 👑
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SELEÇÕES DA COMUNIDADE */}
        <CommunitySelection />

        {/* DASHBOARD DE TOP FRAGGERS COM BARRAS DE PROGRESSO DE K/D */}
        <div className="topfraggers-card">
          <div className="topfraggers-header">
            <div>
              <span className="section-eyebrow">ESTATÍSTICAS INDIVIDUAIS</span>
              <h3 className="card-title" style={{ margin: '0.2rem 0 0' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
                RANKING GERAL DE DESEMPENHO (TOP FRAGGERS)
              </h3>
            </div>
            <span className="recent-matches-count">{topKD.length} JOGADORES REGISTRADOS</span>
          </div>
          
          <ul className="topfraggers-list custom-scrollbar">
            {topKD.map((player, index) => {
              const team = getTeam(player.teamId);
              const kdRaw = player.kills / (player.deaths || 1);
              const kdaRaw = (player.kills + player.assists) / (player.deaths || 1);
              const kd = kdRaw.toFixed(2);
              const kda = kdaRaw.toFixed(2);

              const progressPct = Math.min(100, Math.max(15, (kdRaw / 2.2) * 100));

              let badgeBg = 'rgba(0, 240, 255, 0.12)';
              let badgeBorder = '1px solid rgba(0, 240, 255, 0.4)';
              let badgeText = 'var(--cyan)';

              if (kdRaw >= 2.0) {
                badgeBg = 'linear-gradient(135deg, #ffd700, #ffaa00)';
                badgeBorder = 'none';
                badgeText = '#030712';
              } else if (kdRaw >= 1.5) {
                badgeBg = 'rgba(0, 240, 255, 0.18)';
                badgeBorder = '1px solid #00f0ff';
                badgeText = '#00f0ff';
              } else if (kdRaw >= 1.0) {
                badgeBg = 'rgba(16, 185, 129, 0.18)';
                badgeBorder = '1px solid #10b981';
                badgeText = '#10b981';
              } else {
                badgeBg = 'rgba(255, 51, 102, 0.18)';
                badgeBorder = '1px solid #ff3366';
                badgeText = '#ff3366';
              }
              
              const playerTier = getPlayerTier(player.name);
              const podiumClass = index === 0 ? 'podium-1' : index === 1 ? 'podium-2' : index === 2 ? 'podium-3' : '';
              const rankColorClass = index === 0 ? 'rank-gold' : index === 1 ? 'rank-silver' : index === 2 ? 'rank-bronze' : 'rank-default';

              return (
                <li key={player.name} className={`topfragger-item ${podiumClass}`}>
                  
                  <div className="topfragger-profile">
                    <span className={`topfragger-rank ${rankColorClass}`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </span>
                    <TeamLogo logo={team.logo} name={team.name} initials={team.initials} size={36} borderRadius="8px" />
                    <PlayerAvatar teamName={team.name} playerName={player.name} badgeColor="rgba(255,255,255,0.1)" size={42} />
                    <div>
                      <Link href={`/jogador/${encodeURIComponent(player.name)}`} style={{ textDecoration: 'none' }} className="match-card-hover">
                        <p className="topfragger-name">
                          <span>{player.name}</span>
                          {playerTier && (
                            <span style={{
                              fontSize: '0.62rem',
                              fontWeight: 800,
                              padding: '0.12rem 0.45rem',
                              borderRadius: '6px',
                              background: playerTier === 'S' ? 'rgba(255, 215, 0, 0.18)' : playerTier === 'A' ? 'rgba(0, 240, 255, 0.18)' : playerTier === 'B' ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.08)',
                              color: playerTier === 'S' ? '#ffd700' : playerTier === 'A' ? '#00f0ff' : playerTier === 'B' ? '#10b981' : '#94a3b8',
                              border: `1px solid ${playerTier === 'S' ? '#ffd70060' : playerTier === 'A' ? '#00f0ff60' : playerTier === 'B' ? '#10b98160' : '#ffffff20'}`,
                              letterSpacing: '0.5px',
                              lineHeight: 1,
                            }}>
                              TIER {playerTier}
                            </span>
                          )}
                        </p>
                      </Link>
                      <p className="topfragger-team">
                        <span>{team.name}</span>
                        <span>•</span>
                        <span>{player.matches || 1} {player.matches === 1 ? 'Partida' : 'Partidas'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="topfragger-metrics">
                    {/* Barra de Progresso Visual de K/D */}
                    <div className="topfragger-meter mobile-hide">
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.5px' }}>
                        NÍVEL K/D ({progressPct.toFixed(0)}%)
                      </span>
                      <div className="kd-progress-bar-bg" style={{ width: '100px', height: '6px' }}>
                        <div className="kd-progress-bar-fill" style={{ width: `${progressPct}%`, background: badgeText === '#030712' ? '#ffd700' : badgeText }}></div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.15rem' }}>
                      <span style={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 800, fontFamily: 'var(--font-rajdhani)', letterSpacing: '0.5px' }}>
                        {player.kills}K / {player.deaths}D / {player.assists}A
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--cyan)', fontWeight: 800, letterSpacing: '0.5px' }}>
                        KDA {kda}
                      </span>
                    </div>

                    <div className="topfragger-badge-kd" style={{ background: badgeBg, border: badgeBorder, boxShadow: kdRaw >= 2.0 ? '0 0 20px rgba(255,215,0,0.45)' : 'none' }}>
                      <span style={{ fontSize: '0.58rem', color: badgeText === '#030712' ? '#030712' : 'rgba(255,255,255,0.7)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px' }}>K/D</span>
                      <span style={{ fontWeight: '900', color: badgeText, fontSize: '1.3rem', fontFamily: 'var(--font-rajdhani)', lineHeight: 1.1 }}>{kd}</span>
                    </div>
                  </div>

                </li>
              );
            })}
          </ul>
        </div>

      </section>

      {/* Seção Equipes Participantes */}
      <section className="container" style={{ padding: '0 1.5rem 4rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <span className="section-eyebrow">ORGANIZAÇÕES EM DISPUTA</span>
          <h3 className="card-title" style={{ margin: '0.2rem 0 0', fontSize: '1.75rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            EQUIPES PARTICIPANTES
          </h3>
        </div>
        
        <div className="teams-showcase-grid">
          {teams.map((team, idx) => (
            <Link href={`/time/${team.id}`} key={team.id} className="team-showcase-card">
              <TeamLogo logo={team.logo} name={team.name} initials={team.initials} size={64} borderRadius="12px" />
              <div className="team-showcase-info">
                <span className="team-showcase-group">GRUPO {idx < 4 ? 'A' : 'B'}</span>
                <strong className="team-showcase-name">{team.name}</strong>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Ver escalação e confrontos →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Seção Mata-Mata / Playoff Bracket */}
      <section className="container" style={{ padding: '0 1.5rem 4rem' }}>
        <PlayoffBracket />
      </section>

      {/* Seção Premiações - 3D PODIUM */}
      <section className="container" style={{ padding: '0 1.5rem 5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="section-eyebrow">PREMIAÇÕES OFICIAIS</span>
          <h3 className="card-title" style={{ margin: '0.25rem 0 0', justifyContent: 'center', fontSize: '2rem' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
            PREMIAÇÃO DA TEMPORADA 1
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.4rem' }}>
            Distribuição da premiação em dinheiro para os 3 melhores colocados do torneio
          </p>
        </div>

        <div className="prizes-podium-grid">
          {/* 1º Lugar (Ouro) */}
          <div className="prize-podium-card prize-card-gold">
            <span className="prize-badge-rank" style={{ background: '#ffd700', color: '#030712' }}>
              🥇 1º Colocado (Campeão)
            </span>
            <div style={{ position: 'relative', margin: '1.2rem 0' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100px', height: '100px', background: 'rgba(255, 215, 0, 0.3)', filter: 'blur(25px)', borderRadius: '50%' }}></div>
              <svg width="78" height="78" viewBox="0 0 24 24" fill="#ffd700" stroke="#b8860b" strokeWidth="1" style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 6px 16px rgba(255,215,0,0.45))' }}>
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                <path d="M4 22h16"></path>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                <text x="12" y="7" textAnchor="middle" fill="#000" fontSize="4" fontWeight="bold" stroke="none">1</text>
              </svg>
            </div>
            <div>
              <span style={{ color: '#aebbd0', fontSize: '0.85rem', display: 'block', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>Premiação Campeão</span>
              <span className="prize-amount" style={{ color: '#ffd700', textShadow: '0 0 20px rgba(255,215,0,0.35)' }}>
                R$ 250,00
              </span>
            </div>
          </div>

          {/* 2º Lugar (Prata) */}
          <div className="prize-podium-card prize-card-silver">
            <span className="prize-badge-rank" style={{ background: '#e2e8f0', color: '#030712' }}>
              🥈 2º Colocado (Vice)
            </span>
            <div style={{ position: 'relative', margin: '1.2rem 0' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80px', height: '80px', background: 'rgba(226, 232, 240, 0.2)', filter: 'blur(20px)', borderRadius: '50%' }}></div>
              <svg width="68" height="68" viewBox="0 0 24 24" fill="#c0c0c0" stroke="#718096" strokeWidth="1" style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 4px 12px rgba(255,255,255,0.25))' }}>
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                <path d="M4 22h16"></path>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                <text x="12" y="7" textAnchor="middle" fill="#000" fontSize="4" fontWeight="bold" stroke="none">2</text>
              </svg>
            </div>
            <div>
              <span style={{ color: '#aebbd0', fontSize: '0.85rem', display: 'block', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>Premiação Vice</span>
              <span className="prize-amount" style={{ color: '#f8fafc' }}>
                R$ 100,00
              </span>
            </div>
          </div>

          {/* 3º Lugar (Bronze) */}
          <div className="prize-podium-card prize-card-bronze">
            <span className="prize-badge-rank" style={{ background: '#cd7f32', color: '#030712' }}>
              🥉 3º Colocado
            </span>
            <div style={{ position: 'relative', margin: '1.2rem 0' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80px', height: '80px', background: 'rgba(205, 127, 50, 0.2)', filter: 'blur(20px)', borderRadius: '50%' }}></div>
              <svg width="68" height="68" viewBox="0 0 24 24" fill="#cd7f32" stroke="#8b4513" strokeWidth="1" style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 4px 12px rgba(205,127,50,0.3))' }}>
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                <path d="M4 22h16"></path>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                <text x="12" y="7" textAnchor="middle" fill="#000" fontSize="4" fontWeight="bold" stroke="none">3</text>
              </svg>
            </div>
            <div>
              <span style={{ color: '#aebbd0', fontSize: '0.85rem', display: 'block', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>Premiação 3º Lugar</span>
              <span className="prize-amount" style={{ color: '#e0a976' }}>
                R$ 50,00
              </span>
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
