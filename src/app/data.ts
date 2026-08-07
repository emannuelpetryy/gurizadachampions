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
  { id: 7, teamA: 'jalin', teamB: 'venvanse', scoreA: 13, scoreB: 9, status: 'Encerrado', date: 'dom., 02/08/2026 23:50', group: 'A' },
  { id: 8, teamA: '5cones', teamB: 'desacreditados', scoreA: 5, scoreB: 13, status: 'Encerrado', date: 'seg., 03/08/2026 02:11', group: 'A' },
  { id: 9, teamA: 'gilsons', teamB: 'maconhaco', scoreA: 13, scoreB: 8, status: 'Encerrado', date: 'ter., 04/08/2026 20:30', group: 'B' },
  { id: 10, teamA: '5cones', teamB: 'jalin', scoreA: 13, scoreB: 6, status: 'Encerrado', date: 'ter., 04/08/2026 22:00', group: 'A' },
  { id: 11, teamA: 'desacreditados', teamB: 'venvanse', scoreA: 19, scoreB: 16, status: 'Encerrado', date: 'Rodada 3', group: 'A' },
];

export const upcomingMatches: any[] = [
  {
    id: 'up-4',
    group: 'GRUPO B - RODADA 3',
    teamA: 'whitelemon',
    teamB: 'assentamento',
    date: '2026-08-05T21:00:00-03:00',
    dateDisplay: 'A definir',
  },
];

export const matchDetails: Record<string, any> = {
  '1': {
    map: 'Inferno', roundsA: 0, roundsB: 1, teamARounds: 7, teamBRounds: 13,
    vodUrl: 'https://www.twitch.tv/videos/2827426394',
    teamA_stats: [
      { name: 'Gilli', kills: 15, deaths: 17, assists: 8, hs: null, damage: 1860 },
      { name: 'Dash', kills: 15, deaths: 15, assists: 2, hs: null, damage: 1480 },
      { name: 'Peteka', kills: 12, deaths: 20, assists: 6, hs: null, damage: 1700 },
      { name: 'Camargo', kills: 10, deaths: 16, assists: 2, hs: null, damage: 1040 },
      { name: 'Duzz', kills: 7, deaths: 17, assists: 3, hs: null, damage: 1120 },
    ],
    teamB_stats: [
      { name: 'Tufa', kills: 22, deaths: 10, assists: 8, hs: 45, damage: 2380 },
      { name: 'Distress - Pedro', kills: 20, deaths: 12, assists: 5, hs: 60, damage: 2060 },
      { name: 'Galaxy', kills: 13, deaths: 14, assists: 9, hs: 30, damage: 1620 },
      { name: 'Gio', kills: 13, deaths: 13, assists: 5, hs: 46, damage: 1420 },
      { name: 'Sorps - Leluia', kills: 13, deaths: 10, assists: 6, hs: 46, damage: 1140 },
    ]
  },
  '2': {
    map: 'Dust II', roundsA: 19, roundsB: 22, teamARounds: 19, teamBRounds: 22,
    vodUrl: 'https://www.twitch.tv/videos/2830666292',
    teamA_stats: [
      { name: 'Leco', kills: 48, deaths: 29, assists: 11, hs: 50, damage: 4554 },
      { name: 'Nil', kills: 39, deaths: 31, assists: 9, hs: 15, damage: 4187 },
      { name: 'Cobes', kills: 27, deaths: 29, assists: 7, hs: 59, damage: 2764 },
      { name: 'Demoleison', kills: 17, deaths: 28, assists: 7, hs: 29, damage: 2162 },
      { name: 'Math', kills: 13, deaths: 28, assists: 14, hs: 23, damage: 1949 },
    ],
    teamB_stats: [
      { name: 'Felpy', kills: 41, deaths: 29, assists: 11, hs: 77, damage: 4536 },
      { name: 'Manko', kills: 39, deaths: 34, assists: 14, hs: null, damage: 4368 },
      { name: 'PombaLoka', kills: 26, deaths: 26, assists: 6, hs: 30, damage: 2184 },
      { name: 'Alemão', kills: 20, deaths: 31, assists: 8, hs: 10, damage: 2604 },
      { name: 'Gilson Tedesko', kills: 17, deaths: 33, assists: 5, hs: null, damage: 2394 },
    ]
  },
  '3': {
    map: 'Ancient', roundsA: 0, roundsB: 1, teamARounds: 12, teamBRounds: 16,
    vodUrl: 'https://www.twitch.tv/videos/2827426394',
    teamA_stats: [
      { name: 'Becker', kills: 28, deaths: 22, assists: 9, hs: 28, damage: 3256 },
      { name: 'Bagua', kills: 21, deaths: 21, assists: 6, hs: 57, damage: 2044 },
      { name: 'ChapaChaplin', kills: 15, deaths: 20, assists: 8, hs: 33, damage: 2016 },
      { name: 'Pedro Giraldi', kills: 16, deaths: 20, assists: 6, hs: 50, damage: 1848 },
      { name: 'Deeez1n', kills: 14, deaths: 24, assists: 8, hs: 21, damage: 1372 },
    ],
    teamB_stats: [
      { name: 'Pacal', kills: 39, deaths: 17, assists: 7, hs: 46, damage: 3900 },
      { name: 'Samuka', kills: 25, deaths: 18, assists: 9, hs: 40, damage: 2803 },
      { name: 'Manu', kills: 19, deaths: 18, assists: 6, hs: 47, damage: 1975 },
      { name: 'Baronelis', kills: 13, deaths: 21, assists: 11, hs: 38, damage: 1604 },
      { name: 'Duzão', kills: 10, deaths: 20, assists: 11, hs: 30, damage: 1409 },
    ]
  },
  '4': {
    map: 'Anúbis', roundsA: 1, roundsB: 0, teamARounds: 13, teamBRounds: 10,
    vodUrl: 'https://www.twitch.tv/videos/2830666292',
    teamA_stats: [
      { name: 'Acyd', kills: 33, deaths: 17, assists: 4, hs: 51, damage: 3219 },
      { name: 'Gusta', kills: 19, deaths: 18, assists: 8, hs: 15, damage: 2144 },
      { name: 'Lucas', kills: 15, deaths: 18, assists: 7, hs: 60, damage: 1746 },
      { name: 'João Marcelo', kills: 10, deaths: 17, assists: 6, hs: 50, damage: 1446 },
      { name: 'Natan', kills: 7, deaths: 18, assists: 6, hs: 42, damage: 765 },
    ],
    teamB_stats: [
      { name: 'Daddy Money', kills: 20, deaths: 16, assists: 6, hs: 30, damage: 2469 },
      { name: 'Fernandinho - Peida Leite', kills: 22, deaths: 16, assists: 7, hs: 40, damage: 2215 },
      { name: 'Giuseppe Lagos', kills: 21, deaths: 18, assists: 5, hs: 52, damage: 2046 },
      { name: 'Hallow', kills: 14, deaths: 19, assists: 6, hs: 50, damage: 1497 },
      { name: 'Marcelo - Bitz', kills: 11, deaths: 19, assists: 4, hs: 63, damage: 1048 },
    ]
  },
  '5': {
    map: 'Dust II', roundsA: 1, roundsB: 0, teamARounds: 13, teamBRounds: 6,
    vodUrl: 'https://www.twitch.tv/beckeryeshua',
    teamA_stats: [
      { name: 'Manko', kills: 27, deaths: 12, assists: 7, hs: 37, damage: 2698 },
      { name: 'Felpy', kills: 24, deaths: 12, assists: 6, hs: 68, damage: 2470 },
      { name: 'Alemão', kills: 14, deaths: 11, assists: 6, hs: 57, damage: 1292 },
      { name: 'PombaLoka', kills: 13, deaths: 11, assists: 6, hs: 38, damage: 1406 },
      { name: 'SimboladaPAZ', kills: 9, deaths: 11, assists: 5, hs: 33, damage: 1007 },
    ],
    teamB_stats: [
      { name: 'Daddy Money', kills: 17, deaths: 18, assists: 2, hs: null, damage: 1653 },
      { name: 'Hallow', kills: 16, deaths: 17, assists: 4, hs: null, damage: 1767 },
      { name: 'Giuseppe Lagos', kills: 8, deaths: 18, assists: 2, hs: null, damage: 988 },
      { name: 'Fernandinho - Peida Leite', kills: 8, deaths: 15, assists: 5, hs: null, damage: 1159 },
      { name: 'Marcelo - Bitz', kills: 2, deaths: 19, assists: 6, hs: null, damage: 399 },
    ]
  },
  '6': {
    map: 'Mirage', roundsA: 1, roundsB: 0, teamARounds: 13, teamBRounds: 5,
    vodUrl: 'https://www.twitch.tv/beckeryeshua',
    teamA_stats: [
      { name: 'Acyd', kills: 23, deaths: 6, assists: 2, hs: 39, damage: 2292 },
      { name: 'Gusta', kills: 14, deaths: 13, assists: 5, hs: 71, damage: 1808 },
      { name: 'Natan', kills: 14, deaths: 7, assists: 3, hs: 50, damage: 1399 },
      { name: 'Lucas', kills: 12, deaths: 11, assists: 2, hs: 58, damage: 1325 },
      { name: 'João Marcelo', kills: 9, deaths: 11, assists: 2, hs: 33, damage: 924 },
    ],
    teamB_stats: [
      { name: 'Leco', kills: 17, deaths: 14, assists: 4, hs: 35, damage: 1916 },
      { name: 'Math', kills: 10, deaths: 11, assists: 4, hs: 40, damage: 1118 },
      { name: 'Cobes', kills: 9, deaths: 16, assists: 2, hs: 22, damage: 1076 },
      { name: 'Nil', kills: 8, deaths: 17, assists: 2, hs: 75, damage: 998 },
      { name: 'Demoleison', kills: 3, deaths: 15, assists: 2, hs: 33, damage: 828 },
    ]
  },
  '7': {
    map: 'Nuke', roundsA: 1, roundsB: 0, teamARounds: 13, teamBRounds: 9,
    teamA_stats: [
      { name: 'Gilli', kills: 29, deaths: 15, assists: 4, hs: null, damage: 2400 },
      { name: 'Dash', kills: 25, deaths: 14, assists: 2, hs: null, damage: 2100 },
      { name: 'Duzz', kills: 13, deaths: 13, assists: 7, hs: null, damage: 1400 },
      { name: 'Peteka', kills: 13, deaths: 16, assists: 7, hs: null, damage: 1300 },
      { name: 'Camargo', kills: 7, deaths: 17, assists: 5, hs: null, damage: 900 },
    ],
    teamB_stats: [
      { name: 'Pacal', kills: 31, deaths: 18, assists: 8, hs: null, damage: 2600 },
      { name: 'Samuka', kills: 15, deaths: 18, assists: 5, hs: null, damage: 1600 },
      { name: 'Manu', kills: 14, deaths: 15, assists: 7, hs: null, damage: 1500 },
      { name: 'Baronelis', kills: 9, deaths: 18, assists: 7, hs: null, damage: 1100 },
      { name: 'Duzão', kills: 5, deaths: 18, assists: 6, hs: null, damage: 700 },
    ]
  },
  '8': {
    map: 'Vertigo', roundsA: 0, roundsB: 1, teamARounds: 5, teamBRounds: 13,
    teamA_stats: [
      { name: 'Becker', kills: 20, deaths: 14, assists: 3, hs: 35, damage: 1734 },
      { name: 'Pedro Giraldi', kills: 12, deaths: 15, assists: 2, hs: 50, damage: 1143 },
      { name: 'ChapaChaplin', kills: 11, deaths: 16, assists: 6, hs: 45, damage: 1335 },
      { name: 'Deeez1n', kills: 8, deaths: 18, assists: 4, hs: 75, damage: 984 },
      { name: 'Bagua', kills: 5, deaths: 17, assists: 6, hs: 80, damage: 1043 },
    ],
    teamB_stats: [
      { name: 'Distress - Pedro', kills: 25, deaths: 9, assists: 3, hs: 36, damage: 2150 },
      { name: 'Tufa', kills: 22, deaths: 14, assists: 7, hs: 54, damage: 2131 },
      { name: 'Sorps - Leluia', kills: 14, deaths: 7, assists: 5, hs: 42, damage: 1184 },
      { name: 'Gio', kills: 13, deaths: 13, assists: 4, hs: 46, damage: 1542 },
      { name: 'Galaxy', kills: 6, deaths: 15, assists: 9, hs: 16, damage: 1345 },
    ]
  },
  '9': {
    map: 'Inferno', roundsA: 1, roundsB: 0, teamARounds: 13, teamBRounds: 8,
    vodUrl: 'https://www.twitch.tv/beckeryeshua',
    teamA_stats: [
      { name: 'Manko', kills: 24, deaths: 12, assists: 5, hs: 54, damage: 2349 },
      { name: 'PombaLoka', kills: 14, deaths: 14, assists: 6, hs: 35, damage: 1967 },
      { name: 'Felpy', kills: 17, deaths: 13, assists: 11, hs: 29, damage: 1741 },
      { name: 'Alemão', kills: 12, deaths: 12, assists: 5, hs: 33, damage: 1358 },
      { name: 'Gilson Tedesko', kills: 13, deaths: 12, assists: 2, hs: 46, damage: 1274 },
    ],
    teamB_stats: [
      { name: 'Acyd', kills: 21, deaths: 13, assists: 4, hs: 57, damage: 2197 },
      { name: 'Lucas', kills: 16, deaths: 16, assists: 2, hs: 43, damage: 1820 },
      { name: 'Gusta', kills: 13, deaths: 17, assists: 4, hs: 76, damage: null },
      { name: 'João Marcelo', kills: 9, deaths: 17, assists: 4, hs: 44, damage: null },
      { name: 'Natan', kills: 1, deaths: 18, assists: 4, hs: 100, damage: null },
    ]
  },
  '10': {
    map: 'Anúbis', roundsA: 1, roundsB: 0, teamARounds: 13, teamBRounds: 6,
    teamA_stats: [
      { name: 'Becker', kills: 28, deaths: 11, assists: 7, hs: 46, damage: 2607 },
      { name: 'ChapaChaplin', kills: 18, deaths: 15, assists: 9, hs: 11, damage: 2066 },
      { name: 'Bagua', kills: 12, deaths: 15, assists: 11, hs: 50, damage: 1709 },
      { name: 'Pedro Giraldi', kills: 12, deaths: 14, assists: 4, hs: 50, damage: 1073 },
      { name: 'Demoleison', kills: 8, deaths: 12, assists: 4, hs: 12, damage: 975 },
    ],
    teamB_stats: [
      { name: 'Gilli', kills: 19, deaths: 16, assists: 4, hs: 52, damage: 2233 },
      { name: 'Duzz', kills: 14, deaths: 13, assists: 6, hs: 57, damage: 1906 },
      { name: 'Dash', kills: 11, deaths: 18, assists: 3, hs: 45, damage: 1377 },
      { name: 'Camargo', kills: 13, deaths: 16, assists: 5, hs: 38, damage: null },
      { name: 'Peteka', kills: 8, deaths: 16, assists: 8, hs: 37, damage: null },
    ]
  },
  '11': {
    map: 'Cache', roundsA: 1, roundsB: 0, teamARounds: 19, teamBRounds: 16,
    teamA_stats: [
      { name: 'Distress - Pedro', kills: 32, deaths: 26, assists: 5, hs: 28, damage: 3185 },
      { name: 'Tufa', kills: 27, deaths: 28, assists: 8, hs: 59, damage: 2884 },
      { name: 'Sorps - Leluia', kills: 23, deaths: 23, assists: 12, hs: 56, damage: 2898 },
      { name: 'Gio', kills: 21, deaths: 23, assists: 4, hs: 57, damage: 2183 },
      { name: 'Galaxy', kills: 20, deaths: 24, assists: 10, hs: 23, damage: 2551 },
    ],
    teamB_stats: [
      { name: 'Pacal', kills: 38, deaths: 23, assists: 6, hs: 31, damage: 3688 },
      { name: 'Samuka', kills: 32, deaths: 23, assists: 9, hs: 53, damage: 3421 },
      { name: 'Manu', kills: 21, deaths: 26, assists: 7, hs: 33, damage: 2332 },
      { name: 'Baronelis', kills: 17, deaths: 28, assists: 6, hs: 52, damage: 1782 },
      { name: 'Duzão', kills: 15, deaths: 25, assists: 11, hs: 40, damage: 1915 },
    ]
  }
};

export const groupA = [
  { teamId: 'desacreditados', p: 3, pj: 3, v: 3, d: 0, rd: 17 },
  { teamId: 'venvanse', p: 1, pj: 3, v: 1, d: 2, rd: -3 },
  { teamId: '5cones', p: 1, pj: 3, v: 1, d: 2, rd: -5 },
  { teamId: 'jalin', p: 1, pj: 3, v: 1, d: 2, rd: -9 },
];

export const groupB = [
  { teamId: 'gilsons', p: 3, pj: 3, v: 3, d: 0, rd: 15 },
  { teamId: 'maconhaco', p: 2, pj: 3, v: 2, d: 1, rd: 6 },
  { teamId: 'whitelemon', p: 0, pj: 2, v: 0, d: 2, rd: -10 },
  { teamId: 'assentamento', p: 0, pj: 2, v: 0, d: 2, rd: -11 },
];

const CANONICAL_ALIASES: Record<string, string> = {
  'guasca': 'Bagua',
  '5cns guasca': 'Bagua',
  'lsnbxjq ulzouqodفوي': 'Bagua',
  'zero2': 'Gilli',
  'zero': 'Gilli',
  'jalin | zero2': 'Gilli',
  'knight': 'Camargo',
  'knight水🥷🏻': 'Camargo',
  'jalin | knight': 'Camargo',
  'jalin | knight水🥷🏻': 'Camargo',
  'majaster': 'Gusta',
  'giraldi': 'Pedro Giraldi',
  '5cns - giraldi': 'Pedro Giraldi',
  'de': 'Deeez1n',
  'deez1n': 'Deeez1n',
  '5cns -deeez1n': 'Deeez1n',
  'vandeco': 'Gio',
  'ptk': 'Peteka',
  'petekinha': 'Peteka',
  'leluia': 'Sorps - Leluia',
  'distress': 'Distress - Pedro',
  'alemao_/': 'Alemão',
  'alemao__/': 'Alemão',
  'mankinho^^': 'Manko',
  'mankinho': 'Manko',
  'pombaloka': 'PombaLoka',
  'felpy': 'Felpy',
  'samucahemp': 'Samuka',
  'vvs samucahemp': 'Samuka',
  'perry': 'Manu',
  'vvs perry': 'Manu',
  'vvs duzão': 'Duzão',
  'lucaaas ta lá': 'Lucas',
  'lucaaas tá lá': 'Lucas',
  'giuseppe lagos - henrique': 'Giuseppe Lagos',
  'joseph lakes': 'Giuseppe Lagos',
  'white lemon | joseph lakes': 'Giuseppe Lagos',
  'daddy mny': 'Daddy Money',
  'kyousuke666': 'Daddy Money',
  'easymoneyrasta': 'João Marcelo',
  'lacolombia': 'Natan',
  'b1tplz': 'Marcelo - Bitz',
  'sk | oliveira7f': 'Fernandinho - Peida Leite',
  'oliveira7f': 'Fernandinho - Peida Leite',
  'oliveir7f': 'Fernandinho - Peida Leite',
  'celso - mighty': 'Nil',
  'celso - leco': 'Leco',
  'celso - cobes': 'Cobes',
  'celso - demoleison': 'Demoleison',
  'celso - mathzikntc': 'Math',
  'celso - math': 'Math',
};

export const normalizePlayerName = (name: string): string => {
  if (!name) return '';
  const clean = name.trim().toLowerCase();
  return CANONICAL_ALIASES[clean] || name.trim();
};

const PRIMARY_TEAMS: Record<string, string> = {
  'demoleison': 'assentamento',
  'becker': '5cones',
  'chapachaplin': '5cones',
  'bagua': '5cones',
  'pedro giraldi': '5cones',
  'deeez1n': '5cones',
};

export interface PlayerSummary {
  name: string;
  teamId: string;
  kills: number;
  deaths: number;
  assists: number;
  matches: number;
  hsSum: number;
  hsCount: number;
  avgHs: number;
}

const rawPlayersMap: Record<string, PlayerSummary> = {};

const addPlayersToGlobal = (matchDetailsMap: Record<string, any>, matchId: string, teamAId: string, teamBId: string) => {
  const details = matchDetailsMap[matchId];
  if (details) {
    const processPlayer = (p: any, teamId: string) => {
      const canonicalName = normalizePlayerName(p.name);
      const key = canonicalName.toLowerCase();
      if (!rawPlayersMap[key]) {
        rawPlayersMap[key] = {
          name: canonicalName,
          teamId: PRIMARY_TEAMS[key] || teamId,
          kills: 0,
          deaths: 0,
          assists: 0,
          matches: 0,
          hsSum: 0,
          hsCount: 0,
          avgHs: 0,
        };
      }
      rawPlayersMap[key].kills += p.kills;
      rawPlayersMap[key].deaths += p.deaths;
      rawPlayersMap[key].assists += p.assists;
      rawPlayersMap[key].matches += 1;
      if (typeof p.hs === 'number' && !isNaN(p.hs)) {
        rawPlayersMap[key].hsSum += p.hs;
        rawPlayersMap[key].hsCount += 1;
        rawPlayersMap[key].avgHs = Math.round(rawPlayersMap[key].hsSum / rawPlayersMap[key].hsCount);
      }
      if (!PRIMARY_TEAMS[key]) {
        rawPlayersMap[key].teamId = teamId;
      }
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
addPlayersToGlobal(matchDetails, '7', 'jalin', 'venvanse');
addPlayersToGlobal(matchDetails, '8', '5cones', 'desacreditados');
addPlayersToGlobal(matchDetails, '9', 'gilsons', 'maconhaco');
addPlayersToGlobal(matchDetails, '10', '5cones', 'jalin');
addPlayersToGlobal(matchDetails, '11', 'desacreditados', 'venvanse');

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
    { name: 'Deeez1n', lvl: 6 },
    { name: 'Marcelo - Bitz', lvl: 6 },
    { name: 'Baronelis', lvl: 6 },
    { name: 'Dark', lvl: 5 },
    { name: 'Natan', lvl: 4 },
    { name: 'Gilson Tedesko', lvl: 3 }
  ]
};

export const getPlayerTier = (name: string): string => {
  if (!name) return '';
  const clean = name.trim().toLowerCase();
  for (const [tier, list] of Object.entries(tiers)) {
    if (list.some(p => p.name.trim().toLowerCase() === clean)) {
      return tier;
    }
  }
  return '';
};
