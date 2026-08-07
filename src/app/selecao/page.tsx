'use client';

import { useState, useEffect } from 'react';
import { players, getTeam } from '../data';
import TeamLogo from '../components/TeamLogo';
import PlayerAvatar from '../jogador/[name]/PlayerAvatar';
import Link from 'next/link';

const ROLES_STAR = [
  { rank: '#1', title: '👑 MVP DA TORCIDA', role: 'TOP 1 ELEITO' },
  { rank: '#2', title: '🌟 DESTAQUE DA LIGA', role: 'TOP 2 ELEITO' },
  { rank: '#3', title: '🌟 DESTAQUE DA LIGA', role: 'TOP 3 ELEITO' },
  { rank: '#4', title: '🌟 DESTAQUE DA LIGA', role: 'TOP 4 ELEITO' },
  { rank: '#5', title: '🌟 DESTAQUE DA LIGA', role: 'TOP 5 ELEITO' },
];

const ROLES_BAGRE = [
  { rank: '#1', title: '🐟 REI DOS BAGRES', role: 'BAGRE #1' },
  { rank: '#2', title: '🎣 SELEÇÃO DOS BAGRES', role: 'BAGRE #2' },
  { rank: '#3', title: '🧱 SELEÇÃO DOS BAGRES', role: 'BAGRE #3' },
  { rank: '#4', title: '⚡ SELEÇÃO DOS BAGRES', role: 'BAGRE #4' },
  { rank: '#5', title: '🎒 SELEÇÃO DOS BAGRES', role: 'BAGRE #5' },
];

function cleanSlug(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function getPlayerBadges(p: typeof players[0]) {
  const badges = [];
  const kd = p.kills / (p.deaths || 1);

  if (kd >= 2.0) badges.push({ icon: '👑', title: 'Lenda do K/D', desc: 'K/D geral de 2.00 ou superior!', color: '#ffd700' });
  else if (kd >= 1.5) badges.push({ icon: '🔥', title: 'Hard Carry', desc: 'K/D geral de 1.50 ou superior!', color: '#00f0ff' });
  else if (kd >= 1.2) badges.push({ icon: '⚡', title: 'Maestro Tático', desc: 'Desempenho consistente de alto nível', color: '#eccc68' });

  if (p.kills >= 30) badges.push({ icon: '🎯', title: 'Monstro do Frag', desc: '30+ Kills acumuladas no torneio', color: '#ffa502' });
  if (p.assists >= 10) badges.push({ icon: '🤝', title: 'Rei da Resenha', desc: '10+ Assistências no torneio', color: '#ab47bc' });
  if (kd <= 0.75) badges.push({ icon: '⚓', title: 'Difícil Carregar', desc: 'K/D geral de 0.75 ou inferior', color: '#ff4757' });

  if (badges.length === 0) badges.push({ icon: '⚔️', title: 'Combatente', desc: 'Titular da Gurizada Champions', color: '#70a1ff' });

  return badges;
}

export default function SelecoesPage() {
  const [votes, setVotes] = useState<Record<string, { star: number; bagre: number }>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stars' | 'bagres' | 'my_team'>('stars');

  const [votedStar, setVotedStar] = useState<Record<string, boolean>>({});
  const [votedBagre, setVotedBagre] = useState<Record<string, boolean>>({});

  const [draftStar, setDraftStar] = useState<Record<string, boolean>>({});
  const [draftBagre, setDraftBagre] = useState<Record<string, boolean>>({});

  const [hoveredBadgePlayer, setHoveredBadgePlayer] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isSubmittingVotes, setIsSubmittingVotes] = useState(false);

  useEffect(() => {
    try {
      const VOTE_VERSION = 'v5'; // Atualizado para zerar votos locais do usuario
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

  const handleResetMyVotes = () => {
    if (confirm('Deseja resetar a sua seleção atual e zerar seus votos locais?')) {
      setVotedStar({});
      setVotedBagre({});
      setDraftStar({});
      setDraftBagre({});
      localStorage.removeItem('gc_voted_star_players');
      localStorage.removeItem('gc_voted_bagre_players');
    }
  };

  const fetchVotes = async () => {
    try {
      const slugs = players.map(p => cleanSlug(p.name)).join(',');
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

  const openModal = () => {
    setDraftStar({ ...votedStar });
    setDraftBagre({ ...votedBagre });
    setIsModalOpen(true);
  };

  const toggleDraftStar = (slug: string) => {
    if (votedStar[slug]) return;
    const currentCount = Object.values(draftStar).filter(Boolean).length;
    if (!draftStar[slug] && currentCount >= 5) {
      alert('⚠️ Limite Atingido: Você só pode escolher no máximo 5 jogadores para o Dream Team!');
      return;
    }
    setDraftStar(prev => ({
      ...prev,
      [slug]: !prev[slug]
    }));
  };

  const toggleDraftBagre = (slug: string) => {
    if (votedBagre[slug]) return;
    const currentCount = Object.values(draftBagre).filter(Boolean).length;
    if (!draftBagre[slug] && currentCount >= 5) {
      alert('⚠️ Limite Atingido: Você só pode escolher no máximo 5 jogadores para o Time dos Bagres!');
      return;
    }
    setDraftBagre(prev => ({
      ...prev,
      [slug]: !prev[slug]
    }));
  };

  // Votação só é enviada ao Banco de Dados APÓS o usuário clicar no botão "Concluir Votação"
  const handleFinalSubmitVotes = async () => {
    const newVotesToSubmit: { playerSlug: string; type: 'star' | 'bagre' }[] = [];

    Object.keys(draftStar).forEach(slug => {
      if (draftStar[slug] && !votedStar[slug]) {
        newVotesToSubmit.push({ playerSlug: slug, type: 'star' });
      }
    });

    Object.keys(draftBagre).forEach(slug => {
      if (draftBagre[slug] && !votedBagre[slug]) {
        newVotesToSubmit.push({ playerSlug: slug, type: 'bagre' });
      }
    });

    if (newVotesToSubmit.length === 0) {
      setIsModalOpen(false);
      return;
    }

    setIsSubmittingVotes(true);

    try {
      const res = await fetch('/api/player-votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ votes: newVotesToSubmit })
      });

      if (res.ok) {
        const updatedStars = { ...votedStar, ...draftStar };
        const updatedBagres = { ...votedBagre, ...draftBagre };

        setVotedStar(updatedStars);
        setVotedBagre(updatedBagres);

        localStorage.setItem('gc_voted_star_players', JSON.stringify(updatedStars));
        localStorage.setItem('gc_voted_bagre_players', JSON.stringify(updatedBagres));

        await fetchVotes();
        setIsModalOpen(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingVotes(false);
    }
  };

  const playersWithVotes = players.map(p => {
    const slug = cleanSlug(p.name);
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

  const myStarPlayers = playersWithVotes.filter(p => votedStar[p.slug]);
  const myBagrePlayers = playersWithVotes.filter(p => votedBagre[p.slug]);

  const filteredPlayers = playersWithVotes.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const totalVotesCount = Object.values(votes).reduce((acc, curr) => acc + curr.star + curr.bagre, 0);

  return (
    <main style={{ paddingTop: '6rem', paddingBottom: '5rem', minHeight: '90vh', background: 'radial-gradient(circle at 50% 10%, rgba(255, 215, 0, 0.08) 0%, rgba(5, 10, 20, 1) 70%)' }}>
      <div className="container">
        
        {/* Banner Hero Grandioso */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.85rem', background: 'rgba(255, 215, 0, 0.15)', color: '#ffd700', border: '1px solid #ffd700', padding: '0.3rem 1.2rem', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 800 }}>
            🎮 FANTASY DRAFT & SELEÇÕES
          </span>

          <h1 className="hero-title" style={{ fontSize: '3.4rem', marginTop: '0.8rem', marginBottom: '0.4rem', lineHeight: 1.1 }}>
            SELEÇÃO DOS <span style={{ color: '#ffd700', textShadow: '0 0 35px rgba(255,215,0,0.6)' }}>SONHOS</span> & <span style={{ color: 'var(--cyan)', textShadow: '0 0 35px rgba(0,240,255,0.6)' }}>BAGRES</span>
          </h1>
          
          <p className="hero-subtitle" style={{ maxWidth: '700px', margin: '0.6rem auto 0 auto', fontSize: '1.05rem', color: '#b0bec5' }}>
            Escalação oficial dos 5 Ace de Ouro e dos 5 Bagres eleitos em tempo real!
            {totalVotesCount > 0 && <span style={{ display: 'block', color: 'var(--cyan)', fontWeight: 'bold', marginTop: '0.4rem' }}>🔥 {totalVotesCount} Votos Computados na Liga</span>}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', marginTop: '1.8rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary"
              style={{ padding: '0.9rem 2.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.8rem', boxShadow: '0 0 30px rgba(0,240,255,0.4)', margin: 0, fontWeight: 800 }}
            >
              <span>🗳️</span> MONTAR E VOTAR NA SUA ESCALAÇÃO
            </button>
          </div>
        </div>

        {/* Selector Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('stars')}
            style={{
              background: activeTab === 'stars' ? 'linear-gradient(135deg, #ffd700, #ffaa00)' : 'rgba(10, 15, 30, 0.8)',
              color: activeTab === 'stars' ? '#080d1a' : '#ffd700',
              border: '2px solid #ffd700',
              padding: '0.9rem 2rem',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '1.05rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: activeTab === 'stars' ? '0 0 30px rgba(255,215,0,0.5)' : 'none',
              transition: 'all 0.3s'
            }}
          >
            <span>🌟</span> DREAM TEAM DA TORCIDA (TOP 5)
          </button>

          <button
            onClick={() => setActiveTab('bagres')}
            style={{
              background: activeTab === 'bagres' ? 'linear-gradient(135deg, #00f0ff, #0099ff)' : 'rgba(10, 15, 30, 0.8)',
              color: activeTab === 'bagres' ? '#080d1a' : 'var(--cyan)',
              border: '2px solid var(--cyan)',
              padding: '0.9rem 2rem',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '1.05rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: activeTab === 'bagres' ? '0 0 30px rgba(0,240,255,0.5)' : 'none',
              transition: 'all 0.3s'
            }}
          >
            <span>🐟</span> TIME DOS BAGRES (TOP 5)
          </button>

          <button
            onClick={() => setActiveTab('my_team')}
            style={{
              background: activeTab === 'my_team' ? 'linear-gradient(135deg, #a55eea, #4b7bec)' : 'rgba(10, 15, 30, 0.8)',
              color: activeTab === 'my_team' ? '#fff' : '#a55eea',
              border: '2px solid #a55eea',
              padding: '0.9rem 2rem',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '1.05rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: activeTab === 'my_team' ? '0 0 30px rgba(165,94,234,0.5)' : 'none',
              transition: 'all 0.3s'
            }}
          >
            <span>📱</span> SEU TIME ELEITO ({myStarPlayers.length + myBagrePlayers.length})
          </button>
        </div>

        {/* --- ABA 1: DREAM TEAM DA TORCIDA (5 CARDS EM 1 LINHA SEM CORTES) --- */}
        {activeTab === 'stars' && (
          <div className="glass-card" style={{ padding: '2.5rem 1.5rem', border: '2px solid rgba(255, 215, 0, 0.4)', background: 'linear-gradient(180deg, rgba(255, 215, 0, 0.1) 0%, rgba(5, 10, 20, 0.9) 100%)', boxShadow: '0 0 50px rgba(255,215,0,0.15)' }}>
            
            {/* SEU DREAM TEAM VOTADO (SE JÁ VOTOU) */}
            {myStarPlayers.length > 0 && (
              <div style={{ marginBottom: '3rem', padding: '1.5rem', background: 'rgba(255, 215, 0, 0.05)', borderRadius: '18px', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.75rem', background: '#ffd700', color: '#080d1a', padding: '0.2rem 0.8rem', borderRadius: '12px', fontWeight: 800, textTransform: 'uppercase' }}>
                    SEU VOTO PESSOAL
                  </span>
                  <h3 style={{ fontSize: '1.6rem', color: '#ffd700', fontFamily: 'var(--font-rajdhani)', fontWeight: 800, margin: '0.4rem 0 0 0' }}>
                    ⭐ SEU DREAM TEAM SELECIONADO ({myStarPlayers.length}/5)
                  </h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {myStarPlayers.map((p) => {
                    const team = getTeam(p.teamId);
                    return (
                      <div key={p.name} style={{ background: 'rgba(0,0,0,0.6)', padding: '1rem', borderRadius: '14px', border: '1px solid #ffd700', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <PlayerAvatar teamName={team.name} playerName={p.name} badgeColor="#ffd700" size={44} />
                        <div>
                          <strong style={{ color: '#fff', fontSize: '1rem', display: 'block' }}>{p.name}</strong>
                          <span style={{ color: '#ffd700', fontSize: '0.75rem', fontWeight: 700 }}>{team.name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '2.2rem', color: '#ffd700', fontFamily: 'var(--font-rajdhani)', fontWeight: 800, margin: 0, letterSpacing: '1px' }}>
                🏆 5 ACE DE OURO DA LIGA (DREAM TEAM DA COMUNIDADE)
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
                Os 5 jogadores mais votados pela comunidade • Passe o mouse nas badges para ver as conquistas
              </p>
            </div>

            {/* GRID RESPONSIVO: DESKTOP 5 COLUNAS / MOBILE SWIPEABLE CAROUSEL */}
            <div className="selecao-cards-grid">
              {topStars.map((player, idx) => {
                const team = getTeam(player.teamId);
                const kd = (player.kills / (player.deaths || 1)).toFixed(2);
                const isUserVoted = votedStar[player.slug];
                const playerBadges = getPlayerBadges(player);
                const roleInfo = ROLES_STAR[idx];
                const isHovered = hoveredBadgePlayer === `star_${player.slug}`;

                return (
                  <div
                    key={player.name}
                    className="selecao-card-item"
                    style={{
                      background: 'linear-gradient(180deg, rgba(20, 25, 45, 0.95) 0%, rgba(8, 12, 24, 0.98) 100%)',
                      border: idx === 0 ? '2px solid #ffd700' : '1px solid rgba(255, 215, 0, 0.4)',
                      borderRadius: '20px',
                      padding: '1.2rem 0.7rem 1.2rem 0.7rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      boxShadow: idx === 0 ? '0 0 35px rgba(255, 215, 0, 0.4)' : '0 10px 25px rgba(0,0,0,0.6)',
                      minWidth: '0',
                      transition: 'all 0.3s'
                    }}
                  >
                    {/* Header Posição e Role INTEGRADO DENTRO DO CARD (Sem cortar no topo!) */}
                    <div style={{ width: '100%', background: idx === 0 ? 'linear-gradient(135deg, #ffd700, #ffaa00)' : 'rgba(255,215,0,0.15)', color: idx === 0 ? '#080d1a' : '#ffd700', border: '1px solid #ffd700', padding: '0.3rem 0.4rem', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 800, fontFamily: 'var(--font-rajdhani)', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {roleInfo.rank} {roleInfo.title}
                    </div>

                    <span style={{ fontSize: '0.62rem', color: '#ffd700', fontWeight: 'bold', letterSpacing: '0.5px', marginTop: '0.5rem', textTransform: 'uppercase', textAlign: 'center', whiteSpace: 'nowrap' }}>
                      {roleInfo.role}
                    </span>

                    <div style={{ marginTop: '0.6rem', marginBottom: '0.6rem' }}>
                      <PlayerAvatar teamName={team.name} playerName={player.name} badgeColor={idx === 0 ? '#ffd700' : 'rgba(255,215,0,0.4)'} size={60} />
                    </div>

                    <Link href={`/jogador/${encodeURIComponent(player.name)}`} style={{ textDecoration: 'none', textAlign: 'center', width: '100%' }}>
                      <strong style={{ fontSize: '1.1rem', color: '#fff', display: 'block', fontFamily: 'var(--font-rajdhani)', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.name}</strong>
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem', background: 'rgba(0,0,0,0.4)', padding: '0.2rem 0.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', width: '100%', justifyContent: 'center' }}>
                      <TeamLogo logo={team.logo} name={team.name} initials={team.initials} size={16} borderRadius="4px" />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>{team.name}</span>
                    </div>

                    <div
                      onMouseEnter={() => setHoveredBadgePlayer(`star_${player.slug}`)}
                      onMouseLeave={() => setHoveredBadgePlayer(null)}
                      style={{ position: 'relative', marginTop: '0.7rem', width: '100%', display: 'flex', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <span style={{ fontSize: '0.68rem', background: 'rgba(255,215,0,0.15)', border: '1px solid #ffd700', color: '#ffd700', padding: '0.2rem 0.6rem', borderRadius: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        🏅 {playerBadges.length} Badge{playerBadges.length > 1 ? 's' : ''}
                      </span>

                      {isHovered && (
                        <div style={{ position: 'absolute', bottom: '120%', left: '50%', transform: 'translateX(-50%)', background: '#0a0f1d', border: '1px solid #ffd700', borderRadius: '12px', padding: '0.9rem', width: '220px', zIndex: 999, boxShadow: '0 0 30px rgba(0,0,0,0.95)', color: '#fff', textAlign: 'left' }}>
                          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', fontWeight: 800, color: '#ffd700', borderBottom: '1px solid rgba(255,215,0,0.2)', paddingBottom: '0.3rem', textTransform: 'uppercase' }}>
                            🎖️ CONQUISTAS DE {player.name}:
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            {playerBadges.map((b, bIdx) => (
                              <div key={bIdx} style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '0.9rem' }}>{b.icon}</span>
                                <div>
                                  <strong style={{ fontSize: '0.72rem', color: b.color, display: 'block' }}>{b.title}</strong>
                                  <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block', lineHeight: 1.2 }}>{b.desc}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ width: '100%', background: 'rgba(0,0,0,0.5)', borderRadius: '10px', padding: '0.5rem 0.2rem', marginTop: '0.7rem', display: 'flex', justifyContent: 'space-around', border: '1px solid rgba(255,215,0,0.15)' }}>
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>K/D RATIO</span>
                        <strong style={{ fontSize: '0.95rem', color: '#ffd700', fontFamily: 'var(--font-rajdhani)', fontWeight: 800 }}>{kd}</strong>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>VOTOS</span>
                        <strong style={{ fontSize: '0.95rem', color: '#fff', fontFamily: 'var(--font-rajdhani)', fontWeight: 800 }}>{player.starVotes}</strong>
                      </div>
                    </div>

                    {isUserVoted ? (
                      <span style={{ marginTop: '0.7rem', width: '100%', textAlign: 'center', fontSize: '0.68rem', background: 'rgba(255,215,0,0.2)', color: '#ffd700', border: '1px solid #ffd700', padding: '0.35rem 0.2rem', borderRadius: '8px', fontWeight: 800 }}>
                        SEU VOTO ✅
                      </span>
                    ) : (
                      <button
                        onClick={openModal}
                        style={{ marginTop: '0.7rem', width: '100%', background: 'linear-gradient(135deg, #ffd700, #ffaa00)', color: '#080d1a', border: 'none', padding: '0.45rem 0.2rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.72rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <span>🌟</span> VOTAR NELE
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- ABA 2: TIME DOS BAGRES (5 CARDS EM 1 LINHA SEM CORTES) --- */}
        {activeTab === 'bagres' && (
          <div className="glass-card" style={{ padding: '2.5rem 1.5rem', border: '2px solid rgba(0, 240, 255, 0.4)', background: 'linear-gradient(180deg, rgba(0, 240, 255, 0.1) 0%, rgba(5, 10, 20, 0.9) 100%)', boxShadow: '0 0 50px rgba(0,240,255,0.15)' }}>
            
            {/* SEU TIME DOS BAGRES VOTADO (SE JÁ VOTOU) */}
            {myBagrePlayers.length > 0 && (
              <div style={{ marginBottom: '3rem', padding: '1.5rem', background: 'rgba(0, 240, 255, 0.05)', borderRadius: '18px', border: '1px solid rgba(0, 240, 255, 0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', background: 'var(--cyan)', color: '#080d1a', padding: '0.2rem 0.8rem', borderRadius: '12px', fontWeight: 800, textTransform: 'uppercase' }}>
                    SEU VOTO PESSOAL
                  </span>
                  <h3 style={{ fontSize: '1.6rem', color: 'var(--cyan)', fontFamily: 'var(--font-rajdhani)', fontWeight: 800, margin: 0 }}>
                    🐟 SUA SELEÇÃO DOS BAGRES ({myBagrePlayers.length}/5)
                  </h3>
                  <button
                    onClick={handleResetMyVotes}
                    style={{ background: 'rgba(255, 71, 87, 0.15)', border: '1px solid #ff4757', color: '#ff4757', padding: '0.35rem 0.9rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <span>🗑️</span> Resetar Meus Votos
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {myBagrePlayers.map((p) => {
                    const team = getTeam(p.teamId);
                    return (
                      <div key={p.name} style={{ background: 'rgba(0,0,0,0.6)', padding: '1rem', borderRadius: '14px', border: '1px solid var(--cyan)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <PlayerAvatar teamName={team.name} playerName={p.name} badgeColor="var(--cyan)" size={44} />
                        <div>
                          <strong style={{ color: '#fff', fontSize: '1rem', display: 'block' }}>{p.name}</strong>
                          <span style={{ color: 'var(--cyan)', fontSize: '0.75rem', fontWeight: 700 }}>{team.name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--cyan)', fontFamily: 'var(--font-rajdhani)', fontWeight: 800, margin: 0, letterSpacing: '1px' }}>
                🐟 TIME DOS BAGRES DO CAMPEONATO (COMUNIDADE)
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
                Os 5 Bagres mais votados da comunidade • Passe o mouse nas badges para ver as conquistas
              </p>
            </div>

            {/* GRID RESPONSIVO: DESKTOP 5 COLUNAS / MOBILE SWIPEABLE CAROUSEL */}
            <div className="selecao-cards-grid">
              {topBagres.map((player, idx) => {
                const team = getTeam(player.teamId);
                const kd = (player.kills / (player.deaths || 1)).toFixed(2);
                const isUserVoted = votedBagre[player.slug];
                const playerBadges = getPlayerBadges(player);
                const roleInfo = ROLES_BAGRE[idx];
                const isHovered = hoveredBadgePlayer === `bagre_${player.slug}`;

                return (
                  <div
                    key={player.name}
                    className="selecao-card-item"
                    style={{
                      background: 'linear-gradient(180deg, rgba(20, 25, 45, 0.95) 0%, rgba(8, 12, 24, 0.98) 100%)',
                      border: idx === 0 ? '2px solid var(--cyan)' : '1px solid rgba(0, 240, 255, 0.4)',
                      borderRadius: '20px',
                      padding: '1.2rem 0.7rem 1.2rem 0.7rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      boxShadow: idx === 0 ? '0 0 35px rgba(0, 240, 255, 0.4)' : '0 10px 25px rgba(0,0,0,0.6)',
                      minWidth: '0',
                      transition: 'all 0.3s'
                    }}
                  >
                    <div style={{ width: '100%', background: idx === 0 ? 'linear-gradient(135deg, #00f0ff, #0099ff)' : 'rgba(0,240,255,0.15)', color: idx === 0 ? '#080d1a' : 'var(--cyan)', border: '1px solid var(--cyan)', padding: '0.3rem 0.4rem', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 800, fontFamily: 'var(--font-rajdhani)', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {roleInfo.rank} {roleInfo.title}
                    </div>

                    <span style={{ fontSize: '0.62rem', color: 'var(--cyan)', fontWeight: 'bold', letterSpacing: '0.5px', marginTop: '0.5rem', textTransform: 'uppercase', textAlign: 'center', whiteSpace: 'nowrap' }}>
                      {roleInfo.role}
                    </span>

                    <div style={{ marginTop: '0.6rem', marginBottom: '0.6rem' }}>
                      <PlayerAvatar teamName={team.name} playerName={player.name} badgeColor={idx === 0 ? 'var(--cyan)' : 'rgba(0,240,255,0.4)'} size={60} />
                    </div>

                    <Link href={`/jogador/${encodeURIComponent(player.name)}`} style={{ textDecoration: 'none', textAlign: 'center', width: '100%' }}>
                      <strong style={{ fontSize: '1.1rem', color: '#fff', display: 'block', fontFamily: 'var(--font-rajdhani)', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.name}</strong>
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem', background: 'rgba(0,0,0,0.4)', padding: '0.2rem 0.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', width: '100%', justifyContent: 'center' }}>
                      <TeamLogo logo={team.logo} name={team.name} initials={team.initials} size={16} borderRadius="4px" />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>{team.name}</span>
                    </div>

                    <div
                      onMouseEnter={() => setHoveredBadgePlayer(`bagre_${player.slug}`)}
                      onMouseLeave={() => setHoveredBadgePlayer(null)}
                      style={{ position: 'relative', marginTop: '0.7rem', width: '100%', display: 'flex', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <span style={{ fontSize: '0.68rem', background: 'rgba(0,240,255,0.15)', border: '1px solid var(--cyan)', color: 'var(--cyan)', padding: '0.2rem 0.6rem', borderRadius: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        🏅 {playerBadges.length} Badge{playerBadges.length > 1 ? 's' : ''}
                      </span>

                      {isHovered && (
                        <div style={{ position: 'absolute', bottom: '120%', left: '50%', transform: 'translateX(-50%)', background: '#0a0f1d', border: '1px solid var(--cyan)', borderRadius: '12px', padding: '0.9rem', width: '220px', zIndex: 999, boxShadow: '0 0 30px rgba(0,0,0,0.95)', color: '#fff', textAlign: 'left' }}>
                          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', fontWeight: 800, color: 'var(--cyan)', borderBottom: '1px solid rgba(0,240,255,0.2)', paddingBottom: '0.3rem', textTransform: 'uppercase' }}>
                            🎖️ CONQUISTAS DE {player.name}:
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            {playerBadges.map((b, bIdx) => (
                              <div key={bIdx} style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '0.9rem' }}>{b.icon}</span>
                                <div>
                                  <strong style={{ fontSize: '0.72rem', color: b.color, display: 'block' }}>{b.title}</strong>
                                  <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block', lineHeight: 1.2 }}>{b.desc}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ width: '100%', background: 'rgba(0,0,0,0.5)', borderRadius: '10px', padding: '0.5rem 0.2rem', marginTop: '0.7rem', display: 'flex', justifyContent: 'space-around', border: '1px solid rgba(0,240,255,0.15)' }}>
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>K/D RATIO</span>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--cyan)', fontFamily: 'var(--font-rajdhani)', fontWeight: 800 }}>{kd}</strong>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>VOTOS</span>
                        <strong style={{ fontSize: '0.95rem', color: '#fff', fontFamily: 'var(--font-rajdhani)', fontWeight: 800 }}>{player.bagreVotes}</strong>
                      </div>
                    </div>

                    {isUserVoted ? (
                      <span style={{ marginTop: '0.7rem', width: '100%', textAlign: 'center', fontSize: '0.68rem', background: 'rgba(0,240,255,0.2)', color: 'var(--cyan)', border: '1px solid var(--cyan)', padding: '0.35rem 0.2rem', borderRadius: '8px', fontWeight: 800 }}>
                        SEU VOTO 🐟
                      </span>
                    ) : (
                      <button
                        onClick={openModal}
                        style={{ marginTop: '0.7rem', width: '100%', background: 'linear-gradient(135deg, #00f0ff, #0099ff)', color: '#080d1a', border: 'none', padding: '0.45rem 0.2rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.72rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <span>🐟</span> VOTAR BAGRE
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- ABA 3: SEU TIME PERSONALIZADO DO DISPOSITIVO --- */}
        {activeTab === 'my_team' && (
          <div className="glass-card" style={{ padding: '2.5rem', border: '2px solid rgba(165, 94, 234, 0.4)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '2.2rem', color: '#a55eea', fontFamily: 'var(--font-rajdhani)', fontWeight: 800, margin: 0 }}>
                📱 O SEU TIME ESCALADO NESTE DISPOSITIVO
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
                Jogadores em que você votou como Melhores ou Bagres no seu aparelho
              </p>
            </div>

            {myStarPlayers.length === 0 && myBagrePlayers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Você ainda não votou em nenhum jogador neste dispositivo!</p>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{ marginTop: '1rem' }}>
                  🗳️ Começar Votação
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {myStarPlayers.length > 0 && (
                  <div>
                    <h3 style={{ color: '#ffd700', fontSize: '1.3rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 800, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      🌟 SEUS VOTOS PARA O DREAM TEAM ({myStarPlayers.length})
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
                      {myStarPlayers.map(p => {
                        const team = getTeam(p.teamId);
                        const playerBadges = getPlayerBadges(p);
                        return (
                          <div key={p.name} style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem 1.2rem', borderRadius: '16px', border: '1px solid #ffd700', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <PlayerAvatar teamName={team.name} playerName={p.name} badgeColor="rgba(255,215,0,0.2)" size={48} />
                            <div>
                              <strong style={{ color: '#fff', fontSize: '1.1rem' }}>{p.name}</strong>
                              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: '0.1rem 0 0 0' }}>{team.name} • 🏅 {playerBadges.length} Badges</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {myBagrePlayers.length > 0 && (
                  <div>
                    <h3 style={{ color: 'var(--cyan)', fontSize: '1.3rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 800, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      🐟 SEUS VOTOS PARA O TIME DOS BAGRES ({myBagrePlayers.length})
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
                      {myBagrePlayers.map(p => {
                        const team = getTeam(p.teamId);
                        const playerBadges = getPlayerBadges(p);
                        return (
                          <div key={p.name} style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem 1.2rem', borderRadius: '16px', border: '1px solid var(--cyan)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <PlayerAvatar teamName={team.name} playerName={p.name} badgeColor="rgba(0,240,255,0.2)" size={48} />
                            <div>
                              <strong style={{ color: '#fff', fontSize: '1.1rem' }}>{p.name}</strong>
                              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: '0.1rem 0 0 0' }}>{team.name} • 🏅 {playerBadges.length} Badges</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* MODAL DE VOTAÇÃO DA PÁGINA */}
        {isModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
            <div style={{ background: '#0a0f1d', border: '1px solid rgba(0,240,255,0.3)', borderRadius: '20px', width: '100%', maxWidth: '850px', maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 0 50px rgba(0,240,255,0.2)' }}>
              
              {/* Header do Modal */}
              <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.4)' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span>🗳️</span> MONTE A SUA ESCALAÇÃO DE 5 JOGADORES
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--cyan)', margin: '0.2rem 0 0 0', fontWeight: 600 }}>
                    Monte a sua linha de 5 titulares do Dream Team ou dos Bagres em tempo real!
                  </p>
                </div>

                <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.8rem', cursor: 'pointer', padding: '0.5rem' }}>
                  ✕
                </button>
              </div>

              {/* Banner de Aviso de Critério de Votação (Por Tier) */}
              <div style={{ padding: '0.8rem 1.2rem', background: 'rgba(255, 215, 0, 0.08)', borderBottom: '1px solid rgba(255, 215, 0, 0.2)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <span style={{ fontSize: '1.3rem' }}>💡</span>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#e2e8f0', lineHeight: 1.35 }}>
                  <strong style={{ color: '#ffd700' }}>Critério do Campeonato:</strong> Não escolha apenas por habilidade geral bruta! Escolha quem mais se <strong style={{ color: 'var(--cyan)' }}>DESTACA E SUPERA EXPECTATIVAS</strong> dentro dos seus respectivos <strong style={{ color: '#ffd700' }}>TIERS (S, A, B, C e D)</strong>!
                </p>
              </div>

              {/* PAINEL VISUAL DA ESCALAÇÃO DE 5 CARDS (AO VIVO) */}
              <div style={{ background: 'rgba(5, 10, 20, 0.95)', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ffd700', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>⚔️</span> SEU LINE-UP EM CONSTRUÇÃO ({Object.values(draftStar).filter(Boolean).length}/5)
                  </span>
                  {Object.values(draftStar).filter(Boolean).length > 0 && (
                    <button
                      onClick={() => setDraftStar({})}
                      style={{ background: 'rgba(255, 71, 87, 0.15)', border: '1px solid #ff4757', color: '#ff4757', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Limpar Escalação
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.6rem' }}>
                  {ROLES_STAR.map((role, idx) => {
                    const selectedSlug = Object.keys(draftStar).filter(s => draftStar[s])[idx];
                    const playerObj = selectedSlug ? playersWithVotes.find(p => p.slug === selectedSlug) : null;
                    const teamObj = playerObj ? getTeam(playerObj.teamId) : null;

                    return (
                      <div
                        key={idx}
                        style={{
                          background: playerObj ? 'linear-gradient(180deg, rgba(255, 215, 0, 0.15) 0%, rgba(10, 15, 30, 0.9) 100%)' : 'rgba(255, 255, 255, 0.02)',
                          border: playerObj ? '1.5px solid #ffd700' : '1px dashed rgba(255, 255, 255, 0.2)',
                          borderRadius: '12px',
                          padding: '0.5rem 0.3rem',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          position: 'relative',
                          minHeight: '100px',
                          justifyContent: 'center',
                          boxShadow: playerObj ? '0 0 15px rgba(255, 215, 0, 0.2)' : 'none',
                          transition: 'all 0.3s'
                        }}
                      >
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: playerObj ? '#ffd700' : '#64748b', textTransform: 'uppercase', marginBottom: '0.2rem', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                          JOGADOR #{idx + 1}
                        </span>

                        {playerObj && teamObj ? (
                          <>
                            <button
                              onClick={() => toggleDraftStar(playerObj.slug)}
                              title="Remover da escalação"
                              style={{ position: 'absolute', top: '3px', right: '3px', background: 'rgba(255,71,87,0.8)', border: 'none', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', fontSize: '0.6rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              ✕
                            </button>
                            <PlayerAvatar teamName={teamObj.name} playerName={playerObj.name} badgeColor="#ffd700" size={32} />
                            <strong style={{ fontSize: '0.75rem', color: '#fff', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '75px', textAlign: 'center' }}>
                              {playerObj.name}
                            </strong>
                            <span style={{ fontSize: '0.58rem', color: 'var(--cyan)', fontWeight: 700 }}>{teamObj.initials}</span>
                          </>
                        ) : (
                          <div style={{ textAlign: 'center', padding: '0.2rem' }}>
                            <span style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.2)', display: 'block' }}>+</span>
                            <span style={{ fontSize: '0.62rem', color: '#475569', fontWeight: 600 }}>Vago</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Barra de Busca */}
              <div style={{ padding: '0.8rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                <input
                  type="text"
                  placeholder="🔍 Buscar jogador por nome..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', padding: '0.6rem 1rem', borderRadius: '8px', color: '#fff', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ padding: '1.2rem 1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1 }} className="custom-scrollbar">
                {filteredPlayers.map((player) => {
                  const team = getTeam(player.teamId);
                  const isStarSelected = draftStar[player.slug];
                  const isBagreSelected = draftBagre[player.slug];
                  const isStarAlreadyVoted = votedStar[player.slug];
                  const isBagreAlreadyVoted = votedBagre[player.slug];

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

                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
                        {/* Botão Star */}
                        <button
                          disabled={isStarAlreadyVoted}
                          onClick={() => toggleDraftStar(player.slug)}
                          style={{
                            background: isStarAlreadyVoted ? 'rgba(255, 215, 0, 0.15)' : isStarSelected ? 'linear-gradient(135deg, #ffd700, #ffaa00)' : 'rgba(255, 215, 0, 0.1)',
                            color: isStarAlreadyVoted ? '#ffd700' : isStarSelected ? '#080d1a' : '#ffd700',
                            border: isStarAlreadyVoted ? '1px solid #ffd700' : isStarSelected ? 'none' : '1px solid rgba(255, 215, 0, 0.3)',
                            padding: '0.5rem 0.8rem',
                            borderRadius: '8px',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            cursor: isStarAlreadyVoted ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            boxShadow: isStarSelected ? '0 0 15px rgba(255,215,0,0.4)' : 'none',
                            transition: 'all 0.2s'
                          }}
                        >
                          <span>🌟</span>
                          <span>{isStarAlreadyVoted ? 'VOTADO ✅' : isStarSelected ? 'SELECIONADO ✨' : '+ MELHOR'}</span>
                        </button>

                        {/* Botão Bagre */}
                        <button
                          disabled={isBagreAlreadyVoted}
                          onClick={() => toggleDraftBagre(player.slug)}
                          style={{
                            background: isBagreAlreadyVoted ? 'rgba(0, 240, 255, 0.15)' : isBagreSelected ? 'linear-gradient(135deg, #00f0ff, #0099ff)' : 'rgba(0, 240, 255, 0.1)',
                            color: isBagreAlreadyVoted ? 'var(--cyan)' : isBagreSelected ? '#080d1a' : 'var(--cyan)',
                            border: isBagreAlreadyVoted ? '1px solid var(--cyan)' : isBagreSelected ? 'none' : '1px solid rgba(0, 240, 255, 0.3)',
                            padding: '0.5rem 0.8rem',
                            borderRadius: '8px',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            cursor: isBagreAlreadyVoted ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            boxShadow: isBagreSelected ? '0 0 15px rgba(0,240,255,0.4)' : 'none',
                            transition: 'all 0.2s'
                          }}
                        >
                          <span>🐟</span>
                          <span>{isBagreAlreadyVoted ? 'VOTADO ✅' : isBagreSelected ? 'SELECIONADO ✨' : '+ BAGRE'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ padding: '1rem 1.5rem', background: 'rgba(0,0,0,0.4)', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Total Selecionado: <strong style={{ color: '#ffd700' }}>{Object.values(draftStar).filter(Boolean).length} Melhores</strong> • <strong style={{ color: 'var(--cyan)' }}>{Object.values(draftBagre).filter(Boolean).length} Bagres</strong>
                </span>

                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <button
                    onClick={handleFinalSubmitVotes}
                    disabled={isSubmittingVotes}
                    style={{
                      padding: '0.7rem 1.8rem',
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #00f0ff, #0099ff)',
                      color: '#080d1a',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      boxShadow: '0 0 25px rgba(0,240,255,0.4)',
                      transition: 'all 0.3s'
                    }}
                  >
                    {isSubmittingVotes ? '🚀 ENVIANDO VOTOS...' : '🚀 CONCLUIR E ENVIAR VOTAÇÃO'}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </main>
  );
}
