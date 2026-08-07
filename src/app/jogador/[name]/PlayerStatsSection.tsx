'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ServerPlayerStats {
  steamid?: string;
  name: string;
  serverName?: string;
  rating?: number;
  elo?: number;
  matches?: number;
  wins?: number;
  losses?: number;
  kills?: number;
  deaths?: number;
  assists?: number;
  damage?: number;
  mvps?: number;
}

export default function PlayerStatsSection({
  playerName,
  champKills,
  champDeaths,
  champAssists,
  champKd,
  champAvgHs,
  champDamageTotal,
  champAdr,
  badgeColor,
  badgesComponent,
  chartComponent,
  historyComponent,
}: {
  playerName: string;
  champKills: number;
  champDeaths: number;
  champAssists: number;
  champKd: string;
  champAvgHs?: number;
  champDamageTotal?: number;
  champAdr?: number;
  badgeColor: string;
  badgesComponent: React.ReactNode;
  chartComponent: React.ReactNode;
  historyComponent: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<'championship' | 'server'>('championship');
  const [serverStats, setServerStats] = useState<ServerPlayerStats | null>(null);
  const [lobbyMatches, setLobbyMatches] = useState<any[]>([]);
  const [loadingServer, setLoadingServer] = useState(true);

  useEffect(() => {
    async function fetchServerStats() {
      try {
        const res = await fetch('/api/lobby', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const cleanSlug = playerName.toLowerCase().replace(/[^a-z0-9]/g, '');
          
          let foundStats = null;
          
          if (data.eloMap) {
            // Buscar por nome exato do slug ou por apelidos mapeados (ex: VVS Perry => manu)
            foundStats = data.eloMap[cleanSlug] || null;

            if (!foundStats) {
              // Tentar encontrar por apelido alternativo contido na chave ou nome
              const possibleKeys = Object.keys(data.eloMap).filter(k => {
                const p = data.eloMap[k];
                const pName = p.name?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
                const pServer = p.serverName?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
                return k.includes(cleanSlug) || cleanSlug.includes(k) || pName.includes(cleanSlug) || pServer.includes(cleanSlug);
              });
              if (possibleKeys.length > 0) {
                foundStats = data.eloMap[possibleKeys[0]];
              }
            }

            if (foundStats) {
              setServerStats(foundStats);
            }
          }

          if (Array.isArray(data.matchHistory)) {
            // Filtrar partidas do lobby onde o jogador participou (por nick do campeonato ou do servidor)
            const pMatches = data.matchHistory.filter((m: any) => {
              const inA = m.teamA?.some((tp: any) => {
                const tName = tp.player_name?.toLowerCase() || '';
                return tName.includes(playerName.toLowerCase()) || 
                       playerName.toLowerCase().includes(tName) || 
                       (foundStats?.serverName && tName.includes(foundStats.serverName.toLowerCase()));
              });
              const inB = m.teamB?.some((tp: any) => {
                const tName = tp.player_name?.toLowerCase() || '';
                return tName.includes(playerName.toLowerCase()) || 
                       playerName.toLowerCase().includes(tName) ||
                       (foundStats?.serverName && tName.includes(foundStats.serverName.toLowerCase()));
              });
              return inA || inB;
            });
            setLobbyMatches(pMatches);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingServer(false);
      }
    }
    fetchServerStats();
  }, [playerName]);

  const rating = serverStats?.rating || serverStats?.elo || 1000;
  const sWins = serverStats?.wins || 0;
  const sLosses = serverStats?.losses || 0;
  const sMatches = serverStats?.matches || (sWins + sLosses);
  const sWinrate = sMatches > 0 ? ((sWins / sMatches) * 100).toFixed(1) : '0.0';
  const sKills = serverStats?.kills || 0;
  const sDeaths = serverStats?.deaths || 0;
  const sAssists = serverStats?.assists || 0;
  const sKd = (sKills / (sDeaths || 1)).toFixed(2);
  const sDamage = serverStats?.damage || 0;
  const sMvps = serverStats?.mvps || 0;
  const adr = sMatches > 0 ? (sDamage / (sMatches * 20)).toFixed(1) : '0.0';

  const gcRatingLevel = rating >= 1500 ? 10 : rating >= 1350 ? 9 : rating >= 1200 ? 8 : rating >= 1100 ? 6 : rating >= 1000 ? 4 : 2;

  return (
    <div style={{ width: '100%' }}>
      {/* SELETOR DE ABA (CAMPEONATO vs SERVIDOR / MIX) */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('championship')}
          style={{
            background: activeTab === 'championship'
              ? 'linear-gradient(135deg, #00f0ff 0%, #0099ff 100%)'
              : 'rgba(255,255,255,0.06)',
            color: activeTab === 'championship' ? '#030712' : '#e2e8f0',
            border: activeTab === 'championship' ? 'none' : '1px solid rgba(255,255,255,0.2)',
            padding: '0.9rem 2rem',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '1rem',
            fontFamily: 'var(--font-rajdhani)',
            letterSpacing: '0.5px',
            cursor: 'pointer',
            boxShadow: activeTab === 'championship' ? '0 0 30px rgba(0,240,255,0.5)' : '0 2px 8px rgba(0,0,0,0.3)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            backdropFilter: 'blur(8px)',
          }}
        >
          🏆 CAMPEONATO
        </button>

        <button
          onClick={() => setActiveTab('server')}
          style={{
            background: activeTab === 'server'
              ? 'linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)'
              : 'rgba(255,255,255,0.06)',
            color: activeTab === 'server' ? '#030712' : '#e2e8f0',
            border: activeTab === 'server' ? 'none' : '1px solid rgba(255,255,255,0.2)',
            padding: '0.9rem 2rem',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '1rem',
            fontFamily: 'var(--font-rajdhani)',
            letterSpacing: '0.5px',
            cursor: 'pointer',
            boxShadow: activeTab === 'server' ? '0 0 30px rgba(255,215,0,0.5)' : '0 2px 8px rgba(0,0,0,0.3)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            backdropFilter: 'blur(8px)',
          }}
        >
          ⚡ MIX 5V5
        </button>
      </div>

      {/* ABA 1: CAMPEONATO OFICIAL */}
      {activeTab === 'championship' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          
          {/* Grid de Estatísticas do Campeonato */}
          <div className="player-stats-grid">
            <div style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(0,240,255,0.05))', border: '1px solid rgba(0,240,255,0.35)', padding: '1.6rem', borderRadius: '14px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.4rem', boxShadow: '0 4px 20px rgba(0,240,255,0.12)' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>KILLS</span>
              <span style={{ color: 'var(--cyan)', fontSize: '2.8rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 900, lineHeight: 1, textShadow: '0 0 20px rgba(0,240,255,0.5)' }}>{champKills}</span>
            </div>
            <div style={{ background: 'linear-gradient(135deg, rgba(255,51,102,0.15), rgba(255,51,102,0.05))', border: '1px solid rgba(255,51,102,0.35)', padding: '1.6rem', borderRadius: '14px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.4rem', boxShadow: '0 4px 20px rgba(255,51,102,0.12)' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>DEATHS</span>
              <span style={{ color: '#ff3366', fontSize: '2.8rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 900, lineHeight: 1, textShadow: '0 0 20px rgba(255,51,102,0.5)' }}>{champDeaths}</span>
            </div>
            <div style={{ background: 'linear-gradient(135deg, rgba(100,116,139,0.15), rgba(100,116,139,0.05))', border: '1px solid rgba(100,116,139,0.4)', padding: '1.6rem', borderRadius: '14px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>ASSISTS</span>
              <span style={{ color: '#e2e8f0', fontSize: '2.8rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 900, lineHeight: 1 }}>{champAssists}</span>
            </div>
            <div style={{ background: `linear-gradient(135deg, ${badgeColor}22, ${badgeColor}08)`, border: `1px solid ${badgeColor}88`, padding: '1.6rem', borderRadius: '14px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.4rem', boxShadow: `0 4px 20px ${badgeColor}30` }}>
              <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>K/D RATIO</span>
              <span style={{ color: badgeColor, fontSize: '2.8rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 900, lineHeight: 1, textShadow: `0 0 20px ${badgeColor}80` }}>{champKd}</span>
            </div>
            {champAvgHs !== undefined && champAvgHs > 0 && (
              <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))', border: '1px solid rgba(16,185,129,0.35)', padding: '1.6rem', borderRadius: '14px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.4rem', boxShadow: '0 4px 20px rgba(16,185,129,0.12)' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>% HS MÉDIA</span>
                <span style={{ color: '#10b981', fontSize: '2.8rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 900, lineHeight: 1, textShadow: '0 0 20px rgba(16,185,129,0.5)' }}>{champAvgHs}%</span>
              </div>
            )}
            {champDamageTotal !== undefined && champDamageTotal > 0 && (
              <div style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))', border: '1px solid rgba(245,158,11,0.35)', padding: '1.6rem', borderRadius: '14px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.4rem', boxShadow: '0 4px 20px rgba(245,158,11,0.12)' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>DANO TOTAL</span>
                <span style={{ color: '#f59e0b', fontSize: '2.8rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 900, lineHeight: 1, textShadow: '0 0 20px rgba(245,158,11,0.5)' }}>
                  {champDamageTotal.toLocaleString('pt-BR')}
                </span>
              </div>
            )}
            {champAdr !== undefined && champAdr > 0 && (
              <div style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(236,72,153,0.05))', border: '1px solid rgba(236,72,153,0.35)', padding: '1.6rem', borderRadius: '14px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.4rem', boxShadow: '0 4px 20px rgba(236,72,153,0.12)' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>ADR (DANO/ROUND)</span>
                <span style={{ color: '#ec4899', fontSize: '2.8rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 900, lineHeight: 1, textShadow: '0 0 20px rgba(236,72,153,0.5)' }}>
                  {champAdr.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Badges e Gráfico */}
          {badgesComponent}
          {chartComponent}

          {/* Histórico do Campeonato */}
          <div style={{ width: '100%', marginTop: '2rem' }}>
            {historyComponent}
          </div>
        </div>
      )}

      {/* ABA 2: MIX / LOBBY DO SERVIDOR */}
      {activeTab === 'server' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          
          {/* Header de Resumo do Servidor */}
          <div className="glass-card" style={{ padding: '2rem', width: '100%', maxWidth: '800px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', border: '1.5px solid rgba(255,215,0,0.3)' }}>
            <div>
              <span style={{ background: '#ffd700', color: '#080d1a', padding: '0.3rem 0.8rem', borderRadius: '8px', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.5px' }}>
                GC RATING LVL {gcRatingLevel}
              </span>
              <h3 style={{ fontSize: '2.4rem', color: '#ffd700', fontFamily: 'var(--font-rajdhani)', fontWeight: 800, margin: '0.4rem 0 0 0', lineHeight: 1 }}>
                {rating} ELO
              </h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {sWins} Vitórias • {sLosses} Derrotas ({sWinrate}% Taxa de Vitória)
              </span>
            </div>

            {serverStats?.steamid && (
              <a
                href={`https://steamcommunity.com/profiles/${serverStats.steamid}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                🎮 Perfil Steam ({serverStats.steamid.substring(0, 10)}...)
              </a>
            )}
          </div>

          {/* Grid de Estatísticas Acumuladas no Servidor */}
          <div className="player-stats-grid">
            <div style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(0,240,255,0.05))', border: '1px solid rgba(0,240,255,0.35)', padding: '1.6rem', borderRadius: '14px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.4rem', boxShadow: '0 4px 20px rgba(0,240,255,0.12)' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>KILLS (MIX)</span>
              <span style={{ color: 'var(--cyan)', fontSize: '2.8rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 900, lineHeight: 1, textShadow: '0 0 20px rgba(0,240,255,0.5)' }}>{sKills}</span>
            </div>
            <div style={{ background: 'linear-gradient(135deg, rgba(255,51,102,0.15), rgba(255,51,102,0.05))', border: '1px solid rgba(255,51,102,0.35)', padding: '1.6rem', borderRadius: '14px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.4rem', boxShadow: '0 4px 20px rgba(255,51,102,0.12)' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>DEATHS (MIX)</span>
              <span style={{ color: '#ff3366', fontSize: '2.8rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 900, lineHeight: 1, textShadow: '0 0 20px rgba(255,51,102,0.5)' }}>{sDeaths}</span>
            </div>
            <div style={{ background: 'linear-gradient(135deg, rgba(100,116,139,0.15), rgba(100,116,139,0.05))', border: '1px solid rgba(100,116,139,0.4)', padding: '1.6rem', borderRadius: '14px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>ASSISTS (MIX)</span>
              <span style={{ color: '#e2e8f0', fontSize: '2.8rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 900, lineHeight: 1 }}>{sAssists}</span>
            </div>
            <div style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.18), rgba(255,215,0,0.05))', border: '1px solid rgba(255,215,0,0.5)', padding: '1.6rem', borderRadius: '14px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.4rem', boxShadow: '0 4px 20px rgba(255,215,0,0.15)' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>K/D RATIO (MIX)</span>
              <span style={{ color: '#ffd700', fontSize: '2.8rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 900, lineHeight: 1, textShadow: '0 0 20px rgba(255,215,0,0.6)' }}>{sKd}</span>
            </div>
          </div>

          {/* Dano & MVPs do Servidor */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem', width: '100%', maxWidth: '800px' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.18), rgba(168,85,247,0.05))', border: '1px solid rgba(168,85,247,0.4)', padding: '1.4rem', borderRadius: '14px', textAlign: 'center', boxShadow: '0 4px 20px rgba(168,85,247,0.12)' }}>
              <span style={{ color: '#c084fc', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px' }}>DANO ACUMULADO / ADR</span>
              <strong style={{ display: 'block', color: '#f8fafc', fontSize: '2rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 900, margin: '0.4rem 0', lineHeight: 1 }}>
                {sDamage > 0 ? `${sDamage.toLocaleString('pt-BR')} Dmg` : 'Sem dados'}
              </strong>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ADR Médio: {adr} Dmg/Round</span>
            </div>

            <div style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.18), rgba(251,191,36,0.05))', border: '1px solid rgba(251,191,36,0.4)', padding: '1.4rem', borderRadius: '14px', textAlign: 'center', boxShadow: '0 4px 20px rgba(251,191,36,0.12)' }}>
              <span style={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px' }}>MVPS DE ROUND NO SERVIDOR</span>
              <strong style={{ display: 'block', color: '#ffd700', fontSize: '2rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 900, margin: '0.4rem 0', lineHeight: 1 }}>
                ⭐ {sMvps} MVPs de Rodada
              </strong>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Estrelas de Melhor Jogador do Round</span>
            </div>
          </div>

          {/* Histórico de Amistosos / Lobby */}
          <div style={{ width: '100%', maxWidth: '900px', marginTop: '1.5rem' }}>
            <h2 className="hero-title" style={{ fontSize: '1.8rem', marginBottom: '1.2rem', textShadow: 'none', textAlign: 'left' }}>
              AMISTOSOS RECENTES NO LOBBY
            </h2>

            {loadingServer ? (
              <p style={{ color: 'var(--cyan)', textAlign: 'center' }}>⏳ Carregando histórico do servidor...</p>
            ) : lobbyMatches.length === 0 ? (
              <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Nenhuma partida de mix no lobby registrada para este jogador ainda.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {lobbyMatches.map((m: any, idx: number) => {
                  const inA = m.teamA?.some((tp: any) => {
                    const tName = tp.player_name?.toLowerCase() || '';
                    return tName.includes(playerName.toLowerCase()) || 
                           playerName.toLowerCase().includes(tName) ||
                           (serverStats?.serverName && tName.includes(serverStats.serverName.toLowerCase()));
                  });
                  const won = inA ? m.scoreA > m.scoreB : m.scoreB > m.scoreA;

                  return (
                    <div key={m.id || idx} style={{ background: won ? 'linear-gradient(135deg, rgba(0,240,255,0.08), rgba(0,0,0,0.3))' : 'linear-gradient(135deg, rgba(255,51,102,0.08), rgba(0,0,0,0.3))', border: `1px solid ${won ? 'rgba(0,240,255,0.3)' : 'rgba(255,51,102,0.3)'}`, borderLeft: `4px solid ${won ? '#00f0ff' : '#ff3366'}`, borderRadius: '14px', padding: '1.4rem 1.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', transition: 'all 0.25s ease', boxShadow: won ? '0 4px 20px rgba(0,240,255,0.08)' : '0 4px 20px rgba(255,51,102,0.08)' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem', letterSpacing: '0.5px' }}>{m.date || 'Partida Amistosa'}</span>
                        <strong style={{ fontSize: '1.15rem', color: '#f8fafc', fontFamily: 'var(--font-rajdhani)', letterSpacing: '0.5px' }}>🗺️ {m.mapName || 'Cache'}</strong>
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <span style={{ background: won ? 'rgba(0,240,255,0.18)' : 'rgba(255,51,102,0.18)', color: won ? '#00f0ff' : '#ff3366', padding: '0.4rem 1.1rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.9rem', display: 'inline-block', border: `1px solid ${won ? 'rgba(0,240,255,0.4)' : 'rgba(255,51,102,0.4)'}` }}>
                          {won ? `✅ VITÓRIA (+${m.eloGain || 25} ELO)` : `❌ DERROTA (-${m.eloLoss || 15} ELO)`}
                        </span>
                        <div style={{ fontSize: '1.6rem', color: '#f8fafc', fontWeight: 900, fontFamily: 'var(--font-rajdhani)', marginTop: '0.3rem', letterSpacing: '2px' }}>
                          {m.scoreA} <span style={{ color: '#64748b', fontSize: '1rem' }}>×</span> {m.scoreB}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
