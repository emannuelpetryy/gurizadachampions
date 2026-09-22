'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { groupA, groupB, getTeam, players, getPlayerTier } from '../data';
import PlayerAvatar from '../jogador/[name]/PlayerAvatar';
import TeamLogo from '../components/TeamLogo';
import PlayoffBracket from '../components/PlayoffBracket';

type Tab = 'championship' | 'playoffs' | 'elo_rating';

export default function Ranking() {
  const [activeTab, setActiveTab] = useState<Tab>('championship');
  const [eloMap, setEloMap] = useState<Record<string, any>>({});
  const [loadingElo, setLoadingElo] = useState(true);

  useEffect(() => {
    fetch('/api/lobby', { cache: 'no-store' })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => data?.eloMap && setEloMap(data.eloMap))
      .catch(() => {})
      .finally(() => setLoadingElo(false));
  }, []);

  const renderGroup = (name: string, rows: typeof groupA) => (
    <section className="glass-card" aria-label={`Classificação do Grupo ${name}`}>
      <h2 className="card-title">Grupo {name}</h2>
      <div className="table-responsive">
        <table className="ranking-table">
          <thead><tr><th>Pos.</th><th>Equipe</th><th>Pts.</th><th>J</th><th>V</th><th>D</th><th>Saldo</th></tr></thead>
          <tbody>{rows.map((row, index) => {
            const team = getTeam(row.teamId);
            return <tr key={team.id} className={`rank-${index + 1}`}>
              <td><strong className="rank-number">{index + 1}</strong></td>
              <td><Link href={`/time/${team.id}`} style={{ textDecoration: 'none' }}><span className="team-info"><TeamLogo logo={team.logo} name={team.name} initials={team.initials} size={30} borderRadius="0" /><strong>{team.name}</strong></span></Link></td>
              <td style={{ color: 'var(--primary)', fontWeight: 800 }}>{row.p}</td><td>{row.pj}</td><td style={{ color: 'var(--accent-green)' }}>{row.v}</td><td style={{ color: 'var(--accent-red)' }}>{row.d}</td><td style={{ color: row.rd > 0 ? 'var(--accent-green)' : row.rd < 0 ? 'var(--accent-red)' : 'var(--text-muted)' }}>{row.rd > 0 ? `+${row.rd}` : row.rd}</td>
            </tr>;
          })}</tbody>
        </table>
      </div>
      <p style={{ margin: '1rem 0 0', fontSize: '.76rem' }}>Os dois primeiros avançam às semifinais. Saldo = diferença de rounds.</p>
    </section>
  );

  const rankedPlayers = [...players].sort((a, b) => (b.kills / (b.deaths || 1)) - (a.kills / (a.deaths || 1)));

  return <main className="content-page"><section className="container">
    <header className="page-intro"><div><span className="page-eyebrow">Campeonato · dados oficiais</span><h1>Ranking &amp; classificação</h1></div><p>Grupos, desempenho individual e ELO dos amistosos são leituras diferentes da mesma temporada.</p></header>
    <div className="segment-tabs" role="tablist" aria-label="Seções do ranking">
      <button className={activeTab === 'championship' ? 'segment-tab is-active' : 'segment-tab'} onClick={() => setActiveTab('championship')} role="tab" aria-selected={activeTab === 'championship'}>Campeonato</button>
      <button className={activeTab === 'playoffs' ? 'segment-tab is-active' : 'segment-tab'} onClick={() => setActiveTab('playoffs')} role="tab" aria-selected={activeTab === 'playoffs'}>Playoffs</button>
      <button className={activeTab === 'elo_rating' ? 'segment-tab is-active' : 'segment-tab'} onClick={() => setActiveTab('elo_rating')} role="tab" aria-selected={activeTab === 'elo_rating'}>ELO do lobby</button>
    </div>

    {activeTab === 'championship' && <>
      <div className="rank-layout">{renderGroup('A', groupA)}{renderGroup('B', groupB)}</div>
      <section className="rank-section"><div className="dashboard-heading"><h2>Desempenho individual</h2><span className="page-eyebrow">Acumulado por kills ÷ deaths</span></div>
        <div className="glass-card"><div className="table-responsive"><table className="ranking-table"><thead><tr><th>Rank</th><th>Jogador</th><th>Equipe</th><th>J</th><th>K</th><th>D</th><th>A</th><th>K/D</th><th>KDA</th></tr></thead><tbody>
          {rankedPlayers.map((player, index) => { const team = getTeam(player.teamId); const kd = player.kills / (player.deaths || 1); return <tr key={player.name} className={`rank-${index + 1}`}><td><strong className="rank-number">{index + 1}</strong></td><td><Link href={`/jogador/${encodeURIComponent(player.name)}`} style={{ display: 'flex', alignItems: 'center', gap: '.65rem', textDecoration: 'none' }}><PlayerAvatar teamName={team.name} playerName={player.name} badgeColor="rgba(255,255,255,.15)" size={34}/><strong>{player.name}</strong>{getPlayerTier(player.name) && <span className="tier-badge">{getPlayerTier(player.name)}</span>}</Link></td><td><Link href={`/time/${team.id}`} style={{ color: 'var(--text-muted)' }}>{team.name}</Link></td><td>{player.matches}</td><td style={{ color: 'var(--cyan)' }}>{player.kills}</td><td style={{ color: 'var(--accent-red)' }}>{player.deaths}</td><td>{player.assists}</td><td style={{ color: 'var(--primary)', fontWeight: 800 }}>{kd.toFixed(2)}</td><td>{((player.kills + player.assists) / (player.deaths || 1)).toFixed(2)}</td></tr>; })}
        </tbody></table></div><p style={{ margin: '1rem 0 0', fontSize: '.76rem' }}>K/D e KDA usam totais acumulados, padrão de rankings de CS. HS, dano e ADR não entram enquanto faltarem dados completos em partidas.</p></div>
      </section>
    </>}

    {activeTab === 'playoffs' && <section className="glass-card"><PlayoffBracket /></section>}

    {activeTab === 'elo_rating' && <section><div className="dashboard-heading"><h2>ELO dos amistosos</h2><span className="page-eyebrow">Lobby 5v5 · em tempo real</span></div>
      {loadingElo ? <div className="empty-state">Carregando histórico do lobby…</div> : Object.keys(eloMap).length === 0 ? <div className="empty-state"><p>Ainda não existem pontuações de ELO registradas.</p><Link href="/lobby" className="btn-primary">Abrir lobby</Link></div> : <div className="elo-list">{Object.values(eloMap).sort((a: any,b: any) => b.elo - a.elo).map((player: any, index) => { const known = players.find((p) => p.name.toLowerCase() === player.name.toLowerCase()); const team = known ? getTeam(known.teamId) : null; const total = (player.wins || 0) + (player.losses || 0); return <article className="elo-card" key={player.name}><div style={{ display: 'flex', alignItems: 'center', gap: '.7rem', minWidth: 0 }}><strong className="rank-number">{index + 1}</strong>{known && <PlayerAvatar teamName={team?.name || ''} playerName={player.name} badgeColor="var(--primary)" size={38}/>}<div style={{ minWidth: 0 }}><strong style={{ display: 'block' }}>{player.name}</strong><span style={{ color: 'var(--text-dim)', fontSize: '.72rem' }}>{player.wins || 0}V · {player.losses || 0}D · {total ? Math.round(((player.wins || 0) / total) * 100) : 0}% WR</span></div></div><strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-rajdhani)', fontSize: '1.55rem', whiteSpace: 'nowrap' }}>{player.elo} <small style={{ fontSize: '.65rem' }}>ELO</small></strong></article>; })}</div>}
    </section>}
  </section></main>;
}
