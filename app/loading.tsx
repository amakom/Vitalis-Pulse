import { LeaderboardSkeleton } from '@/components/dashboard/skeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <LeaderboardSkeleton />
    </div>
  );
}
