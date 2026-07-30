import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

const NAMESPACE = 'gurizadachampions_v3';
const API_BASE = `https://api.counterapi.dev/v1/${NAMESPACE}`;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const playersParam = searchParams.get('players');

  if (!playersParam) {
    return NextResponse.json({ error: 'Missing players parameter' }, { status: 400 });
  }

  const playerSlugs = playersParam.split(',').map(p => p.trim().toLowerCase().replace(/[^a-z0-9]/g, '_'));

  // 1. Tentar Supabase se configurado
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('player_votes')
        .select('player_slug, star_count, bagre_count')
        .in('player_slug', playerSlugs);

      if (!error && data) {
        const results: Record<string, { star: number; bagre: number }> = {};
        playerSlugs.forEach(slug => {
          results[slug] = { star: 0, bagre: 0 };
        });
        data.forEach((row: any) => {
          results[row.player_slug] = {
            star: row.star_count || 0,
            bagre: row.bagre_count || 0,
          };
        });
        return NextResponse.json(results);
      }
    } catch (e) {
      console.error('Supabase fetch failed, falling back to CounterAPI:', e);
    }
  }

  // 2. Fallback para CounterAPI
  try {
    const results: Record<string, { star: number; bagre: number }> = {};

    await Promise.all(
      playerSlugs.map(async (slug) => {
        try {
          const [resStar, resBagre] = await Promise.all([
            fetch(`${API_BASE}/star_${slug}`, { cache: 'no-store' }),
            fetch(`${API_BASE}/bagre_${slug}`, { cache: 'no-store' }),
          ]);

          const dataStar = resStar.ok ? await resStar.json() : { count: 0 };
          const dataBagre = resBagre.ok ? await resBagre.json() : { count: 0 };

          results[slug] = {
            star: dataStar.count || 0,
            bagre: dataBagre.count || 0,
          };
        } catch (err) {
          results[slug] = { star: 0, bagre: 0 };
        }
      })
    );

    return NextResponse.json(results);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch votes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Suporte a envio individual ou em lote (batch)
    const votesToProcess: { playerSlug: string; type: 'star' | 'bagre' }[] = 
      Array.isArray(body.votes) ? body.votes : (body.playerSlug ? [body] : []);

    if (votesToProcess.length === 0) {
      return NextResponse.json({ error: 'No votes provided' }, { status: 400 });
    }

    const results: any[] = [];

    for (const voteItem of votesToProcess) {
      const { playerSlug, type } = voteItem;
      if (!playerSlug || (type !== 'star' && type !== 'bagre')) continue;

      const cleanSlug = playerSlug.toLowerCase().replace(/[^a-z0-9]/g, '_');

      if (supabase) {
        try {
          const { data: existing } = await supabase
            .from('player_votes')
            .select('star_count, bagre_count')
            .eq('player_slug', cleanSlug)
            .single();

          let newStar = existing?.star_count || 0;
          let newBagre = existing?.bagre_count || 0;

          if (type === 'star') newStar += 1;
          if (type === 'bagre') newBagre += 1;

          const { error: upsertErr } = await supabase
            .from('player_votes')
            .upsert({
              player_slug: cleanSlug,
              star_count: newStar,
              bagre_count: newBagre,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'player_slug' });

          if (!upsertErr) {
            results.push({ slug: cleanSlug, type, count: type === 'star' ? newStar : newBagre });
            continue;
          }
        } catch (e) {
          console.error('Supabase vote error, fallback to CounterAPI:', e);
        }
      }

      // Fallback CounterAPI
      try {
        const res = await fetch(`${API_BASE}/${type}_${cleanSlug}/up`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          results.push({ slug: cleanSlug, type, count: data.count || 1 });
        }
      } catch (err) {
        results.push({ slug: cleanSlug, type, count: 1 });
      }
    }

    return NextResponse.json({ success: true, processed: results.length, results });
  } catch (e) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
