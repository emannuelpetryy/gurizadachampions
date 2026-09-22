import { NextRequest, NextResponse } from 'next/server';

const SLOT_MATCH_VOTES = 94;

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return { supabaseUrl, supabaseKey };
}

const cleanMatchId = (value: unknown) => String(value || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 120);

// In-memory fallback para ambiente local sem credenciais
const localVotesFallback: Record<string, { a: number; b: number }> = {};

async function getStoredVotes(): Promise<Record<string, { a: number; b: number }>> {
  const { supabaseUrl, supabaseKey } = getSupabaseConfig();
  if (!supabaseUrl || !supabaseKey) return localVotesFallback;

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/match_lobby?select=*&slot_id=eq.${SLOT_MATCH_VOTES}`, {
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
        apikey: supabaseKey,
      },
      cache: 'no-store',
    });
    if (!res.ok) return localVotesFallback;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0 && data[0].player_name) {
      return JSON.parse(data[0].player_name);
    }
  } catch (e) {
    console.error('Erro ao ler palpites no Supabase:', e);
  }
  return localVotesFallback;
}

async function saveStoredVotes(votesMap: Record<string, { a: number; b: number }>) {
  const { supabaseUrl, supabaseKey } = getSupabaseConfig();
  if (!supabaseUrl || !supabaseKey) {
    Object.assign(localVotesFallback, votesMap);
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
        slot_id: SLOT_MATCH_VOTES,
        player_name: JSON.stringify(votesMap),
        joined_at: new Date().toISOString(),
      }),
    });
  } catch (e) {
    console.error('Erro ao salvar palpites no Supabase:', e);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const matchId = cleanMatchId(searchParams.get('matchId'));

  if (!matchId) {
    return NextResponse.json({ error: 'Missing matchId' }, { status: 400 });
  }

  const allVotes = await getStoredVotes();
  const current = allVotes[matchId] || { a: 0, b: 0 };
  return NextResponse.json(current);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { matchId: rawMatchId, team } = body;

    const matchId = cleanMatchId(rawMatchId);
    if (!matchId || (team !== 'a' && team !== 'b')) {
      return NextResponse.json({ error: 'Dados de votação inválidos' }, { status: 400 });
    }
    const teamKey = team as 'a' | 'b';

    const allVotes = await getStoredVotes();
    const current = allVotes[matchId] || { a: 0, b: 0 };
    current[teamKey] = (current[teamKey] || 0) + 1;
    allVotes[matchId] = current;

    await saveStoredVotes(allVotes);
    return NextResponse.json(current);
  } catch (e) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
