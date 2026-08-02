import { NextResponse } from 'next/server';

function cleanSlug(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

const DEFAULT_ALIASES: Record<string, string> = {
  'vvs_perry': 'manu',
  'vvsperry': 'manu',
  'perry': 'manu',
  'manuel': 'manu',
};

async function getAliasMap(supabaseUrl: string, supabaseKey: string): Promise<Record<string, string>> {
  try {
    const aliasQueryUrl = `${supabaseUrl}/rest/v1/match_lobby?select=*&slot_id=eq.95`;
    const aliasRes = await fetch(aliasQueryUrl, {
      headers: { Authorization: `Bearer ${supabaseKey}`, apikey: supabaseKey },
      cache: 'no-store',
    });
    const aliasData = aliasRes.ok ? await aliasRes.json() : [];
    let customMap: Record<string, string> = {};
    if (aliasData.length > 0) {
      try { customMap = JSON.parse(aliasData[0].player_name); } catch (e) {}
    }
    return { ...DEFAULT_ALIASES, ...customMap };
  } catch (e) {
    return DEFAULT_ALIASES;
  }
}

function resolvePlayerSlug(name: string, steamid: string = '', aliasMap: Record<string, string>): string {
  const rawSlug = cleanSlug(name);
  if (aliasMap[rawSlug]) return aliasMap[rawSlug];
  if (steamid && aliasMap[steamid]) return aliasMap[steamid];
  return rawSlug;
}

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ players: [], aliases: DEFAULT_ALIASES });
  }

  try {
    const aliasMap = await getAliasMap(supabaseUrl, supabaseKey);

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

    return NextResponse.json({ players: playersList, aliases: aliasMap });
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

  // 1. Validação Obrigatória de Autenticação no POST (Bearer <key> / x-api-key / ?key=)
  const expectedApiKey = process.env.WEBSYNC_API_KEY || process.env.MIX_API_KEY || 'gurizada-mix-secret-key-2026';
  
  const authHeader = request.headers.get('authorization') || '';
  const xApiKey = request.headers.get('x-api-key') || '';
  const { searchParams } = new URL(request.url);
  const queryKey = searchParams.get('key') || searchParams.get('token') || '';

  const receivedToken = authHeader.replace(/^Bearer\s+/i, '').trim() || xApiKey.trim() || queryKey.trim();

  if (receivedToken !== expectedApiKey) {
    return NextResponse.json(
      { error: 'Não autorizado. Chave de API (WebSyncApiKey) inválida ou não informada.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    // 2. Tratamento do Sinal de Wipe (ex: !rating_wipe => {"wipe": true})
    if (body && (body.wipe === true || body.wipe === 'true')) {
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
          player_name: JSON.stringify({}),
          joined_at: new Date().toISOString(),
        }),
      });

      return NextResponse.json({
        success: true,
        message: 'Rating wipe efetuado e salvo no Supabase com sucesso',
        wipe: true,
      }, { status: 200 });
    }

    // 3. Adicionar Alias / Mapeamento de Nome (action: 'add_alias')
    if (body.action === 'add_alias' && body.steamNick && body.champName) {
      const currentAliasMap = await getAliasMap(supabaseUrl, supabaseKey);
      currentAliasMap[cleanSlug(body.steamNick)] = cleanSlug(body.champName);

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
          slot_id: 95,
          player_name: JSON.stringify(currentAliasMap),
          joined_at: new Date().toISOString(),
        }),
      });

      return NextResponse.json({ success: true, aliases: currentAliasMap }, { status: 200 });
    }

    // 4. Lote de Jogadores ou Jogador Único
    const incomingPlayers = Array.isArray(body.players)
      ? body.players
      : (body.name || body.steamid ? [body] : []);

    if (incomingPlayers.length === 0) {
      // Caso seja um payload genérico ou desconhecido, responder 200 para não travar o plugin
      return NextResponse.json({ success: true, message: 'Payload recebido' }, { status: 200 });
    }

    const aliasMap = await getAliasMap(supabaseUrl, supabaseKey);

    // Buscar mapa ELO atual do Supabase
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
      const s = resolvePlayerSlug(ip.name, ip.steamid, aliasMap);
      const existing = currentEloMap[s] || {};

      currentEloMap[s] = {
        ...existing,
        name: existing.name || ip.name,
        serverName: ip.name,
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

    // 5. Salvar / Persistir mapa atualizado no Supabase (slot_id = 96)
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

    return NextResponse.json({ success: true, count: incomingPlayers.length }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Erro ao sincronizar estatísticas do servidor' }, { status: 500 });
  }
}
