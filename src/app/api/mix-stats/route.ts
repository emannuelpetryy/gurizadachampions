import { NextResponse } from 'next/server';

function cleanSlug(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ players: [] });
  }

  try {
    const eloQueryUrl = `${supabaseUrl}/rest/v1/match_lobby?select=*&slot_id=eq.96`;
    const eloRes = await fetch(eloQueryUrl, {
      headers: { Authorization: `Bearer ${supabaseKey}`, apikey: supabaseKey },
      cache: 'no-store',
    });
    const eloData = eloRes.ok ? await eloRes.json() : [];
    let eloMap: Record<string, any> = {};
    if (eloData.length > 0) {
      try { eloMap = JSON.parse(eloData[0].player_name); } catch(e) {}
    }

    const playersList = Object.values(eloMap).map((p: any) => {
      const wins = p.wins || 0;
      const losses = p.losses || 0;
      const matches = p.matches || (wins + losses);
      return {
        steamid: p.steamid || `7656119${cleanSlug(p.name).substring(0, 10).padEnd(10, '0')}`,
        name: p.name,
        rating: p.rating || p.elo || 1000,
        matches,
        wins,
        losses,
        kills: p.kills || 0,
        deaths: p.deaths || 0,
        assists: p.assists || 0,
        damage: p.damage || 0,
        mvps: p.mvps || 0,
        created_at: p.created_at || new Date().toISOString(),
      };
    });

    return NextResponse.json({ players: playersList });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const incomingPlayers = Array.isArray(body.players) ? body.players : [body];

    // Buscar mapa atual
    const eloQueryUrl = `${supabaseUrl}/rest/v1/match_lobby?select=*&slot_id=eq.96`;
    const eloRes = await fetch(eloQueryUrl, {
      headers: { Authorization: `Bearer ${supabaseKey}`, apikey: supabaseKey },
      cache: 'no-store',
    });
    const eloData = eloRes.ok ? await eloRes.json() : [];
    let currentEloMap: Record<string, any> = {};
    if (eloData.length > 0) {
      try { currentEloMap = JSON.parse(eloData[0].player_name); } catch(e) {}
    }

    incomingPlayers.forEach((ip: any) => {
      if (!ip || !ip.name) return;
      const s = cleanSlug(ip.name);
      const existing = currentEloMap[s] || {};

      currentEloMap[s] = {
        ...existing,
        name: ip.name,
        steamid: ip.steamid || existing.steamid || '',
        rating: ip.rating !== undefined ? ip.rating : (ip.elo !== undefined ? ip.elo : (existing.rating || existing.elo || 1000)),
        elo: ip.rating !== undefined ? ip.rating : (ip.elo !== undefined ? ip.elo : (existing.elo || existing.rating || 1000)),
        matches: ip.matches !== undefined ? ip.matches : (existing.matches || (existing.wins || 0) + (existing.losses || 0)),
        wins: ip.wins !== undefined ? ip.wins : (existing.wins || 0),
        losses: ip.losses !== undefined ? ip.losses : (existing.losses || 0),
        kills: ip.kills !== undefined ? ip.kills : (existing.kills || 0),
        deaths: ip.deaths !== undefined ? ip.deaths : (existing.deaths || 0),
        assists: ip.assists !== undefined ? ip.assists : (existing.assists || 0),
        damage: ip.damage !== undefined ? ip.damage : (existing.damage || 0),
        mvps: ip.mvps !== undefined ? ip.mvps : (existing.mvps || 0),
        created_at: ip.created_at || existing.created_at || new Date().toISOString(),
      };
    });

    // Upsert no slot 96
    const upsertUrl = `${supabaseUrl}/rest/v1/match_lobby`;
    await fetch(upsertUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
        apikey: supabaseKey,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        slot_id: 96,
        player_name: JSON.stringify(currentEloMap),
        joined_at: new Date().toISOString(),
      }),
    });

    return NextResponse.json({ success: true, count: incomingPlayers.length });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Erro ao sincronizar estatísticas do servidor' }, { status: 500 });
  }
}
