import { NextRequest, NextResponse } from 'next/server';

const SLOT_PICKEM = 92;

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return { supabaseUrl, supabaseKey };
}

interface PickemState {
  scores: Record<string, number>;
  mvps: Record<string, number>;
  totalPicks: number;
}

const defaultPickemState: PickemState = {
  scores: {
    'ven_3_0': 4,
    'ven_3_1': 7,
    'ven_3_2': 5,
    'des_3_0': 2,
    'des_3_1': 4,
    'des_3_2': 3,
  },
  mvps: {
    'Pacal': 6,
    'Tufa': 5,
    'Manu': 4,
    'Sorps - Leluia': 3,
    'Distress - Pedro': 2,
  },
  totalPicks: 25,
};

function normalizePickemState(state: PickemState): PickemState {
  if (!state.scores) state.scores = {};
  if (state.scores['ven_2_0']) {
    state.scores['ven_3_0'] = (state.scores['ven_3_0'] || 0) + state.scores['ven_2_0'];
    delete state.scores['ven_2_0'];
  }
  if (state.scores['ven_2_1']) {
    state.scores['ven_3_1'] = (state.scores['ven_3_1'] || 0) + state.scores['ven_2_1'];
    delete state.scores['ven_2_1'];
  }
  if (state.scores['des_2_0']) {
    state.scores['des_3_0'] = (state.scores['des_3_0'] || 0) + state.scores['des_2_0'];
    delete state.scores['des_2_0'];
  }
  if (state.scores['des_2_1']) {
    state.scores['des_3_1'] = (state.scores['des_3_1'] || 0) + state.scores['des_2_1'];
    delete state.scores['des_2_1'];
  }
  return state;
}

let localPickemFallback: PickemState = { ...defaultPickemState };

async function getStoredPickem(): Promise<PickemState> {
  const { supabaseUrl, supabaseKey } = getSupabaseConfig();
  if (!supabaseUrl || !supabaseKey) return normalizePickemState(localPickemFallback);

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/match_lobby?select=*&slot_id=eq.${SLOT_PICKEM}`, {
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
        apikey: supabaseKey,
      },
      cache: 'no-store',
    });
    if (!res.ok) return normalizePickemState(localPickemFallback);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0 && data[0].player_name) {
      return normalizePickemState(JSON.parse(data[0].player_name));
    }
  } catch (e) {
    console.error('Erro ao ler Pickem no Supabase:', e);
  }
  return normalizePickemState(localPickemFallback);
}

async function saveStoredPickem(state: PickemState) {
  const { supabaseUrl, supabaseKey } = getSupabaseConfig();
  if (!supabaseUrl || !supabaseKey) {
    localPickemFallback = state;
    return;
  }

  try {
    await fetch(`${supabaseUrl}/rest/v1/match_lobby`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
        apikey: supabaseKey,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        slot_id: SLOT_PICKEM,
        player_name: JSON.stringify(state),
        joined_at: new Date().toISOString(),
      }),
    });
  } catch (e) {
    console.error('Erro ao salvar Pickem no Supabase:', e);
  }
}

export async function GET() {
  const state = await getStoredPickem();
  return NextResponse.json(state);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scoreChoice, mvpChoice, prevScoreChoice, prevMvpChoice } = body;

    const state = await getStoredPickem();
    if (!state.scores) state.scores = {};
    if (!state.mvps) state.mvps = {};

    // Reverter escolha anterior se informada
    if (prevScoreChoice && state.scores[prevScoreChoice] && state.scores[prevScoreChoice] > 0) {
      state.scores[prevScoreChoice] -= 1;
      state.totalPicks = Math.max(0, (state.totalPicks || 1) - 1);
    }
    if (prevMvpChoice && state.mvps[prevMvpChoice] && state.mvps[prevMvpChoice] > 0) {
      state.mvps[prevMvpChoice] -= 1;
    }

    // Aplicar novo palpite de placar
    if (scoreChoice) {
      state.scores[scoreChoice] = (state.scores[scoreChoice] || 0) + 1;
      state.totalPicks = (state.totalPicks || 0) + 1;
    }

    // Aplicar novo palpite de MVP
    if (mvpChoice) {
      state.mvps[mvpChoice] = (state.mvps[mvpChoice] || 0) + 1;
    }

    await saveStoredPickem(state);
    return NextResponse.json(state);
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao processar palpite do Pickem' }, { status: 500 });
  }
}
