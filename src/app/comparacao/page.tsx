'use client';

import { useState } from 'react';
import { players, getTeam, matchDetails, tiers } from '../data';
import PlayerAvatar from '../jogador/[name]/PlayerAvatar';
import Link from 'next/link';

export default function ComparacaoPage() {
  const [playerAName, setPlayerAName] = useState(players[0]?.name || '');
  const [playerBName, setPlayerBName] = useState(players[1]?.name || players[0]?.name || '');

  const pA = players.find(p => p.name === playerAName) || players[0];
  const pB = players.find(p => p.name === playerBName) || players[1] || players[0];

  const teamA = getTeam(pA.teamId);
  const teamB = getTeam(pB.teamId);

  const kdA = pA.kills / (pA.deaths || 1);
  const kdB = pB.kills / (pB.deaths || 1);

  // Contar MVPs
  const getMVPs = (playerName: string) => {
    let count = 0;
    Object.values(matchDetails).forEach((det: any) => {
      const allStats = [...det.teamA_stats, ...det.teamB_stats];
      let bestKd = -1;
      let mvpPlayer = null;
      allStats.forEach((s: any) => {
        const kdVal = s.kills / (s.deaths || 1);
        if (kdVal > bestKd) {
          bestKd = kdVal;
          mvpPlayer = s.name;
        }
      });
      if (mvpPlayer && (mvpPlayer as string).toLowerCase() === playerName.toLowerCase()) {
        count++;
      }
    });
    return count;
  };

  const mvpsA = getMVPs(pA.name);
  const mvpsB = getMVPs(pB.name);

  // Tier info
  const getTierLvl = (name: string) => {
    for (const [tName, tList] of Object.entries(tiers)) {
      const found = tList.find(tp => tp.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(tp.name.toLowerCase()));
      if (found) return { tier: tName, lvl: found.lvl };
    }
    return { tier: '-', lvl: 0 };
  };

  const tierA = getTierLvl(pA.name);
  const tierB = getTierLvl(pB.name);

  // Badges por jogador
  const getPlayerBadges = (playerName: string) => {
    const badges: { icon: string; title: string; desc: string; color: string }[] = [];
    let totalKills = 0;
    let totalDeaths = 0;
    let totalAssists = 0;

    Object.values(matchDetails).forEach((det: any) => {
      const allP = [...det.teamA_stats, ...det.teamB_stats];
      const stat = allP.find((s: any) => s.name.toLowerCase() === playerName.toLowerCase());
      if (stat) {
        totalKills += stat.kills;
        totalDeaths += stat.deaths;
        totalAssists += stat.assists;
      }
    });

    const overallKd = totalKills / (totalDeaths || 1);

    if (overallKd >= 1.5) badges.push({ icon: '🔥', title: 'Hard Carry', desc: 'K/D geral acima de 1.50', color: '#ff4757' });
    if (totalAssists >= 10) badges.push({ icon: '🤝', title: 'Rei da Resenha', desc: '10+ assistências no campeonato', color: '#2ed573' });
    if (totalKills >= 30) badges.push({ icon: '🎯', title: 'Pistoleiro Elite', desc: '30+ kills acumuladas no campeonato', color: '#ffa502' });
    if (overallKd >= 1.2 && overallKd < 1.5) badges.push({ icon: '⚡', title: 'Maestro', desc: 'Desempenho tático superior', color: '#eccc68' });
    if (overallKd <= 0.7) badges.push({ icon: '🎒', title: 'Mochila', desc: 'K/D abaixo de 0.70', color: '#70a1ff' });

    return badges;
  };

  const badgesA = getPlayerBadges(pA.name);
  const badgesB = getPlayerBadges(pB.name);

  const StatComparisonRow = ({ 
    label, 
    valA, 
    valB, 
    format = (v: any) => v, 
    lowerIsBetter = false 
  }: { 
    label: string, 
    valA: number, 
    valB: number, 
    format?: (v: any) => any, 
    lowerIsBetter?: boolean 
  }) => {
    const isAWinner = lowerIsBetter ? valA < valB : valA > valB;
    const isBWinner = lowerIsBetter ? valB < valA : valB > valA;

    // Para barras visuais quando menor é melhor (ex: mortes), invertemos os pesos
    const weightA = lowerIsBetter ? (valB || 1) : (valA || 1);
    const weightB = lowerIsBetter ? (valA || 1) : (valB || 1);

    return (
      <div className="versus-meter-row">
        <div className="versus-meter-labels">
          <strong style={{ fontSize: '1.25rem', color: isAWinner ? 'var(--cyan)' : '#f1f5f9', fontFamily: 'var(--font-rajdhani)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            {format(valA)} {isAWinner && '👑'}
          </strong>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>
            {label}
          </span>
          <strong style={{ fontSize: '1.25rem', color: isBWinner ? '#d946ef' : '#f1f5f9', fontFamily: 'var(--font-rajdhani)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            {isBWinner && '👑 '} {format(valB)}
          </strong>
        </div>

        {/* Bar Comparison */}
        <div className="versus-meter-bar">
          <div style={{ flex: weightA, background: isAWinner ? 'var(--cyan)' : 'rgba(0,240,255,0.4)', transition: 'all 0.35s ease' }}></div>
          <div style={{ flex: weightB, background: isBWinner ? '#d946ef' : 'rgba(217,70,239,0.4)', transition: 'all 0.35s ease' }}></div>
        </div>
      </div>
    );
  };

  return (
    <main style={{ padding: '4rem 0', minHeight: '100vh' }}>
      <section className="container">
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="section-eyebrow">HEAD-TO-HEAD</span>
          <h1 className="hero-title" style={{ fontSize: '3rem', margin: '0.2rem 0 0', textShadow: 'none' }}>
            COMPARAÇÃO <span style={{ color: 'var(--cyan)' }}>1V1</span>
          </h1>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem', fontSize: '0.95rem' }}>
            Coloque dois jogadores frente a frente e analise quem domina as estatísticas da temporada!
          </p>
        </div>

        {/* Versus Arena Card */}
        <div className="versus-arena-card">
          <div className="versus-fighter-grid">
            
            {/* Player A Fighter Card */}
            <div className="versus-fighter-card" style={{ borderTop: '3px solid var(--cyan)' }}>
              <PlayerAvatar teamName={teamA.name} playerName={pA.name} badgeColor="var(--cyan)" size={84} />
              <select
                value={playerAName}
                onChange={(e) => setPlayerAName(e.target.value)}
                className="versus-select"
                style={{ borderColor: 'rgba(0, 240, 255, 0.4)' }}
              >
                {players.map(p => (
                  <option key={p.name} value={p.name} style={{ background: '#080d1a' }}>{p.name}</option>
                ))}
              </select>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 700 }}>{teamA.name}</span>
                {tierA.tier !== '-' && (
                  <span style={{ fontSize: '0.65rem', background: 'rgba(0, 240, 255, 0.15)', border: '1px solid rgba(0, 240, 255, 0.5)', color: 'var(--cyan)', padding: '0.15rem 0.5rem', borderRadius: '6px', fontWeight: 800 }}>
                    TIER {tierA.tier} (LVL {tierA.lvl})
                  </span>
                )}
              </div>
            </div>

            {/* VS Pulsating Badge */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div className="versus-badge-icon">
                VS
              </div>
              <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>DUELO</span>
            </div>

            {/* Player B Fighter Card */}
            <div className="versus-fighter-card" style={{ borderTop: '3px solid #d946ef' }}>
              <PlayerAvatar teamName={teamB.name} playerName={pB.name} badgeColor="#d946ef" size={84} />
              <select
                value={playerBName}
                onChange={(e) => setPlayerBName(e.target.value)}
                className="versus-select"
                style={{ borderColor: 'rgba(217, 70, 239, 0.4)' }}
              >
                {players.map(p => (
                  <option key={p.name} value={p.name} style={{ background: '#080d1a' }}>{p.name}</option>
                ))}
              </select>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 700 }}>{teamB.name}</span>
                {tierB.tier !== '-' && (
                  <span style={{ fontSize: '0.65rem', background: 'rgba(217, 70, 239, 0.15)', border: '1px solid rgba(217, 70, 239, 0.5)', color: '#d946ef', padding: '0.15rem 0.5rem', borderRadius: '6px', fontWeight: 800 }}>
                    TIER {tierB.tier} (LVL {tierB.lvl})
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Head-to-Head Stats Comparison Card */}
        <div className="glass-card" style={{ padding: '2.5rem 2rem', marginBottom: '3rem' }}>
          <h3 className="hero-title" style={{ fontSize: '2rem', marginBottom: '2rem', textShadow: 'none', textAlign: 'center' }}>
            DUELO DE ESTATÍSTICAS
          </h3>

          <StatComparisonRow label="K/D Ratio" valA={kdA} valB={kdB} format={(v) => v.toFixed(2)} />
          <StatComparisonRow label="Total Kills" valA={pA.kills} valB={pB.kills} />
          <StatComparisonRow label="Total Deaths" valA={pA.deaths} valB={pB.deaths} lowerIsBetter={true} />
          <StatComparisonRow label="Total Assists" valA={pA.assists} valB={pB.assists} />
          <StatComparisonRow label="Títulos de MVP" valA={mvpsA} valB={mvpsB} />
          <StatComparisonRow label="Nível de Tier" valA={tierA.lvl} valB={tierB.lvl} format={(v) => `Lvl ${v}`} />
        </div>

        {/* Badges Comparison Card */}
        <div className="glass-card" style={{ padding: '2.5rem 2rem' }}>
          <h3 className="hero-title" style={{ fontSize: '2rem', marginBottom: '2rem', textShadow: 'none', textAlign: 'center' }}>
            BADGES & CONQUISTAS DO CAMPEONATO
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Player A Badges */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '14px', border: '1px solid rgba(0,240,255,0.2)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.8rem' }}>
                <PlayerAvatar teamName={teamA.name} playerName={pA.name} badgeColor="var(--cyan)" size={40} />
                <strong style={{ fontSize: '1.2rem', color: 'var(--cyan)' }}>{pA.name}</strong>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {badgesA.length > 0 ? (
                  badgesA.map((b, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(0,0,0,0.4)', padding: '0.6rem 1rem', borderRadius: '8px', border: `1px solid ${b.color}44` }}>
                      <span style={{ fontSize: '1.4rem' }}>{b.icon}</span>
                      <div>
                        <strong style={{ color: b.color, fontSize: '0.95rem', display: 'block' }}>{b.title}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.desc}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Nenhuma badge conquistada ainda</span>
                )}
              </div>
            </div>

            {/* Player B Badges */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '14px', border: '1px solid rgba(171,71,188,0.2)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.8rem' }}>
                <PlayerAvatar teamName={teamB.name} playerName={pB.name} badgeColor="#ab47bc" size={40} />
                <strong style={{ fontSize: '1.2rem', color: '#ab47bc' }}>{pB.name}</strong>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {badgesB.length > 0 ? (
                  badgesB.map((b, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(0,0,0,0.4)', padding: '0.6rem 1rem', borderRadius: '8px', border: `1px solid ${b.color}44` }}>
                      <span style={{ fontSize: '1.4rem' }}>{b.icon}</span>
                      <div>
                        <strong style={{ color: b.color, fontSize: '0.95rem', display: 'block' }}>{b.title}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.desc}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Nenhuma badge conquistada ainda</span>
                )}
              </div>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}
