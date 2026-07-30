import { players, getTeam, matches, matchDetails, tiers } from '../../data';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PlayerChart from './PlayerChart';
import PlayerAvatar from './PlayerAvatar';
import GamersClubLink from './GamersClubLink';
import PlayerCardGenerator from './PlayerCardGenerator';

export default async function JogadorPage({ params }: { params: Promise<{ name: string }> }) {
  const resolvedParams = await params;
  const decodedName = decodeURIComponent(resolvedParams.name);
  
  // Buscar os dados agregados (total) do jogador
  const player = players.find(p => p.name.toLowerCase() === decodedName.toLowerCase());
  
  if (!player) {
    notFound();
  }
  
  const team = getTeam(player.teamId);
  const kdRaw = player.kills / (player.deaths || 1);
  const kd = kdRaw.toFixed(2);
  
  let badgeColor = '#666';
  if (kdRaw >= 1.5) badgeColor = 'var(--cyan)';
  else if (kdRaw >= 1.0) badgeColor = '#4caf50';
  else if (kdRaw >= 0.7) badgeColor = '#f57c00';
  else badgeColor = 'var(--accent-red)';
  
  // Determinar o Tier do jogador
  let playerTier = 'Não ranqueado';
  let tierLvl = '';
  let playerLvlVal: number | undefined = undefined;

  for (const [tierName, tierPlayers] of Object.entries(tiers)) {
    const found = tierPlayers.find(tp => tp.name.toLowerCase().includes(decodedName.toLowerCase()) || decodedName.toLowerCase().includes(tp.name.toLowerCase()));
    if (found) {
      playerTier = `Tier ${tierName}`;
      tierLvl = `(Lvl ${found.lvl})`;
      playerLvlVal = found.lvl;
      break;
    }
  }

  // Buscar histórico de partidas deste jogador
  const playerMatches = matches.map(m => {
    const details = matchDetails[m.id.toString()];
    if (!details) return null;
    
    // Verifica se o jogador está na teamA ou teamB
    const inTeamA = details.teamA_stats.find((p: any) => p.name.toLowerCase() === decodedName.toLowerCase());
    const inTeamB = details.teamB_stats.find((p: any) => p.name.toLowerCase() === decodedName.toLowerCase());
    
    if (inTeamA || inTeamB) {
      const stats = inTeamA || inTeamB;
      const matchKd = (stats.kills / (stats.deaths || 1)).toFixed(2);
      return {
        match: m,
        details,
        stats,
        matchKd,
        teamObj: inTeamA ? getTeam(m.teamA) : getTeam(m.teamB),
        enemyObj: inTeamA ? getTeam(m.teamB) : getTeam(m.teamA),
        won: inTeamA ? m.scoreA > m.scoreB : m.scoreB > m.scoreA,
      };
    }
    return null;
  }).filter(Boolean) as any[];

  return (
    <main style={{ padding: '4rem 0', minHeight: '100vh' }}>
      <section className="container">
        
        {/* Header do Jogador */}
        <div className="glass-card" style={{ padding: '3rem 2rem', marginBottom: '3rem', position: 'relative', overflow: 'hidden' }}>
          {/* Fundo dinâmico da cor do badge */}
          <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: badgeColor, filter: 'blur(100px)', opacity: 0.1, borderRadius: '50%', transform: 'translate(30%, -30%)' }}></div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexDirection: 'column' }}>
              <PlayerAvatar teamName={team.name} playerName={player.name} badgeColor={badgeColor} editable={true} />
              <h1 className="hero-title" style={{ fontSize: '3rem', margin: 0, textShadow: 'none' }}>{player.name}</h1>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {playerTier !== 'Não ranqueado' && (
                  <span style={{ background: 'var(--gold)', color: '#000', padding: '0.4rem 1rem', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    {playerTier} {tierLvl}
                  </span>
                )}
                <Link href={`/time/${team.id}`} style={{ textDecoration: 'none' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.4)', color: '#fff', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.9rem', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }} className="match-card-hover">
                    {team.logo ? <img src={team.logo} alt={team.name} style={{ width: '18px', height: '18px', borderRadius: '50%' }} /> : null}
                    {team.name}
                  </span>
                </Link>
              </div>
              <GamersClubLink playerName={player.name} lvl={playerLvlVal} />
              <PlayerCardGenerator
                playerName={player.name}
                teamName={team.name}
                teamLogo={team.logo}
                teamInitials={team.initials}
                kills={player.kills}
                deaths={player.deaths}
                assists={player.assists}
                kd={kd}
                lvl={playerLvlVal}
                tierName={playerTier}
                badgeColor={badgeColor}
              />
            </div>

            {/* Estatísticas Gerais */}
            <div className="player-stats-grid">
              <div style={{ background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.2)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 'bold' }}>KILLS</span>
                <span style={{ color: 'var(--cyan)', fontSize: '2.5rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 'bold', lineHeight: 1 }}>{player.kills}</span>
              </div>
              <div style={{ background: 'rgba(255,51,102,0.1)', border: '1px solid rgba(255,51,102,0.2)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 'bold' }}>DEATHS</span>
                <span style={{ color: 'var(--accent-red)', fontSize: '2.5rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 'bold', lineHeight: 1 }}>{player.deaths}</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 'bold' }}>ASSISTS</span>
                <span style={{ color: '#fff', fontSize: '2.5rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 'bold', lineHeight: 1 }}>{player.assists}</span>
              </div>
              <div style={{ background: badgeColor, border: `1px solid ${badgeColor}`, padding: '1.5rem', borderRadius: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem', boxShadow: `0 0 15px ${badgeColor}40` }}>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 'bold' }}>K/D RATIO</span>
                <span style={{ color: '#fff', fontSize: '2.5rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 'bold', lineHeight: 1 }}>{kd}</span>
              </div>
            </div>

            {/* Badges / Conquistas */}
            {(() => {
              let mvpCount = 0;
              let hasHardCarry = false;
              let hasDifficilCarregar = false;

              let hasMonstroDoFrag = false;

              Object.values(matchDetails).forEach((det: any) => {
                const allStats = [...det.teamA_stats, ...det.teamB_stats];
                const pStat = allStats.find((s: any) => s.name.toLowerCase() === decodedName.toLowerCase());
                if (pStat) {
                  const pKd = pStat.kills / (pStat.deaths || 1);
                  if (pKd >= 2.0) hasHardCarry = true;
                  if (pStat.kills >= 30) hasMonstroDoFrag = true;

                  let bestKd = -1;
                  let mvpPlayer = null;
                  let worstKd = 999;
                  let worstPlayer = null;

                  allStats.forEach((s: any) => {
                    const kdVal = s.kills / (s.deaths || 1);
                    if (kdVal > bestKd) {
                      bestKd = kdVal;
                      mvpPlayer = s.name;
                    }
                    if (kdVal < worstKd) {
                      worstKd = kdVal;
                      worstPlayer = s.name;
                    }
                  });

                  if (mvpPlayer && (mvpPlayer as string).toLowerCase() === decodedName.toLowerCase()) {
                    mvpCount++;
                  }
                  if (worstPlayer && (worstPlayer as string).toLowerCase() === decodedName.toLowerCase()) {
                    hasDifficilCarregar = true;
                  }
                }
              });

              const maxAssists = Math.max(...players.map(p => p.assists));
              const isReiDaResenha = player.assists === maxAssists && player.assists > 0;

              let isSwapped = false;
              for (const tierPlayers of Object.values(tiers)) {
                const found = tierPlayers.find(tp => (tp.name.toLowerCase().includes(decodedName.toLowerCase()) || decodedName.toLowerCase().includes(tp.name.toLowerCase())) && (tp as any).swap);
                if (found) {
                  isSwapped = true;
                  break;
                }
              }

              const badgesList = [];
              if (mvpCount > 0) badgesList.push({ title: 'MVP da Partida', desc: `Melhor jogador da partida ${mvpCount}x no campeonato`, icon: '🏆', color: 'var(--gold)' });
              if (hasHardCarry) badgesList.push({ title: 'Hard Carry', desc: 'Teve desempenho monstruoso com K/D > 2.0 em uma partida', icon: '🔥', color: 'var(--cyan)' });
              if (hasMonstroDoFrag) badgesList.push({ title: 'Monstro do Frag', desc: 'Fez 30 ou mais Kills em uma única partida', icon: '🎯', color: '#ff9800' });
              if (isReiDaResenha) badgesList.push({ title: 'Rei da Resenha', desc: 'Dono do maior número de assistências de toda a liga', icon: '👑', color: '#ab47bc' });
              if (isSwapped) badgesList.push({ title: 'Trocado', desc: 'Jogador envolvido em troca de equipe durante a liga', icon: '🔄', color: '#00e676' });
              if (hasDifficilCarregar) badgesList.push({ title: 'Difícil Carregar', desc: 'Teve o menor K/D em uma partida do campeonato', icon: '⚓', color: 'var(--accent-red)' });

              if (badgesList.length === 0) return null;

              return (
                <div style={{ marginTop: '2rem', width: '100%', maxWidth: '800px' }}>
                  <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem', textAlign: 'center' }}>MEDALHAS E CONQUISTAS</h4>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {badgesList.map((b, idx) => (
                      <div key={idx} title={`${b.title}: ${b.desc}`} style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${b.color}`, padding: '0.8rem 1.2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.8rem', boxShadow: `0 0 10px ${b.color}20`, cursor: 'help' }}>
                        <span style={{ fontSize: '1.5rem' }}>{b.icon}</span>
                        <div>
                          <strong style={{ display: 'block', color: '#fff', fontSize: '0.95rem' }}>{b.title}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

          </div>
          
          {/* Gráfico de Evolução de K/D */}
          {playerMatches.length > 0 && (
            <PlayerChart data={playerMatches.map((pm, i) => ({ 
              name: `vs ${pm.enemyObj.name}`, 
              kd: parseFloat(pm.matchKd) 
            }))} />
          )}

        </div>

        {/* Histórico de Partidas */}
        <h2 className="hero-title" style={{ fontSize: '2rem', marginBottom: '1.5rem', textShadow: 'none', textAlign: 'left' }}>HISTÓRICO DE PARTIDAS</h2>
        
        {playerMatches.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Nenhuma partida registrada para este jogador.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {playerMatches.map((pm, i) => (
              <div key={i} className="glass-card match-card-hover" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '2rem', borderLeft: `4px solid ${pm.won ? 'var(--cyan)' : 'var(--accent-red)'}` }}>
                
                {/* Oponente */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {pm.enemyObj.logo ? <img src={pm.enemyObj.logo} alt={pm.enemyObj.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} /> : <div className="team-logo-square" style={{ width: '40px', height: '40px' }}>{pm.enemyObj.initials}</div>}
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>VS</span>
                    <p style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#fff' }}>{pm.enemyObj.name}</p>
                  </div>
                </div>

                {/* Info da Partida & Stats do Jogador nela */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ background: pm.won ? 'rgba(0,240,255,0.1)' : 'rgba(255,51,102,0.1)', color: pm.won ? 'var(--cyan)' : 'var(--accent-red)', padding: '0.2rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {pm.won ? 'VITÓRIA' : 'DERROTA'}
                  </span>
                  <Link href={`/partida/${pm.match.id}`} style={{ textDecoration: 'none' }}>
                    <span style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '0.3rem 1rem', borderRadius: '6px', fontSize: '0.9rem', cursor: 'pointer' }} className="match-card-hover">
                      Ver Partida
                    </span>
                  </Link>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mapa: {pm.details.map}</span>
                </div>

                {/* Stats do Jogador */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Desempenho</span>
                    <strong style={{ fontSize: '1.1rem', color: '#fff' }}>{pm.stats.kills}K / {pm.stats.deaths}D / {pm.stats.assists}A</strong>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block', textAlign: 'center' }}>K/D</span>
                    <strong style={{ color: '#fff', fontSize: '1.2rem', fontFamily: 'var(--font-rajdhani)' }}>{pm.matchKd}</strong>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </section>
    </main>
  );
}
