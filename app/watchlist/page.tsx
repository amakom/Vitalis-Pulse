'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { useWatchlist } from '@/lib/hooks/use-watchlist';
import { Project } from '@/lib/types';
import { ScoreRing } from '@/components/dashboard/score-ring';
import { ChainBadge } from '@/components/dashboard/chain-badge';
import { TierBadge } from '@/components/dashboard/tier-badge';
import { getScoreColor } from '@/lib/constants';

export default function WatchlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { watchlist, loading: wlLoading, toggle } = useWatchlist();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Fetch project data for watchlisted slugs
  useEffect(() => {
    async function load() {
      if (wlLoading || watchlist.length === 0) {
        setProjects([]);
        setLoadingProjects(false);
        return;
      }

      try {
        const { getAllProjects } = await import('@/lib/data/queries');
        const allProjects = await getAllProjects();
        let matched = allProjects.filter(p => watchlist.includes(p.slug));

        // Fallback to mock if no live data
        if (matched.length === 0) {
          const { projects: mock } = await import('@/lib/mock-data');
          matched = mock.filter(p => watchlist.includes(p.slug));
        }

        setProjects(matched);
      } catch {
        const { projects: mock } = await import('@/lib/mock-data');
        setProjects(mock.filter(p => watchlist.includes(p.slug)));
      }

      setLoadingProjects(false);
    }
    load();
  }, [watchlist, wlLoading]);

  if (authLoading || wlLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="flex h-40 items-center justify-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-teal" />
          <h1 className="text-2xl font-bold">Watchlist</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {user
            ? `Tracking ${watchlist.length} project${watchlist.length !== 1 ? 's' : ''}`
            : 'Sign in to sync your watchlist across devices'}
        </p>
      </div>

      {!user && (
        <div className="mb-6 rounded-lg border border-teal/30 bg-teal/5 px-4 py-3 text-sm">
          <span className="text-muted-foreground">Your watchlist is saved locally. </span>
          <Link href="/login" className="font-medium text-teal hover:underline">
            Create an account
          </Link>
          <span className="text-muted-foreground"> to sync it across devices.</span>
        </div>
      )}

      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card py-16 text-center">
          <Star className="h-10 w-10 text-muted-foreground/30" />
          <div>
            <p className="font-medium">No projects watchlisted</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Star projects from the leaderboard to track them here.
            </p>
          </div>
          <Link href="/" className="rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal/90">
            Browse Projects
          </Link>
        </div>
      ) : loadingProjects ? (
        <div className="flex h-40 items-center justify-center text-muted-foreground">Loading projects...</div>
      ) : (
        <div className="space-y-3">
          {projects.map(project => {
            const trendPositive = project.scoreTrend24h >= 0;
            return (
              <div key={project.slug} className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-teal/30">
                <Link href={`/project/${project.slug}`} className="flex flex-1 items-center gap-4">
                  <ScoreRing score={project.vitalisScore} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {project.logo_url && <img src={project.logo_url} alt={project.name} className="h-5 w-5 rounded-full" />}
                      <span className="font-semibold truncate">{project.name}</span>
                      <ChainBadge chain={project.chain} />
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <TierBadge score={project.vitalisScore} />
                      <span className={`inline-flex items-center gap-0.5 font-mono ${trendPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                        {trendPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {Math.abs(project.scoreTrend24h)}%
                      </span>
                    </div>
                  </div>
                  <div className="hidden sm:grid sm:grid-cols-5 sm:gap-2 sm:text-center">
                    {Object.entries(project.subScores).map(([key, val]) => (
                      <div key={key}>
                        <div className="text-[10px] uppercase text-muted-foreground">{key.slice(0, 4)}</div>
                        <div className="font-mono text-sm font-medium" style={{ color: getScoreColor(val) }}>{val}</div>
                      </div>
                    ))}
                  </div>
                </Link>
                <button
                  onClick={() => toggle(project.slug)}
                  className="rounded-lg p-2 text-muted-foreground opacity-0 transition-all hover:bg-red-500/10 hover:text-red-500 group-hover:opacity-100"
                  title="Remove from watchlist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
