import { NextRequest, NextResponse } from 'next/server';

const SLOT_DUEL_VOTES = 93;

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return { supabaseUrl, supabaseKey };
}

const cleanDuelId = (value: unknown) => String(value || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 120);

// In-memory fallback para ambiente local sem variáveis de ambiente
const localVotesFallback: Record<string, { a: number; b: number }> = {};

async function getStoredVotes(): Promise<Record<string, { a: number; b: number }>> {
  const { supabaseUrl, supabaseKey } = getSupabaseConfig();
  if (!supabaseUrl || !supabaseKey) return localVotesFallback;

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/match_lobby?select=*&slot_id=eq.${SLOT_DUEL_VOTES}`, {
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
    console.error('Erro ao ler votos de duelos no Supabase:', e);
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
        slot_id: SLOT_DUEL_VOTES,
        player_name: JSON.stringify(votesMap),
        joined_at: new Date().toISOString(),
      }),
    });
  } catch (e) {
    console.error('Erro ao salvar votos de duelos no Supabase:', e);
  }
}

export async function GET(request: NextRequest) {
  const duelId = cleanDuelId(new URL(request.url).searchParams.get('duelId'));
  if (!duelId) return NextResponse.json({ error: 'Duelo inválido' }, { status: 400 });

  const allVotes = await getStoredVotes();
  const current = allVotes[duelId] || { a: 0, b: 0 };
  return NextResponse.json(current);
}

export async function POST(request: NextRequest) {
  try {
    const { duelId: rawDuelId, choice } = await request.json();
    const duelId = cleanDuelId(rawDuelId);
    if (!duelId || (choice !== 'a' && choice !== 'b')) {
      return NextResponse.json({ error: 'Voto inválido' }, { status: 400 });
    }
    const voteKey = choice as 'a' | 'b';

    const allVotes = await getStoredVotes();
    const current = allVotes[duelId] || { a: 0, b: 0 };
    current[voteKey] = (current[voteKey] || 0) + 1;
    allVotes[duelId] = current;

    await saveStoredVotes(allVotes);
    return NextResponse.json(current);
  } catch {
    return NextResponse.json({ error: 'Não foi possível registrar o voto' }, { status: 500 });
  }
}
