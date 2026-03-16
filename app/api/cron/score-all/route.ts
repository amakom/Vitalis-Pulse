import { NextRequest, NextResponse } from 'next/server';
import { scoreNextProject, scoreAllProjects } from '@/lib/scoring/pipeline';

export const maxDuration = 60; // Hobby plan limit
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('mode');

  try {
    // Default: score the single oldest-scored project (fits in 60s)
    // Use ?mode=all to score everything (only works locally or on Pro plan)
    if (mode === 'all') {
      const result = await scoreAllProjects();
      return NextResponse.json({ success: true, ...result, timestamp: new Date().toISOString() });
    }

    const result = await scoreNextProject();
    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('[Cron] Score failed:', err);
    return NextResponse.json({ error: 'Scoring failed' }, { status: 500 });
  }
}
