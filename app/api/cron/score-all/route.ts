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
    // ?mode=all — score everything (only works locally or on Pro plan)
    if (mode === 'all') {
      const result = await scoreAllProjects();
      return NextResponse.json({ success: true, ...result, timestamp: new Date().toISOString() });
    }

    // Default: batch score multiple projects within the 60s limit
    // Each project takes ~8-12s (API calls + rate limits), so we can fit ~5 per run
    // With 2 runs/day, all ~40 projects get scored every ~4 days
    const batchSize = 5;
    const results: { name: string; score: number }[] = [];
    const startTime = Date.now();

    for (let i = 0; i < batchSize; i++) {
      // Safety: stop if we're running close to the 60s limit
      if (Date.now() - startTime > 45_000) break;

      const result = await scoreNextProject();
      if (!result.projectId) break;
      if ('projectName' in result) {
        results.push({ name: result.projectName, score: result.score });
      }
    }

    return NextResponse.json({
      success: true,
      scored: results.length,
      projects: results,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('[Cron] Score failed:', err);
    return NextResponse.json({ error: 'Scoring failed' }, { status: 500 });
  }
}
