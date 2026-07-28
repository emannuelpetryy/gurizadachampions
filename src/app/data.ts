export const teams = [
  { id: 'venvanse', name: 'Venvanse', logo: 'V' },
  { id: 'desacreditados', name: 'Os Desacreditados', logo: 'OD' },
  { id: '5cones', name: '5 Cones', logo: '5C' },
  { id: 'jalin', name: 'Jalin Habei', logo: 'JH' },
  { id: 'gilsons', name: 'Gilsons E-Sports', logo: 'GE' },
  { id: 'maconhaco', name: 'Maconhaço E-Sports', logo: 'ME' },
  { id: 'assentamento', name: 'Assentamento Celso Furtado', logo: 'AC' },
  { id: 'whitelemon', name: 'White Lemon', logo: 'WL' },
];

export const getTeam = (id: string) => teams.find(t => t.id === id) || teams[0];

export const matches = [
  { id: 1, teamA: 'jalin', teamB: 'desacreditados', scoreA: 0, scoreB: 1, status: 'Encerrado', date: 'qui., 23/07/2026 21:00', group: 'A' },
  { id: 2, teamA: '5cones', teamB: 'venvanse', scoreA: 0, scoreB: 1, status: 'Encerrado', date: 'qui., 23/07/2026 22:10', group: 'A' },
  { id: 3, teamA: 'assentamento', teamB: 'gilsons', scoreA: 0, scoreB: 1, status: 'Encerrado', date: 'seg., 27/07/2026 20:00', group: 'B' },
  { id: 4, teamA: 'maconhaco', teamB: 'whitelemon', scoreA: 1, scoreB: 0, status: 'Encerrado', date: 'Rodada 1', group: 'B' },
];

export const groupA = [
  { teamId: 'venvanse', p: 1, pj: 1, v: 1, e: 0, d: 0, k: 106, d_rounds: 94 },
  { teamId: 'desacreditados', p: 1, pj: 1, v: 1, e: 0, d: 0, k: 81, d_rounds: 59 },
  { teamId: '5cones', p: 0, pj: 1, v: 0, e: 0, d: 1, k: 94, d_rounds: 107 },
  { teamId: 'jalin', p: 0, pj: 1, v: 0, e: 0, d: 1, k: 59, d_rounds: 85 },
];

export const groupB = [
  { teamId: 'gilsons', p: 1, pj: 1, v: 1, e: 0, d: 0, k: 143, d_rounds: 153 },
  { teamId: 'maconhaco', p: 1, pj: 1, v: 1, e: 0, d: 0, k: 84, d_rounds: 88 },
  { teamId: 'assentamento', p: 0, pj: 1, v: 0, e: 0, d: 1, k: 144, d_rounds: 145 },
  { teamId: 'whitelemon', p: 0, pj: 1, v: 0, e: 0, d: 1, k: 88, d_rounds: 88 },
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
