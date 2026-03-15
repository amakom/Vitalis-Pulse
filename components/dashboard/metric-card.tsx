import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string;
  subtext?: string;
  className?: string;
  valueColor?: string;
}

export function MetricCard({ label, value, subtext, className, valueColor }: MetricCardProps) {
  return (
    <div className={cn(
      'rounded-lg border border-border bg-card p-4',
      className
    )}>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p
        className="mt-1 font-mono text-2xl font-bold"
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </p>
      {subtext && (
        <p className="mt-0.5 text-xs text-muted-foreground">{subtext}</p>
      )}
    </div>
  );
}

interface MiniMetricProps {
  label: string;
  value: string;
  valueColor?: string;
}

export function MiniMetric({ label, value, valueColor }: MiniMetricProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className="mt-0.5 font-mono text-base font-semibold"
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </p>
    </div>
  );
}
