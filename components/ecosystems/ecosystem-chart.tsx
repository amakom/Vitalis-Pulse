'use client';

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { EcosystemData } from '@/lib/types';
import { getScoreColor } from '@/lib/constants';

interface EcosystemChartProps {
  data: EcosystemData[];
}

export function EcosystemChart({ data }: EcosystemChartProps) {
  const chartData = data
    .filter(d => d.projectCount > 0)
    .sort((a, b) => b.avgScore - a.avgScore)
    .map(d => ({
      name: d.name,
      score: d.avgScore,
      color: d.color,
    }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: '#94A3B8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12, fill: '#E2E8F0' }}
            axisLine={false}
            tickLine={false}
            width={90}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value) => [`${value}`, 'Avg Score']}
          />
          <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
