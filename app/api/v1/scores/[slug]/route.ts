import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const { data, error } = await supabase
    .from('projects')
    .select(`*, score:current_scores(*)`)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const { data: history } = await supabase
    .from('score_history')
    .select('vitalis_score, recorded_at')
    .eq('project_id', data.id)
    .order('recorded_at', { ascending: true })
    .limit(90);

  const response = NextResponse.json({
    data: {
      ...data,
      score: Array.isArray(data.score) ? data.score[0] : data.score,
      scoreHistory: history || [],
    },
  });

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Cache-Control', 'public, s-maxage=300');

  return response;
}
