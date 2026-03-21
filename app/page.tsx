import Link from 'next/link';
import { getLeaderboard, getDashboardStats } from '@/lib/data/queries';
import { projects as mockProjects, globalStats as mockStats } from '@/lib/mock-data';
import { HeroStats } from '@/components/dashboard/hero-stats';
import { LeaderboardTable } from '@/components/dashboard/leaderboard-table';
import { LandingHero } from '@/components/landing/landing-hero';

export const revalidate = 300;

export default async function HomePage() {
  const stats = await getDashboardStats();
  const { projects } = await getLeaderboard({ limit: 200 });

  const usesMock = projects.length === 0;
  const displayProjects = usesMock ? mockProjects : projects;
  const displayStats = usesMock ? mockStats : stats;

  return (
    <>
      {/* Landing Hero */}
      <LandingHero stats={displayStats} projectCount={displayProjects.length} />

      {/* Leaderboard Section */}
      <div id="leaderboard" className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        {usesMock && (
          <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-sm text-amber-400">
            Displaying sample data. Real scores are being calculated.
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Project Leaderboard
          </h2>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Real-time health scores for {displayProjects.length} projects across {usesMock ? '8' : 'multiple'} chains
          </p>
        </div>

        <div className="mb-8">
          <HeroStats stats={displayStats} />
        </div>

        <LeaderboardTable projects={displayProjects} />
      </div>
    </>
  );
}
