import { NextResponse } from 'next/server';

function cleanSlug(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

const DEFAULT_ALIASES: Record<string, string> = {
  'vvs_perry': 'manu',
  'vvsperry': 'manu',
  'perry': 'manu',
  'manuel': 'manu',
  'desacreditados_distress': 'distress_pedro',
  'distress': 'distress_pedro',
  'jalin_zero2': 'zero2',
  'zero2': 'zero2',
  'ptk': 'peteka',
  'desacreditados_leluia': 'sorps_leluia',
  'leluia': 'sorps_leluia',
  '5cns_guasca': 'alem_o',
  'guasca': 'alem_o',
  'gilson_e_sports_gilson_tedesko': 'gilson_tedesko',
  'vvs_samucahemp': 'samucahemp',
  'vvs_baronelis': 'baronelis',
  'vvs_duz_o': 'duzao',
  'jalin_duzz': 'duzz',
  'jalin_k_t': 'knight',
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

    // ==========================================
    // NOVA ARQUITETURA: APENAS DADOS DE PARTIDAS
    // ==========================================
    const scoreA = getProp(body, 'scoreA', 'ScoreA', 'score_a', 'score_ct', 'ScoreCT');
    const scoreB = getProp(body, 'scoreB', 'ScoreB', 'score_b', 'score_t', 'ScoreT');
    
    if (scoreA === undefined || scoreB === undefined) {
      // Se não for um payload de final de partida (MatchStats), ignoramos.
      // Isso impede que o KentoRankme ou outros plugins sobrescrevam e baguncem os dados com estatísticas de Deathmatch/Warmup.
      return NextResponse.json({ success: true, message: 'Ignorando estatísticas acumulativas. Aceitando apenas finais de partida.' }, { status: 200 });
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

      const rawKills = getProp(ip, 'kills', 'Kills');
      const rawDeaths = getProp(ip, 'deaths', 'Deaths');
      const rawAssists = getProp(ip, 'assists', 'Assists');
      const rawDamage = getProp(ip, 'damage', 'Damage');
      const rawMvps = getProp(ip, 'mvps', 'MVPs', 'Mvps');
      const rawRating = getProp(ip, 'rating', 'Rating', 'elo', 'Elo');

      // Não confiar nos Wins/Losses do servidor CS2 (frequentemente bugam por causa da troca de lados no half)
      let wins = existing.wins || 0;
      let losses = existing.losses || 0;
      let matches = existing.matches || (wins + losses);
      
      // Se a partida acabou (tem scoreA e scoreB), verificar se o jogador estava na partida e dar a vitória/derrota
      const payloadScoreA = getProp(body, 'scoreA', 'ScoreA', 'score_a');
      const payloadScoreB = getProp(body, 'scoreB', 'ScoreB', 'score_b');
      if (payloadScoreA !== undefined && payloadScoreB !== undefined) {
         const tA = getProp(body, 'teamA', 'TeamA') || [];
         const tB = getProp(body, 'teamB', 'TeamB') || [];
         
         const inA = tA.some((tp: any) => tp.player_name === name || tp.player_name === steamid);
         const inB = tB.some((tp: any) => tp.player_name === name || tp.player_name === steamid);
         
         if (inA || inB) {
            matches += 1;
            const won = inA ? Number(payloadScoreA) > Number(payloadScoreB) : Number(payloadScoreB) > Number(payloadScoreA);
            if (won) wins += 1;
            else losses += 1;
         }
      }

      // Acumular estatísticas da partida com o total histórico do site
      const matchKills = rawKills !== undefined ? Number(rawKills) : 0;
      const matchDeaths = rawDeaths !== undefined ? Number(rawDeaths) : 0;
      const matchAssists = rawAssists !== undefined ? Number(rawAssists) : 0;
      const matchDamage = rawDamage !== undefined ? Number(rawDamage) : 0;
      const matchMvps = rawMvps !== undefined ? Number(rawMvps) : 0;

      const kills = (existing.kills || 0) + matchKills;
      const deaths = (existing.deaths || 0) + matchDeaths;
      const assists = (existing.assists || 0) + matchAssists;
      const damage = (existing.damage || 0) + matchDamage;
      const mvps = (existing.mvps || 0) + matchMvps;

      // ======================================================
      // CÁLCULO DE ELO - Estilo FaceIT / GamersClub
      // Base: 1000 ELO inicial
      // +20 por vitória, -15 por derrota (range 15-25 baseado em dominância)
      // Bônus individual: K/D ratio, ADR (dano por round), MVPs
      // ======================================================
      let computedRating = rawRating !== undefined ? Number(rawRating) : null;

      if (computedRating === null) {
        // Base ELO = 1000 + ganhos por vitórias - perdas por derrotas
        // Vitórias valem 20 ELO, derrotas tiram 15 ELO
        const baseElo = 1000 + (wins * 20) - (losses * 15);

        // Bônus por K/D ratio (FaceIT style)
        // K/D 1.5 = +20, K/D 1.0 = 0, K/D 0.5 = -20
        const kdRatio = deaths > 0 ? kills / deaths : kills;
        const kdBonus = Math.round((kdRatio - 1.0) * 40);

        // Bônus por ADR (Dano por Round médio)
        // ADR calculado como damage total / (matches * 22 rounds médios)
        const totalRounds = matches * 22;
        const avgDmgPerRound = totalRounds > 0 ? damage / totalRounds : 0;
        // ADR 80 = +5, ADR 100 = +15, ADR 60 = -5
        const adrBonus = Math.round((avgDmgPerRound - 70) * 0.4);

        // Bônus por MVPs (Estrelas de Rodada)
        // 1 MVP = +3 ELO
        const mvpBonus = mvps * 3;

        computedRating = Math.max(100, Math.round(baseElo + kdBonus + adrBonus + mvpBonus));
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

    // 6. Se o payload inclui scoreA/scoreB, salvar histórico de partida automaticamente (slot 98)
    const matchMap = getProp(body, 'mapName', 'MapName', 'map', 'Map') || 'Não informado';
    const payloadTeamA = getProp(body, 'teamA', 'TeamA', 'team_a') || [];
    const payloadTeamB = getProp(body, 'teamB', 'TeamB', 'team_b') || [];

    if (scoreA !== undefined && scoreB !== undefined) {
      const sA = Number(scoreA);
      const sB = Number(scoreB);
      const diff = Math.abs(sA - sB);

      // ELO ganho/perdido baseado na dominância do placar
      let eloGain = diff >= 9 ? 25 : diff >= 5 ? 22 : diff >= 2 ? 18 : 15;
      let eloLoss = diff >= 9 ? 22 : diff >= 5 ? 18 : diff >= 2 ? 15 : 12;

      // Montar times com o Scoreboard embutido
      const enrichTeam = (team: any[]) => team.map(tp => {
        const pName = tp.player_name || tp.name;
        // Buscar os stats que esse jogador enviou NESTE payload (MatchStats)
        const matchData = incomingPlayers.find((ip: any) => {
           const ipName = getProp(ip, 'name', 'Name', 'PlayerName', 'player_name', 'nick', 'Nick');
           const ipSteam = getProp(ip, 'steamid', 'SteamID', 'SteamId', 'steam_id');
           return ipName === pName || (tp.steamid && tp.steamid === ipSteam);
        }) || {};
        
        return {
           player_name: pName,
           player_slug: resolvePlayerSlug(pName, tp.steamid || '', aliasMap),
           kills: matchData.kills !== undefined ? Number(matchData.kills) : 0,
           deaths: matchData.deaths !== undefined ? Number(matchData.deaths) : 0,
           assists: matchData.assists !== undefined ? Number(matchData.assists) : 0,
           damage: matchData.damage !== undefined ? Number(matchData.damage) : 0,
           mvps: matchData.mvps !== undefined ? Number(matchData.mvps) : 0,
        };
      });

      const teamAScoreboard = enrichTeam(payloadTeamA);
      const teamBScoreboard = enrichTeam(payloadTeamB);

      const histQueryUrl = `${supabaseUrl}/rest/v1/match_lobby?select=*&slot_id=eq.98`;
      const histRes = await fetch(histQueryUrl, {
        headers: { Authorization: `Bearer ${supabaseKey}`, apikey: supabaseKey },
        cache: 'no-store',
      });
      const histData = histRes.ok ? await histRes.json() : [];
      let currentHistory: any[] = [];
      if (histData.length > 0) {
        try { currentHistory = JSON.parse(histData[0].player_name); } catch (e) {}
      }

      const newMatchRecord = {
        id: Date.now().toString(),
        scoreA: sA,
        scoreB: sB,
        mapName: matchMap,
        teamA: teamAScoreboard,
        teamB: teamBScoreboard,
        eloGain,
        eloLoss,
        date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
      };

      const updatedHistory = [newMatchRecord, ...currentHistory];
      await fetch(upsertUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          apikey: supabaseKey,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          slot_id: 98,
          player_name: JSON.stringify(updatedHistory),
          joined_at: new Date().toISOString(),
        }),
      });
    }

    return NextResponse.json({ success: true, count: incomingPlayers.length }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Erro ao sincronizar estatísticas do servidor' }, { status: 500 });
  }
}
