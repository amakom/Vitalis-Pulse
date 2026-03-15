'use client';

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { Project } from '@/lib/types';

interface RadarComparisonProps {
  projects: Project[];
}

const COLORS = ['#14B8A6', '#F59E0B', '#8B5CF6', '#EF4444'];

function getSubScores(project: Project) {
  const base = project.vitalisScore;
  const noise = (seed: number) => Math.round(base + (((seed * 13) % 21) - 10));
  const clamp = (v: number) => Math.max(0, Math.min(100, v));
  return {
    Treasury: clamp(noise(1)),
    Development: clamp(noise(2)),
    Community: clamp(noise(3)),
    Revenue: clamp(noise(4)),
    Governance: clamp(noise(5)),
  };
}

export function RadarComparison({ projects }: RadarComparisonProps) {
  if (projects.length === 0) return null;

  const categories = ['Treasury', 'Development', 'Community', 'Revenue', 'Governance'];

  const data = categories.map(cat => {
    const entry: Record<string, string | number> = { category: cat };
    projects.forEach(p => {
      const scores = getSubScores(p);
      entry[p.name] = scores[cat as keyof typeof scores];
    });
    return entry;
  });

  return (
    <div className="h-[400px]">
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
