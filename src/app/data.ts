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
  { id: 4, teamA: 'maconhaco', teamB: 'whitelemon', scoreA: 1, scoreB: 0, status: 'Encerrado', date: 'Rodada 1', group: 'B' },
  { id: 1, teamA: 'jalin', teamB: 'desacreditados', scoreA: 0, scoreB: 1, status: 'Encerrado', date: 'qui., 23/07/2026 21:00', group: 'A' },
  { id: 2, teamA: '5cones', teamB: 'venvanse', scoreA: 0, scoreB: 1, status: 'Encerrado', date: 'qui., 23/07/2026 22:10', group: 'A' },
  { id: 3, teamA: 'assentamento', teamB: 'gilsons', scoreA: 0, scoreB: 1, status: 'Encerrado', date: 'seg., 27/07/2026 20:00', group: 'B' },
];

export const matchDetails: Record<string, any> = {
  '1': {
    map: 'Mirage', roundsA: 0, roundsB: 1,
    teamA_stats: [
      { name: 'Dash', kills: 15, deaths: 15, assists: 2 },
      { name: 'Gilli', kills: 15, deaths: 17, assists: 8 },
      { name: 'Duzz', kills: 7, deaths: 17, assists: 3 },
      { name: 'Peteka', kills: 12, deaths: 20, assists: 6 },
      { name: 'Knight', kills: 10, deaths: 16, assists: 2 },
    ],
    teamB_stats: [
      { name: 'Sorps - Leluia', kills: 13, deaths: 10, assists: 6 },
      { name: 'Tufabala', kills: 22, deaths: 10, assists: 8 },
      { name: 'Vandeco', kills: 13, deaths: 13, assists: 5 },
      { name: 'Galaxy', kills: 13, deaths: 14, assists: 9 },
      { name: 'Pedro - Distress', kills: 20, deaths: 12, assists: 5 },
    ]
  },
  '2': {
    map: 'Inferno', roundsA: 0, roundsB: 1,
    teamA_stats: [
      { name: 'Nil', kills: 39, deaths: 31, assists: 9 },
      { name: 'Leco', kills: 48, deaths: 29, assists: 11 },
      { name: 'Math', kills: 13, deaths: 28, assists: 14 },
      { name: 'Cobes', kills: 27, deaths: 29, assists: 7 },
      { name: 'João Marcelo', kills: 17, deaths: 28, assists: 7 },
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
    map: 'Nuke', roundsA: 0, roundsB: 1,
    teamA_stats: [
      { name: 'ChapaChaplin', kills: 15, deaths: 20, assists: 8 },
      { name: 'Baguá', kills: 21, deaths: 21, assists: 6 },
      { name: 'Pedro G.', kills: 16, deaths: 20, assists: 6 },
      { name: 'Dezin', kills: 14, deaths: 24, assists: 8 },
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
    map: 'Anúbis', roundsA: 1, roundsB: 0,
    teamA_stats: [
      { name: 'Gusta', kills: 19, deaths: 18, assists: 8 },
      { name: 'Acyd', kills: 33, deaths: 17, assists: 4 },
      { name: 'Do Not Remove - Lucas', kills: 15, deaths: 18, assists: 7 },
      { name: 'Tricke', kills: 10, deaths: 17, assists: 6 },
      { name: 'Natan', kills: 7, deaths: 18, assists: 6 },
    ],
    teamB_stats: [
      { name: 'Hallow', kills: 14, deaths: 19, assists: 6 },
      { name: 'DaddyMnny', kills: 20, deaths: 16, assists: 6 },
      { name: 'Fernandin 666', kills: 22, deaths: 16, assists: 7 },
      { name: 'Giuseppe Lagos', kills: 21, deaths: 18, assists: 5 },
      { name: 'B1tz', kills: 11, deaths: 19, assists: 4 },
    ]
  }
};

export const groupA = [
  { teamId: 'venvanse', p: 1, pj: 1, v: 1, d: 0 },
  { teamId: 'desacreditados', p: 1, pj: 1, v: 1, d: 0 },
  { teamId: '5cones', p: 0, pj: 1, v: 0, d: 1 },
  { teamId: 'jalin', p: 0, pj: 1, v: 0, d: 1 },
];

export const groupB = [
  { teamId: 'gilsons', p: 1, pj: 1, v: 1, d: 0 },
  { teamId: 'maconhaco', p: 1, pj: 1, v: 1, d: 0 },
  { teamId: 'assentamento', p: 0, pj: 1, v: 0, d: 1 },
  { teamId: 'whitelemon', p: 0, pj: 1, v: 0, d: 1 },
];

// Re-computando a lista global de players a partir das matchDetails para ter o DB exato.
export const players: Array<{name: string, teamId: string, kills: number, deaths: number, assists: number}> = [];
const addPlayersToGlobal = (matchDetailsMap: Record<string, any>, matchId: string, teamAId: string, teamBId: string) => {
  const details = matchDetailsMap[matchId];
  if (details) {
    details.teamA_stats.forEach((p: any) => players.push({ name: p.name, teamId: teamAId, kills: p.kills, deaths: p.deaths, assists: p.assists }));
    details.teamB_stats.forEach((p: any) => players.push({ name: p.name, teamId: teamBId, kills: p.kills, deaths: p.deaths, assists: p.assists }));
  }
};

addPlayersToGlobal(matchDetails, '1', 'jalin', 'desacreditados');
addPlayersToGlobal(matchDetails, '2', 'assentamento', 'gilsons');
addPlayersToGlobal(matchDetails, '3', '5cones', 'venvanse');
addPlayersToGlobal(matchDetails, '4', 'maconhaco', 'whitelemon');

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
    { name: 'DaddyMnny', lvl: 17 },
    { name: 'Fernandin 666', lvl: 15 },
    { name: 'Pedro - Distress', lvl: 15 },
    { name: 'Gusta', lvl: 14 },
    { name: 'Gilli', lvl: 14 },
    { name: 'Samuka', lvl: 14 },
    { name: 'ChapaChaplin', lvl: 13 }
  ],
  B: [
    { name: 'Alemão', lvl: 13 },
    { name: 'Tufabala', lvl: 12 },
    { name: 'Hallow', lvl: 12 },
    { name: 'Duzz', lvl: 12 },
    { name: 'Math', lvl: 11 },
    { name: 'Do Not Remove - Lucas', lvl: 10 },
    { name: 'Baguá', lvl: 10 },
    { name: 'Manu', lvl: 10 }
  ],
  C: [
    { name: 'João Marcelo', lvl: 10 },
    { name: 'Giuseppe Lagos', lvl: 10 },
    { name: 'Vandeco', lvl: 10 },
    { name: 'Peteka', lvl: 9 },
    { name: 'Duzão', lvl: 9 },
    { name: 'PombaLoka', lvl: 9 },
    { name: 'Cobes', lvl: 9 },
    { name: 'Pedro G.', lvl: 7 }
  ],
  D: [
    { name: 'Galaxy', lvl: 7 },
    { name: 'Knight', lvl: 7 },
    { name: 'Dezin', lvl: 6 },
    { name: 'B1tz', lvl: 6 },
    { name: 'Baronelis', lvl: 6 },
    { name: 'Tricke', lvl: 5 },
    { name: 'Natan', lvl: 4 },
    { name: 'Gilson Tedesko', lvl: 3 }
  ]
};
