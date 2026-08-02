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

function getProp(obj: any, ...possibleKeys: string[]) {
  if (!obj || typeof obj !== 'object') return undefined;
  for (const k of possibleKeys) {
    if (obj[k] !== undefined) return obj[k];
  }
  const keys = Object.keys(obj);
  for (const k of possibleKeys) {
    const lower = k.toLowerCase();
    const foundKey = keys.find(key => key.toLowerCase() === lower);
    if (foundKey && obj[foundKey] !== undefined) return obj[foundKey];
  }
  return undefined;
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
    if (body && (getProp(body, 'wipe') === true || getProp(body, 'wipe') === 'true')) {
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
    const action = getProp(body, 'action');
    const steamNick = getProp(body, 'steamNick', 'steam_nick', 'SteamNick');
    const champName = getProp(body, 'champName', 'champ_name', 'ChampName');

    if (action === 'add_alias' && steamNick && champName) {
      const currentAliasMap = await getAliasMap(supabaseUrl, supabaseKey);
      currentAliasMap[cleanSlug(steamNick)] = cleanSlug(champName);

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

    // 4. Lote de Jogadores ou Jogador Único (suporta C# PascalCase e JSON camelCase/snake_case)
    const rawPlayers = getProp(body, 'players', 'Players', 'data', 'Data', 'stats', 'Stats');
    const incomingPlayers = Array.isArray(rawPlayers)
      ? rawPlayers
      : (getProp(body, 'name', 'Name') || getProp(body, 'steamid', 'SteamID', 'SteamId') ? [body] : []);

    if (incomingPlayers.length === 0) {
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
      const name = getProp(ip, 'name', 'Name', 'PlayerName', 'player_name', 'nick', 'Nick');
      if (!name) return;
      
      const steamid = getProp(ip, 'steamid', 'SteamID', 'SteamId', 'steam_id') || '';
      const s = resolvePlayerSlug(name, steamid, aliasMap);
      const existing = currentEloMap[s] || {};

      const rawWins = getProp(ip, 'wins', 'Wins');
      const rawLosses = getProp(ip, 'losses', 'Losses');
      const rawMatches = getProp(ip, 'matches', 'Matches');
      const rawKills = getProp(ip, 'kills', 'Kills');
      const rawDeaths = getProp(ip, 'deaths', 'Deaths');
      const rawAssists = getProp(ip, 'assists', 'Assists');
      const rawDamage = getProp(ip, 'damage', 'Damage');
      const rawMvps = getProp(ip, 'mvps', 'MVPs', 'Mvps');
      const rawRating = getProp(ip, 'rating', 'Rating', 'elo', 'Elo');

      const wins = rawWins !== undefined ? Number(rawWins) : (existing.wins || 0);
      const losses = rawLosses !== undefined ? Number(rawLosses) : (existing.losses || 0);
      const matches = rawMatches !== undefined ? Number(rawMatches) : (existing.matches || wins + losses);
      const kills = rawKills !== undefined ? Number(rawKills) : (existing.kills || 0);
      const deaths = rawDeaths !== undefined ? Number(rawDeaths) : (existing.deaths || 0);
      const assists = rawAssists !== undefined ? Number(rawAssists) : (existing.assists || 0);
      const damage = rawDamage !== undefined ? Number(rawDamage) : (existing.damage || 0);
      const mvps = rawMvps !== undefined ? Number(rawMvps) : (existing.mvps || 0);

      // Calcular ELO / Rating Dinâmico baseado em performance individual (Estilo FaceIT / GamersClub)
      let computedRating = rawRating !== undefined ? Number(rawRating) : null;

      if (computedRating === null) {
        const kdRatio = kills / Math.max(1, deaths);
        const avgDmg = matches > 0 ? (damage / (matches * 20)) : 0;
        const baseScore = 1000 + (wins * 20) - (losses * 15);
        const kdBonus = Math.round((kdRatio - 1.0) * 40);
        const adrBonus = Math.round((avgDmg - 75) * 0.5);
        const mvpBonus = mvps * 2;

        computedRating = Math.max(100, Math.round(baseScore + kdBonus + adrBonus + mvpBonus));
      }

      currentEloMap[s] = {
        ...existing,
        name: existing.name || name,
        serverName: name,
        steamid: steamid || existing.steamid || '',
        rating: computedRating,
        elo: computedRating,
        matches,
        wins,
        losses,
        kills,
        deaths,
        assists,
        damage,
        mvps,
        created_at: getProp(ip, 'created_at', 'CreatedAt') || existing.created_at || new Date().toISOString(),
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
