'use client';

import { useMemo } from 'react';
import { getPlayerTier, getTeam, players } from '../data';
import PlayerAvatar from '../jogador/[name]/PlayerAvatar';
import MatchPrediction from './MatchPrediction';
import TeamLogo from './TeamLogo';

type ShowdownPlayer = (typeof players)[number];

const teamAId = 'venvanse';
const teamBId = 'desacreditados';

const kdOf = (player: ShowdownPlayer) => player.kills / (player.deaths || 1);

const formatKd = (player: ShowdownPlayer) => kdOf(player).toFixed(2);

const tierValue: Record<string, number> = { S: 5, A: 4, B: 3, C: 2, D: 1 };

const getSimilarity = (playerA: ShowdownPlayer, playerB: ShowdownPlayer) => {
  const maxKd = Math.max(kdOf(playerA), kdOf(playerB), 1);
  const kdSimilarity = 1 - Math.abs(kdOf(playerA) - kdOf(playerB)) / maxKd;
  const tierA = tierValue[getPlayerTier(playerA.name)] || 0;
  const tierB = tierValue[getPlayerTier(playerB.name)] || 0;
  const tierSimilarity = tierA && tierB ? 1 - Math.abs(tierA - tierB) / 4 : kdSimilarity;

  return Math.max(0, Math.round(((kdSimilarity * 0.7) + (tierSimilarity * 0.3)) * 100));
};

const getSimilarityLabel = (similarity: number) => {
  if (similarity >= 85) return 'Duelo equilibrado';
  if (similarity >= 65) return 'Boa disputa';
  return 'Vantagem estatística';
};

function PlayerDuel({ playerA, playerB, index }: { playerA?: ShowdownPlayer; playerB?: ShowdownPlayer; index: number }) {
  if (!playerA && !playerB) return null;

  const similarity = playerA && playerB ? getSimilarity(playerA, playerB) : 0;
  const kdA = playerA ? kdOf(playerA) : 0;
  const kdB = playerB ? kdOf(playerB) : 0;
  const winner = kdA === kdB ? null : kdA > kdB ? 'a' : 'b';

  const renderPlayer = (player: ShowdownPlayer | undefined, side: 'a' | 'b') => {
    if (!player) {
      return <span style={{ color: '#64748b', fontSize: '0.8rem', fontStyle: 'italic' }}>Sem jogador</span>;
    }

    const team = getTeam(player.teamId);
    const isLeading = winner === side;

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', minWidth: 0 }}>
        <PlayerAvatar teamName={team.name} playerName={player.name} badgeColor={side === 'a' ? 'rgba(0,240,255,0.2)' : 'rgba(255,51,102,0.2)'} size={38} />
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
            <strong style={{ color: '#fff', fontSize: '0.92rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{player.name}</strong>
            {getPlayerTier(player.name) && (
              <span className={`final-tier tier-${getPlayerTier(player.name)}`} style={{ fontSize: '0.58rem', fontWeight: 900, padding: '0.1rem 0.3rem', borderRadius: '5px' }}>
                TIER {getPlayerTier(player.name)}
              </span>
            )}
          </div>
          <span style={{ color: isLeading ? (side === 'a' ? '#00f0ff' : '#ff7891') : '#94a3b8', fontSize: '0.78rem', fontWeight: 800 }}>
            K/D {formatKd(player)} · {player.kills}K / {player.deaths}D
          </span>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 112px minmax(0, 1fr)', gap: '0.8rem', alignItems: 'center', padding: '0.85rem 0', borderTop: index === 0 ? 'none' : '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ padding: '0.75rem', borderRadius: '12px', background: winner === 'a' ? 'rgba(0,240,255,0.1)' : 'rgba(255,255,255,0.035)', border: `1px solid ${winner === 'a' ? 'rgba(0,240,255,0.35)' : 'rgba(255,255,255,0.07)'}` }}>
        {renderPlayer(playerA, 'a')}
      </div>

      <div className="final-similarity" style={{ textAlign: 'center' }}>
        <span style={{ display: 'block', color: '#ffd700', fontSize: '0.66rem', fontWeight: 900, letterSpacing: '0.6px' }}>{similarity}%</span>
        <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.6rem', lineHeight: 1.15, marginTop: '0.15rem' }}>{playerA && playerB ? getSimilarityLabel(similarity) : 'Comparação'}</span>
      </div>

      <div style={{ padding: '0.75rem', borderRadius: '12px', background: winner === 'b' ? 'rgba(255,51,102,0.1)' : 'rgba(255,255,255,0.035)', border: `1px solid ${winner === 'b' ? 'rgba(255,51,102,0.35)' : 'rgba(255,255,255,0.07)'}` }}>
        {renderPlayer(playerB, 'b')}
      </div>
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

  return (
    <section className="glass-card" style={{ marginBottom: '3.5rem', padding: 'clamp(1.1rem, 3vw, 2rem)', border: '1px solid rgba(255,215,0,0.34)', background: 'radial-gradient(circle at 50% -20%, rgba(255,215,0,0.11), transparent 45%), linear-gradient(135deg, rgba(10,20,39,0.98), rgba(5,11,25,0.98))', boxShadow: '0 18px 55px rgba(0,0,0,0.32)' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.6rem' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.38rem 0.9rem', border: '1px solid rgba(255,215,0,0.6)', borderRadius: '999px', color: '#ffd700', fontSize: '0.72rem', fontWeight: 900, letterSpacing: '1.5px' }}>👑 GRANDE FINAL · MD3</span>
        <h2 style={{ margin: '0.8rem 0 0.35rem', color: '#fff', fontFamily: 'var(--font-rajdhani)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1, textTransform: 'uppercase' }}>
          VENVANSE <span className="final-vs-badge">VS</span> OS DESACREDITADOS
        </h2>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.88rem' }}>A final está definida. Compare o nível dos jogadores e escolha seu campeão.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem', maxWidth: '780px', margin: '0 auto 1.6rem' }}>
        {[{ team: teamA, roster: rosterA, color: '#00f0ff', side: 'a' }, { team: teamB, roster: rosterB, color: '#ff5172', side: 'b' }].map(({ team, roster, color, side }) => (
          <div key={team.id} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.9rem 1rem', borderRadius: '14px', background: `${color}0d`, border: `1px solid ${color}55` }}>
            <TeamLogo logo={team.logo} name={team.name} initials={team.initials} size={48} borderRadius="10px" />
            <div style={{ minWidth: 0, flex: 1 }}>
              <strong style={{ display: 'block', color: '#fff', fontFamily: 'var(--font-rajdhani)', fontSize: '1.05rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{team.name}</strong>
              <span style={{ color, fontSize: '0.72rem', fontWeight: 800 }}>{roster.length} jogadores · {totalKills(roster)} kills</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'block', color: '#94a3b8', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.8px' }}>K/D médio</span>
              <strong style={{ color, fontFamily: 'var(--font-rajdhani)', fontSize: '1.35rem' }}>{averageKd(roster)}</strong>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '980px', margin: '0 auto', padding: '0.55rem 0.8rem', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <span style={{ color: '#00f0ff', fontSize: '0.68rem', fontWeight: 900, letterSpacing: '1px' }}>VENVANSE</span>
        <span style={{ color: '#ffd700', fontSize: '0.68rem', fontWeight: 900, letterSpacing: '1px' }}>PROXIMIDADE POR K/D + TIER</span>
        <span style={{ color: '#ff5172', fontSize: '0.68rem', fontWeight: 900, letterSpacing: '1px' }}>DESACREDITADOS</span>
      </div>

      <div style={{ maxWidth: '980px', margin: '0 auto 1.6rem' }}>
        {duels.map(({ playerA, playerB }, index) => <PlayerDuel key={`${playerA?.name || 'a'}-${playerB?.name || 'b'}`} playerA={playerA} playerB={playerB} index={index} />)}
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <MatchPrediction matchId="final" teamAName={teamA.name} teamBName={teamB.name} />
      </div>
    </section>
  );
}
