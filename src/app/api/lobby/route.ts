import { NextRequest, NextResponse } from 'next/server';
import { players, tiers } from '../../data';

function cleanSlug(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

// Buscar nível (lvl) do jogador na tabela tiers
function getPlayerLevel(playerName: string): number {
  const searchName = playerName.toLowerCase();
  for (const list of Object.values(tiers)) {
    const found = list.find(p =>
      p.name.toLowerCase() === searchName ||
      p.name.toLowerCase().includes(searchName) ||
      searchName.includes(p.name.toLowerCase())
    );
    if (found) return found.lvl;
  }
  return 10; // Nível padrão
}

// Algoritmo de Balanceamento Perfeito 5vs5
// Regra de Ouro: Jogadores Tier S (Lvl >= 17) DEVEM ser divididos igualmente entre os dois times (ex: 1 pro Time A, 1 pro Time B)!
function balanceTeams(slots: any[]) {
  const validPlayers = slots.filter(s => s && s.player_name);
  if (validPlayers.length < 2) return null;

  const n = validPlayers.length;
  const teamSize = Math.floor(n / 2);

  // Gerar todas as combinações de tamanho teamSize
  function getCombinations(arr: any[], k: number): any[][] {
    if (k === 0) return [[]];
    if (arr.length === 0) return [];
    const head = arr[0];
    const tail = arr.slice(1);
    const withHead = getCombinations(tail, k - 1).map(c => [head, ...c]);
    const withoutHead = getCombinations(tail, k);
    return [...withHead, ...withoutHead];
  }

  const combinations = getCombinations(validPlayers, teamSize);
  const HIGH_LEVEL_THRESHOLD = 17; // Jogadores de Nível Alto / Tier S

  let bestHighDiff = Infinity;
  let bestSumDiff = Infinity;
  let bestTeams: { teamA: any[]; teamB: any[]; sumA: number; sumB: number; diff: number }[] = [];

  combinations.forEach(teamA => {
    const idsA = new Set(teamA.map(p => p.slot_id));
    const teamB = validPlayers.filter(p => !idsA.has(p.slot_id));

    // Contar quantos Tier S ficaram em cada time
    const highA = teamA.filter(p => (p.lvl || 10) >= HIGH_LEVEL_THRESHOLD).length;
    const highB = teamB.filter(p => (p.lvl || 10) >= HIGH_LEVEL_THRESHOLD).length;
    const highDiff = Math.abs(highA - highB);

    const sumA = teamA.reduce((acc, p) => acc + (p.lvl || 10), 0);
    const sumB = teamB.reduce((acc, p) => acc + (p.lvl || 10), 0);
    const sumDiff = Math.abs(sumA - sumB);

    // Prioridade 1: Dividir jogadores Tier S (20, 19, 18, 17) de forma igual (highDiff = 0 ou mínimo)
    // Prioridade 2: Minimizar a diferença da soma de níveis total (sumDiff)
    if (highDiff < bestHighDiff) {
      bestHighDiff = highDiff;
      bestSumDiff = sumDiff;
      bestTeams = [{ teamA, teamB, sumA, sumB, diff: sumDiff }];
    } else if (highDiff === bestHighDiff) {
      if (sumDiff < bestSumDiff) {
        bestSumDiff = sumDiff;
        bestTeams = [{ teamA, teamB, sumA, sumB, diff: sumDiff }];
      } else if (sumDiff === bestSumDiff) {
        bestTeams.push({ teamA, teamB, sumA, sumB, diff: sumDiff });
      }
    }
  });

  // Sortear uma das combinações perfeitamente equilibradas se houver mais de uma
  const chosen = bestTeams[Math.floor(Math.random() * bestTeams.length)];
  return chosen;
}

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ slots: Array(10).fill(null), drawResult: null });
    }

    const queryUrl = `${supabaseUrl}/rest/v1/match_lobby?select=*&order=slot_id.asc`;

    const res = await fetch(queryUrl, {
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ slots: Array(10).fill(null), drawResult: null });
    }

    const data = await res.json();
    const slotsMap: Record<number, any> = {};

    let storedDrawResult = null;
    let storedMatchHistory: any[] = [];
    let storedVetoState = { bannedMaps: [], vetoTurn: 'teamA' };
    let storedEloMap: Record<string, { name: string; elo: number; wins: number; losses: number }> = {};

    if (Array.isArray(data)) {
      data.forEach(item => {
        if (item.slot_id === 99) {
          // Registro reservado para o resultado do sorteio
          try { storedDrawResult = JSON.parse(item.player_name); } catch(e) {}
        } else if (item.slot_id === 98) {
          // Registro reservado para o histórico de partidas do lobby
          try { storedMatchHistory = JSON.parse(item.player_name); } catch(e) {}
        } else if (item.slot_id === 97) {
          // Registro reservado para o estado de veto de mapas ao vivo
          try { storedVetoState = JSON.parse(item.player_name); } catch(e) {}
        } else if (item.slot_id === 96) {
          // Registro reservado para a pontuação ELO dos jogadores
          try { storedEloMap = JSON.parse(item.player_name); } catch(e) {}
        } else {
          slotsMap[item.slot_id] = item;
        }
      });
    }

    const slots = Array.from({ length: 10 }, (_, i) => slotsMap[i + 1] || null);

    return NextResponse.json({ slots, drawResult: storedDrawResult, matchHistory: storedMatchHistory, vetoState: storedVetoState, eloMap: storedEloMap });
  } catch (e) {
    return NextResponse.json({ slots: Array(10).fill(null), drawResult: null, matchHistory: [], vetoState: { bannedMaps: [], vetoTurn: 'teamA' }, eloMap: {} });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 });
    }

    const { action, slotId, playerName, teamId, scoreA, scoreB, mapName, teamA, teamB } = await request.json();

    if (action === 'save_match') {
      if (scoreA === undefined || scoreB === undefined) {
        return NextResponse.json({ error: 'Placar inválido' }, { status: 400 });
      }

      // Buscar histórico existente
      const queryUrl = `${supabaseUrl}/rest/v1/match_lobby?select=*&slot_id=eq.98`;
      const histRes = await fetch(queryUrl, {
        headers: { 'Authorization': `Bearer ${supabaseKey}`, 'apikey': supabaseKey },
        cache: 'no-store',
      });
      const histData = histRes.ok ? await histRes.json() : [];
      let currentHistory: any[] = [];
      if (histData.length > 0) {
        try { currentHistory = JSON.parse(histData[0].player_name); } catch(e) {}
      }

      const newMatchRecord = {
        id: Date.now().toString(),
        scoreA,
        scoreB,
        mapName: mapName || 'Dust II',
        teamA: teamA || [],
        teamB: teamB || [],
        date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
      };

      const updatedHistory = [newMatchRecord, ...currentHistory];

      // Salvar histórico atualizado no slot 98
      const upsertUrl = `${supabaseUrl}/rest/v1/match_lobby`;
      await fetch(upsertUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          slot_id: 98,
          player_name: JSON.stringify(updatedHistory),
          joined_at: new Date().toISOString(),
        }),
      });

      // Atualizar ELO e estatísticas individuais dos jogadores no slot 96 (Estilo FaceIT)
      const eloQueryUrl = `${supabaseUrl}/rest/v1/match_lobby?select=*&slot_id=eq.96`;
      const eloRes = await fetch(eloQueryUrl, {
        headers: { 'Authorization': `Bearer ${supabaseKey}`, 'apikey': supabaseKey },
        cache: 'no-store',
      });
      const eloData = eloRes.ok ? await eloRes.json() : [];
      let currentEloMap: Record<string, { name: string; elo: number; wins: number; losses: number }> = {};
      if (eloData.length > 0) {
        try { currentEloMap = JSON.parse(eloData[0].player_name); } catch(e) {}
      }

      const winners = scoreA > scoreB ? (teamA || []) : scoreB > scoreA ? (teamB || []) : [];
      const losers = scoreA > scoreB ? (teamB || []) : scoreB > scoreA ? (teamA || []) : [];

      winners.forEach((p: any) => {
        if (!p || !p.player_name) return;
        const s = cleanSlug(p.player_name);
        const playerStats = currentEloMap[s] || { name: p.player_name, elo: 1000, wins: 0, losses: 0 };
        playerStats.name = p.player_name;
        playerStats.elo += 25;
        playerStats.wins += 1;
        currentEloMap[s] = playerStats;
      });

      losers.forEach((p: any) => {
        if (!p || !p.player_name) return;
        const s = cleanSlug(p.player_name);
        const playerStats = currentEloMap[s] || { name: p.player_name, elo: 1000, wins: 0, losses: 0 };
        playerStats.name = p.player_name;
        playerStats.elo = Math.max(100, playerStats.elo - 15);
        playerStats.losses += 1;
        currentEloMap[s] = playerStats;
      });

      await fetch(upsertUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          slot_id: 96,
          player_name: JSON.stringify(currentEloMap),
          joined_at: new Date().toISOString(),
        }),
      });

      return NextResponse.json({ success: true, matchHistory: updatedHistory, eloMap: currentEloMap });
    }

    if (action === 'ban_map') {
      if (!mapName) {
        return NextResponse.json({ error: 'Falta o mapa' }, { status: 400 });
      }

      const queryUrl = `${supabaseUrl}/rest/v1/match_lobby?select=*&slot_id=eq.97`;
      const vetoRes = await fetch(queryUrl, {
        headers: { 'Authorization': `Bearer ${supabaseKey}`, 'apikey': supabaseKey },
        cache: 'no-store',
      });
      const vetoData = vetoRes.ok ? await vetoRes.json() : [];
      let vetoState = { bannedMaps: [] as string[], vetoTurn: 'teamA' };
      if (vetoData.length > 0) {
        try { vetoState = JSON.parse(vetoData[0].player_name); } catch(e) {}
      }

      if (!vetoState.bannedMaps.includes(mapName)) {
        vetoState.bannedMaps.push(mapName);
        vetoState.vetoTurn = vetoState.vetoTurn === 'teamA' ? 'teamB' : 'teamA';
      }

      const upsertUrl = `${supabaseUrl}/rest/v1/match_lobby`;
      await fetch(upsertUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          slot_id: 97,
          player_name: JSON.stringify(vetoState),
          joined_at: new Date().toISOString(),
        }),
      });

      return NextResponse.json({ success: true, vetoState });
    }

    if (action === 'reset_veto') {
      const vetoState = { bannedMaps: [], vetoTurn: 'teamA' };
      const upsertUrl = `${supabaseUrl}/rest/v1/match_lobby`;
      await fetch(upsertUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          slot_id: 97,
          player_name: JSON.stringify(vetoState),
          joined_at: new Date().toISOString(),
        }),
      });

      return NextResponse.json({ success: true, vetoState });
    }

    if (action === 'join') {
      const { customLevel } = await request.json().catch(() => ({}));
      if (!slotId || !playerName) {
        return NextResponse.json({ error: 'Falta slotId ou playerName' }, { status: 400 });
      }

      const slug = cleanSlug(playerName);
      const lvl = customLevel ? parseInt(customLevel) : getPlayerLevel(playerName);
      const matchedPlayer = players.find(p => p.name.toLowerCase() === playerName.toLowerCase());
      const finalTeamId = teamId || matchedPlayer?.teamId || 'desacreditados';

      // Upsert no slot selecionado
      const upsertUrl = `${supabaseUrl}/rest/v1/match_lobby`;
      const res = await fetch(upsertUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          slot_id: slotId,
          player_name: playerName,
          player_slug: slug,
          team_id: finalTeamId,
          lvl,
          joined_at: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        return NextResponse.json({ error: 'Erro ao entrar na vaga' }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    if (action === 'leave') {
      if (!slotId) {
        return NextResponse.json({ error: 'Falta slotId' }, { status: 400 });
      }

      const deleteUrl = `${supabaseUrl}/rest/v1/match_lobby?slot_id=eq.${slotId}`;
      const res = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
        },
      });

      if (!res.ok) {
        return NextResponse.json({ error: 'Erro ao sair da vaga' }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    if (action === 'reset') {
      // Limpar todos os slots
      const deleteUrl = `${supabaseUrl}/rest/v1/match_lobby?slot_id=gt.0`;
      await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
        },
      });

      return NextResponse.json({ success: true });
    }

    if (action === 'draw') {
      // Buscar slots atuais para sortear
      const queryUrl = `${supabaseUrl}/rest/v1/match_lobby?select=*&slot_id=lte.10`;
      const res = await fetch(queryUrl, {
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
        },
        cache: 'no-store',
      });

      const slotsData = res.ok ? await res.json() : [];
      const drawResult = balanceTeams(slotsData);

      if (!drawResult) {
        return NextResponse.json({ error: 'É necessário pelo menos 2 jogadores no lobby para sortear' }, { status: 400 });
      }

      // Salvar resultado do sorteio no slot 99
      const upsertUrl = `${supabaseUrl}/rest/v1/match_lobby`;
      await fetch(upsertUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          slot_id: 99,
          player_name: JSON.stringify(drawResult),
          joined_at: new Date().toISOString(),
        }),
      });

      return NextResponse.json({ drawResult });
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Erro interno' }, { status: 500 });
  }
}
