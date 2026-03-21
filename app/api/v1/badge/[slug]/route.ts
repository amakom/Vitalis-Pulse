import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const { data } = await supabase
    .from('projects')
    .select(`slug, score:current_scores(vitalis_score)`)
    .eq('slug', slug)
    .single();

  const score = Array.isArray(data?.score) ? data.score[0]?.vitalis_score : (data?.score as any)?.vitalis_score;
  const displayScore = score || 0;

  let color = '#EF4444';
  if (displayScore >= 90) color = '#10B981';
  else if (displayScore >= 70) color = '#14B8A6';
  else if (displayScore >= 50) color = '#F59E0B';
  else if (displayScore >= 25) color = '#F97316';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="28" viewBox="0 0 160 28">
      <rect width="160" height="28" rx="6" fill="#0B1426"/>
      <rect x="1" y="1" width="158" height="26" rx="5" fill="none" stroke="${color}" stroke-width="1" opacity="0.3"/>
      <text x="8" y="18" font-family="Arial,sans-serif" font-size="10" fill="#94A3B8">VitalisPulse</text>
      <text x="56" y="18" font-family="Arial,sans-serif" font-size="11" fill="#64748B">|</text>
      <text x="68" y="18" font-family="monospace" font-size="12" font-weight="bold" fill="${color}">${displayScore}</text>
      <text x="88" y="18" font-family="Arial,sans-serif" font-size="10" fill="#64748B">/ 100</text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, s-maxage=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
