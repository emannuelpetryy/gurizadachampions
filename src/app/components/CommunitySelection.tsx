'use client';

import { useState, useEffect } from 'react';
import { players, getTeam } from '../data';
import TeamLogo from './TeamLogo';
import PlayerAvatar from '../jogador/[name]/PlayerAvatar';
import Link from 'next/link';

export default function CommunitySelection() {
  const [votes, setVotes] = useState<Record<string, { star: number; bagre: number }>>({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');

  const [votedStar, setVotedStar] = useState<Record<string, boolean>>({});
  const [votedBagre, setVotedBagre] = useState<Record<string, boolean>>({});
  const [submittingSlug, setSubmittingSlug] = useState<string | null>(null);

  // Carregar votos no localStorage (por dispositivo)
  useEffect(() => {
    try {
      const VOTE_VERSION = 'v3';
      const storedVersion = localStorage.getItem('gc_vote_version');

      if (storedVersion !== VOTE_VERSION) {
        localStorage.removeItem('gc_voted_star_players');
        localStorage.removeItem('gc_voted_bagre_players');
        localStorage.setItem('gc_vote_version', VOTE_VERSION);
      } else {
        const starStorage = localStorage.getItem('gc_voted_star_players');
        if (starStorage) setVotedStar(JSON.parse(starStorage));

        const bagreStorage = localStorage.getItem('gc_voted_bagre_players');
        if (bagreStorage) setVotedBagre(JSON.parse(bagreStorage));
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  // Carregar dados de votos da API
  const fetchVotes = async () => {
    try {
      const slugs = players.map(p => p.name.toLowerCase().replace(/[^a-z0-9]/g, '_')).join(',');
      const res = await fetch(`/api/player-votes?players=${encodeURIComponent(slugs)}`);
      if (res.ok) {
        const data = await res.json();
        setVotes(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  // Função para votar num jogador
  const handleVote = async (playerName: string, type: 'star' | 'bagre') => {
    const slug = playerName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    // Verificar se já votou nesse jogador e categoria
    if (type === 'star' && votedStar[slug]) return;
    if (type === 'bagre' && votedBagre[slug]) return;

    setSubmittingSlug(`${type}_${slug}`);

    try {
      const res = await fetch('/api/player-votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerSlug: slug, type })
      });

      if (res.ok) {
        const data = await res.json();
        setVotes(prev => ({
          ...prev,
          [slug]: {
            ...prev[slug],
            [type]: data.count
          }
        }));

        if (type === 'star') {
          const updated = { ...votedStar, [slug]: true };
          setVotedStar(updated);
          localStorage.setItem('gc_voted_star_players', JSON.stringify(updated));
        } else {
          const updated = { ...votedBagre, [slug]: true };
          setVotedBagre(updated);
          localStorage.setItem('gc_voted_bagre_players', JSON.stringify(updated));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingSlug(null);
    }
  };

  // Processar Top 5 Melhores (Dream Team) e Top 5 Bagres
  const playersWithVotes = players.map(p => {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const playerVotes = votes[slug] || { star: 0, bagre: 0 };
    return {
      ...p,
      slug,
      starVotes: playerVotes.star,
      bagreVotes: playerVotes.bagre
    };
  });

  const topStars = [...playersWithVotes]
    .sort((a, b) => b.starVotes - a.starVotes || (b.kills / (b.deaths || 1)) - (a.kills / (a.deaths || 1)))
    .slice(0, 5);

  const topBagres = [...playersWithVotes]
    .sort((a, b) => b.bagreVotes - a.bagreVotes || (a.kills / (a.deaths || 1)) - (b.kills / (b.deaths || 1)))
    .slice(0, 5);

  const filteredPlayers = playersWithVotes.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesTeam = selectedTeam === 'all' || p.teamId === selectedTeam;
    return matchesSearch && matchesTeam;
  });

  return (
    <div style={{ marginTop: '3rem', gridColumn: '1 / -1' }}>
      {/* Header do Widget */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.8rem', margin: 0 }}>
            <span style={{ fontSize: '2.2rem' }}>🗳️</span> SELEÇÕES DA TORCIDA
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
            Votação pública global em tempo real (1 voto por dispositivo)
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
          style={{ padding: '0.8rem 1.8rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', boxShadow: '0 0 20px rgba(0,240,255,0.4)', margin: 0 }}
        >
          <span>🗳️</span> VOTAR NOS SEUS FAVS E BAGRES
        </button>
      </div>

      {/* Grid das Seleções: Dream Team vs Bagre Team */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        
        {/* CARD 1: DREAM TEAM DA TORCIDA 🌟 */}
        <div className="glass-card" style={{ border: '1px solid rgba(255, 215, 0, 0.3)', background: 'linear-gradient(180deg, rgba(255, 215, 0, 0.05) 0%, rgba(5, 10, 20, 0.6) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid rgba(255,215,0,0.15)', paddingBottom: '0.8rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 800, color: '#ffd700', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🌟 DREAM TEAM DA TORCIDA
            </h3>
            <span style={{ fontSize: '0.75rem', background: 'rgba(255,215,0,0.15)', color: '#ffd700', border: '1px solid #ffd700', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 'bold' }}>
              TOP 5 MELHORES
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {topStars.map((player, idx) => {
              const team = getTeam(player.teamId);
              const kd = (player.kills / (player.deaths || 1)).toFixed(2);
              return (
                <div key={player.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.4)', padding: '0.75rem 1rem', borderRadius: '10px', borderLeft: idx === 0 ? '4px solid #ffd700' : idx === 1 ? '4px solid #c0c0c0' : idx === 2 ? '4px solid #cd7f32' : '4px solid rgba(255,215,0,0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '1.2rem', fontWeight: 800, color: idx === 0 ? '#ffd700' : idx === 1 ? '#c0c0c0' : idx === 2 ? '#cd7f32' : '#888', minWidth: '28px' }}>
                      #{idx + 1}
                    </span>
                    <TeamLogo logo={team.logo} name={team.name} initials={team.initials} size={28} borderRadius="4px" />
                    <PlayerAvatar teamName={team.name} playerName={player.name} badgeColor="rgba(255,215,0,0.1)" size={32} />
                    <div>
                      <Link href={`/jogador/${encodeURIComponent(player.name)}`} style={{ textDecoration: 'none' }} className="match-card-hover">
                        <strong style={{ fontSize: '0.95rem', color: '#fff' }}>{player.name}</strong>
                      </Link>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>{team.name} • K/D {kd}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,215,0,0.15)', border: '1px solid #ffd700', padding: '0.3rem 0.8rem', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.9rem' }}>🌟</span>
                    <span style={{ fontWeight: 800, color: '#ffd700', fontFamily: 'var(--font-rajdhani)', fontSize: '1.1rem' }}>
                      {player.starVotes} <span style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Votos</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CARD 2: TIME DOS BAGRES DA TORCIDA 🐟 */}
        <div className="glass-card" style={{ border: '1px solid rgba(0, 240, 255, 0.3)', background: 'linear-gradient(180deg, rgba(0, 240, 255, 0.05) 0%, rgba(5, 10, 20, 0.6) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid rgba(0,240,255,0.15)', paddingBottom: '0.8rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 800, color: 'var(--cyan)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🐟 TIME DOS BAGRES
            </h3>
            <span style={{ fontSize: '0.75rem', background: 'rgba(0,240,255,0.15)', color: 'var(--cyan)', border: '1px solid var(--cyan)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 'bold' }}>
              TOP 5 BAGRES DA TORCIDA
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {topBagres.map((player, idx) => {
              const team = getTeam(player.teamId);
              const kd = (player.kills / (player.deaths || 1)).toFixed(2);
              return (
                <div key={player.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.4)', padding: '0.75rem 1rem', borderRadius: '10px', borderLeft: idx === 0 ? '4px solid #00f0ff' : idx === 1 ? '4px solid #00d2d3' : idx === 2 ? '4px solid #54a0ff' : '4px solid rgba(0,240,255,0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--cyan)', minWidth: '28px' }}>
                      #{idx + 1}
                    </span>
                    <TeamLogo logo={team.logo} name={team.name} initials={team.initials} size={28} borderRadius="4px" />
                    <PlayerAvatar teamName={team.name} playerName={player.name} badgeColor="rgba(0,240,255,0.1)" size={32} />
                    <div>
                      <Link href={`/jogador/${encodeURIComponent(player.name)}`} style={{ textDecoration: 'none' }} className="match-card-hover">
                        <strong style={{ fontSize: '0.95rem', color: '#fff' }}>{player.name}</strong>
                      </Link>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>{team.name} • K/D {kd}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,240,255,0.15)', border: '1px solid var(--cyan)', padding: '0.3rem 0.8rem', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.9rem' }}>🐟</span>
                    <span style={{ fontWeight: 800, color: 'var(--cyan)', fontFamily: 'var(--font-rajdhani)', fontSize: '1.1rem' }}>
                      {player.bagreVotes} <span style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Votos</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* MODAL DE VOTAÇÃO COMPLETO */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
          <div style={{ background: '#0a0f1d', border: '1px solid rgba(0,240,255,0.3)', borderRadius: '20px', width: '100%', maxWidth: '750px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 0 50px rgba(0,240,255,0.2)' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.4)' }}>
              <div>
                <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 800, color: '#fff', margin: 0 }}>
                  🗳️ VOTAÇÃO DA TORCIDA
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                  Vote nos seus favoritos para o Dream Team e nos Bagres do Campeonato! (1 voto por jogador por dispositivo)
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.8rem', cursor: 'pointer', padding: '0.5rem' }}
              >
                ✕
              </button>
            </div>

            {/* Buscador & Filtros */}
            <div style={{ padding: '1rem 1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
              <input
                type="text"
                placeholder="🔍 Buscar jogador por nome..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ flex: 1, minWidth: '220px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', padding: '0.6rem 1rem', borderRadius: '8px', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>

            {/* Lista de Jogadores para Votação */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1 }} className="custom-scrollbar">
              {filteredPlayers.map((player) => {
                const team = getTeam(player.teamId);
                const isStarVoted = votedStar[player.slug];
                const isBagreVoted = votedBagre[player.slug];
                const isStarLoading = submittingSlug === `star_${player.slug}`;
                const isBagreLoading = submittingSlug === `bagre_${player.slug}`;

                return (
                  <div key={player.name} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', minWidth: 0 }}>
                      <TeamLogo logo={team.logo} name={team.name} initials={team.initials} size={36} borderRadius="6px" />
                      <PlayerAvatar teamName={team.name} playerName={player.name} badgeColor="rgba(255,255,255,0.1)" size={38} />
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <strong style={{ fontSize: '1rem', color: '#fff', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{player.name}</strong>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{team.name} • {player.kills}K / {player.deaths}D</p>
                      </div>
                    </div>

                    {/* Botões de Votação */}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
                      {/* Votar Star */}
                      <button
                        disabled={isStarVoted || isStarLoading}
                        onClick={() => handleVote(player.name, 'star')}
                        style={{
                          background: isStarVoted ? 'rgba(255, 215, 0, 0.15)' : 'linear-gradient(135deg, #ffd700, #ffaa00)',
                          color: isStarVoted ? '#ffd700' : '#080d1a',
                          border: isStarVoted ? '1px solid #ffd700' : 'none',
                          padding: '0.5rem 0.9rem',
                          borderRadius: '8px',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          cursor: isStarVoted ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          transition: 'all 0.2s',
                          opacity: isStarLoading ? 0.6 : 1
                        }}
                      >
                        <span>🌟</span>
                        <span>{isStarVoted ? 'MELHOR ✅' : 'VOTAR MELHOR'} ({player.starVotes})</span>
                      </button>

                      {/* Votar Bagre */}
                      <button
                        disabled={isBagreVoted || isBagreLoading}
                        onClick={() => handleVote(player.name, 'bagre')}
                        style={{
                          background: isBagreVoted ? 'rgba(0, 240, 255, 0.15)' : 'linear-gradient(135deg, #00f0ff, #0099ff)',
                          color: isBagreVoted ? 'var(--cyan)' : '#080d1a',
                          border: isBagreVoted ? '1px solid var(--cyan)' : 'none',
                          padding: '0.5rem 0.9rem',
                          borderRadius: '8px',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          cursor: isBagreVoted ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          transition: 'all 0.2s',
                          opacity: isBagreLoading ? 0.6 : 1
                        }}
                      >
                        <span>🐟</span>
                        <span>{isBagreVoted ? 'BAGRE ✅' : 'VOTAR BAGRE'} ({player.bagreVotes})</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '1rem 1.5rem', background: 'rgba(0,0,0,0.4)', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'right' }}>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn-secondary"
                style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem', margin: 0 }}
              >
                Concluir Votação
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
