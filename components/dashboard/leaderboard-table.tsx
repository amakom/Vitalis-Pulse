'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Project } from '@/lib/types';
import { getCategoryLabel, getScoreColor } from '@/lib/constants';
import { formatRunway, getRunwayColor } from '@/lib/utils';
import { ScoreRing } from './score-ring';
import { ScoreSparkline } from './score-sparkline';
import { ChainBadge } from './chain-badge';
import { GradeBadge } from './tier-badge';
import { FilterBar } from './filter-bar';

interface LeaderboardTableProps {
  projects: Project[];
  initialChain?: string;
}

const PAGE_SIZE = 25;

export function LeaderboardTable({ projects, initialChain = 'all' }: LeaderboardTableProps) {
  const router = useRouter();
  const [chain, setChain] = useState(initialChain);
  const [category, setCategory] = useState('all');
  const [scoreRange, setScoreRange] = useState('all');
  const [sortBy, setSortBy] = useState('score-desc');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let result = [...projects];

    if (chain !== 'all') result = result.filter(p => p.chain === chain);
    if (category !== 'all') result = result.filter(p => p.category === category);
    if (scoreRange === 'thriving') result = result.filter(p => p.vitalisScore >= 90);
    else if (scoreRange === 'healthy') result = result.filter(p => p.vitalisScore >= 70);
    else if (scoreRange === 'at-risk') result = result.filter(p => p.vitalisScore < 70);
    else if (scoreRange === 'critical') result = result.filter(p => p.vitalisScore < 50);

    result.sort((a, b) => {
      switch (sortBy) {
        case 'score-asc': return a.vitalisScore - b.vitalisScore;
        case 'trend-desc': return Math.abs(b.scoreTrend24h) - Math.abs(a.scoreTrend24h);
        case 'runway-asc': return a.treasury.runwayMonths - b.treasury.runwayMonths;
        default: return b.vitalisScore - a.vitalisScore;
      }
    });

    return result;
  }, [projects, chain, category, scoreRange, sortBy]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Render at most 7 page buttons around current page
  const pageButtons = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i);
    const buttons: (number | 'ellipsis')[] = [];
    buttons.push(0);
    if (page > 2) buttons.push('ellipsis' as unknown as number);
    for (let i = Math.max(1, page - 1); i <= Math.min(totalPages - 2, page + 1); i++) {
      buttons.push(i);
    }
    if (page < totalPages - 3) buttons.push('ellipsis' as unknown as number);
    buttons.push(totalPages - 1);
    return buttons;
  }, [totalPages, page]);

  return (
    <div className="space-y-4">
      <FilterBar
        selectedChain={chain}
        onChainChange={v => { setChain(v); setPage(0); }}
        selectedCategory={category}
        onCategoryChange={v => { setCategory(v); setPage(0); }}
        selectedScoreRange={scoreRange}
        onScoreRangeChange={v => { setScoreRange(v); setPage(0); }}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-lg border border-border md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">#</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Project</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Vitalis Score</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Trend (24h)</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Treasury Runway</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Dev Grade</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((project, i) => {
              const rank = page * PAGE_SIZE + i + 1;
              const trendPositive = project.scoreTrend24h >= 0;
              const runwayColor = getRunwayColor(project.treasury.runwayMonths);
              return (
                <tr
                  key={project.id}
                  onClick={() => router.push(`/project/${project.slug}`)}
                  className="cursor-pointer border-b border-border transition-colors hover:bg-slate-50 even:bg-muted/10 dark:hover:bg-[#0F1D32]"
                >
                  <td className="px-4 py-3 font-mono text-muted-foreground">{rank}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {project.logo_url ? (
                        <img src={project.logo_url} alt={project.name} className="h-8 w-8 shrink-0 rounded-full" />
                      ) : (
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: `hsl(${(project.name.charCodeAt(0) * 7 + project.name.charCodeAt(1) * 3) % 360}, 55%, 45%)` }}
                        >
                          {project.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-foreground">{project.name}</span>
                        <div className="mt-0.5">
                          <ChainBadge chain={project.chain} />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {getCategoryLabel(project.category)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-mono text-lg font-bold"
                        style={{ color: getScoreColor(project.vitalisScore) }}
                      >
                        {project.vitalisScore}
                      </span>
                      <ScoreSparkline data={project.scoreHistory} score={project.vitalisScore} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-0.5 font-mono text-sm font-medium ${trendPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                      {trendPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                      {Math.abs(project.scoreTrend24h).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="font-mono text-sm font-medium"
                      style={runwayColor ? { color: runwayColor } : undefined}
                    >
                      {formatRunway(project.treasury.runwayMonths)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <GradeBadge grade={project.development.grade} />
                  </td>
                  <td className="px-4 py-3">
                    {project.revenue.isRevenuePositive ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-500">
                        Revenue Positive
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-slate-500/15 px-2.5 py-0.5 text-xs font-medium text-slate-400">
                        Pre-Revenue
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="space-y-3 md:hidden">
        {paged.map((project, i) => {
          const rank = page * PAGE_SIZE + i + 1;
          const trendPositive = project.scoreTrend24h >= 0;
          const runwayColor = getRunwayColor(project.treasury.runwayMonths);
          return (
            <Link
              key={project.id}
              href={`/project/${project.slug}`}
              className="block rounded-lg border border-border bg-card p-4 transition-colors hover:border-teal/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-muted-foreground">#{rank}</span>
                  {project.logo_url ? (
                    <img src={project.logo_url} alt={project.name} className="h-8 w-8 rounded-full" />
                  ) : (
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: `hsl(${(project.name.charCodeAt(0) * 7 + project.name.charCodeAt(1) * 3) % 360}, 55%, 45%)` }}
                    >
                      {project.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <ChainBadge chain={project.chain} />
                  </div>
                </div>
                <ScoreRing score={project.vitalisScore} size="sm" animated={false} />
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span>{getCategoryLabel(project.category)}</span>
                <span className={trendPositive ? 'text-emerald-500' : 'text-red-500'}>
                  {trendPositive ? '+' : ''}{project.scoreTrend24h.toFixed(1)}%
                </span>
                <span style={runwayColor ? { color: runwayColor } : undefined}>
                  {formatRunway(project.treasury.runwayMonths)}
                </span>
                <GradeBadge grade={project.development.grade} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-1.5">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-40"
            >
              Previous
            </button>
            {pageButtons.map((p, idx) =>
              p === ('ellipsis' as unknown as number) ? (
                <span key={`e-${idx}`} className="flex items-center px-2 text-muted-foreground">...</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p as number)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    page === p
                      ? 'bg-teal text-white'
                      : 'border border-border bg-card hover:bg-accent'
                  }`}
                >
                  {(p as number) + 1}
                </button>
              )
            )}
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
