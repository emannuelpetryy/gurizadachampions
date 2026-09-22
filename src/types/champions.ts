export interface Season {
  id: string; // ex: 'season-1', 'season-2'
  name: string; // ex: 'Temporada 1 — Edição de Estreia'
  shortName: string; // ex: 'T1 (2026)'
  year: number;
  status: 'upcoming' | 'ongoing' | 'playoffs' | 'completed';
  stageDescription: string; // ex: 'Grande Final Definida'
  startDate: string;
  endDate?: string;
  championTeamId?: string;
  mvpPlayerName?: string;
}

export interface Team {
  id: string;
  name: string;
  initials: string;
  logo: string;
  group?: string;
}

export interface PlayerStats {
  name: string;
  teamId: string;
  kills: number;
  deaths: number;
  assists: number;
  matches: number;
  hsSum?: number;
  hsCount?: number;
  avgHs?: number;
  damageTotal?: number;
  damageMatchesCount?: number;
  roundsPlayedForDamage?: number;
  avgDamage?: number;
  adr?: number;
}

export interface PlayerRadarAttributes {
  firepower: number; // 0 a 100: K/D e Kills por Round (KPR)
  aim: number;       // 0 a 100: Headshot % ponderado
  support: number;   // 0 a 100: Assistências por Round (APR)
  survival: number;  // 0 a 100: Sobrevivência (1 - DPR)
  impact: number;    // 0 a 100: ADR ponderado e dano médio
  archetype: {
    title: string;
    description: string;
    icon: string;
    color: string;
  };
  dataCoverage: {
    totalMatches: number;
    matchesWithHs: number;
    matchesWithDamage: number;
    isEstimatedHs: boolean;
    isEstimatedDamage: boolean;
  };
}

export interface RecentMatchRecord {
  matchId: number | string;
  stage?: string;
  map: string;
  date: string;
  won: boolean;
  scoreDisplay: string;
  enemyTeamName: string;
  enemyTeamLogo: string;
  kills: number;
  deaths: number;
  assists: number;
  kd: string;
  hs?: number | null;
  damage?: number | null;
}

export interface PickemVote {
  scoreA: number;
  scoreB: number;
  winnerTeamId: string;
  mvpPlayerName?: string;
  timestamp: string;
}
