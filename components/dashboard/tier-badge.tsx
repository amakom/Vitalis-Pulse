import { cn } from '@/lib/utils';
import { getScoreTier } from '@/lib/constants';

interface TierBadgeProps {
  score: number;
  className?: string;
}

export function TierBadge({ score, className }: TierBadgeProps) {
  const tier = getScoreTier(score);

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        className
      )}
      style={{
        backgroundColor: tier.bgColor,
        color: tier.color,
      }}
    >
      {tier.label}
    </span>
  );
}

interface GradeBadgeProps {
  grade: string;
  className?: string;
}

const GRADE_STYLES: Record<string, { color: string; bg: string }> = {
  A: { color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
  B: { color: '#14B8A6', bg: 'rgba(20, 184, 166, 0.15)' },
  C: { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' },
  D: { color: '#F97316', bg: 'rgba(249, 115, 22, 0.15)' },
  F: { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)' },
};

export function GradeBadge({ grade, className }: GradeBadgeProps) {
  const style = GRADE_STYLES[grade[0]] || GRADE_STYLES.C;

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-md px-2 py-0.5 font-mono text-xs font-bold',
        className
      )}
      style={{
        backgroundColor: style.bg,
        color: style.color,
      }}
    >
      {grade}
    </span>
  );
}
