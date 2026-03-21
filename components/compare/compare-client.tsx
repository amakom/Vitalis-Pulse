'use client';

import { useState, useMemo } from 'react';
import { Project } from '@/lib/types';
import { getScoreColor, getCategoryLabel } from '@/lib/constants';
import { formatCurrency, formatRunway, getRunwayColor } from '@/lib/utils';
import { ScoreRing } from '@/components/dashboard/score-ring';
import { ChainBadge } from '@/components/dashboard/chain-badge';
import { ProjectSelector } from '@/components/compare/project-selector';
import { RadarComparison } from '@/components/compare/radar-comparison';

interface CompareClientProps {
  allProjects: Project[];
}

const SUGGESTED_PAIRS = [
  { names: ['Aave', 'Compound'], label: 'Lending Giants' },
  { names: ['Arbitrum', 'Optimism'], label: 'L2 Rivals' },
  { names: ['Uniswap', 'SushiSwap'], label: 'DEX Battle' },
  { names: ['Lido', 'Rocket Pool'], label: 'Liquid Staking' },
];

export function CompareClient({ allProjects }: CompareClientProps) {
  const [selected, setSelected] = useState<Project[]>([
    allProjects[0],
    allProjects[1],
  ].filter(Boolean));

  const handleAdd = (project: Project) => {
    if (selected.length < 4 && !selected.some(p => p.id === project.id)) {
      setSelected([...selected, project]);
    }
  };

  const handleRemove = (id: string) => {
    setSelected(selected.filter(p => p.id !== id));
  };

  const handleSuggestedComparison = (names: string[]) => {
    const found = names
      .map(name => allProjects.find(p => p.name.toLowerCase() === name.toLowerCase()))
      .filter(Boolean) as Project[];
    if (found.length >= 2) {
      setSelected(found);
    }
  };

  // Find which suggested comparisons have matching projects
  const availableSuggestions = useMemo(() => {
    return SUGGESTED_PAIRS.filter(pair =>
      pair.names.filter(name =>
        allProjects.some(p => p.name.toLowerCase() === name.toLowerCase())
      ).length >= 2
    );
  }, [allProjects]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Compare Projects</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">Side-by-side health score comparison for up to 4 projects</p>
      </div>

      {/* Suggested Comparisons */}
      {availableSuggestions.length > 0 && (
        <div className="mb-6">
          <p className="mb-2 text-sm font-medium text-muted-foreground">Suggested comparisons:</p>
          <div className="flex flex-wrap gap-2">
            {availableSuggestions.map(pair => (
              <button
                key={pair.label}
                onClick={() => handleSuggestedComparison(pair.names)}
                className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:border-teal/30 hover:bg-accent"
              >
                {pair.names.join(' vs ')}
                <span className="ml-1.5 text-xs text-muted-foreground">({pair.label})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <ProjectSelector
          allProjects={allProjects}
          selected={selected}
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
      </div>

      {selected.length >= 2 && (
        <>
          <div className="mb-8 rounded-xl border border-border bg-card p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold">Score Comparison</h2>
            <RadarComparison projects={selected} />
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {selected.map(project => (
              <div key={project.id} className="rounded-xl border border-border bg-card p-4 sm:p-5">
                <div className="mb-4 flex flex-col items-center gap-3">
                  <ScoreRing score={project.vitalisScore} size="md" />
                  <div className="text-center">
                    <h3 className="font-semibold">{project.name}</h3>
                    <ChainBadge chain={project.chain} className="mt-1" />
                  </div>
                </div>

                {[
                  { label: 'Treasury', weight: '30%', value: project.subScores.treasury },
                  { label: 'Development', weight: '25%', value: project.subScores.development },
                  { label: 'Community', weight: '20%', value: project.subScores.community },
                  { label: 'Revenue', weight: '15%', value: project.subScores.revenue },
                  { label: 'Governance', weight: '10%', value: project.subScores.governance },
                ].map(sub => (
                  <div key={sub.label} className="mb-3">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{sub.label} ({sub.weight})</span>
                      <span className="font-mono font-semibold" style={{ color: getScoreColor(sub.value) }}>
                        {sub.value}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${sub.value}%`, backgroundColor: getScoreColor(sub.value) }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Metric</th>
                  {selected.map(p => (
                    <th key={p.id} className="px-4 py-3 text-left font-medium text-foreground">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {([
                  { label: 'Vitalis Score', values: selected.map(p => ({ text: p.vitalisScore.toString(), color: getScoreColor(p.vitalisScore) })) },
                  { label: 'Category', values: selected.map(p => ({ text: getCategoryLabel(p.category), color: undefined as string | undefined })) },
                  { label: 'Chain', values: selected.map(p => ({ text: p.chain, color: undefined as string | undefined })) },
                  { label: 'Treasury', values: selected.map(p => ({ text: formatCurrency(p.treasury.totalUsd), color: undefined as string | undefined })) },
                  { label: 'Runway', values: selected.map(p => ({ text: formatRunway(p.treasury.runwayMonths), color: getRunwayColor(p.treasury.runwayMonths) })) },
                  { label: 'Burn Rate', values: selected.map(p => ({ text: `${formatCurrency(p.treasury.monthlyBurnUsd)}/mo`, color: undefined as string | undefined })) },
                  { label: 'Commits (30d)', values: selected.map(p => ({ text: p.development.commits30d.toLocaleString(), color: undefined as string | undefined })) },
                  { label: 'Active Devs', values: selected.map(p => ({ text: p.development.activeDevs.toString(), color: undefined as string | undefined })) },
                  { label: 'Dev Grade', values: selected.map(p => ({ text: p.development.grade, color: undefined as string | undefined })) },
                  { label: 'DAU/MAU', values: selected.map(p => ({ text: p.community.dauMauRatio.toFixed(2), color: undefined as string | undefined })) },
                  { label: 'Holder Growth', values: selected.map(p => ({ text: `${p.community.holderGrowth30d > 0 ? '+' : ''}${p.community.holderGrowth30d}%`, color: p.community.holderGrowth30d > 0 ? '#10B981' : '#EF4444' })) },
                  { label: 'Monthly Revenue', values: selected.map(p => ({ text: formatCurrency(p.revenue.monthlyRevenueUsd), color: undefined as string | undefined })) },
                  { label: 'Revenue Trend', values: selected.map(p => ({ text: p.revenue.trend, color: p.revenue.trend === 'growing' ? '#10B981' : p.revenue.trend === 'declining' ? '#EF4444' : undefined })) },
                  { label: 'Voter Participation', values: selected.map(p => ({ text: `${p.governance.voterParticipation}%`, color: undefined as string | undefined })) },
                  { label: 'Last Audit', values: selected.map(p => ({ text: `${p.governance.lastAuditDaysAgo}d ago`, color: undefined as string | undefined })) },
                ] as { label: string; values: { text: string; color?: string }[] }[]).map((row) => (
                  <tr key={row.label} className="border-b border-border transition-colors hover:bg-muted/20">
                    <td className="px-4 py-2.5 font-medium text-muted-foreground">{row.label}</td>
                    {row.values.map((val, i) => (
                      <td key={i} className="px-4 py-2.5 font-mono" style={val.color ? { color: val.color } : undefined}>
                        {val.text}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {selected.length < 2 && (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center sm:p-12">
          <p className="text-muted-foreground">Select at least 2 projects to compare</p>
        </div>
      )}
    </>
  );
}
