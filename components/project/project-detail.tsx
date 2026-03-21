'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, Star, ArrowUpRight, ArrowDownRight, ExternalLink, Globe, BookOpen, Code2, Copy, Check, X } from 'lucide-react';
import { Project } from '@/lib/types';
import { getCategoryLabel } from '@/lib/constants';
import { ScoreRing } from '@/components/dashboard/score-ring';
import { ChainBadge } from '@/components/dashboard/chain-badge';
import { TierBadge } from '@/components/dashboard/tier-badge';
import { ScoreHistoryChart } from '@/components/project/score-history-chart';
import { TreasurySection } from '@/components/project/treasury-section';
import { DevelopmentSection } from '@/components/project/development-section';
import { CommunitySection } from '@/components/project/community-section';
import { RevenueSection } from '@/components/project/revenue-section';
import { GovernanceSection } from '@/components/project/governance-section';
import { useToast } from '@/components/layout/toast';

interface ProjectDetailProps {
  project: Project;
  isMock?: boolean;
}

export function ProjectDetail({ project, isMock }: ProjectDetailProps) {
  const { showToast } = useToast();
  const subScores = project.subScores;
  const trendPositive = project.scoreTrend24h >= 0;
  const [watchlisted, setWatchlisted] = useState(false);
  const [embedModalOpen, setEmbedModalOpen] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check watchlist state from localStorage
  useEffect(() => {
    const watchlist = JSON.parse(localStorage.getItem('vitalis-watchlist') || '[]');
    setWatchlisted(watchlist.includes(project.slug));
  }, [project.slug]);

  const handleShare = async () => {
    const url = `https://www.vitalispulse.xyz/project/${project.slug}`;
    const text = `${project.name} has a Vitalis Score of ${project.vitalisScore}/100 on @vitalispulse`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${project.name} — VitalisPulse`, text, url });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      showToast('Link copied to clipboard');
    }
  };

  const handleWatchlist = () => {
    const watchlist: string[] = JSON.parse(localStorage.getItem('vitalis-watchlist') || '[]');
    if (watchlisted) {
      const updated = watchlist.filter((s: string) => s !== project.slug);
      localStorage.setItem('vitalis-watchlist', JSON.stringify(updated));
      setWatchlisted(false);
      showToast('Removed from watchlist');
    } else {
      watchlist.push(project.slug);
      localStorage.setItem('vitalis-watchlist', JSON.stringify(watchlist));
      setWatchlisted(true);
      showToast('Added to watchlist');
    }
  };

  const embedCode = `<a href="https://www.vitalispulse.xyz/project/${project.slug}"><img src="https://www.vitalispulse.xyz/api/v1/badge/${project.slug}" alt="${project.name} Vitalis Score" /></a>`;

  const handleCopyEmbed = async () => {
    await navigator.clipboard.writeText(embedCode);
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 2000);
  };

  // Format last scored timestamp
  const lastScoredLabel = project.lastScoredAt
    ? formatTimeAgo(new Date(project.lastScoredAt))
    : 'Recently';

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      {isMock && (
        <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-sm text-amber-400">
          Displaying sample data. Real scores are being calculated.
        </div>
      )}

      {/* Back link */}
      <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Leaderboard
      </Link>

      {/* Hero */}
      <div className="mb-8 rounded-xl border border-border bg-card p-6 lg:p-8">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:gap-10">
          <ScoreRing score={project.vitalisScore} size="lg" showLabel />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              {project.logo_url && (
                <img src={project.logo_url} alt={project.name} className="h-8 w-8 rounded-full" />
              )}
              <h1 className="text-2xl font-bold lg:text-3xl">{project.name}</h1>
              <ChainBadge chain={project.chain} />
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {getCategoryLabel(project.category)}
              </span>
              <TierBadge score={project.vitalisScore} />
            </div>

            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{project.healthSummary}</p>

            {/* External links */}
            {project.externalLinks && (
              <div className="mt-3 flex flex-wrap gap-3">
                {project.externalLinks.website && (
                  <a href={project.externalLinks.website} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Globe className="h-3.5 w-3.5" /> Website <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {project.externalLinks.docs && (
                  <a href={project.externalLinks.docs} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <BookOpen className="h-3.5 w-3.5" /> Docs <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {project.externalLinks.github && (
                  <a href={project.externalLinks.github} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Code2 className="h-3.5 w-3.5" /> GitHub <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1">
                <span className={`inline-flex items-center gap-0.5 font-mono text-sm font-medium ${trendPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                  {trendPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {Math.abs(project.scoreTrend24h)}% (24h)
                </span>
              </div>
              <span className="text-xs text-muted-foreground">Last updated: {lastScoredLabel}</span>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share
              </button>
              <button
                onClick={handleWatchlist}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  watchlisted
                    ? 'bg-amber-500/15 text-amber-500 hover:bg-amber-500/25'
                    : 'bg-teal px-3 py-1.5 text-white hover:bg-teal/90'
                }`}
              >
                <Star className={`h-3.5 w-3.5 ${watchlisted ? 'fill-current' : ''}`} />
                {watchlisted ? 'Watchlisted' : 'Add to Watchlist'}
              </button>
            </div>

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

      {/* Score History Chart */}
      {project.scoreHistory.length > 1 && (
        <div className="mb-8 rounded-xl border border-border bg-card p-4 sm:p-6">
          <h2 className="mb-4 text-lg font-semibold">Score History (90 days)</h2>
          <ScoreHistoryChart data={project.scoreHistory} currentScore={project.vitalisScore} />
        </div>
      )}

      {/* Score Breakdown Sections */}
      <div className="space-y-6 sm:space-y-8">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <TreasurySection project={project} subScore={subScores.treasury} />
        </div>
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <DevelopmentSection project={project} subScore={subScores.development} />
        </div>
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <CommunitySection project={project} subScore={subScores.community} />
        </div>
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <RevenueSection project={project} subScore={subScores.revenue} />
        </div>
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <GovernanceSection project={project} subScore={subScores.governance} />
        </div>
      </div>

      {/* Bottom section */}
      <div className="mt-8 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-teal">
            <path d="M3 12h4l3-9 4 18 3-9h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-sm text-muted-foreground">Powered by VitalisPulse</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setEmbedModalOpen(true)}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
          >
            Embed this score
          </button>
          <Link href="/about" className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent">
            Scoring Methodology
          </Link>
        </div>
      </div>

      {/* Embed Modal */}
      {embedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setEmbedModalOpen(false)}>
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Embed Vitalis Score</h3>
              <button onClick={() => setEmbedModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Add this badge to your project&apos;s README or website to display your Vitalis Score.
            </p>
            <div className="mb-4 flex items-center justify-center rounded-lg bg-muted/50 p-4">
              <img
                src={`/api/v1/badge/${project.slug}`}
                alt={`${project.name} Vitalis Score`}
                className="h-8"
              />
            </div>
            <div className="relative">
              <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs text-muted-foreground">{embedCode}</pre>
              <button
                onClick={handleCopyEmbed}
                className="absolute right-2 top-2 rounded-md bg-card border border-border p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {embedCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
