import { PlayerStats, PlayerRadarAttributes, RecentMatchRecord } from '../types/champions';

/**
 * Calcula o K/D de um jogador
 */
export function calcKd(kills: number, deaths: number): number {
  return kills / (deaths || 1);
}

/**
 * Calcula o KDA de um jogador
 */
export function calcKda(kills: number, deaths: number, assists: number): number {
  return (kills + assists) / (deaths || 1);
}

/**
 * Formata K/D com 2 casas decimais
 */
export function formatKd(kills: number, deaths: number): string {
  return calcKd(kills, deaths).toFixed(2);
}

/**
 * Formata KDA com 2 casas decimais
 */
export function formatKda(kills: number, deaths: number, assists: number): string {
  return calcKda(kills, deaths, assists).toFixed(2);
}

/**
 * Ordenação canônica do Gurizada Champions:
 * 1. K/D arredondado a 2 casas decimais
 * 2. Em caso de empate: maior KDA acumulado
 * 3. Em caso de empate: maior número de kills
 */
export function sortRanking<T extends { kills: number; deaths: number; assists: number }>(playersList: T[]): T[] {
  return [...playersList].sort((a, b) => {
    const kdA_2dec = Math.round(calcKd(a.kills, a.deaths) * 100);
    const kdB_2dec = Math.round(calcKd(b.kills, b.deaths) * 100);
    if (kdB_2dec !== kdA_2dec) return kdB_2dec - kdA_2dec;

    const kdaA = calcKda(a.kills, a.deaths, a.assists);
    const kdaB = calcKda(b.kills, b.deaths, b.assists);
    if (kdaB !== kdaA) return kdaB - kdaA;

    return b.kills - a.kills;
  });
}

/**
 * Clamp para manter valores entre min e max
 */
function clamp(val: number, min = 15, max = 99): number {
  return Math.round(Math.min(max, Math.max(min, val)));
}

/**
 * Calcula os atributos do Radar 360º de forma robusta e resiliente a dados incompletos
 */
export function calculateRadarAttributes(
  player: PlayerStats,
  playerMatches: RecentMatchRecord[],
  totalRoundsOverall: number = 0
): PlayerRadarAttributes {
  const kd = calcKd(player.kills, player.deaths);
  const totalMatches = playerMatches.length || player.matches || 1;

  // 1. Tratamento inteligente de partidas com HS
  const matchesWithHsList = playerMatches.filter(m => m.hs !== null && m.hs !== undefined && !isNaN(m.hs));
  const hasTrackedHs = matchesWithHsList.length > 0;
  let effectiveHs = 40; // Média da liga padrão caso nenhum jogo tenha tido registro

  if (hasTrackedHs) {
    const totalHsSum = matchesWithHsList.reduce((acc, m) => acc + (m.hs || 0), 0);
    effectiveHs = totalHsSum / matchesWithHsList.length;
  } else if (player.avgHs && player.avgHs > 0) {
    effectiveHs = player.avgHs;
  }

  // 2. Tratamento inteligente de partidas com Dano/ADR
  const matchesWithDamageList = playerMatches.filter(m => m.damage !== null && m.damage !== undefined && !isNaN(m.damage));
  const hasTrackedDamage = matchesWithDamageList.length > 0;
  let effectiveAdr = 75; // Baseline estimado da liga

  if (hasTrackedDamage) {
    const totalDamageSum = matchesWithDamageList.reduce((acc, m) => acc + (m.damage || 0), 0);
    const totalRoundsWithDamage = matchesWithDamageList.reduce((acc, m) => {
      // Estimar rounds por partida (geralmente entre 16 e 24 rounds em média)
      return acc + 20;
    }, 0);
    effectiveAdr = totalDamageSum / Math.max(1, totalRoundsWithDamage);
  } else if (player.adr && player.adr > 0) {
    effectiveAdr = player.adr;
  } else {
    // Estimativa segura baseada em Kills e K/D
    const estKpr = player.kills / Math.max(1, totalMatches * 20);
    effectiveAdr = estKpr * 110;
  }

  // 3. Estimar Rounds jogados no total para KPR, APR, DPR
  const estimatedTotalRounds = Math.max(20, totalRoundsOverall > 0 ? totalRoundsOverall : totalMatches * 20);
  const kpr = player.kills / estimatedTotalRounds;
  const apr = player.assists / estimatedTotalRounds;
  const dpr = player.deaths / estimatedTotalRounds;

  // --- CÁLCULO DOS 5 EIXOS (0 a 100) ---

  // Eixo 1: Poder de Fogo (Firepower) - baseado em KD e KPR
  // KD 1.0 -> ~60. KD 1.5 -> ~85. KD 0.7 -> ~42.
  const firepower = clamp(35 + (kd - 0.6) * 45 + (kpr - 0.5) * 30);

  // Eixo 2: Mira / Precisão (Aim) - baseado em HS%
  // 30% HS -> 50 pts, 50% HS -> 80 pts, 70% HS -> 96 pts
  const aim = clamp(20 + (effectiveHs / 70) * 75);

  // Eixo 3: Suporte & Utilidade (Support) - baseado em APR e assistências
  // 0.15 APR -> 45 pts, 0.35 APR -> 85 pts
  const support = clamp(30 + (apr / 0.4) * 60);

  // Eixo 4: Sobrevivência (Survival) - menos mortes por round
  // dpr 0.5 (morre metade dos rounds) -> 85 pts, dpr 0.85 -> 40 pts
  const survivalRate = Math.max(0, 1 - dpr);
  const survival = clamp(25 + survivalRate * 70);

  // Eixo 5: Impacto (Impact) - baseado em ADR
  // ADR 50 -> 40 pts, ADR 85 -> 72 pts, ADR 110 -> 92 pts
  const impact = clamp(25 + (effectiveAdr / 115) * 70);

  // --- DETERMINAÇÃO DO ARQUÉTIPO TÁTICO ---
  let archetype = {
    title: 'Polivalente / Coringa',
    description: 'Equilibrado em todas as fases, adapta-se às necessidades do time em qualquer mapa.',
    icon: '🎯',
    color: '#00F0FF',
  };

  if (firepower >= 80 && aim >= 75) {
    archetype = {
      title: 'Entry Fragger / Mirador',
      description: 'Puro poder de fogo na mira. Abre os bombs com primeiras eliminações decisivas.',
      icon: '⚡',
      color: '#FFD700',
    };
  } else if (impact >= 78 && firepower >= 75) {
    archetype = {
      title: 'Estrela / Carregador',
      description: 'Causa dano massivo em todas as rodadas e decide partidas nos momentos críticos.',
      icon: '👑',
      color: '#FF3366',
    };
  } else if (survival >= 75 && firepower >= 65) {
    archetype = {
      title: 'Clutcher Silencioso',
      description: 'Manso e calculista. Dificilmente é abatido de graça e brilha em situações de 1vX.',
      icon: '🥷',
      color: '#10B981',
    };
  } else if (support >= 75) {
    archetype = {
      title: 'Suporte de Ouro',
      description: 'Jogador coletivo por excelência. Prepara as bangs, dá cover e garante refrags.',
      icon: '🛡️',
      color: '#00F0FF',
    };
  } else if (aim >= 75 && firepower < 65) {
    archetype = {
      title: 'One-Tap Artist',
      description: 'Taxa de headshot cirúrgica quando encontra a mira certa.',
      icon: '🎯',
      color: '#F59E0B',
    };
  } else if (firepower < 50 && support >= 50) {
    archetype = {
      title: 'Isca Tática & Resenha',
      description: 'Cria espaço para os companheiros, atrai as atenções e mantém a energia da equipe alta.',
      icon: '🎣',
      color: '#A855F7',
    };
  }

  return {
    firepower,
    aim,
    support,
    survival,
    impact,
    archetype,
    dataCoverage: {
      totalMatches,
      matchesWithHs: matchesWithHsList.length,
      matchesWithDamage: matchesWithDamageList.length,
      isEstimatedHs: !hasTrackedHs,
      isEstimatedDamage: !hasTrackedDamage,
    },
  };
}
