'use client';

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Project } from '@/lib/types';
import { MiniMetric } from '@/components/dashboard/metric-card';
import { formatCurrency } from '@/lib/utils';
import { getScoreColor } from '@/lib/constants';

interface RevenueSectionProps {
  project: Project;
  subScore: number;
}

const MONTH_LABELS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

export function RevenueSection({ project, subScore }: RevenueSectionProps) {
  const { revenue } = project;

  const chartData = revenue.monthlyHistory.map((val, i) => ({
    month: MONTH_LABELS[i],
    revenue: val,
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Revenue & Sustainability</h3>
          <p className="text-sm text-muted-foreground">Weight: 15%</p>
        </div>
        <div className="flex items-center gap-3">
          {revenue.isRevenuePositive && (
            <span className="rounded-full bg-emerald/15 px-2.5 py-0.5 text-xs font-medium text-emerald">
              Revenue Positive
            </span>
          )}
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
        <MiniMetric label="Monthly Revenue" value={formatCurrency(revenue.monthlyRevenueUsd)} />
        <MiniMetric label="Non-Token Income" value={`${revenue.nonTokenIncomePercent}%`} />
        <MiniMetric label="Burn Multiple" value={`${revenue.burnMultiple}x`} />
        <MiniMetric
          label="Revenue Trend"
          value={revenue.trend.charAt(0).toUpperCase() + revenue.trend.slice(1)}
          valueColor={revenue.trend === 'growing' ? '#10B981' : revenue.trend === 'declining' ? '#EF4444' : undefined}
        />
      </div>

      {/* Chart */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="mb-3 text-sm font-medium text-muted-foreground">Monthly Revenue (6 months)</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#94A3B8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94A3B8' }}
                axisLine={false}
                tickLine={false}
                width={50}
                tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#14B8A6"
                strokeWidth={2}
                dot={{ fill: '#14B8A6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
