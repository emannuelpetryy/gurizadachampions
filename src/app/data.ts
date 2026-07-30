export const teams = [
  { id: 'venvanse', name: 'Venvanse', initials: 'VEN', logo: '/logos/venvanse.jpeg' },
  { id: 'desacreditados', name: 'Os Desacreditados', initials: 'ODS', logo: '/logos/desacreditados.jpeg' },
  { id: '5cones', name: '5 Cones', initials: '5CN', logo: '/logos/5cones.jpeg' },
  { id: 'jalin', name: 'Jalin Habei', initials: 'JHB', logo: '/logos/jalin.jpeg' },
  { id: 'gilsons', name: 'Gilsons E-Sports', initials: 'GLS', logo: '/logos/gilsons.jpeg' },
  { id: 'maconhaco', name: 'Maconhaço E-Sports', initials: 'MAC', logo: '/logos/maconhaco.jpeg' },
  { id: 'assentamento', name: 'Assent. Celso Furtado', initials: 'ACF', logo: '/logos/assentamento.jpeg' },
  { id: 'whitelemon', name: 'White Lemon', initials: 'WLM', logo: '/logos/whitelemon.jpeg' },
];

export const getTeam = (id: string) => teams.find(t => t.id === id) || teams[0];

export const matches = [
  { id: 4, teamA: 'maconhaco', teamB: 'whitelemon', scoreA: 13, scoreB: 10, status: 'Encerrado', date: 'Rodada 1', group: 'B' },
  { id: 1, teamA: 'jalin', teamB: 'desacreditados', scoreA: 7, scoreB: 13, status: 'Encerrado', date: 'qui., 23/07/2026 21:00', group: 'A' },
  { id: 2, teamA: 'assentamento', teamB: 'gilsons', scoreA: 19, scoreB: 22, status: 'Encerrado', date: 'seg., 27/07/2026 20:00', group: 'B' },
  { id: 3, teamA: '5cones', teamB: 'venvanse', scoreA: 12, scoreB: 16, status: 'Encerrado', date: 'qui., 23/07/2026 22:10', group: 'A' },
  { id: 5, teamA: 'gilsons', teamB: 'whitelemon', scoreA: 13, scoreB: 6, status: 'Encerrado', date: 'ter., 28/07/2026 21:00', group: 'B' },
  { id: 6, teamA: 'maconhaco', teamB: 'assentamento', scoreA: 13, scoreB: 5, status: 'Encerrado', date: 'qua., 29/07/2026 21:30', group: 'B' },
];

export const upcomingMatches = [
  {
    id: 203,
    teamA: 'desacreditados',
    teamB: '5cones',
    date: 'A definir',
    dateDisplay: 'Sexta-Feira, 31/07 - Horário a Definir',
    group: 'Rodada 2 - Grupo A'
  },
  {
    id: 204,
    teamA: 'venvanse',
    teamB: 'jalin',
    date: 'A definir',
    dateDisplay: 'Domingo, 02/08 - Horário a Definir',
    group: 'Rodada 2 - Grupo A'
  }
];

export const matchDetails: Record<string, any> = {
  '1': {
    map: 'Inferno', roundsA: 0, roundsB: 1, teamARounds: 7, teamBRounds: 13,
    vodUrl: 'https://www.twitch.tv/videos/2827426394',
    teamA_stats: [
      { name: 'Dash', kills: 15, deaths: 15, assists: 2 },
      { name: 'Gilli', kills: 15, deaths: 17, assists: 8 },
      { name: 'Duzz', kills: 7, deaths: 17, assists: 3 },
      { name: 'Peteka', kills: 12, deaths: 20, assists: 6 },
      { name: 'Camargo', kills: 10, deaths: 16, assists: 2 },
    ],
    teamB_stats: [
      { name: 'Sorps - Leluia', kills: 13, deaths: 10, assists: 6 },
      { name: 'Tufa', kills: 22, deaths: 10, assists: 8 },
      { name: 'Gio', kills: 13, deaths: 13, assists: 5 },
      { name: 'Galaxy', kills: 13, deaths: 14, assists: 9 },
      { name: 'Distress - Pedro', kills: 20, deaths: 12, assists: 5 },
    ]
  },
  '2': {
    map: 'Dust II', roundsA: 19, roundsB: 22, teamARounds: 19, teamBRounds: 22,
    vodUrl: 'https://www.twitch.tv/videos/2830666292',
    teamA_stats: [
      { name: 'Nil', kills: 39, deaths: 31, assists: 9 },
      { name: 'Leco', kills: 48, deaths: 29, assists: 11 },
      { name: 'Math', kills: 13, deaths: 28, assists: 14 },
      { name: 'Cobes', kills: 27, deaths: 29, assists: 7 },
      { name: 'Demoleison', kills: 17, deaths: 28, assists: 7 },
    ],
    teamB_stats: [
      { name: 'Gilson Tedesko', kills: 17, deaths: 33, assists: 5 },
      { name: 'Manko', kills: 39, deaths: 34, assists: 14 },
      { name: 'PombaLoka', kills: 26, deaths: 26, assists: 6 },
      { name: 'Alemão', kills: 20, deaths: 31, assists: 8 },
      { name: 'Felpy', kills: 41, deaths: 29, assists: 11 },
    ]
  },
  '3': {
    map: 'Ancient', roundsA: 0, roundsB: 1, teamARounds: 12, teamBRounds: 16,
    vodUrl: 'https://www.twitch.tv/videos/2827426394',
    teamA_stats: [
      { name: 'ChapaChaplin', kills: 15, deaths: 20, assists: 8 },
      { name: 'Bagua', kills: 21, deaths: 21, assists: 6 },
      { name: 'Pedro Giraldi', kills: 16, deaths: 20, assists: 6 },
      { name: 'De', kills: 14, deaths: 24, assists: 8 },
      { name: 'Becker', kills: 28, deaths: 22, assists: 9 },
    ],
    teamB_stats: [
      { name: 'Pacal', kills: 39, deaths: 17, assists: 7 },
      { name: 'Samuka', kills: 25, deaths: 18, assists: 9 },
      { name: 'Manu', kills: 19, deaths: 18, assists: 6 },
      { name: 'Duzão', kills: 10, deaths: 20, assists: 11 },
      { name: 'Baronelis', kills: 13, deaths: 21, assists: 11 },
    ]
  },
  '4': {
    map: 'Anúbis', roundsA: 1, roundsB: 0, teamARounds: 13, teamBRounds: 10,
    vodUrl: 'https://www.twitch.tv/videos/2830666292',
    teamA_stats: [
      { name: 'Gusta', kills: 19, deaths: 18, assists: 8 },
      { name: 'Acyd', kills: 33, deaths: 17, assists: 4 },
      { name: 'Lucas', kills: 15, deaths: 18, assists: 7 },
      { name: 'EasyMoneyrasta', kills: 10, deaths: 17, assists: 6 },
      { name: 'LaColombia', kills: 7, deaths: 18, assists: 6 },
    ],
    teamB_stats: [
      { name: 'Hallow', kills: 14, deaths: 19, assists: 6 },
      { name: 'Daddy Money', kills: 20, deaths: 16, assists: 6 },
      { name: 'Fernandinho - Peida Leite', kills: 22, deaths: 16, assists: 7 },
      { name: 'Giuseppe Lagos - Henrique', kills: 21, deaths: 18, assists: 5 },
      { name: 'Marcelo - Bitz', kills: 11, deaths: 19, assists: 4 },
    ]
  },
  '5': {
    map: 'Dust II', roundsA: 1, roundsB: 0, teamARounds: 13, teamBRounds: 6,
    vodUrl: 'https://www.twitch.tv/beckeryeshua',
    teamA_stats: [
      { name: 'Alemão', kills: 14, deaths: 10, assists: 6 },
      { name: 'SimboladaPAZ', kills: 9, deaths: 11, assists: 5 },
      { name: 'Manko', kills: 27, deaths: 11, assists: 7 },
      { name: 'PombaLoka', kills: 13, deaths: 11, assists: 6 },
      { name: 'Felpy', kills: 24, deaths: 12, assists: 6 },
    ],
    teamB_stats: [
      { name: 'Giuseppe Lagos - Henrique', kills: 8, deaths: 18, assists: 2 },
      { name: 'Marcelo - Bitz', kills: 2, deaths: 19, assists: 6 },
      { name: 'Hallow', kills: 16, deaths: 17, assists: 4 },
      { name: 'Daddy Money', kills: 17, deaths: 18, assists: 2 },
      { name: 'Fernandinho - Peida Leite', kills: 8, deaths: 15, assists: 5 },
    ]
  },
  '6': {
    map: 'Mirage', roundsA: 1, roundsB: 0, teamARounds: 13, teamBRounds: 5,
    vodUrl: 'https://www.twitch.tv/beckeryeshua',
    teamA_stats: [
      { name: 'Acyd', kills: 23, deaths: 6, assists: 2 },
      { name: 'Gusta', kills: 14, deaths: 13, assists: 5 },
      { name: 'LaColombia', kills: 14, deaths: 7, assists: 3 },
      { name: 'Lucas', kills: 12, deaths: 11, assists: 2 },
      { name: 'EasyMoneyrasta', kills: 9, deaths: 11, assists: 2 },
    ],
    teamB_stats: [
      { name: 'Leco', kills: 17, deaths: 14, assists: 4 },
      { name: 'Math', kills: 10, deaths: 11, assists: 4 },
      { name: 'Cobes', kills: 9, deaths: 15, assists: 2 },
      { name: 'Nil', kills: 8, deaths: 17, assists: 2 },
      { name: 'Demoleison', kills: 3, deaths: 15, assists: 2 },
    ]
  }
};

export const groupA = [
  { teamId: 'desacreditados', p: 1, pj: 1, v: 1, d: 0, rd: 6 },
  { teamId: 'venvanse', p: 1, pj: 1, v: 1, d: 0, rd: 4 },
  { teamId: '5cones', p: 0, pj: 1, v: 0, d: 1, rd: -4 },
  { teamId: 'jalin', p: 0, pj: 1, v: 0, d: 1, rd: -6 },
];

export const groupB = [
  { teamId: 'maconhaco', p: 2, pj: 2, v: 2, d: 0, rd: 11 },
  { teamId: 'gilsons', p: 2, pj: 2, v: 2, d: 0, rd: 10 },
  { teamId: 'whitelemon', p: 0, pj: 2, v: 0, d: 2, rd: -10 },
  { teamId: 'assentamento', p: 0, pj: 2, v: 0, d: 2, rd: -11 },
];

// Re-computando a lista global de players a partir das matchDetails para ter o DB exato.
export interface PlayerSummary {
  name: string;
  teamId: string;
  kills: number;
  deaths: number;
  assists: number;
  matches: number;
}

const rawPlayersMap: Record<string, PlayerSummary> = {};

const addPlayersToGlobal = (matchDetailsMap: Record<string, any>, matchId: string, teamAId: string, teamBId: string) => {
  const details = matchDetailsMap[matchId];
  if (details) {
    const processPlayer = (p: any, teamId: string) => {
      const key = p.name.toLowerCase();
      if (!rawPlayersMap[key]) {
        rawPlayersMap[key] = {
          name: p.name,
          teamId,
          kills: 0,
          deaths: 0,
          assists: 0,
          matches: 0,
        };
      }
      rawPlayersMap[key].kills += p.kills;
      rawPlayersMap[key].deaths += p.deaths;
      rawPlayersMap[key].assists += p.assists;
      rawPlayersMap[key].matches += 1;
      rawPlayersMap[key].teamId = teamId;
    };

    details.teamA_stats.forEach((p: any) => processPlayer(p, teamAId));
    details.teamB_stats.forEach((p: any) => processPlayer(p, teamBId));
  }
};

addPlayersToGlobal(matchDetails, '1', 'jalin', 'desacreditados');
addPlayersToGlobal(matchDetails, '2', 'assentamento', 'gilsons');
addPlayersToGlobal(matchDetails, '3', '5cones', 'venvanse');
addPlayersToGlobal(matchDetails, '4', 'maconhaco', 'whitelemon');
addPlayersToGlobal(matchDetails, '5', 'gilsons', 'whitelemon');
addPlayersToGlobal(matchDetails, '6', 'maconhaco', 'assentamento');

export const players: Array<PlayerSummary> = Object.values(rawPlayersMap);

export const tiers = {
  S: [
    { name: 'Manko', lvl: 20 },
    { name: 'Becker', lvl: 20 },
    { name: 'Acyd', lvl: 20 },
    { name: 'Dash', lvl: 18 },
    { name: 'Pacal', lvl: 18 },
    { name: 'Nil', lvl: 18 },
    { name: 'Leco', lvl: 17, swap: true },
    { name: 'Sorps - Leluia', lvl: 17 }
  ],
  A: [
    { name: 'Felpy', lvl: 18, swap: true },
    { name: 'Daddy Money', lvl: 17 },
    { name: 'Fernandinho - Peida Leite', lvl: 15 },
    { name: 'Distress - Pedro', lvl: 15 },
    { name: 'Gusta', lvl: 14 },
    { name: 'Gilli', lvl: 14 },
    { name: 'Samuka', lvl: 14 },
    { name: 'ChapaChaplin', lvl: 13 }
  ],
  B: [
    { name: 'Alemão', lvl: 13 },
    { name: 'Tufa', lvl: 12 },
    { name: 'Hallow', lvl: 12 },
    { name: 'Duzz', lvl: 12 },
    { name: 'Math', lvl: 11 },
    { name: 'Lucas', lvl: 10 },
    { name: 'Bagua', lvl: 10 },
    { name: 'Manu', lvl: 10 }
  ],
  C: [
    { name: 'João Marcelo', lvl: 10 },
    { name: 'Giuseppe Lagos - Henrique', lvl: 10 },
    { name: 'Gio', lvl: 10 },
    { name: 'Peteka', lvl: 9 },
    { name: 'Duzão', lvl: 9 },
    { name: 'PombaLoka', lvl: 9 },
    { name: 'Cobes', lvl: 9 },
    { name: 'Pedro Giraldi', lvl: 7 }
  ],
  D: [
    { name: 'Galaxy', lvl: 7 },
    { name: 'Camargo', lvl: 7 },
    { name: 'De', lvl: 6 },
    { name: 'Marcelo - Bitz', lvl: 6 },
    { name: 'Baronelis', lvl: 6 },
    { name: 'Dark', lvl: 5 },
    { name: 'Natan', lvl: 4 },
    { name: 'Gilson Tedesko', lvl: 3 }
  ]
};
