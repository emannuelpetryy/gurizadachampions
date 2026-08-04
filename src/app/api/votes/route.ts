import { NextRequest, NextResponse } from 'next/server';

const NAMESPACE = 'gurizadachampions_v2';
const API_BASE = `https://api.counterapi.dev/v1/${NAMESPACE}`;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get('matchId');

  if (!matchId) {
    return NextResponse.json({ error: 'Missing matchId' }, { status: 400 });
  }

  try {
    const [resA, resB] = await Promise.all([
      fetch(`${API_BASE}/match_${matchId}_a`, { cache: 'no-store' }),
      fetch(`${API_BASE}/match_${matchId}_b`, { cache: 'no-store' })
    ]);

    const dataA = resA.ok ? await resA.json() : { count: 0 };
    const dataB = resB.ok ? await resB.json() : { count: 0 };

    return NextResponse.json({
      a: dataA.count || 0,
      b: dataB.count || 0
    });
  } catch (e) {
    return NextResponse.json({ a: 0, b: 0 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { matchId, team } = body;

    // Validação de Segurança e Sanitização de Entrada
    const cleanMatchId = typeof matchId === 'string' ? matchId.replace(/[^a-zA-Z0-9_-]/g, '') : String(matchId || '');
    if (!cleanMatchId || (team !== 'a' && team !== 'b')) {
      return NextResponse.json({ error: 'Dados de votação inválidos' }, { status: 400 });
    }

    // Incrementar no CounterAPI
    await fetch(`${API_BASE}/match_${matchId}_${team}/up`, { cache: 'no-store' });

    // Buscar os dados atualizados
    const [resA, resB] = await Promise.all([
      fetch(`${API_BASE}/match_${matchId}_a`, { cache: 'no-store' }),
      fetch(`${API_BASE}/match_${matchId}_b`, { cache: 'no-store' })
    ]);

    const dataA = resA.ok ? await resA.json() : { count: 0 };
    const dataB = resB.ok ? await resB.json() : { count: 0 };

    return NextResponse.json({
      a: dataA.count || 0,
      b: dataB.count || 0
    });
  } catch (e) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
