'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getScoreColor } from '@/lib/constants';

interface ScoreHistoryChartProps {
  data: number[];
  currentScore: number;
}

export function ScoreHistoryChart({ data, currentScore }: ScoreHistoryChartProps) {
  const chartData = data.map((score, i) => ({
    day: i + 1,
    score,
    label: `Day ${data.length - i}`,
  }));

  const color = getScoreColor(currentScore);
  const minScore = Math.max(0, Math.min(...data) - 10);
  const maxScore = Math.min(100, Math.max(...data) + 10);

  return (
    <div className="h-64 w-full sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            tickFormatter={(v) => {
              if (v === 1) return '90d ago';
              if (v === Math.round(data.length / 2)) return '45d ago';
              if (v === data.length) return 'Today';
              return '';
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[minScore, maxScore]}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value: any) => [value, 'Vitalis Score']}
            labelFormatter={(label: any) => `${data.length - Number(label)} days ago`}
          />
          <ReferenceLine y={60} stroke="#F59E0B" strokeDasharray="5 5" opacity={0.5} />
          <ReferenceLine y={40} stroke="#EF4444" strokeDasharray="5 5" opacity={0.5} />
          <Area
            type="monotone"
            dataKey="score"
            stroke={color}
            strokeWidth={2}
            fill="url(#scoreGradient)"
            dot={false}
            activeDot={{ r: 4, fill: color }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="mt-2 flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 bg-amber-500" style={{ borderTop: '2px dashed #F59E0B' }} />
          Healthy threshold (60)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 bg-red-500" style={{ borderTop: '2px dashed #EF4444' }} />
          At-risk threshold (40)
        </div>
      </div>
    </div>
  );
}
