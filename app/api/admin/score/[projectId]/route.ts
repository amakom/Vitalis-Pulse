import { NextRequest, NextResponse } from 'next/server';
import { scoreProject } from '@/lib/scoring/pipeline';

export const maxDuration = 120;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { projectId } = await params;
    await scoreProject(projectId);
    return NextResponse.json({ success: true, projectId });
  } catch (err) {
    console.error('[Admin] Score failed:', err);
    return NextResponse.json({ error: 'Scoring failed' }, { status: 500 });
  }
}
