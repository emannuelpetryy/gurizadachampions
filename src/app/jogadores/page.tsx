'use client';

import { useState, useMemo } from 'react';
import { tiers, players as globalPlayers, getTeam } from '../data';
import Link from 'next/link';
import PlayerAvatar from '../jogador/[name]/PlayerAvatar';
import TeamLogo from '../components/TeamLogo';

export default function Jogadores() {
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const tierKeys = Object.keys(tiers) as Array<keyof typeof tiers>;

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return tierKeys.map(tier => {
      if (selectedTier !== 'ALL' && selectedTier !== tier) return null;

      const list = tiers[tier].filter(player => {
        if (!query) return true;
        const fullPlayer = globalPlayers.find(p => p.name.toLowerCase() === player.name.toLowerCase());
        const teamName = fullPlayer ? getTeam(fullPlayer.teamId).name.toLowerCase() : '';
        return player.name.toLowerCase().includes(query) || teamName.includes(query);
      });

      if (list.length === 0) return null;

      return {
        tier,
        players: list,
      };
    }).filter(Boolean) as Array<{ tier: keyof typeof tiers; players: typeof tiers[keyof typeof tiers] }>;
  }, [selectedTier, searchQuery, tierKeys]);

  const totalFilteredPlayers = filteredData.reduce((sum, g) => sum + g.players.length, 0);

  return (
    <main style={{ padding: '1.5rem 0', minHeight: '100vh' }}>
      <section className="container">
        
        {/* Header da Página */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span className="section-eyebrow">ROSTER COMPLETO DA LIGA</span>
          <h1 className="hero-title" style={{ fontSize: '2rem', margin: '0.2rem 0 0', textShadow: 'none' }}>
            TIERS DOS <span className="text-cyan">JOGADORES</span>
          </h1>
          <p className="hero-subtitle" style={{ marginTop: '0.35rem', marginBottom: '1.2rem', fontSize: '0.9rem' }}>
            Classificação oficial baseada no nível GamersClub / Gurizada Rating
          </p>

          {/* Filtros e Busca */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem', maxWidth: '720px', margin: '0 auto' }}>
            
            {/* Input de Busca */}
            <label className="ranking-search" style={{ width: '100%', maxWidth: '520px', margin: '0 auto' }}>
              <span aria-hidden="true" style={{ fontSize: '1.1rem' }}>⌕</span>
              <span className="sr-only">Buscar jogador ou equipe</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar jogador ou time..."
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.9rem', padding: '0 0.4rem' }}
                >
                  ✕
                </button>
              )}
            </label>

            {/* Chips de Tier */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setSelectedTier('ALL')}
                style={{
                  padding: '0.45rem 1.1rem',
                  borderRadius: '999px',
                  fontFamily: 'var(--font-rajdhani)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  border: selectedTier === 'ALL' ? '1px solid var(--cyan)' : '1px solid rgba(255,255,255,0.12)',
                  background: selectedTier === 'ALL' ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255,255,255,0.04)',
                  color: selectedTier === 'ALL' ? 'var(--cyan)' : '#cbd5e1',
                  boxShadow: selectedTier === 'ALL' ? '0 0 15px rgba(0, 240, 255, 0.25)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                TODOS OS TIERS
              </button>
              {tierKeys.map(tier => {
                const isActive = selectedTier === tier;
                const tierColor = tier === 'S' ? '#ffd700' : tier === 'A' ? '#00f0ff' : tier === 'B' ? '#10b981' : '#94a3b8';

                return (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setSelectedTier(tier)}
                    style={{
                      padding: '0.45rem 1.1rem',
                      borderRadius: '999px',
                      fontFamily: 'var(--font-rajdhani)',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      border: isActive ? `1px solid ${tierColor}` : '1px solid rgba(255,255,255,0.12)',
                      background: isActive ? `${tierColor}22` : 'rgba(255,255,255,0.04)',
                      color: isActive ? tierColor : '#cbd5e1',
                      boxShadow: isActive ? `0 0 15px ${tierColor}40` : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    TIER {tier}
                  </button>
                );
              })}
            </div>

            <span style={{ fontSize: '0.78rem', color: '#8fa0bc', letterSpacing: '0.5px' }}>
              Mostrando <strong>{totalFilteredPlayers}</strong> jogadores
            </span>
          </div>
        </div>

        {/* Grupos de Tiers */}
        {filteredData.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: 0 }}>Nenhum jogador encontrado com os filtros atuais.</p>
            <button
              type="button"
              onClick={() => { setSelectedTier('ALL'); setSearchQuery(''); }}
              style={{ marginTop: '1rem', background: 'rgba(0, 240, 255, 0.15)', border: '1px solid var(--cyan)', color: 'var(--cyan)', padding: '0.6rem 1.4rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 800 }}
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {filteredData.map(({ tier, players }) => {
              const tierColor = tier === 'S' ? '#ffd700' : tier === 'A' ? '#00f0ff' : tier === 'B' ? '#10b981' : '#94a3b8';

              return (
                <div key={tier} className="glass-card" style={{ padding: '2rem 1.8rem', borderTop: `3px solid ${tierColor}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <span className={`tier-badge tier-${tier}`} style={{ fontSize: '1rem', padding: '0.35rem 1rem' }}>
                        TIER {tier}
                      </span>
                      <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 700 }}>
                        {players.length} {players.length === 1 ? 'JOGADOR' : 'JOGADORES'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid-3">
                    {players.map((player) => {
                      const fullPlayer = globalPlayers.find(p => p.name.toLowerCase() === player.name.toLowerCase());
                      const team = fullPlayer ? getTeam(fullPlayer.teamId) : null;
                      
                      return (
                        <div key={player.name} className="player-card" style={{ transition: 'all 0.22s ease' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0, flex: 1 }}>
                            <PlayerAvatar teamName={team?.name || ''} playerName={player.name} badgeColor={tierColor} size={42} />
                            <div style={{ minWidth: 0 }}>
                              <p style={{ fontWeight: 800, color: '#fff', fontSize: '1.05rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                <Link href={`/jogador/${encodeURIComponent(player.name)}`} style={{ textDecoration: 'none', color: 'inherit' }} className="match-card-hover">
                                  {player.name}
                                </Link>
                                {(player as any).swap && (
                                  <span style={{ fontSize: '0.62rem', color: '#10b981', border: '1px solid #10b981', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: 800 }}>
                                    🔄 Trocado
                                  </span>
                                )}
                              </p>
                              {team && (
                                <Link href={`/time/${team.id}`} style={{ textDecoration: 'none', color: '#94a3b8', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.15rem' }}>
                                  <TeamLogo logo={team.logo} name={team.name} initials={team.initials} size={16} borderRadius="3px" />
                                  <span>{team.name}</span>
                                </Link>
                              )}
                            </div>
                          </div>
                          
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <span style={{ color: tierColor, fontWeight: 900, fontSize: '1.15rem', fontFamily: 'var(--font-rajdhani)', display: 'block' }}>
                              LVL {player.lvl}
                            </span>
                            <span style={{ fontSize: '0.65rem', color: '#8fa0bc', fontWeight: 700, textTransform: 'uppercase' }}>
                              GamersClub
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
