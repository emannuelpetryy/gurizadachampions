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

  const StatComparisonRow = ({ label, valA, valB, format = (v: any) => v }: { label: string, valA: number, valB: number, format?: (v: any) => any }) => {
    const isAWinner = valA > valB;
    const isBWinner = valB > valA;

    return (
      <div style={{ marginBottom: '1.5rem', background: 'rgba(0,0,0,0.3)', padding: '1.2rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <strong style={{ fontSize: '1.3rem', color: isAWinner ? 'var(--cyan)' : '#fff', fontFamily: 'var(--font-rajdhani)' }}>
            {format(valA)} {isAWinner && '👑'}
          </strong>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>{label}</span>
          <strong style={{ fontSize: '1.3rem', color: isBWinner ? '#ab47bc' : '#fff', fontFamily: 'var(--font-rajdhani)' }}>
            {isBWinner && '👑 '} {format(valB)}
          </strong>
        </div>

        {/* Visual Bar Comparison */}
        <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', background: 'rgba(255,255,255,0.1)', gap: '2px' }}>
          <div style={{ flex: valA || 1, background: isAWinner ? 'var(--cyan)' : 'rgba(0,240,255,0.4)', transition: 'all 0.3s' }}></div>
          <div style={{ flex: valB || 1, background: isBWinner ? '#ab47bc' : 'rgba(171,71,188,0.4)', transition: 'all 0.3s' }}></div>
        </div>
      </div>
    );
  };

  return (
    <main style={{ padding: '4rem 0', minHeight: '100vh' }}>
      <section className="container">
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="hero-title" style={{ fontSize: '3rem', margin: 0, textShadow: 'none' }}>
            COMPARAÇÃO <span style={{ color: 'var(--cyan)' }}>1V1</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Coloque dois jogadores lado a lado e alimente a rivalidade do campeonato!</p>
        </div>

        {/* Selectors Header Card */}
        <div className="glass-card" style={{ padding: '2.5rem 2rem', marginBottom: '3rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '2rem', alignItems: 'center' }}>
            
            {/* Player A Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <PlayerAvatar teamName={teamA.name} playerName={pA.name} badgeColor="var(--cyan)" size={90} />
              <select
                value={playerAName}
                onChange={(e) => setPlayerAName(e.target.value)}
                style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid var(--cyan)', padding: '0.8rem 1.2rem', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', width: '100%', maxWidth: '280px', outline: 'none', cursor: 'pointer' }}
              >
                {players.map(p => (
                  <option key={p.name} value={p.name} style={{ background: '#111' }}>{p.name}</option>
                ))}
              </select>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{teamA.name}</span>
            </div>

            {/* VS Badge */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--cyan), #ab47bc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.4rem', color: '#fff', boxShadow: '0 0 20px rgba(0,240,255,0.4)', fontFamily: 'var(--font-rajdhani)' }}>
                VS
              </div>
            </div>

            {/* Player B Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <PlayerAvatar teamName={teamB.name} playerName={pB.name} badgeColor="#ab47bc" size={90} />
              <select
                value={playerBName}
                onChange={(e) => setPlayerBName(e.target.value)}
                style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid #ab47bc', padding: '0.8rem 1.2rem', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', width: '100%', maxWidth: '280px', outline: 'none', cursor: 'pointer' }}
              >
                {players.map(p => (
                  <option key={p.name} value={p.name} style={{ background: '#111' }}>{p.name}</option>
                ))}
              </select>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{teamB.name}</span>
            </div>

          </div>
        </div>

        {/* Head-to-Head Stats Comparison Card */}
        <div className="glass-card" style={{ padding: '2.5rem 2rem' }}>
          <h3 className="hero-title" style={{ fontSize: '2rem', marginBottom: '2rem', textShadow: 'none', textAlign: 'center' }}>
            DUELO DE ESTATÍSTICAS
          </h3>

          <StatComparisonRow label="K/D Ratio" valA={kdA} valB={kdB} format={(v) => v.toFixed(2)} />
          <StatComparisonRow label="Total Kills" valA={pA.kills} valB={pB.kills} />
          <StatComparisonRow label="Total Deaths" valA={pA.deaths} valB={pB.deaths} />
          <StatComparisonRow label="Total Assists" valA={pA.assists} valB={pB.assists} />
          <StatComparisonRow label="Títulos de MVP" valA={mvpsA} valB={mvpsB} />
          <StatComparisonRow label="Nível de Tier" valA={tierA.lvl} valB={tierB.lvl} format={(v) => `Lvl ${v}`} />

        </div>

      </section>
    </main>
  );
}
