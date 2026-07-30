import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const playerSlug = formData.get('playerSlug') as string | null;

    if (!file || !playerSlug) {
      return NextResponse.json({ error: 'Missing file or playerSlug' }, { status: 400 });
    }

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Tamanho máximo: 50MB
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'A foto excede o tamanho máximo permitido de 50MB.' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${playerSlug}.${ext}`;
    const filePath = `player-photos/${fileName}`;

    const fileBuffer = await file.arrayBuffer();

    // Upload para o Supabase Storage via REST API diretamente
    const uploadUrl = `${supabaseUrl}/storage/v1/object/${filePath}`;

    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': file.type,
        'x-upsert': 'true', // substituir se já existir
      },
      body: fileBuffer,
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error('Supabase Storage upload error:', errText);
      return NextResponse.json({ error: 'Upload to storage failed', detail: errText }, { status: 500 });
    }

    // Gerar URL pública do arquivo
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${filePath}`;

    // Salvar referência na tabela player_votes (upsert)
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
        photo_url: publicUrl,
        updated_at: new Date().toISOString(),
      }),
    });

    if (!upsertRes.ok) {
      const errText = await upsertRes.text();
      console.error('Supabase DB upsert error:', errText);
      // Ainda retorna sucesso se o upload funcionou — a URL ainda é válida
    }

    return NextResponse.json({ url: publicUrl, slug: playerSlug });
  } catch (e: any) {
    console.error('Player photo upload error:', e);
    return NextResponse.json({ error: 'Internal server error', detail: e?.message }, { status: 500 });
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
    const slugsParam = searchParams.get('slugs');

    if (!slugsParam) {
      return NextResponse.json({ error: 'Missing slugs' }, { status: 400 });
    }

    const slugs = slugsParam.split(',').map(s => s.trim());

    const queryUrl = `${supabaseUrl}/rest/v1/player_votes?select=player_slug,photo_url&player_slug=in.(${slugs.map(s => `"${s}"`).join(',')})&photo_url=not.is.null`;

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
    const result: Record<string, string> = {};
    if (Array.isArray(data)) {
      data.forEach((row: any) => {
        if (row.player_slug && row.photo_url) {
          result[row.player_slug] = row.photo_url;
        }
      });
    }

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({});
  }
}
