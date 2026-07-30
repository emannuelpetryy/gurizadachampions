'use client';

import { useState, useEffect } from 'react';
import { groupA, groupB, getTeam, players } from '../data';
import Link from 'next/link';
import PlayerAvatar from '../jogador/[name]/PlayerAvatar';
import TeamLogo from '../components/TeamLogo';

export default function Ranking() {
  const [activeTab, setActiveTab] = useState<'championship' | 'faceit'>('championship');
  const [eloMap, setEloMap] = useState<Record<string, any>>({});
  const [loadingElo, setLoadingElo] = useState(true);

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
      <h3 className="card-title" style={{ textAlign: 'center', justifyContent: 'center' }}>GRUPO {groupName}</h3>
      <div className="table-responsive">
        <table className="ranking-table">
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
              return (
                <tr key={team.id} className={`rank-${index + 1}`}>
                  <td style={{ textAlign: 'center' }}>
                    <span className="rank-number" style={{ fontSize: index < 2 ? '1.5rem' : '1.2rem', color: index < 2 ? 'var(--cyan)' : '#fff', textShadow: index < 2 ? '0 0 10px rgba(0,240,255,0.5)' : 'none' }}>
                      {index + 1}
                    </span>
                  </td>
                  <td>
                    <Link href={`/time/${team.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="team-info" style={{ cursor: 'pointer' }}>
                        <TeamLogo logo={team.logo} name={team.name} initials={team.initials} size={40} borderRadius="8px" />
                        <strong style={{ fontSize: '1.1rem' }}>{team.name}</strong>
                      </div>
                    </Link>
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>{row.p}</td>
                  <td style={{ textAlign: 'center' }}>{row.pj}</td>
                  <td style={{ textAlign: 'center', color: '#00F0FF' }}>{row.v}</td>
                  <td style={{ textAlign: 'center', color: '#ff3366' }}>{row.d}</td>
                  <td style={{ textAlign: 'center', color: row.rd > 0 ? '#2ed573' : row.rd < 0 ? '#ff4757' : 'var(--text-muted)', fontWeight: 'bold' }}>
                    {row.rd > 0 ? `+${row.rd}` : row.rd}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>* Top 2 classificam para as semifinais | RD = Saldo de Rounds</p>
    </div>
  );

  return (
    <main style={{ padding: '4rem 0', minHeight: '100vh' }}>
      <section className="container">
        
        {/* SELETOR DE MENU SUSPENSO / TABS DE RANKING */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('championship')}
            style={{
              background: activeTab === 'championship' ? 'linear-gradient(135deg, #00f0ff, #0099ff)' : 'rgba(255,255,255,0.05)',
              color: activeTab === 'championship' ? '#080d1a' : '#fff',
              border: activeTab === 'championship' ? 'none' : '1px solid rgba(255,255,255,0.15)',
              padding: '0.9rem 2rem',
              borderRadius: '20px',
              fontWeight: 800,
              fontSize: '1rem',
              fontFamily: 'var(--font-rajdhani)',
              cursor: 'pointer',
              boxShadow: activeTab === 'championship' ? '0 0 25px rgba(0,240,255,0.4)' : 'none',
              transition: 'all 0.3s',
            }}
          >
            🏆 RANKING DO CAMPEONATO
          </button>

          <button
            onClick={() => setActiveTab('faceit')}
            style={{
              background: activeTab === 'faceit' ? 'linear-gradient(135deg, #ffd700, #ffaa00)' : 'rgba(255,255,255,0.05)',
              color: activeTab === 'faceit' ? '#080d1a' : '#fff',
              border: activeTab === 'faceit' ? 'none' : '1px solid rgba(255,255,255,0.15)',
              padding: '0.9rem 2rem',
              borderRadius: '20px',
              fontWeight: 800,
              fontSize: '1rem',
              fontFamily: 'var(--font-rajdhani)',
              cursor: 'pointer',
              boxShadow: activeTab === 'faceit' ? '0 0 25px rgba(255,215,0,0.4)' : 'none',
              transition: 'all 0.3s',
            }}
          >
            ⚡ RANKING ELO FACEIT (AMISTOSOS 5V5)
          </button>
        </div>

        {/* TAB 1: CLASSIFICAÇÃO DO CAMPEONATO */}
        {activeTab === 'championship' && (
          <>
            <h1 className="hero-title" style={{ fontSize: '3.2rem', textAlign: 'center', textShadow: 'none' }}>
              TABELA DE <span className="text-cyan">CLASSIFICAÇÃO</span>
            </h1>
            <p className="hero-subtitle" style={{ textAlign: 'center', marginBottom: '3rem' }}>
              FASE DE GRUPOS - GURIZADA CHAMPIONS
            </p>

            <div className="grid-2">
              {renderGroupTable('A', groupA)}
              {renderGroupTable('B', groupB)}
            </div>

            <h2 className="hero-title" style={{ fontSize: '2.5rem', textAlign: 'center', marginTop: '4rem', marginBottom: '2rem', textShadow: 'none' }}>
              RANKING GERAL DE <span className="text-gold">DESEMPENHO</span>
            </h2>
            
            <div className="glass-card" style={{ padding: '1.5rem' }}>
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
                    {[...players].sort((a, b) => (b.kills / (b.deaths || 1)) - (a.kills / (a.deaths || 1))).map((player, index) => {
                      const team = getTeam(player.teamId);
                      const kd = (player.kills / (player.deaths || 1)).toFixed(2);
                      const kda = ((player.kills + player.assists) / (player.deaths || 1)).toFixed(2);
                      return (
                        <tr key={player.name} className={`rank-${index + 1}`}>
                          <td style={{ textAlign: 'center' }}><span className="rank-number" style={{ fontSize: index < 3 ? '1.5rem' : '1.2rem' }}>#{index + 1}</span></td>
                          <td>
                            <Link href={`/jogador/${encodeURIComponent(player.name)}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem' }} className="match-card-hover">
                              <PlayerAvatar teamName={team.name} playerName={player.name} badgeColor="rgba(255,255,255,0.1)" size={40} />
                              <strong style={{ fontSize: '1.1rem', color: '#fff' }}>{player.name}</strong>
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
                          <td style={{ textAlign: 'center', color: 'var(--cyan)', fontWeight: 'bold', fontSize: '1.2rem' }}>{player.kills}</td>
                          <td style={{ textAlign: 'center', color: 'var(--accent-red)' }}>{player.deaths}</td>
                          <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{player.assists}</td>
                          <td style={{ textAlign: 'center', color: 'var(--gold)', fontWeight: 'bold', fontSize: '1.2rem' }}>{kd}</td>
                          <td style={{ textAlign: 'center', color: 'var(--cyan)', fontWeight: 'bold', fontSize: '1.2rem' }}>{kda}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: RANKING ELO FACEIT AMISTOSOS */}
        {activeTab === 'faceit' && (
          <div>
            <h1 className="hero-title" style={{ fontSize: '3.2rem', textAlign: 'center', textShadow: 'none' }}>
              RANKING ELO <span className="text-gold">FACEIT (5V5)</span>
            </h1>
            <p className="hero-subtitle" style={{ textAlign: 'center', marginBottom: '3rem' }}>
              Pontuação individual acumulada nas partidas amistosas do Lobby (+25 ELO vitória / -15 ELO derrota)
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
                    
                    const faceitLevel = player.elo >= 1500 ? 10 : player.elo >= 1350 ? 9 : player.elo >= 1200 ? 8 : player.elo >= 1100 ? 6 : player.elo >= 1000 ? 4 : 2;
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
                              <strong style={{ fontSize: '1.15rem', display: 'block' }}>{player.name}</strong>
                            </Link>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{player.wins || 0}V - {player.losses || 0}D ({winrate}% WR)</span>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ background: badgeColor, color: '#080d1a', padding: '0.25rem 0.7rem', borderRadius: '8px', fontWeight: 900, fontSize: '0.75rem', display: 'inline-block', marginBottom: '0.3rem' }}>
                            FACEIT LVL {faceitLevel}
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
