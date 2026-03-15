'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Project } from '@/lib/types';
import { MiniMetric } from '@/components/dashboard/metric-card';
import { GradeBadge } from '@/components/dashboard/tier-badge';
import { formatCurrency } from '@/lib/utils';
import { getScoreColor } from '@/lib/constants';

interface TreasurySectionProps {
  project: Project;
  subScore: number;
}

export function TreasurySection({ project, subScore }: TreasurySectionProps) {
  const { treasury } = project;

  const riskFlags: string[] = [];
  const nativeTokenPct = treasury.composition.find(c => c.label === 'Native Token')?.percentage || 0;
  if (nativeTokenPct > 50) riskFlags.push('High native token concentration');
  if (treasury.runwayMonths < 6) riskFlags.push('Low treasury runway');
  if (treasury.stablecoinRatio < 0.15) riskFlags.push('Low stablecoin reserves');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Treasury Health</h3>
          <p className="text-sm text-muted-foreground">Weight: 30%</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-2xl font-bold" style={{ color: getScoreColor(subScore) }}>
            {subScore}
          </span>
          <span className="text-sm text-muted-foreground">/100</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${subScore}%`, backgroundColor: getScoreColor(subScore) }}
        />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MiniMetric label="Runway" value={`${treasury.runwayMonths} months`} valueColor={treasury.runwayMonths < 6 ? '#EF4444' : undefined} />
        <MiniMetric label="Diversification" value={treasury.diversificationGrade} />
        <MiniMetric label="Stablecoin Ratio" value={`${Math.round(treasury.stablecoinRatio * 100)}%`} />
        <MiniMetric label="Burn Rate" value={`${formatCurrency(treasury.monthlyBurnUsd)}/mo`} />
      </div>

      {/* Chart */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="mb-3 text-sm font-medium text-muted-foreground">Treasury Composition</p>
        <div className="flex items-center gap-6">
          <div className="h-48 w-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={treasury.composition}
                  dataKey="percentage"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  {treasury.composition.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${value}%`}
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {treasury.composition.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-mono font-medium">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk flags */}
      {riskFlags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {riskFlags.map((flag, i) => (
            <span key={i} className="rounded-full bg-amber/15 px-3 py-1 text-xs font-medium text-amber">
              {flag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
