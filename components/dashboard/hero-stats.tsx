import { MetricCard } from './metric-card';
import { formatCurrency } from '@/lib/utils';
import { globalStats } from '@/lib/mock-data';

export function HeroStats() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      <MetricCard
        label="Projects Scored"
        value={globalStats.totalProjects.toLocaleString()}
      />
      <MetricCard
        label="Avg. Vitalis Score"
        value={globalStats.avgScore.toString()}
        valueColor="#14B8A6"
      />
      <MetricCard
        label="Projects At Risk"
        value={globalStats.atRiskCount.toString()}
        valueColor="#F59E0B"
      />
      <MetricCard
        label="Total Treasury Tracked"
        value={formatCurrency(globalStats.totalTreasury)}
      />
    </div>
  );
}
