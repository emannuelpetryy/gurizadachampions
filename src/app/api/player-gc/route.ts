import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 });
    }

    const { playerSlug, gcUrl } = await request.json();

    if (!playerSlug) {
      return NextResponse.json({ error: 'Falta o playerSlug' }, { status: 400 });
    }

    let cleanGcUrl = (gcUrl || '').trim();
    if (cleanGcUrl && !cleanGcUrl.startsWith('http://') && !cleanGcUrl.startsWith('https://')) {
      cleanGcUrl = `https://${cleanGcUrl}`;
    }

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
        updated_at: new Date().toISOString(),
      }),
    });

    if (!upsertRes.ok) {
      const errText = await upsertRes.text();
      console.error('Erro ao salvar link GC:', errText);
      return NextResponse.json({ error: 'Erro ao salvar no banco de dados' }, { status: 500 });
    }

    return NextResponse.json({ slug: playerSlug, gcUrl: cleanGcUrl });
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

    const queryUrl = `${supabaseUrl}/rest/v1/player_votes?select=player_slug,gc_url&player_slug=eq.${encodeURIComponent(slug)}`;

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
      return NextResponse.json({ gcUrl: data[0].gc_url || null });
    }

    return NextResponse.json({ gcUrl: null });
  } catch (e) {
    return NextResponse.json({});
  }
}
