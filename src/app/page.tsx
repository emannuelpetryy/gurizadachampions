import { getTeam, matches, matchDetails, players, teams, getPlayerTier, playoffMatches } from './data';
import Link from 'next/link';
import PlayerAvatar from './jogador/[name]/PlayerAvatar';
import Comments from '../components/Comments';
import TeamLogo from './components/TeamLogo';
import CommunitySelection from './components/CommunitySelection';
import PlayoffBracket from './components/PlayoffBracket';
import GrandFinalShowdown from './components/GrandFinalShowdown';
import PickemWidget from './components/PickemWidget';
import SeasonSelector from './components/SeasonSelector';
import HomeTopFraggers from './components/HomeTopFraggers';
import { sortRanking } from '../lib/stats';

export default function Home() {
  // Ranking oficial: K/D acumulado (2 casas decimais); em empate, melhor KDA acumulado e kills.
  const topKD = sortRanking(players);

  const totalKillsLeague = players.reduce((sum, p) => sum + p.kills, 0);

  return (
    <main>
      <section className="home-hero">
        <div className="home-hero-backdrop" aria-hidden="true" />
        <div className="home-hero-scanlines" aria-hidden="true" />
        <div className="container home-hero-content">
          <div className="home-hero-copy">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
            <SeasonSelector />
            <div className="season-status-badge" style={{ margin: 0 }}>
              <span className="status-pulse-dot"></span> GRANDE FINAL DEFINIDA
            </div>
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
      <section className="container" style={{ padding: '1.5rem 1rem' }}>
        {/* GRANDE FINAL: CONFRONTO POR NÍVEL + VOTAÇÃO DA TORCIDA */}
        <GrandFinalShowdown />

        {/* BOLÃO E PICK'EM DA GRANDE FINAL */}
        <PickemWidget />

        {/* ÚLTIMAS PARTIDAS: SEMIFINAIS DOS PLAYOFFS (O CAMINHO ATÉ A FINAL) */}
        <section className="recent-matches-section" style={{ marginTop: '1.5rem' }}>
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
        <HomeTopFraggers topKD={topKD} />

      </section>

      {/* Seção Equipes Participantes */}
      <section className="container" style={{ padding: '0 1rem 1.4rem' }}>
        <div style={{ marginBottom: '0.85rem' }}>
          <span className="section-eyebrow">ORGANIZAÇÕES EM DISPUTA</span>
          <h3 className="card-title" style={{ margin: '0.2rem 0 0', fontSize: '1.25rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            EQUIPES PARTICIPANTES
          </h3>
        </div>
        
        <div className="teams-showcase-grid">
          {teams.map((team, idx) => (
            <Link href={`/time/${team.id}`} key={team.id} className="team-showcase-card">
              <TeamLogo logo={team.logo} name={team.name} initials={team.initials} size={40} borderRadius="8px" />
              <div className="team-showcase-info">
                <span className="team-showcase-group">GRUPO {idx < 4 ? 'A' : 'B'}</span>
                <strong className="team-showcase-name" style={{ fontSize: '0.94rem' }}>{team.name}</strong>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Ver escalação →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Seção Mata-Mata / Playoff Bracket */}
      <section className="container" style={{ padding: '0 1rem 1.4rem' }}>
        <PlayoffBracket />
      </section>

      {/* Seção Premiações - 3D PODIUM */}
      <section className="container" style={{ padding: '0 1rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <span className="section-eyebrow">PREMIAÇÕES OFICIAIS</span>
          <h3 className="card-title" style={{ margin: '0.2rem 0 0', justifyContent: 'center', fontSize: '1.35rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
            PREMIAÇÃO DA TEMPORADA 1
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '0.2rem' }}>
            Distribuição da premiação em dinheiro para os 3 melhores colocados do torneio
          </p>
        </div>

        <div className="prizes-podium-grid">
          {/* 1º Lugar (Ouro) */}
          <div className="prize-podium-card prize-card-gold">
            <span className="prize-badge-rank" style={{ background: '#ffd700', color: '#030712' }}>
              🥇 1º Colocado (Campeão)
            </span>
            <div style={{ position: 'relative', margin: '0.5rem 0' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '52px', height: '52px', background: 'rgba(255, 215, 0, 0.3)', filter: 'blur(16px)', borderRadius: '50%' }}></div>
              <svg width="42" height="42" viewBox="0 0 24 24" fill="#ffd700" stroke="#b8860b" strokeWidth="1" style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 3px 10px rgba(255,215,0,0.45))' }}>
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
              <span style={{ color: '#aebbd0', fontSize: '0.7rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 800 }}>Premiação Campeão</span>
              <span className="prize-amount" style={{ color: '#ffd700', textShadow: '0 0 18px rgba(255,215,0,0.35)' }}>
                R$ 250,00
              </span>
            </div>
          </div>

          {/* 2º Lugar (Prata) */}
          <div className="prize-podium-card prize-card-silver">
            <span className="prize-badge-rank" style={{ background: '#e2e8f0', color: '#030712' }}>
              🥈 2º Colocado (Vice)
            </span>
            <div style={{ position: 'relative', margin: '0.5rem 0' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '44px', height: '44px', background: 'rgba(226, 232, 240, 0.2)', filter: 'blur(12px)', borderRadius: '50%' }}></div>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="#c0c0c0" stroke="#718096" strokeWidth="1" style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 3px 8px rgba(255,255,255,0.25))' }}>
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
              <span style={{ color: '#aebbd0', fontSize: '0.7rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 800 }}>Premiação Vice</span>
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
            <div style={{ position: 'relative', margin: '0.5rem 0' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '44px', height: '44px', background: 'rgba(205, 127, 50, 0.2)', filter: 'blur(12px)', borderRadius: '50%' }}></div>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="#cd7f32" stroke="#8b4513" strokeWidth="1" style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 3px 8px rgba(205,127,50,0.3))' }}>
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
              <span style={{ color: '#aebbd0', fontSize: '0.7rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 800 }}>Premiação 3º Lugar</span>
              <span className="prize-amount" style={{ color: '#e0a976' }}>
                R$ 50,00
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Mural de Resenha (Comentários) */}
      <section className="container" style={{ padding: '0 1rem 2rem' }}>
        <Comments />
      </section>
    </main>
  );
}
