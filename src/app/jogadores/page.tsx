'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { getPlayerTier, getTeam, players, teams } from '../data';
import PlayerAvatar from '../jogador/[name]/PlayerAvatar';

export default function Jogadores() {
  const [query, setQuery] = useState('');
  const [tier, setTier] = useState('todos');
  const [teamId, setTeamId] = useState('todos');
  const filtered = useMemo(() => [...players].filter((player) => {
    const searchable = `${player.name} ${getTeam(player.teamId).name}`.toLowerCase();
    return searchable.includes(query.toLowerCase()) && (tier === 'todos' || getPlayerTier(player.name) === tier) && (teamId === 'todos' || player.teamId === teamId);
  }).sort((a, b) => (b.kills / (b.deaths || 1)) - (a.kills / (a.deaths || 1))), [query, tier, teamId]);

  return <main className="content-page"><section className="container">
    <header className="page-intro"><div><span className="page-eyebrow">Comunidade · elenco oficial</span><h1>Jogadores</h1></div><p>Use os filtros para encontrar o atleta, equipe, tier e desempenho acumulado na temporada.</p></header>
    <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 1fr) repeat(2, minmax(150px, .45fr))', gap: '.7rem', marginBottom: '1.5rem' }}>
      <label><span className="sr-only">Buscar jogador</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar jogador ou equipe" style={{ width: '100%', minHeight: '42px', background: '#111314', color: '#fff', border: '1px solid var(--card-border)', padding: '.6rem .75rem' }} /></label>
      <label><span className="sr-only">Filtrar por tier</span><select value={tier} onChange={(event) => setTier(event.target.value)} style={{ width: '100%', minHeight: '42px', background: '#111314', color: '#fff', border: '1px solid var(--card-border)', padding: '.6rem .75rem' }}><option value="todos">Todos os tiers</option>{['S','A','B','C','D'].map((value) => <option key={value} value={value}>Tier {value}</option>)}</select></label>
      <label><span className="sr-only">Filtrar por equipe</span><select value={teamId} onChange={(event) => setTeamId(event.target.value)} style={{ width: '100%', minHeight: '42px', background: '#111314', color: '#fff', border: '1px solid var(--card-border)', padding: '.6rem .75rem' }}><option value="todos">Todas as equipes</option>{teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}</select></label>
    </div>
    <p className="page-eyebrow" style={{ marginBottom: '.75rem' }}>{filtered.length} jogadores encontrados</p>
    <div className="elo-list">{filtered.map((player) => { const team = getTeam(player.teamId); const kd = player.kills / (player.deaths || 1); return <Link href={`/jogador/${encodeURIComponent(player.name)}`} className="elo-card" style={{ textDecoration: 'none' }} key={player.name}><span style={{ display: 'flex', alignItems: 'center', gap: '.75rem', minWidth: 0 }}><PlayerAvatar teamName={team.name} playerName={player.name} badgeColor="rgba(229,199,92,.5)" size={44}/><span style={{ minWidth: 0 }}><strong style={{ display: 'block' }}>{player.name}</strong><span style={{ color: 'var(--text-dim)', fontSize: '.72rem' }}>{team.name} · <span className="tier-badge">Tier {getPlayerTier(player.name) || '—'}</span></span></span></span><strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-rajdhani)', fontSize: '1.45rem', whiteSpace: 'nowrap' }}>{kd.toFixed(2)}<small style={{ display: 'block', color: 'var(--text-dim)', fontFamily: 'var(--font-inter)', fontSize: '.58rem', textAlign: 'right' }}>K/D · {player.matches}J</small></strong></Link>; })}</div>
    {filtered.length === 0 && <div className="empty-state" style={{ marginTop: '1rem' }}>Nenhum jogador corresponde aos filtros.</div>}
  </section></main>;
}
