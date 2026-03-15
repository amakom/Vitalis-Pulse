'use client';

import { useState } from 'react';
import { projects } from '@/lib/mock-data';
import { Project } from '@/lib/types';
import { getScoreColor, getCategoryLabel } from '@/lib/constants';
import { formatCurrency, formatRunway } from '@/lib/utils';
import { ScoreRing } from '@/components/dashboard/score-ring';
import { ChainBadge } from '@/components/dashboard/chain-badge';
import { GradeBadge } from '@/components/dashboard/tier-badge';
import { ProjectSelector } from '@/components/compare/project-selector';
import { RadarComparison } from '@/components/compare/radar-comparison';

export default function ComparePage() {
  const [selected, setSelected] = useState<Project[]>([
    projects[0],
    projects[1],
  ]);

  const handleAdd = (project: Project) => {
    if (selected.length < 4 && !selected.some(p => p.id === project.id)) {
      setSelected([...selected, project]);
    }
  };

  const handleRemove = (id: string) => {
    setSelected(selected.filter(p => p.id !== id));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Compare Projects</h1>
        <p className="mt-1 text-muted-foreground">Side-by-side health score comparison for up to 4 projects</p>
      </div>

      {/* Selector */}
      <div className="mb-8">
        <ProjectSelector
          selected={selected}
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
      </div>

      {selected.length >= 2 && (
        <>
          {/* Radar Chart */}
          <div className="mb-8 rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Score Comparison</h2>
            <RadarComparison projects={selected} />
          </div>

          {/* Side by side cards */}
          <div className="mb-8 grid gap-4" style={{ gridTemplateColumns: `repeat(${selected.length}, 1fr)` }}>
            {selected.map(project => (
              <div key={project.id} className="rounded-xl border border-border bg-card p-5">
                <div className="mb-4 flex flex-col items-center gap-3">
                  <ScoreRing score={project.vitalisScore} size="md" />
                  <div className="text-center">
                    <h3 className="font-semibold">{project.name}</h3>
                    <ChainBadge chain={project.chain} className="mt-1" />
                  </div>
                </div>

                {/* Sub-score bars */}
                {[
                  { label: 'Treasury', weight: '30%', value: Math.max(0, Math.min(100, project.vitalisScore + (((1 * 13) % 21) - 10))) },
                  { label: 'Development', weight: '25%', value: Math.max(0, Math.min(100, project.vitalisScore + (((2 * 13) % 21) - 10))) },
                  { label: 'Community', weight: '20%', value: Math.max(0, Math.min(100, project.vitalisScore + (((3 * 13) % 21) - 10))) },
                  { label: 'Revenue', weight: '15%', value: Math.max(0, Math.min(100, project.vitalisScore + (((4 * 13) % 21) - 10))) },
                  { label: 'Governance', weight: '10%', value: Math.max(0, Math.min(100, project.vitalisScore + (((5 * 13) % 21) - 10))) },
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

          {/* Metric comparison table */}
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
                  { label: 'Runway', values: selected.map(p => ({ text: formatRunway(p.treasury.runwayMonths), color: p.treasury.runwayMonths < 6 ? '#EF4444' : undefined })) },
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
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
          <p className="text-muted-foreground">Select at least 2 projects to compare</p>
        </div>
      )}
    </div>
  );
}
