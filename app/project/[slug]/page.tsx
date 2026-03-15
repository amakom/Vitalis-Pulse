'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Share2, Star, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { getProjectBySlug, projects } from '@/lib/mock-data';
import { getCategoryLabel } from '@/lib/constants';
import { ScoreRing } from '@/components/dashboard/score-ring';
import { ChainBadge } from '@/components/dashboard/chain-badge';
import { TierBadge } from '@/components/dashboard/tier-badge';
import { ScoreSparkline } from '@/components/dashboard/score-sparkline';
import { TreasurySection } from '@/components/project/treasury-section';
import { DevelopmentSection } from '@/components/project/development-section';
import { CommunitySection } from '@/components/project/community-section';
import { RevenueSection } from '@/components/project/revenue-section';
import { GovernanceSection } from '@/components/project/governance-section';
import { useToast } from '@/components/layout/toast';

// Generate sub-scores from project data (deterministic)
function getSubScores(project: ReturnType<typeof getProjectBySlug>) {
  if (!project) return { treasury: 0, development: 0, community: 0, revenue: 0, governance: 0 };
  const base = project.vitalisScore;
  const noise = (seed: number) => Math.round(base + (((seed * 13) % 21) - 10));
  const clamp = (v: number) => Math.max(0, Math.min(100, v));
  return {
    treasury: clamp(noise(1)),
    development: clamp(noise(2)),
    community: clamp(noise(3)),
    revenue: clamp(noise(4)),
    governance: clamp(noise(5)),
  };
}

export default function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const project = getProjectBySlug(slug);
  const { showToast } = useToast();

  if (!project) {
    notFound();
  }

  const subScores = getSubScores(project);
  const trendPositive = project.scoreTrend24h >= 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      {/* Back link */}
      <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Leaderboard
      </Link>

      {/* Hero */}
      <div className="mb-8 rounded-xl border border-border bg-card p-6 lg:p-8">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:gap-10">
          {/* Score ring */}
          <ScoreRing score={project.vitalisScore} size="lg" showLabel />

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold lg:text-3xl">{project.name}</h1>
              <ChainBadge chain={project.chain} />
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {getCategoryLabel(project.category)}
              </span>
              <TierBadge score={project.vitalisScore} />
            </div>

            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{project.healthSummary}</p>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              {/* Trend */}
              <div className="flex items-center gap-1">
                <span className={`inline-flex items-center gap-0.5 font-mono text-sm font-medium ${trendPositive ? 'text-emerald' : 'text-red'}`}>
                  {trendPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {Math.abs(project.scoreTrend24h)}% (24h)
                </span>
              </div>

              {/* Sparkline */}
              <ScoreSparkline data={project.scoreHistory} score={project.vitalisScore} width={100} height={28} />

              <span className="text-xs text-muted-foreground">Last updated: 2 hours ago</span>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent">
                <Share2 className="h-3.5 w-3.5" />
                Share
              </button>
              <button
                onClick={() => showToast('Added to watchlist')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-teal/90"
              >
                <Star className="h-3.5 w-3.5" />
                Add to Watchlist
              </button>
            </div>

            {/* Badges */}
            {project.badges.length > 0 && (
              <div className="mt-3 flex gap-2">
                {project.badges.map(badge => (
                  <span key={badge} className="rounded-full bg-teal/10 px-2.5 py-0.5 text-xs font-medium text-teal">
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Score Breakdown Sections */}
      <div className="space-y-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <TreasurySection project={project} subScore={subScores.treasury} />
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <DevelopmentSection project={project} subScore={subScores.development} />
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <CommunitySection project={project} subScore={subScores.community} />
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <RevenueSection project={project} subScore={subScores.revenue} />
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <GovernanceSection project={project} subScore={subScores.governance} />
        </div>
      </div>

      {/* Bottom section */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-teal">
            <path d="M3 12h4l3-9 4 18 3-9h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-sm text-muted-foreground">Powered by Vitalis</span>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent">
            Embed this score
          </button>
          <Link href="/about" className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent">
            Scoring Methodology
          </Link>
        </div>
      </div>
    </div>
  );
}
