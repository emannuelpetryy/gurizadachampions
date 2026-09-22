import { NextRequest, NextResponse } from 'next/server';

const NAMESPACE = 'gurizadachampions_v2';
const API_BASE = `https://api.counterapi.dev/v1/${NAMESPACE}`;

const cleanDuelId = (value: unknown) => String(value || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 120);

async function getCounts(duelId: string) {
  const [resA, resB] = await Promise.all([
    fetch(`${API_BASE}/final_duel_${duelId}_a`, { cache: 'no-store' }),
    fetch(`${API_BASE}/final_duel_${duelId}_b`, { cache: 'no-store' }),
  ]);

  const dataA = resA.ok ? await resA.json() : { count: 0 };
  const dataB = resB.ok ? await resB.json() : { count: 0 };
  return { a: dataA.count || 0, b: dataB.count || 0 };
}

export async function GET(request: NextRequest) {
  const duelId = cleanDuelId(new URL(request.url).searchParams.get('duelId'));
  if (!duelId) return NextResponse.json({ error: 'Duelo inválido' }, { status: 400 });

  try {
    return NextResponse.json(await getCounts(duelId));
  } catch {
    return NextResponse.json({ a: 0, b: 0 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { duelId: rawDuelId, choice } = await request.json();
    const duelId = cleanDuelId(rawDuelId);
    if (!duelId || (choice !== 'a' && choice !== 'b')) {
      return NextResponse.json({ error: 'Voto inválido' }, { status: 400 });
    }

    await fetch(`${API_BASE}/final_duel_${duelId}_${choice}/up`, { cache: 'no-store' });
    return NextResponse.json(await getCounts(duelId));
  } catch {
    return NextResponse.json({ error: 'Não foi possível registrar o voto' }, { status: 500 });
  }
}
