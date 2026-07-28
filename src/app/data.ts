export const teams = [
  { id: 'venvanse', name: 'Venvanse', initials: 'VEN' },
  { id: 'desacreditados', name: 'Os Desacreditados', initials: 'ODS' },
  { id: '5cones', name: '5 Cones', initials: '5CN' },
  { id: 'jalin', name: 'Jalin Habei', initials: 'JHB' },
  { id: 'gilsons', name: 'Gilsons E-Sports', initials: 'GLS' },
  { id: 'maconhaco', name: 'Maconhaço E-Sports', initials: 'MAC' },
  { id: 'assentamento', name: 'Assent. Celso Furtado', initials: 'ACF' },
  { id: 'whitelemon', name: 'White Lemon', initials: 'WLM' },
];

export const getTeam = (id: string) => teams.find(t => t.id === id) || teams[0];

export const matches = [
  { id: 4, teamA: 'maconhaco', teamB: 'whitelemon', scoreA: 1, scoreB: 0, status: 'Encerrado', date: 'Rodada 1', group: 'B' },
  { id: 1, teamA: 'jalin', teamB: 'desacreditados', scoreA: 0, scoreB: 1, status: 'Encerrado', date: 'qui., 23/07/2026 21:00', group: 'A' },
  { id: 2, teamA: '5cones', teamB: 'venvanse', scoreA: 0, scoreB: 1, status: 'Encerrado', date: 'qui., 23/07/2026 22:10', group: 'A' },
  { id: 3, teamA: 'assentamento', teamB: 'gilsons', scoreA: 0, scoreB: 1, status: 'Encerrado', date: 'seg., 27/07/2026 20:00', group: 'B' },
];

export const matchDetails: Record<string, any> = {
  '4': {
    map: 'Anúbis',
    roundsA: 13,
    roundsB: 10,
    teamA_stats: [
      { name: 'acyd', kills: 33, deaths: 17, assists: 4 },
      { name: 'Majaster', kills: 19, deaths: 18, assists: 8 },
      { name: 'Lucaaas TA LÁ', kills: 15, deaths: 18, assists: 7 },
      { name: 'EasyMoneyrasta', kills: 10, deaths: 17, assists: 6 },
      { name: 'LaColombia', kills: 7, deaths: 18, assists: 6 },
    ],
    teamB_stats: [
      { name: 'sk | oliveira7f', kills: 22, deaths: 16, assists: 7 },
      { name: 'White Lemon | Giuseppe Lagos', kills: 21, deaths: 18, assists: 5 },
      { name: 'kyousuke666', kills: 20, deaths: 16, assists: 6 },
      { name: 'Hallow', kills: 14, deaths: 19, assists: 6 },
      { name: 'b1tplz', kills: 11, deaths: 19, assists: 4 },
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

export const players = [
  { name: 'Leco', teamId: 'assentamento', kills: 48, deaths: 29, assists: 11 },
  { name: 'Felpy', teamId: 'gilsons', kills: 41, deaths: 29, assists: 11 },
  { name: 'Manko', teamId: 'gilsons', kills: 39, deaths: 34, assists: 14 },
  { name: 'Pacal', teamId: 'venvanse', kills: 39, deaths: 17, assists: 7 },
  { name: 'Nil', teamId: 'assentamento', kills: 39, deaths: 31, assists: 9 },
  { name: 'Acyd', teamId: 'maconhaco', kills: 33, deaths: 17, assists: 4 },
  { name: 'Becker', teamId: '5cones', kills: 28, deaths: 22, assists: 9 },
  { name: 'Cobes', teamId: 'assentamento', kills: 27, deaths: 29, assists: 7 },
  { name: 'PombaLoka', teamId: 'gilsons', kills: 26, deaths: 26, assists: 6 },
  { name: 'Samuka', teamId: 'venvanse', kills: 25, deaths: 18, assists: 9 },
];

export const tiers = {
  S: [
    { name: 'Matheus mankinho', lvl: 20 },
    { name: 'becker', lvl: 20 },
    { name: 'Acyd', lvl: 20 },
    { name: 'dash', lvl: 18 },
    { name: 'pacal', lvl: 18 },
    { name: 'Nil', lvl: 18 },
    { name: 'leco', lvl: 17, swap: true },
    { name: 's0rps', lvl: 17 }
  ],
  A: [
    { name: 'Felpy', lvl: 18, swap: true },
    { name: 'DaddyMnny', lvl: 17 },
    { name: 'Fernandinho', lvl: 15 },
    { name: 'distress', lvl: 15 },
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
    { name: 'math', lvl: 11 },
    { name: 'Lucas', lvl: 10 },
    { name: 'bagua', lvl: 10 },
    { name: 'Manu', lvl: 10 }
  ],
  C: [
    { name: 'Gio', lvl: 10 },
    { name: 'Giuseppe Lagos - Henrique', lvl: 10 },
    { name: 'dark', lvl: 10 },
    { name: 'ptk', lvl: 9 },
    { name: 'duzao', lvl: 9 },
    { name: 'PombaLoka', lvl: 9 },
    { name: 'COBES', lvl: 9 },
    { name: 'Pedro Giraldi', lvl: 7 }
  ],
  D: [
    { name: 'Galaxy', lvl: 7 },
    { name: 'Knight', lvl: 7 },
    { name: 'Jota Marcinho', lvl: 6 },
    { name: 'b1tplz', lvl: 6 },
    { name: 'Baronelis', lvl: 6 },
    { name: 'De', lvl: 5 },
    { name: 'Natan', lvl: 4 },
    { name: 'gilso tedesko', lvl: 3 }
  ]
};
