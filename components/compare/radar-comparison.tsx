'use client';

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { Project } from '@/lib/types';

interface RadarComparisonProps {
  projects: Project[];
}

const COLORS = ['#14B8A6', '#F59E0B', '#8B5CF6', '#EF4444'];

const SUB_SCORE_KEYS: { label: string; key: keyof Project['subScores'] }[] = [
  { label: 'Treasury', key: 'treasury' },
  { label: 'Development', key: 'development' },
  { label: 'Community', key: 'community' },
  { label: 'Revenue', key: 'revenue' },
  { label: 'Governance', key: 'governance' },
];

export function RadarComparison({ projects }: RadarComparisonProps) {
  if (projects.length === 0) return null;

  const data = SUB_SCORE_KEYS.map(({ label, key }) => {
    const entry: Record<string, string | number> = { category: label };
    projects.forEach(p => {
      entry[p.name] = p.subScores[key];
    });
    return entry;
  });

  return (
    <div className="h-[280px] sm:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="#1E3A5F" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fontSize: 12, fill: '#94A3B8' }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: '#64748B' }}
          />
          {projects.map((p, i) => (
            <Radar
              key={p.id}
              name={p.name}
              dataKey={p.name}
              stroke={COLORS[i]}
              fill={COLORS[i]}
              fillOpacity={0.1}
              strokeWidth={2}
            />
          ))}
          <Legend
            wrapperStyle={{ fontSize: '12px' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
