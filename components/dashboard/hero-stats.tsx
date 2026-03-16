import { MetricCard } from './metric-card';
import { formatCurrency } from '@/lib/utils';

interface HeroStatsProps {
  stats: {
    totalProjects: number;
    avgScore: number;
    atRiskCount: number;
    totalTreasury: number;
  };
}

export function HeroStats({ stats }: HeroStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      <MetricCard
        label="Projects Scored"
        value={stats.totalProjects.toLocaleString()}
      />
      <MetricCard
        label="Avg. Vitalis Score"
        value={stats.avgScore.toString()}
        valueColor="#14B8A6"
      />
      <MetricCard
        label="Projects At Risk"
        value={stats.atRiskCount.toString()}
        valueColor="#F59E0B"
      />
      <MetricCard
        label="Total Treasury Tracked"
        value={formatCurrency(stats.totalTreasury)}
      />
    </div>
  );
}
