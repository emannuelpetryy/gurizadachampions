'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ServerPlayerStats {
  steamid?: string;
  name: string;
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
          
          if (data.eloMap) {
            // Buscar por nome exato do slug ou por apelidos mapeados (ex: VVS Perry => manu)
            let foundStats = data.eloMap[cleanSlug] || null;

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
            background: activeTab === 'championship' ? 'linear-gradient(135deg, #00f0ff, #0099ff)' : 'rgba(255,255,255,0.05)',
            color: activeTab === 'championship' ? '#080d1a' : '#fff',
            border: activeTab === 'championship' ? 'none' : '1px solid rgba(255,255,255,0.15)',
            padding: '0.85rem 1.8rem',
            borderRadius: '20px',
            fontWeight: 800,
            fontSize: '0.95rem',
            fontFamily: 'var(--font-rajdhani)',
            cursor: 'pointer',
            boxShadow: activeTab === 'championship' ? '0 0 25px rgba(0,240,255,0.4)' : 'none',
            transition: 'all 0.3s',
          }}
        >
          🏆 ESTATÍSTICAS DO CAMPEONATO
        </button>

        <button
          onClick={() => setActiveTab('server')}
          style={{
            background: activeTab === 'server' ? 'linear-gradient(135deg, #ffd700, #ffaa00)' : 'rgba(255,255,255,0.05)',
            color: activeTab === 'server' ? '#080d1a' : '#fff',
            border: activeTab === 'server' ? 'none' : '1px solid rgba(255,255,255,0.15)',
            padding: '0.85rem 1.8rem',
            borderRadius: '20px',
            fontWeight: 800,
            fontSize: '0.95rem',
            fontFamily: 'var(--font-rajdhani)',
            cursor: 'pointer',
            boxShadow: activeTab === 'server' ? '0 0 25px rgba(255,215,0,0.4)' : 'none',
            transition: 'all 0.3s',
          }}
        >
          ⚡ ESTATÍSTICAS DO SERVIDOR (MIX 5V5)
        </button>
      </div>

      {/* ABA 1: CAMPEONATO OFICIAL */}
      {activeTab === 'championship' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          
          {/* Grid de Estatísticas do Campeonato */}
          <div className="player-stats-grid">
            <div style={{ background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.2)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 'bold' }}>KILLS</span>
              <span style={{ color: 'var(--cyan)', fontSize: '2.5rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 'bold', lineHeight: 1 }}>{champKills}</span>
            </div>
            <div style={{ background: 'rgba(255,51,102,0.1)', border: '1px solid rgba(255,51,102,0.2)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 'bold' }}>DEATHS</span>
              <span style={{ color: 'var(--accent-red)', fontSize: '2.5rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 'bold', lineHeight: 1 }}>{champDeaths}</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 'bold' }}>ASSISTS</span>
              <span style={{ color: '#fff', fontSize: '2.5rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 'bold', lineHeight: 1 }}>{champAssists}</span>
            </div>
            <div style={{ background: badgeColor, border: `1px solid ${badgeColor}`, padding: '1.5rem', borderRadius: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem', boxShadow: `0 0 15px ${badgeColor}40` }}>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 'bold' }}>K/D RATIO</span>
              <span style={{ color: '#fff', fontSize: '2.5rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 'bold', lineHeight: 1 }}>{champKd}</span>
            </div>
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
            <div style={{ background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.2)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 'bold' }}>KILLS (MIX)</span>
              <span style={{ color: 'var(--cyan)', fontSize: '2.5rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 'bold', lineHeight: 1 }}>{sKills}</span>
            </div>
            <div style={{ background: 'rgba(255,51,102,0.1)', border: '1px solid rgba(255,51,102,0.2)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 'bold' }}>DEATHS (MIX)</span>
              <span style={{ color: 'var(--accent-red)', fontSize: '2.5rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 'bold', lineHeight: 1 }}>{sDeaths}</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 'bold' }}>ASSISTS (MIX)</span>
              <span style={{ color: '#fff', fontSize: '2.5rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 'bold', lineHeight: 1 }}>{sAssists}</span>
            </div>
            <div style={{ background: 'rgba(255,215,0,0.15)', border: '1px solid #ffd700', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 'bold' }}>K/D RATIO (MIX)</span>
              <span style={{ color: '#ffd700', fontSize: '2.5rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 'bold', lineHeight: 1 }}>{sKd}</span>
            </div>
          </div>

          {/* Dano & MVPs do Servidor */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', width: '100%', maxWidth: '800px' }}>
            <div style={{ background: 'rgba(171,71,188,0.12)', border: '1px solid rgba(171,71,188,0.3)', padding: '1.2rem', borderRadius: '12px', textAlign: 'center' }}>
              <span style={{ color: '#ab47bc', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>DANO ACUMULADO / ADR</span>
              <strong style={{ display: 'block', color: '#fff', fontSize: '1.8rem', fontFamily: 'var(--font-rajdhani)', margin: '0.3rem 0' }}>
                {sDamage > 0 ? `${sDamage.toLocaleString('pt-BR')} Dmg` : 'Sem dados'}
              </strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ADR Médio: {adr} Dmg/Round</span>
            </div>

            <div style={{ background: 'rgba(255,152,0,0.12)', border: '1px solid rgba(255,152,0,0.3)', padding: '1.2rem', borderRadius: '12px', textAlign: 'center' }}>
              <span style={{ color: '#ff9800', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>MVPS DE ROUND NO SERVIDOR</span>
              <strong style={{ display: 'block', color: '#ffd700', fontSize: '1.8rem', fontFamily: 'var(--font-rajdhani)', margin: '0.3rem 0' }}>
                ⭐ {sMvps} MVPs de Rodada
              </strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estrelas de Melhor Jogador do Round</span>
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
                    <div key={m.id || idx} className="glass-card" style={{ padding: '1.2rem 1.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: `4px solid ${won ? '#00f0ff' : '#ff3366'}`, flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{m.date || 'Partida Amistosa'}</span>
                        <strong style={{ fontSize: '1.1rem', color: '#fff' }}>Mapa: {m.mapName || 'Cache'}</strong>
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <span style={{ background: won ? 'rgba(0,240,255,0.15)' : 'rgba(255,51,102,0.15)', color: won ? '#00f0ff' : '#ff3366', padding: '0.3rem 0.9rem', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem' }}>
                          {won ? `VITÓRIA (+${m.eloGain || 25} ELO)` : `DERROTA (-${m.eloLoss || 15} ELO)`}
                        </span>
                        <div style={{ fontSize: '1.4rem', color: '#fff', fontWeight: 800, fontFamily: 'var(--font-rajdhani)', marginTop: '0.2rem' }}>
                          {m.scoreA} x {m.scoreB}
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
