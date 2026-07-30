import { getTeam, matches, matchDetails } from '../../data';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PlayerAvatar from '../../jogador/[name]/PlayerAvatar';
import TeamLogo from '../../components/TeamLogo';

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const match = matches.find(m => m.id === parseInt(resolvedParams.id));
  if (!match) return notFound();

  const details = matchDetails[resolvedParams.id];
  const teamA = getTeam(match.teamA);
  const teamB = getTeam(match.teamB);

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

  // Cálculos de Resumo
  const totalKillsA = details.teamA_stats.reduce((acc: number, p: any) => acc + p.kills, 0);
  const totalDeathsA = details.teamA_stats.reduce((acc: number, p: any) => acc + p.deaths, 0);
  
  const totalKillsB = details.teamB_stats.reduce((acc: number, p: any) => acc + p.kills, 0);
  const totalDeathsB = details.teamB_stats.reduce((acc: number, p: any) => acc + p.deaths, 0);

  const totalRounds = (details.teamARounds || 0) + (details.teamBRounds || 0);

  const renderPlayerCard = (player: any, teamName: string) => {
    const kdaRaw = player.kills / (player.deaths || 1);
    const kda = kdaRaw.toFixed(2);
    const kpr = totalRounds > 0 ? (player.kills / totalRounds).toFixed(2) : '-';
    
    // Cor do badge de KDA baseada no valor (verde para bom, vermelho para ruim, amarelo médio)
    let badgeColor = '#666';
    if (kdaRaw >= 1.5) badgeColor = 'var(--cyan)';
    else if (kdaRaw >= 1.0) badgeColor = '#4caf50'; // Verde
    else if (kdaRaw >= 0.7) badgeColor = '#f57c00'; // Laranja
    else badgeColor = 'var(--accent-red)'; // Vermelho

    const allPlayersInMatch = [...details.teamA_stats, ...details.teamB_stats];
    let maxKd = -1;
    let mvpName = '';
    let minKd = 999;
    let worstName = '';
    let maxAssistsInMatch = -1;
    let reiResenhaName = '';

    allPlayersInMatch.forEach((p: any) => {
      const pKd = p.kills / (p.deaths || 1);
      if (pKd > maxKd) {
        maxKd = pKd;
        mvpName = p.name;
      }
      if (pKd < minKd) {
        minKd = pKd;
        worstName = p.name;
      }
      if (p.assists > maxAssistsInMatch) {
        maxAssistsInMatch = p.assists;
        reiResenhaName = p.name;
      }
    });

    const kprVal = totalRounds > 0 ? player.kills / totalRounds : 0;

    const matchBadges = [];
    if (player.name === mvpName) matchBadges.push({ title: 'MVP', desc: 'Melhor jogador da partida (Maior K/D)', icon: '🏆', color: 'var(--gold)' });
    if (kdaRaw >= 2.0) matchBadges.push({ title: 'Hard Carry', desc: 'Teve desempenho destruidor com K/D >= 2.0', icon: '🔥', color: 'var(--cyan)' });
    if (player.kills >= 30) matchBadges.push({ title: 'Monstro do Frag', desc: 'Eliminou 30 ou mais inimigos na partida', icon: '🎯', color: '#ff9800' });
    if (kprVal >= 1.0) matchBadges.push({ title: 'Maestro do Round', desc: 'Média alta de 1+ kill por round jogado', icon: '⚡', color: '#e91e63' });
    if (player.assists >= 10) matchBadges.push({ title: 'Assistente de Luxo', desc: 'Garantiu 10+ assistências no jogo', icon: '🤝', color: '#4caf50' });
    if (player.name === reiResenhaName && player.assists > 0) matchBadges.push({ title: 'Rei da Resenha', desc: 'Jogador com mais assistências nesta partida', icon: '👑', color: '#ab47bc' });
    if (player.name === worstName) matchBadges.push({ title: 'Difícil Carregar', desc: 'Jogador com menor K/D na partida', icon: '⚓', color: 'var(--accent-red)' });

    return (
      <div key={player.name} className="glass-card match-card-hover" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '0.8rem' }}>
        <PlayerAvatar teamName={teamName} playerName={player.name} badgeColor={badgeColor} size={40} />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
              <Link href={`/jogador/${encodeURIComponent(player.name)}`} style={{ textDecoration: 'none', color: 'inherit' }} className="match-card-hover">
                <strong style={{ fontSize: '1.1rem', color: '#fff' }}>{player.name}</strong>
              </Link>
              <span style={{ background: badgeColor, color: '#fff', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                KD {kda}
              </span>
              {matchBadges.map((b, idx) => (
                <span key={idx} title={`${b.title}: ${b.desc}`} style={{ background: 'rgba(0,0,0,0.5)', border: `1px solid ${b.color}`, color: b.color, fontSize: '0.7rem', fontWeight: 'bold', padding: '0.1rem 0.4rem', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', cursor: 'help' }}>
                  <span>{b.icon}</span> {b.title}
                </span>
              ))}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <strong>K/D/A:</strong> {player.kills}/{player.deaths}/{player.assists}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>KPR</span>
            <strong style={{ fontSize: '1.1rem', color: 'var(--cyan)', fontFamily: 'var(--font-rajdhani)' }}>{kpr}</strong>
          </div>
        </div>
      </div>
    );
  };

  const CrosshairIcon = () => (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.5))', color: 'var(--cyan)' }}>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="22" y1="12" x2="18" y2="12"></line>
      <line x1="6" y1="12" x2="2" y2="12"></line>
      <line x1="12" y1="6" x2="12" y2="2"></line>
      <line x1="12" y1="22" x2="12" y2="18"></line>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  const SkullIcon = () => (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px rgba(255,51,102,0.5))', color: 'var(--accent-red)' }}>
      <circle cx="12" cy="10" r="8"></circle>
      <path d="M7 16l-1 5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1l-1-5"></path>
      <circle cx="9" cy="10" r="1"></circle>
      <circle cx="15" cy="10" r="1"></circle>
    </svg>
  );

  return (
    <main style={{ padding: '4rem 0' }}>
      <section className="container">
        
        {/* Match Header */}
        <div className="glass-card" style={{ marginBottom: '2rem', padding: '0', overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(45deg, rgba(0,240,255,0.05), transparent)', padding: '3rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem' }}>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <Link href={`/time/${teamA.id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <TeamLogo logo={teamA.logo} name={teamA.name} initials={teamA.initials} size={100} borderRadius="16px" />
                  <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-rajdhani)', color: '#fff', textAlign: 'center' }}>{teamA.name}</h2>
                </Link>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>GRUPO {match.group}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', background: 'rgba(0,0,0,0.6)', padding: '0.8rem 2rem', borderRadius: '16px', border: '1px solid rgba(0,240,255,0.3)', boxShadow: '0 0 20px rgba(0,240,255,0.15)' }}>
                  <span style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--cyan)', fontFamily: 'var(--font-rajdhani)', lineHeight: 1 }}>{match.scoreA}</span>
                  <span style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 'bold' }}>x</span>
                  <span style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--cyan)', fontFamily: 'var(--font-rajdhani)', lineHeight: 1 }}>{match.scoreB}</span>
                </div>
                {details.map && (
                  <span style={{ background: 'rgba(0,240,255,0.15)', border: '1px solid var(--cyan)', color: 'var(--cyan)', padding: '0.3rem 1.2rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', marginTop: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    📍 MAPA: {details.map}
                  </span>
                )}
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <Link href={`/time/${teamB.id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <TeamLogo logo={teamB.logo} name={teamB.name} initials={teamB.initials} size={100} borderRadius="16px" />
                  <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-rajdhani)', color: '#fff', textAlign: 'center' }}>{teamB.name}</h2>
                </Link>
              </div>

            </div>
          </div>
        </div>

        {/* MVP Card */}
        {(() => {
          const allPlayers = [...details.teamA_stats, ...details.teamB_stats];
          if (allPlayers.length > 0) {
            const mvp = allPlayers.reduce((prev, current) => {
              const prevKD = prev.kills / (prev.deaths || 1);
              const currKD = current.kills / (current.deaths || 1);
              return (prevKD > currKD) ? prev : current;
            });
            const isMvpInTeamA = details.teamA_stats.some((p: any) => p.name === mvp.name);
            const mvpTeamId = isMvpInTeamA ? match.teamA : match.teamB;
            const mvpTeamObj = getTeam(mvpTeamId);
            const mvpKD = (mvp.kills / (mvp.deaths || 1)).toFixed(2);

            return (
              <div className="glass-card" style={{ padding: '0', marginBottom: '3rem', overflow: 'hidden', position: 'relative', border: '1px solid var(--gold)', boxShadow: '0 0 30px rgba(255, 215, 0, 0.15)' }}>
                <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)', animation: 'spin 10s linear infinite' }}></div>
                <div style={{ position: 'relative', zIndex: 1, padding: '2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.9) 100%)' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ position: 'relative' }}>
                      <PlayerAvatar teamName={mvpTeamObj.name} playerName={mvp.name} badgeColor="var(--gold)" size={80} />
                      <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', background: 'var(--gold)', padding: '0.5rem', borderRadius: '50%', color: '#000', boxShadow: '0 0 10px rgba(255,215,0,0.8)', zIndex: 2 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"></path></svg>
                      </div>
                    </div>
                    <div>
                      <h4 style={{ color: 'var(--gold)', margin: 0, fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase' }}>MVP da Partida</h4>
                      <Link href={`/jogador/${encodeURIComponent(mvp.name)}`} style={{ textDecoration: 'none' }}>
                        <h2 style={{ color: '#fff', fontSize: '2.5rem', fontFamily: 'var(--font-rajdhani)', margin: 0, textShadow: '0 0 10px rgba(255,255,255,0.3)' }} className="match-card-hover">{mvp.name}</h2>
                      </Link>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <TeamLogo logo={mvpTeamObj.logo} name={mvpTeamObj.name} initials={mvpTeamObj.initials} size={20} borderRadius="4px" />
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{mvpTeamObj.name}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,215,0,0.2)', padding: '1rem 1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                      <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Desempenho</span>
                      <strong style={{ fontSize: '1.5rem', color: '#fff' }}>{mvp.kills}K / {mvp.deaths}D / {mvp.assists}A</strong>
                    </div>
                    <div style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', padding: '1rem 1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                      <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold)' }}>K/D Ratio</span>
                      <strong style={{ fontSize: '2rem', color: 'var(--gold)', fontFamily: 'var(--font-rajdhani)', lineHeight: 1 }}>{mvpKD}</strong>
                    </div>
                  </div>

                </div>
              </div>
            );
          }
          return null;
        })()}

        {/* Resumo */}
        <h3 className="hero-title" style={{ fontSize: '2.2rem', marginTop: '3rem', marginBottom: '1.5rem', textShadow: 'none', textAlign: 'left' }}>RESUMO</h3>
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '3rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '2rem', alignItems: 'center' }}>
            
            {/* Team A Resumo */}
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <CrosshairIcon />
                <span style={{ fontSize: '2rem', fontWeight: 'bold', fontFamily: 'var(--font-rajdhani)', color: '#fff' }}>{totalKillsA}</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Kills</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <SkullIcon />
                <span style={{ fontSize: '2rem', fontWeight: 'bold', fontFamily: 'var(--font-rajdhani)', color: '#fff' }}>{totalDeathsA}</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Deaths</span>
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: '1px', height: '80px', background: 'rgba(255,255,255,0.1)' }}></div>

            {/* Team B Resumo */}
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <CrosshairIcon />
                <span style={{ fontSize: '2rem', fontWeight: 'bold', fontFamily: 'var(--font-rajdhani)', color: '#fff' }}>{totalKillsB}</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Kills</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <SkullIcon />
                <span style={{ fontSize: '2rem', fontWeight: 'bold', fontFamily: 'var(--font-rajdhani)', color: '#fff' }}>{totalDeathsB}</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Deaths</span>
              </div>
            </div>

          </div>
        </div>

        {/* VOD / Transmissão */}
        {details.vodUrl && (() => {
          let embedSrc = details.vodUrl;
          if (details.vodUrl.includes('twitch.tv/videos/')) {
            const videoId = details.vodUrl.split('twitch.tv/videos/')[1]?.split('?')[0];
            embedSrc = `https://player.twitch.tv/?video=${videoId}&parent=gurizadachampions.vercel.app&parent=localhost&autoplay=false`;
          } else if (details.vodUrl.includes('youtube.com/watch?v=')) {
            const videoId = details.vodUrl.split('watch?v=')[1]?.split('&')[0];
            embedSrc = `https://www.youtube.com/embed/${videoId}`;
          }

          return (
            <div style={{ marginTop: '3rem', marginBottom: '1rem' }}>
              <h3 className="hero-title" style={{ fontSize: '2.2rem', marginBottom: '1.5rem', textShadow: 'none', textAlign: 'left' }}>TRANSMISSÃO / VOD</h3>
              <div className="glass-card" style={{ padding: '0.8rem', overflow: 'hidden', borderRadius: '16px', border: '1px solid rgba(0,240,255,0.2)', boxShadow: '0 0 20px rgba(0,240,255,0.1)' }}>
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: '12px', overflow: 'hidden' }}>
                  <iframe
                    src={embedSrc}
                    title="Transmissão da Partida"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Escalação */}
        <h3 className="hero-title" style={{ fontSize: '2.2rem', marginTop: '3rem', marginBottom: '1.5rem', textShadow: 'none', textAlign: 'left' }}>ESCALAÇÃO</h3>
        
        <div className="grid-2">
          {/* Team A Roster */}
          <div>
            <h4 style={{ color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.3rem' }}>
              <TeamLogo logo={teamA.logo} name={teamA.name} initials={teamA.initials} size={30} borderRadius="6px" />
              {teamA.name}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {details.teamA_stats.map((p: any) => renderPlayerCard(p, teamA.name))}
            </div>
          </div>
          
          {/* Team B Roster */}
          <div>
            <h4 style={{ color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.3rem' }}>
              <TeamLogo logo={teamB.logo} name={teamB.name} initials={teamB.initials} size={30} borderRadius="6px" />
              {teamB.name}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {details.teamB_stats.map((p: any) => renderPlayerCard(p, teamB.name))}
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}
