'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { getPlayerTier, getTeam, players, tiers } from '../data';
import PlayerAvatar from '../jogador/[name]/PlayerAvatar';
import DuelPrediction from './DuelPrediction';
import TeamLogo from './TeamLogo';

type ShowdownPlayer = (typeof players)[number];

const teamAId = 'venvanse';
const teamBId = 'desacreditados';

const kdOf = (player: ShowdownPlayer) => player.kills / (player.deaths || 1);
const kdaOf = (player: ShowdownPlayer) => (player.kills + player.assists) / (player.deaths || 1);

const formatKd = (player: ShowdownPlayer) => kdOf(player).toFixed(2);
const formatKda = (player: ShowdownPlayer) => kdaOf(player).toFixed(2);

const getPlayerLevel = (name: string) =>
  Object.values(tiers).flat().find((entry) => entry.name.trim().toLowerCase() === name.trim().toLowerCase())?.lvl;

function PlayerDuel({ playerA, playerB, index }: { playerA?: ShowdownPlayer; playerB?: ShowdownPlayer; index: number }) {
  if (!playerA && !playerB) return null;

  const kdA = playerA ? kdOf(playerA) : 0;
  const kdB = playerB ? kdOf(playerB) : 0;
  const winner = kdA === kdB ? null : kdA > kdB ? 'a' : 'b';
  const kdDifference = Math.abs(kdA - kdB);
  const comparisonLabel = !playerA || !playerB
    ? 'Sem comparação'
    : kdDifference < 0.01
      ? 'K/D igual'
      : `${winner === 'a' ? playerA.name : playerB.name} +${kdDifference.toFixed(2)}`;

  const renderPlayer = (player: ShowdownPlayer | undefined, side: 'a' | 'b') => {
    if (!player) {
      return <span className="final-player-empty">Sem jogador</span>;
    }

    const team = getTeam(player.teamId);
    const isLeading = winner === side;

    return (
      <div className="final-player-card-content">
        <PlayerAvatar teamName={team.name} playerName={player.name} badgeColor={side === 'a' ? 'rgba(0,240,255,0.2)' : 'rgba(255,51,102,0.2)'} size={38} />
        <div className="final-player-copy">
          <div className="final-player-name">
            <strong>{player.name}</strong>
            {getPlayerTier(player.name) && (
              <span className={`final-tier tier-${getPlayerTier(player.name)}`}>
                TIER {getPlayerTier(player.name)}
              </span>
            )}
            {getPlayerLevel(player.name) && <span className="final-level">LVL {getPlayerLevel(player.name)}</span>}
          </div>
          <span className={`final-player-stats ${isLeading ? `is-leading-${side}` : ''}`}>
            K/D {formatKd(player)} · KDA {formatKda(player)}
          </span>
        </div>
      </div>
    );
  };

  const playerCard = (player: ShowdownPlayer | undefined, side: 'a' | 'b') => {
    const content = renderPlayer(player, side);
    const className = `final-player-card final-player-card-${side} ${winner === side ? 'is-leading' : ''}`;
    return player ? (
      <Link href={`/jogador/${encodeURIComponent(player.name)}`} className={className} aria-label={`Ver perfil de ${player.name}`}>{content}</Link>
    ) : <div className={className}>{content}</div>;
  };

  return (
    <div className={`final-duel ${index === 0 ? 'is-first' : ''}`}>
      {playerCard(playerA, 'a')}
      <div className="final-kd-comparison">
        <span className="final-kd-score">{playerA && playerB ? `${formatKd(playerA)} × ${formatKd(playerB)}` : '—'}</span>
        <span className="final-kd-label">K/D</span>
        <span className="final-kd-difference">{comparisonLabel}</span>
      </div>
      {playerCard(playerB, 'b')}
      {playerA && playerB && (
        <DuelPrediction
          duelId={`final-${playerA.name}-${playerB.name}`}
          playerAName={playerA.name}
          playerBName={playerB.name}
        />
      )}
    </div>
  );
}

export default function GrandFinalShowdown() {
  const teamA = getTeam(teamAId);
  const teamB = getTeam(teamBId);

  const rosterA = useMemo(() => players.filter(player => player.teamId === teamAId).sort((a, b) => kdOf(b) - kdOf(a)), []);
  const rosterB = useMemo(() => players.filter(player => player.teamId === teamBId).sort((a, b) => kdOf(b) - kdOf(a)), []);
  const duels = Array.from({ length: Math.max(rosterA.length, rosterB.length) }, (_, index) => ({ playerA: rosterA[index], playerB: rosterB[index] }));

  const averageKd = (roster: ShowdownPlayer[]) => roster.length ? (roster.reduce((sum, player) => sum + kdOf(player), 0) / roster.length).toFixed(2) : '0.00';
  const totalKills = (roster: ShowdownPlayer[]) => roster.reduce((sum, player) => sum + player.kills, 0);

  // Estado de votação de time para a Grande Final
  const [teamVotes, setTeamVotes] = useState({ venvanse: 0, desacreditados: 0, a: 0, b: 0 });
  const [userTeamVote, setUserTeamVote] = useState<'venvanse' | 'desacreditados' | null>(null);
  const [submittingTeam, setSubmittingTeam] = useState(false);
  const [loadedTeamVotes, setLoadedTeamVotes] = useState(false);

  useEffect(() => {
    // 1. Carregar escolha salva do usuário
    const saved = localStorage.getItem('gc_pred_user_final');
    let normalizedSaved: 'venvanse' | 'desacreditados' | null = null;
    if (saved === 'venvanse' || saved === 'a') normalizedSaved = 'venvanse';
    else if (saved === 'desacreditados' || saved === 'b') normalizedSaved = 'desacreditados';

    if (normalizedSaved) {
      setUserTeamVote(normalizedSaved);
    }

    // 2. Carregar votos do servidor Supabase
    fetch('/api/votes?matchId=final')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data && typeof data.a === 'number' && typeof data.b === 'number') {
          const vVotes = typeof data.venvanse === 'number' ? data.venvanse : data.a;
          const dVotes = typeof data.desacreditados === 'number' ? data.desacreditados : data.b;
          setTeamVotes({ venvanse: vVotes, desacreditados: dVotes, a: vVotes, b: dVotes });

          // Se o banco estiver zerado mas o usuário tinha votado antes no cache, sincronizar com Supabase
          if (vVotes === 0 && dVotes === 0 && normalizedSaved) {
            fetch('/api/votes', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ matchId: 'final', teamId: normalizedSaved }),
            })
              .then((r) => r.ok ? r.json() : null)
              .then((updated) => {
                if (updated && typeof updated.a === 'number' && typeof updated.b === 'number') {
                  const uv = typeof updated.venvanse === 'number' ? updated.venvanse : updated.a;
                  const ud = typeof updated.desacreditados === 'number' ? updated.desacreditados : updated.b;
                  setTeamVotes({ venvanse: uv, desacreditados: ud, a: uv, b: ud });
                }
              })
              .catch(() => {});
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoadedTeamVotes(true));
  }, []);

  const handleVoteTeam = async (targetTeamId: 'venvanse' | 'desacreditados') => {
    if (submittingTeam || userTeamVote === targetTeamId) return;

    setSubmittingTeam(true);
    const prevVote = userTeamVote;

    // Atualização otimista local
    setUserTeamVote(targetTeamId);
    setTeamVotes((prev) => {
      const copy = { ...prev };
      if (prevVote) {
        copy[prevVote] = Math.max(0, copy[prevVote] - 1);
      }
      copy[targetTeamId] = copy[targetTeamId] + 1;
      copy.a = copy.venvanse;
      copy.b = copy.desacreditados;
      return copy;
    });

    localStorage.setItem('gc_pred_user_final', targetTeamId);

    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: 'final',
          teamId: targetTeamId,
          previousTeam: prevVote,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.a === 'number' && typeof data.b === 'number') {
          const vVotes = typeof data.venvanse === 'number' ? data.venvanse : data.a;
          const dVotes = typeof data.desacreditados === 'number' ? data.desacreditados : data.b;
          setTeamVotes({ venvanse: vVotes, desacreditados: dVotes, a: vVotes, b: dVotes });
        }
      }
    } catch (e) {
      console.error('Erro ao enviar voto de time:', e);
    } finally {
      setSubmittingTeam(false);
    }
  };

  const totalTeamVotes = teamVotes.venvanse + teamVotes.desacreditados;
  const pctVenvanse = totalTeamVotes > 0 ? Math.round((teamVotes.venvanse / totalTeamVotes) * 100) : 50;
  const pctDesacreditados = 100 - pctVenvanse;

  return (
    <section className="grand-final">
      <header className="grand-final-header">
        <span className="grand-final-stage">👑 GRANDE FINAL · MD3</span>
        <h2 className="grand-final-title">
          VENVANSE <span className="final-vs-badge">VS</span> OS DESACREDITADOS
        </h2>
        <p>A final está definida. Clique no seu time para votar no campeão e confira os confrontos 1v1 abaixo.</p>
      </header>

      {/* Cards Interativos de Votação nos Times */}
      <div className="grand-final-teams">
        {/* CARD VENVANSE */}
        <div
          onClick={() => handleVoteTeam('venvanse')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleVoteTeam('venvanse')}
          className={`grand-final-team grand-final-team-a ${userTeamVote === 'venvanse' ? 'is-team-selected' : ''}`}
          style={{
            cursor: userTeamVote === 'venvanse' ? 'default' : 'pointer',
            transition: 'all 0.25s ease',
            position: 'relative',
            outline: 'none',
          }}
          title={userTeamVote === 'venvanse' ? 'Seu time escolhido como campeão' : 'Clique para votar na Venvanse como campeã'}
        >
          <TeamLogo logo={teamA.logo} name={teamA.name} initials={teamA.initials} size={48} borderRadius="10px" />
          <div className="grand-final-team-copy">
            <strong>{teamA.name}</strong>
            <span>{rosterA.length} jogadores · {totalKills(rosterA)} kills</span>
            {userTeamVote === 'venvanse' ? (
              <div style={{ marginTop: '0.35rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', fontWeight: 800, color: 'var(--cyan)' }}>
                <span className="status-pulse-dot" style={{ background: 'var(--cyan)' }} />
                👑 SEU CAMPEÃO ESCOLHIDO
              </div>
            ) : (
              <div style={{ marginTop: '0.35rem', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8' }}>
                🗳️ {userTeamVote ? 'Trocar voto para Venvanse' : 'Clique para votar na Venvanse'}
              </div>
            )}
          </div>
          <div className="grand-final-team-kd">
            <span>K/D médio</span>
            <strong>{averageKd(rosterA)}</strong>
            <span style={{ fontSize: '0.85rem', color: 'var(--cyan)', marginTop: '0.2rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 'bold' }}>
              {pctVenvanse}% ({teamVotes.venvanse})
            </span>
          </div>
        </div>

        {/* CARD OS DESACREDITADOS */}
        <div
          onClick={() => handleVoteTeam('desacreditados')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleVoteTeam('desacreditados')}
          className={`grand-final-team grand-final-team-b ${userTeamVote === 'desacreditados' ? 'is-team-selected' : ''}`}
          style={{
            cursor: userTeamVote === 'desacreditados' ? 'default' : 'pointer',
            transition: 'all 0.25s ease',
            position: 'relative',
            outline: 'none',
          }}
          title={userTeamVote === 'desacreditados' ? 'Seu time escolhido como campeão' : 'Clique para votar nos Desacreditados como campeão'}
        >
          <TeamLogo logo={teamB.logo} name={teamB.name} initials={teamB.initials} size={48} borderRadius="10px" />
          <div className="grand-final-team-copy">
            <strong>{teamB.name}</strong>
            <span>{rosterB.length} jogadores · {totalKills(rosterB)} kills</span>
            {userTeamVote === 'desacreditados' ? (
              <div style={{ marginTop: '0.35rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', fontWeight: 800, color: '#ff3366' }}>
                <span className="status-pulse-dot" style={{ background: '#ff3366' }} />
                👑 SEU CAMPEÃO ESCOLHIDO
              </div>
            ) : (
              <div style={{ marginTop: '0.35rem', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8' }}>
                🗳️ {userTeamVote ? 'Trocar voto para Desacreditados' : 'Clique para votar nos Desacreditados'}
              </div>
            )}
          </div>
          <div className="grand-final-team-kd">
            <span>K/D médio</span>
            <strong>{averageKd(rosterB)}</strong>
            <span style={{ fontSize: '0.85rem', color: '#ff7891', marginTop: '0.2rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 'bold' }}>
              {pctDesacreditados}% ({teamVotes.desacreditados})
            </span>
          </div>
        </div>
      </div>

      {/* BARRA DA TORCIDA DO CAMPEÃO (BROADCAST CROWD BAR) */}
      <div
        style={{
          maxWidth: '780px',
          margin: '-0.6rem auto 1.8rem',
          padding: '0.9rem 1.2rem',
          borderRadius: '12px',
          background: 'rgba(13, 20, 36, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
          <span style={{ color: 'var(--cyan)' }}>
            VENVANSE · {pctVenvanse}% ({teamVotes.venvanse} {teamVotes.venvanse === 1 ? 'voto' : 'votos'})
          </span>
          <span style={{ color: '#8fa0b8', fontSize: '0.7rem', fontWeight: 600 }}>
            {totalTeamVotes > 0 ? `${totalTeamVotes} voto${totalTeamVotes === 1 ? '' : 's'} no total` : 'Nenhum voto ainda'}
          </span>
          <span style={{ color: '#ff5172' }}>
            {pctDesacreditados}% ({teamVotes.desacreditados} {teamVotes.desacreditados === 1 ? 'voto' : 'votos'}) · OS DESACREDITADOS
          </span>
        </div>

        {/* Barra Visual Proporcional */}
        <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${pctVenvanse}%`, background: 'linear-gradient(90deg, var(--cyan), rgba(0,240,255,0.7))', transition: 'width 0.4s ease' }} />
          <div style={{ width: `${pctDesacreditados}%`, background: 'linear-gradient(90deg, rgba(255,81,114,0.7), #ff5172)', transition: 'width 0.4s ease' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.45rem', fontSize: '0.7rem', color: '#94a3b8' }}>
          <span>
            {userTeamVote ? (
              <span style={{ color: '#2ed573', fontWeight: 700 }}>
                ✓ Seu palpite para campeão está salvo no Supabase ({userTeamVote === 'venvanse' ? 'Venvanse' : 'Os Desacreditados'})
              </span>
            ) : (
              'Clique em qualquer um dos dois times acima para votar no seu campeão'
            )}
          </span>
          {userTeamVote && (
            <button
              type="button"
              onClick={() => handleVoteTeam(userTeamVote === 'venvanse' ? 'desacreditados' : 'venvanse')}
              disabled={submittingTeam}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#00f0ff',
                cursor: 'pointer',
                fontSize: '0.7rem',
                textDecoration: 'underline',
                padding: '0 0.2rem',
              }}
            >
              Trocar meu voto
            </button>
          )}
        </div>
      </div>

      {/* CHAVE DE CONFRONTOS INDIVIDUAIS POR K/D */}
      <div className="grand-final-key">
        <span className="team-a-key">VENVANSE</span>
        <span>CONFRONTO POR K/D</span>
        <span className="team-b-key">DESACREDITADOS</span>
      </div>

      <div className="grand-final-duels">
        {duels.map(({ playerA, playerB }, index) => (
          <PlayerDuel
            key={`${playerA?.name || 'a'}-${playerB?.name || 'b'}`}
            playerA={playerA}
            playerB={playerB}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
