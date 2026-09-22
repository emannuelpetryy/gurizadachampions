'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { getPlayerTier, getTeam, players, tiers } from '../data';
import PlayerAvatar from '../jogador/[name]/PlayerAvatar';
import MatchPrediction from './MatchPrediction';
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
    <section className="grand-final">
      <header className="grand-final-header">
        <span className="grand-final-stage">👑 GRANDE FINAL · MD3</span>
        <h2 className="grand-final-title">
          VENVANSE <span className="final-vs-badge">VS</span> OS DESACREDITADOS
        </h2>
        <p>A final está definida. Compare os números e escolha seu campeão.</p>
      </header>

      <div className="grand-final-teams">
        {[{ team: teamA, roster: rosterA, side: 'a' }, { team: teamB, roster: rosterB, side: 'b' }].map(({ team, roster, side }) => (
          <div key={team.id} className={`grand-final-team grand-final-team-${side}`}>
            <TeamLogo logo={team.logo} name={team.name} initials={team.initials} size={48} borderRadius="10px" />
            <div className="grand-final-team-copy">
              <strong>{team.name}</strong>
              <span>{roster.length} jogadores · {totalKills(roster)} kills</span>
            </div>
            <div className="grand-final-team-kd">
              <span>K/D médio</span>
              <strong>{averageKd(roster)}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="grand-final-key">
        <span className="team-a-key">VENVANSE</span>
        <span>CONFRONTO POR K/D</span>
        <span className="team-b-key">DESACREDITADOS</span>
      </div>

      <div className="grand-final-duels">
        {duels.map(({ playerA, playerB }, index) => <PlayerDuel key={`${playerA?.name || 'a'}-${playerB?.name || 'b'}`} playerA={playerA} playerB={playerB} index={index} />)}
      </div>

      <div className="grand-final-prediction">
        <MatchPrediction matchId="final" teamAName={teamA.name} teamBName={teamB.name} />
      </div>
    </section>
  );
}
