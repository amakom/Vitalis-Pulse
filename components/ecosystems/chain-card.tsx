import Link from 'next/link';
import { EcosystemData } from '@/lib/types';
import { getScoreColor } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { ScoreRing } from '@/components/dashboard/score-ring';

interface ChainCardProps {
  ecosystem: EcosystemData;
}

export function ChainCard({ ecosystem }: ChainCardProps) {
  return (
    <Link
      href={`/?chain=${ecosystem.chain}`}
      className="rounded-xl border border-border bg-card p-5 transition-all hover:border-teal/30 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: ecosystem.color }}
          >
            {ecosystem.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold">{ecosystem.name}</h3>
            <p className="text-xs text-muted-foreground">{ecosystem.projectCount} projects scored</p>
          </div>
        </div>
        <ScoreRing score={ecosystem.avgScore} size="sm" animated={false} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Avg Score</p>
          <p className="font-mono text-lg font-bold" style={{ color: getScoreColor(ecosystem.avgScore) }}>
            {ecosystem.avgScore}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">At Risk</p>
          <p className="font-mono text-lg font-bold" style={{ color: ecosystem.atRiskPercent > 40 ? '#F97316' : '#94A3B8' }}>
            {ecosystem.atRiskPercent}%
          </p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-muted-foreground">Total Treasury</p>
          <p className="font-mono text-lg font-bold">
            {formatCurrency(ecosystem.totalTreasury)}
          </p>
        </div>
      </div>
    </Link>
  );
}
