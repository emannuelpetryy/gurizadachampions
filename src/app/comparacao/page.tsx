'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { getPlayerTier, getTeam, matchDetails, normalizePlayerName, players } from '../data';
import PlayerAvatar from '../jogador/[name]/PlayerAvatar';

const kd = (player: (typeof players)[number]) => player.kills / (player.deaths || 1);

export default function ComparacaoPage() {
  const [playerAName, setPlayerAName] = useState(players[0]?.name || '');
  const [playerBName, setPlayerBName] = useState(players[1]?.name || players[0]?.name || '');
  const playerA = players.find((player) => player.name === playerAName) || players[0];
  const playerB = players.find((player) => player.name === playerBName) || players[0];
  const teamA = getTeam(playerA.teamId); const teamB = getTeam(playerB.teamId);
  const appearances = useMemo(() => (name: string) => Object.values(matchDetails).filter((details: any) => [...details.teamA_stats, ...details.teamB_stats].some((row: any) => normalizePlayerName(row.name).toLowerCase() === name.toLowerCase())).length, []);
  const stats = [
    ['K/D', kd(playerA), kd(playerB), (value: number) => value.toFixed(2)],
    ['KDA', (playerA.kills + playerA.assists) / (playerA.deaths || 1), (playerB.kills + playerB.assists) / (playerB.deaths || 1), (value: number) => value.toFixed(2)],
    ['Kills', playerA.kills, playerB.kills, String], ['Deaths', playerA.deaths, playerB.deaths, String], ['Assists', playerA.assists, playerB.assists, String], ['Partidas', appearances(playerA.name), appearances(playerB.name), String],
  ] as const;

  return <main className="content-page"><section className="container">
    <header className="page-intro"><div><span className="page-eyebrow">Comunidade · frente a frente</span><h1>Comparar 1v1</h1></div><p>Compare estatísticas acumuladas, tier e presença no campeonato sem criar métricas artificiais.</p></header>
    <section className="glass-card" style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'end' }}>
        {[[playerA, teamA, playerAName, setPlayerAName, 'A'], [playerB, teamB, playerBName, setPlayerBName, 'B']].map(([player, team, selected, setSelected, side]: any, index) => <div key={side} style={{ display: 'grid', gap: '.75rem', textAlign: index === 1 ? 'right' : 'left' }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: index === 1 ? 'flex-end' : 'flex-start', gap: '.75rem' }}>{index === 1 && <div><strong style={{ display: 'block' }}>{player.name}</strong><span style={{ color: 'var(--text-dim)', fontSize: '.72rem' }}>{team.name} · Tier {getPlayerTier(player.name) || '—'}</span></div>}<PlayerAvatar teamName={team.name} playerName={player.name} badgeColor="var(--primary)" size={52}/>{index === 0 && <div><strong style={{ display: 'block' }}>{player.name}</strong><span style={{ color: 'var(--text-dim)', fontSize: '.72rem' }}>{team.name} · Tier {getPlayerTier(player.name) || '—'}</span></div>}</div><label><span className="sr-only">Jogador {side}</span><select value={selected} onChange={(event) => setSelected(event.target.value)} style={{ width: '100%', minHeight: '42px', background: '#111314', color: '#fff', border: '1px solid var(--card-border)', padding: '.6rem .75rem' }}>{players.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}</select></label></div>)}
        <strong style={{ alignSelf: 'center', color: 'var(--primary)', fontFamily: 'var(--font-rajdhani)', fontSize: '1.8rem' }}>VS</strong>
      </div>
    </section>
    <section className="glass-card"><div className="dashboard-heading"><h2>Placar estatístico</h2><span className="page-eyebrow">Totais da temporada</span></div><div style={{ display: 'grid', gap: '.7rem' }}>{stats.map(([label, valueA, valueB, format]) => { const max = Math.max(Number(valueA), Number(valueB), 1); const aWins = valueA > valueB; const bWins = valueB > valueA; return <div key={label} style={{ display: 'grid', gridTemplateColumns: 'minmax(60px, 1fr) 80px minmax(60px, 1fr)', gap: '.8rem', alignItems: 'center' }}><strong style={{ textAlign: 'right', color: aWins ? 'var(--primary)' : 'var(--text-main)' }}>{format(valueA)}</strong><span style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '.68rem', fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase' }}>{label}</span><strong style={{ color: bWins ? 'var(--primary)' : 'var(--text-main)' }}>{format(valueB)}</strong><div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: `${(Number(valueA) / max) * 50}% ${(Number(valueB) / max) * 50}%`, gap: '2px', height: '5px', background: '#2b2e2f' }}><span style={{ background: aWins ? 'var(--primary)' : 'var(--cyan)' }} /><span style={{ background: bWins ? 'var(--primary)' : 'var(--accent-red)' }} /></div></div>; })}</div></section>
    <div className="season-actions" style={{ justifyContent: 'center', marginTop: '1.25rem' }}><Link href={`/jogador/${encodeURIComponent(playerA.name)}`} className="btn-secondary">Perfil de {playerA.name}</Link><Link href={`/jogador/${encodeURIComponent(playerB.name)}`} className="btn-secondary">Perfil de {playerB.name}</Link></div>
  </section></main>;
}
