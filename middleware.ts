import { updateSession } from '@/lib/supabase/middleware';
import { type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Match all routes except static files and API routes that don't need auth
    '/((?!_next/static|_next/image|favicon.ico|api/cron|api/v1).*)',
  ],
};
