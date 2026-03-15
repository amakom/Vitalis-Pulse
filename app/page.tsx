import { projects } from '@/lib/mock-data';
import { HeroStats } from '@/components/dashboard/hero-stats';
import { LeaderboardTable } from '@/components/dashboard/leaderboard-table';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Project Leaderboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          The heartbeat of Web3 — real-time health scores for {projects.length} projects
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8">
        <HeroStats />
      </div>

      {/* Leaderboard */}
      <LeaderboardTable projects={projects} />
    </div>
  );
}
