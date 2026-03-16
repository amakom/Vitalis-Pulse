import { NextRequest, NextResponse } from 'next/server';
import { scoreAllProjects } from '@/lib/scoring/pipeline';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await scoreAllProjects();
    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('[Cron] Score-all failed:', err);
    return NextResponse.json({ error: 'Scoring failed' }, { status: 500 });
  }
}
