'use client';

import { useState, useEffect } from 'react';
import { groupA, groupB, getTeam, players, getPlayerTier } from '../data';
import Link from 'next/link';
import PlayerAvatar from '../jogador/[name]/PlayerAvatar';
import TeamLogo from '../components/TeamLogo';

import PlayoffBracket from '../components/PlayoffBracket';
import SeasonSelector from '../components/SeasonSelector';
import { sortRanking } from '../../lib/stats';

export default function Ranking() {
  const [activeTab, setActiveTab] = useState<'championship' | 'playoffs' | 'elo_rating'>('championship');
  const [eloMap, setEloMap] = useState<Record<string, any>>({});
  const [loadingElo, setLoadingElo] = useState(true);
  const [playerQuery, setPlayerQuery] = useState('');

  useEffect(() => {
    async function fetchElo() {
      try {
        const res = await fetch('/api/lobby', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.eloMap) setEloMap(data.eloMap);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingElo(false);
      }
    }
    fetchElo();
  }, []);

  const renderGroupTable = (groupName: string, groupData: any[]) => (
    <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <h3 className="card-title" style={{ margin: 0 }}>
          <span style={{ color: 'var(--cyan)' }}>GRUPO</span> {groupName}
        </h3>
        <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 800, letterSpacing: '0.5px' }}>
          TOP 2 ➔ SEMIFINAIS
        </span>
      </div>
      <div className="table-responsive">
        <table className="ranking-table group-ranking-table">
          <thead>
            <tr>
              <th style={{ width: '60px', textAlign: 'center' }}>POS</th>
              <th>EQUIPE</th>
              <th style={{ textAlign: 'center', color: 'var(--primary)' }}>PTS</th>
              <th style={{ textAlign: 'center' }}>J</th>
              <th style={{ textAlign: 'center' }}>V</th>
              <th style={{ textAlign: 'center' }}>D</th>
              <th style={{ textAlign: 'center', color: '#2ed573' }}>RD</th>
            </tr>
          </thead>
          <tbody>
            {groupData.map((row, index) => {
              const team = getTeam(row.teamId);
              const isQualified = index < 2;
              return (
                <tr key={team.id} className={`rank-${index + 1}`}>
                  <td style={{ textAlign: 'center' }}>
                    <span className="rank-number" style={{ fontSize: isQualified ? '1.4rem' : '1.1rem', color: isQualified ? '#10b981' : '#64748b', fontWeight: 900 }}>
                      {index + 1}
                    </span>
                  </td>
                  <td>
                    <Link href={`/time/${team.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="team-info" style={{ cursor: 'pointer' }}>
                        <TeamLogo logo={team.logo} name={team.name} initials={team.initials} size={36} borderRadius="8px" />
                        <div>
                          <strong style={{ fontSize: '1.05rem', color: '#fff' }}>{team.name}</strong>
                          {isQualified && (
                            <span style={{ display: 'block', fontSize: '0.65rem', color: '#10b981', fontWeight: 700 }}>
                              Classificado para Playoffs
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--cyan)', fontWeight: 900, fontSize: '1.25rem', fontFamily: 'var(--font-rajdhani)' }}>{row.p}</td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>{row.pj}</td>
                  <td style={{ textAlign: 'center', color: '#00f0ff', fontWeight: 700 }}>{row.v}</td>
                  <td style={{ textAlign: 'center', color: '#ff3366', fontWeight: 700 }}>{row.d}</td>
                  <td style={{ textAlign: 'center', color: row.rd > 0 ? '#10b981' : row.rd < 0 ? '#ff3366' : 'var(--text-muted)', fontWeight: 800, fontFamily: 'var(--font-rajdhani)', fontSize: '1.1rem' }}>
                    {row.rd > 0 ? `+${row.rd}` : row.rd}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.78rem', color: '#8fa0bc' }}>
        * Top 2 avançam às semifinais | PTS = Pontos, J = Jogos, V = Vitórias, D = Derrotas, RD = Saldo de Rounds
      </p>
    </div>
  );

  return (
    <main style={{ padding: '1.5rem 0', minHeight: '100vh' }}>
      <section className="container">
        
        {/* SELETOR DE MENU SUSPENSO / TABS DE RANKING */}
        <div className="ranking-tabs" style={{ marginBottom: '1.4rem' }}>
          <button
            onClick={() => setActiveTab('championship')}
            className={`ranking-tab ${activeTab === 'championship' ? 'is-active' : ''}`}
          >
            🏆 RANKING DO CAMPEONATO
          </button>

          <button
            onClick={() => setActiveTab('playoffs')}
            className={`ranking-tab ${activeTab === 'playoffs' ? 'is-active' : ''}`}
          >
            ⚔️ MATA-MATA (PLAYOFFS)
          </button>

          <button
            onClick={() => setActiveTab('elo_rating')}
            className={`ranking-tab ${activeTab === 'elo_rating' ? 'is-active' : ''}`}
          >
            ⚡ RANKING DE ELO DA GURIZADA (AMISTOSOS 5V5)
          </button>
        </div>

        {/* TAB PLAYOFFS (MATA-MATA) */}
        {activeTab === 'playoffs' && (
          <div style={{ marginTop: '1rem' }}>
            <PlayoffBracket />
          </div>
        )}

        {/* TAB 1: CLASSIFICAÇÃO DO CAMPEONATO */}
        {activeTab === 'championship' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <SeasonSelector />
            </div>
            <h1 className="hero-title" style={{ fontSize: '2rem', textAlign: 'center', textShadow: 'none' }}>
              TABELA DE <span className="text-cyan">CLASSIFICAÇÃO</span>
            </h1>
            <p className="hero-subtitle" style={{ textAlign: 'center', marginBottom: '1.4rem', fontSize: '0.9rem' }}>
              FASE DE GRUPOS - GURIZADA CHAMPIONS
            </p>

            <div className="grid-2">
              {renderGroupTable('A', groupA)}
              {renderGroupTable('B', groupB)}
            </div>

            <h2 className="hero-title" style={{ fontSize: '1.7rem', textAlign: 'center', marginTop: '2rem', marginBottom: '0.35rem', textShadow: 'none' }}>
              RANKING GERAL DE <span className="text-gold">DESEMPENHO</span>
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
              Classificação oficial por <strong style={{ color: 'var(--gold)' }}>K/D</strong> (2 casas decimais). Critério de desempate: melhor <strong style={{ color: 'var(--cyan)' }}>KDA</strong> acumulado e total de kills.
            </p>
            
            <div className="glass-card" style={{ padding: '1.1rem' }}>
              <label className="ranking-search">
                <span aria-hidden="true">⌕</span>
                <span className="sr-only">Buscar jogador</span>
                <input value={playerQuery} onChange={(event) => setPlayerQuery(event.target.value)} placeholder="Buscar jogador ou amigo..." />
              </label>
              <div className="table-responsive">
                <table className="ranking-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px', textAlign: 'center' }}>RANK</th>
                      <th>JOGADOR</th>
                      <th>EQUIPE</th>
                      <th style={{ textAlign: 'center' }}>J</th>
                      <th style={{ textAlign: 'center', color: 'var(--cyan)' }}>KILLS</th>
                      <th style={{ textAlign: 'center', color: 'var(--accent-red)' }}>DEATHS</th>
                      <th style={{ textAlign: 'center' }}>ASSISTS</th>
                      <th style={{ textAlign: 'center', color: 'var(--gold)' }}>K/D</th>
                      <th style={{ textAlign: 'center', color: 'var(--cyan)' }}>KDA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortRanking(
                      [...players].filter((player) =>
                        `${player.name} ${getTeam(player.teamId).name}`.toLowerCase().includes(playerQuery.trim().toLowerCase())
                      )
                    ).map((player, index) => {
                      const team = getTeam(player.teamId);
                      const kd = (player.kills / (player.deaths || 1)).toFixed(2);
                      const kda = ((player.kills + player.assists) / (player.deaths || 1)).toFixed(2);
                      const playerTier = getPlayerTier(player.name);
                      return (
                        <tr key={player.name} className={`rank-${index + 1}`}>
                          <td style={{ textAlign: 'center' }}>
                            <span className="rank-number" style={{
                              fontSize: index < 3 ? '1.4rem' : '1.1rem',
                              color: index === 0 ? '#ffd700' : index === 1 ? '#e2e8f0' : index === 2 ? '#cd7f32' : 'var(--text-muted)',
                              fontWeight: 900,
                              fontFamily: 'var(--font-rajdhani)',
                            }}>
                              {index === 0 ? '🥇 #1' : index === 1 ? '🥈 #2' : index === 2 ? '🥉 #3' : `#${index + 1}`}
                            </span>
                          </td>
                          <td>
                            <Link href={`/jogador/${encodeURIComponent(player.name)}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.85rem' }} className="match-card-hover">
                              <PlayerAvatar teamName={team.name} playerName={player.name} badgeColor="rgba(255,255,255,0.1)" size={38} />
                              <strong style={{ fontSize: '1.05rem', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                                {player.name}
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
                              </strong>
                            </Link>
                          </td>
                          <td>
                            <Link href={`/time/${team.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                              <div className="team-info" style={{ gap: '0.5rem', cursor: 'pointer' }}>
                                <TeamLogo logo={team.logo} name={team.name} initials={team.initials} size={24} borderRadius="4px" />
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{team.name}</span>
                              </div>
                            </Link>
                          </td>
                          <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{player.matches || 1}</td>
                          <td style={{ textAlign: 'center', color: 'var(--cyan)', fontWeight: 'bold', fontSize: '1.15rem' }}>{player.kills}</td>
                          <td style={{ textAlign: 'center', color: 'var(--accent-red)' }}>{player.deaths}</td>
                          <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{player.assists}</td>
                          <td style={{ textAlign: 'center', color: parseFloat(kd) >= 2.0 ? '#ffd700' : parseFloat(kd) >= 1.5 ? 'var(--cyan)' : parseFloat(kd) >= 1.0 ? '#10b981' : 'var(--accent-red)', fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'var(--font-rajdhani)' }}>
                            {kd}
                          </td>
                          <td style={{ textAlign: 'center', color: 'var(--cyan)', fontWeight: 'bold', fontSize: '1.15rem', fontFamily: 'var(--font-rajdhani)' }}>{kda}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p style={{ textAlign: 'center', margin: '1rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                K/D e KDA são acumulados do campeonato (kills e assistências totais ÷ mortes totais), como nos rankings de CS. Não é a média dos ratios de cada mapa. HS, dano e ADR ficam fora do ranking geral enquanto não houver dados completos de todas as partidas.
              </p>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <PlayoffBracket />
            </div>
          </>
        )}

        {/* TAB 2: RANKING DE ELO DA GURIZADA (AMISTOSOS) */}
        {activeTab === 'elo_rating' && (
          <div>
            <h1 className="hero-title" style={{ fontSize: '2rem', textAlign: 'center', textShadow: 'none' }}>
              RANKING DE ELO <span className="text-gold">DA GURIZADA</span>
            </h1>
            <p className="hero-subtitle" style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Pontuação individual acumulada nas partidas amistosas do Lobby. ELO dinâmico: base 1000 +20/vit. -15/der. + bônus K/D, ADR e MVPs de Rodada
            </p>

            {loadingElo ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--cyan)' }}>
                ⏳ Carregando pontuação ELO em tempo real...
              </div>
            ) : Object.keys(eloMap).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Ainda não há pontuações de ELO registradas no Lobby.</p>
                <Link href="/lobby" style={{ display: 'inline-block', marginTop: '1rem', background: 'linear-gradient(135deg, #00f0ff, #0099ff)', color: '#080d1a', padding: '0.8rem 1.6rem', borderRadius: '14px', fontWeight: 800, textDecoration: 'none' }}>
                  🎮 Ir para o Lobby Jogar Amistoso
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.4rem', maxWidth: '1050px', margin: '0 auto' }}>
                {Object.values(eloMap)
                  .sort((a: any, b: any) => b.elo - a.elo)
                  .map((player: any, idx: number) => {
                    const totalMatches = (player.wins || 0) + (player.losses || 0);
                    const winrate = totalMatches > 0 ? ((player.wins / totalMatches) * 100).toFixed(1) : '0.0';
                    const matchedP = players.find(p => p.name.toLowerCase() === player.name.toLowerCase());
                    const team = matchedP ? getTeam(matchedP.teamId) : { name: 'Convidado' };
                    const playerTier = getPlayerTier(player.name);
                    
                    const ratingLevel = player.elo >= 1500 ? 10 : player.elo >= 1350 ? 9 : player.elo >= 1200 ? 8 : player.elo >= 1100 ? 6 : player.elo >= 1000 ? 4 : 2;
                    const badgeColor = player.elo >= 1400 ? '#ffd700' : player.elo >= 1200 ? '#00f0ff' : '#a4b0be';

                    return (
                      <div key={player.name} className="glass-card" style={{ padding: '1.4rem 1.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1.5px solid ${badgeColor}50`, boxShadow: idx === 0 ? '0 0 30px rgba(255,215,0,0.3)' : 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ fontSize: '1.4rem', fontWeight: 900, color: idx === 0 ? '#ffd700' : idx === 1 ? '#c0c0c0' : idx === 2 ? '#cd7f32' : 'var(--text-muted)', width: '32px' }}>
                            #{idx + 1}
                          </span>
                          <Link href={`/jogador/${encodeURIComponent(player.name)}`} style={{ textDecoration: 'none' }}>
                            <PlayerAvatar teamName={team.name} playerName={player.name} badgeColor={badgeColor} size={50} />
                          </Link>
                          <div>
                            <Link href={`/jogador/${encodeURIComponent(player.name)}`} style={{ textDecoration: 'none', color: '#fff' }}>
                              <strong style={{ fontSize: '1.15rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                                {player.name}
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
                              </strong>
                            </Link>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>{player.wins || 0}V - {player.losses || 0}D ({winrate}% WR)</span>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ background: badgeColor, color: '#080d1a', padding: '0.25rem 0.7rem', borderRadius: '8px', fontWeight: 900, fontSize: '0.75rem', display: 'inline-block', marginBottom: '0.3rem' }}>
                            GC RATING LVL {ratingLevel}
                          </span>
                          <strong style={{ fontSize: '1.4rem', color: badgeColor, display: 'block', fontFamily: 'var(--font-rajdhani)' }}>
                            {player.elo} ELO
                          </strong>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

      </section>
    </main>
  );
}
