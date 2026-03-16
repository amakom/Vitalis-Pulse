import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const chain = searchParams.get('chain');
  const category = searchParams.get('category');
  const limit = Math.min(Number(searchParams.get('limit')) || 25, 100);
  const offset = Number(searchParams.get('offset')) || 0;

  let query = supabase
    .from('projects')
    .select(`
      id, name, slug, chain, category, website,
      score:current_scores(vitalis_score, treasury_score, development_score,
        community_score, revenue_score, governance_score, scored_at)
    `)
    .eq('is_active', true)
    .order('vitalis_score', { referencedTable: 'current_scores', ascending: false })
    .range(offset, offset + limit - 1);

  if (chain) query = query.eq('chain', chain);
  if (category) query = query.eq('category', category);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch scores' }, { status: 500 });
  }

  const response = NextResponse.json({
    data: data?.map((p: any) => ({
      ...p,
      score: Array.isArray(p.score) ? p.score[0] : p.score,
    })),
    meta: { limit, offset, chain, category },
  });

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Cache-Control', 'public, s-maxage=300');

  return response;
}
