import { NextRequest, NextResponse } from 'next/server';
import { seedProjects } from '@/lib/scoring/seed';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await seedProjects();
  return NextResponse.json({ success: true, message: '20 projects seeded' });
}
