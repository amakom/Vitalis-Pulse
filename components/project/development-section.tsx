'use client';

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Project } from '@/lib/types';
import { MiniMetric } from '@/components/dashboard/metric-card';
import { GradeBadge } from '@/components/dashboard/tier-badge';
import { getScoreColor } from '@/lib/constants';

interface DevelopmentSectionProps {
  project: Project;
  subScore: number;
}

export function DevelopmentSection({ project, subScore }: DevelopmentSectionProps) {
  const { development } = project;

  const chartData = development.weeklyCommits.map((commits, i) => ({
    week: `W${i + 1}`,
    commits,
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Development Activity</h3>
          <p className="text-sm text-muted-foreground">Weight: 25%</p>
        </div>
        <div className="flex items-center gap-3">
          <GradeBadge grade={development.grade} className="text-base px-3 py-1" />
          <div className="flex items-center gap-2">
            <span className="font-mono text-2xl font-bold" style={{ color: getScoreColor(subScore) }}>
              {subScore}
            </span>
            <span className="text-sm text-muted-foreground">/100</span>
          </div>
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
        <MiniMetric label="Commits (30d)" value={development.commits30d.toLocaleString()} />
        <MiniMetric label="Active Devs" value={development.activeDevs.toString()} />
        <MiniMetric label="PR Merge Time" value={`${development.prMergeTimeHours} hrs`} />
        <MiniMetric label="Last Deploy" value={development.lastDeployDaysAgo > 0 ? `${development.lastDeployDaysAgo} days ago` : 'Unknown'} />
      </div>

      {/* Chart */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="mb-3 text-sm font-medium text-muted-foreground">Weekly Commits (12 weeks)</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="week"
                tick={{ fontSize: 11, fill: '#94A3B8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94A3B8' }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="commits" fill="#14B8A6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
