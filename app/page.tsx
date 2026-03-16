import { getLeaderboard, getDashboardStats } from '@/lib/data/queries';
import { projects as mockProjects, globalStats as mockStats } from '@/lib/mock-data';
import { HeroStats } from '@/components/dashboard/hero-stats';
import { LeaderboardTable } from '@/components/dashboard/leaderboard-table';

export const revalidate = 300;

export default async function HomePage() {
  const stats = await getDashboardStats();
  const { projects } = await getLeaderboard({ limit: 200 });

  const usesMock = projects.length === 0;
  const displayProjects = usesMock ? mockProjects : projects;
  const displayStats = usesMock ? mockStats : stats;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      {usesMock && (
        <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-sm text-amber-400">
          Displaying sample data. Real scores are being calculated.
        </div>
      )}

      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Project Leaderboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          The heartbeat of Web3 — real-time health scores for {displayProjects.length} projects
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8">
        <HeroStats stats={displayStats} />
      </div>

      {/* Leaderboard */}
      <LeaderboardTable projects={displayProjects} />
    </div>
  );
}
