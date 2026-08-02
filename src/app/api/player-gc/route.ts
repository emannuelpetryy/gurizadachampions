import { NextRequest, NextResponse } from 'next/server';

function cleanSlug(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 });
    }

    const { playerSlug, gcUrl, steamNick } = await request.json();

    if (!playerSlug) {
      return NextResponse.json({ error: 'Falta o playerSlug' }, { status: 400 });
    }

    let cleanGcUrl = (gcUrl || '').trim();
    if (cleanGcUrl && !cleanGcUrl.startsWith('http://') && !cleanGcUrl.startsWith('https://')) {
      cleanGcUrl = `https://${cleanGcUrl}`;
    }

    const cleanSteamNick = (steamNick || '').trim();

    // Upsert em player_votes
    const upsertUrl = `${supabaseUrl}/rest/v1/player_votes`;
    const upsertRes = await fetch(upsertUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        player_slug: playerSlug,
        gc_url: cleanGcUrl,
        steam_nick: cleanSteamNick,
        updated_at: new Date().toISOString(),
      }),
    });

    // Se um nick da Steam foi informado, salvar alias no slot 95 do match_lobby
    if (cleanSteamNick) {
      try {
        const aliasQueryUrl = `${supabaseUrl}/rest/v1/match_lobby?select=*&slot_id=eq.95`;
        const aliasRes = await fetch(aliasQueryUrl, {
          headers: { Authorization: `Bearer ${supabaseKey}`, apikey: supabaseKey },
          cache: 'no-store',
        });
        const aliasData = aliasRes.ok ? await aliasRes.json() : [];
        let aliasMap: Record<string, string> = {};
        if (aliasData.length > 0) {
          try { aliasMap = JSON.parse(aliasData[0].player_name); } catch(e) {}
        }
        aliasMap[cleanSlug(cleanSteamNick)] = cleanSlug(playerSlug);

        const aliasUpsertUrl = `${supabaseUrl}/rest/v1/match_lobby`;
        await fetch(aliasUpsertUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${supabaseKey}`,
            apikey: supabaseKey,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates',
          },
          body: JSON.stringify({
            slot_id: 95,
            player_name: JSON.stringify(aliasMap),
            joined_at: new Date().toISOString(),
          }),
        });
      } catch (e) {
        console.error('Erro ao sincronizar alias:', e);
      }
    }

    return NextResponse.json({ slug: playerSlug, gcUrl: cleanGcUrl, steamNick: cleanSteamNick });
  } catch (e: any) {
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({});
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Falta o slug' }, { status: 400 });
    }

    const queryUrl = `${supabaseUrl}/rest/v1/player_votes?select=player_slug,gc_url,steam_nick&player_slug=eq.${encodeURIComponent(slug)}`;

    const res = await fetch(queryUrl, {
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({});
    }

    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return NextResponse.json({ gcUrl: data[0].gc_url || null, steamNick: data[0].steam_nick || null });
    }

    return NextResponse.json({ gcUrl: null, steamNick: null });
  } catch (e) {
    return NextResponse.json({});
  }
}
