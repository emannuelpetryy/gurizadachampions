import { Season } from '../types/champions';

export const SEASONS: Season[] = [
  {
    id: 'season-1',
    name: 'Temporada 1 — Edição de Estreia',
    shortName: 'Temporada 1 (2026)',
    year: 2026,
    status: 'playoffs',
    stageDescription: 'Grande Final Definida: Venvanse vs Os Desacreditados',
    startDate: '23/07/2026',
    endDate: 'Setembro 2026',
  },
  {
    id: 'season-2',
    name: 'Temporada 2 — Próximo Campeonato',
    shortName: 'Temporada 2 (Em Breve)',
    year: 2026,
    status: 'upcoming',
    stageDescription: 'Draft & Novos Times a definir',
    startDate: 'Em Breve',
  },
];

export const CURRENT_SEASON_ID = 'season-1';

export function getCurrentSeason(): Season {
  return SEASONS.find(s => s.id === CURRENT_SEASON_ID) || SEASONS[0];
}

export function getSeason(id: string): Season | undefined {
  return SEASONS.find(s => s.id === id);
}

export function getAllSeasons(): Season[] {
  return SEASONS;
}
