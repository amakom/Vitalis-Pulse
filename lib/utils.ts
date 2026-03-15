import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toFixed(0);
}

export function formatRunway(months: number): string {
  if (months >= 60) return '5+ years';
  if (months >= 24) return `${Math.floor(months / 12)}+ years`;
  if (months <= 0) return '< 1 month';
  if (months < 3) return `${months} months`;
  return `${months} months`;
}

export function getRunwayColor(months: number): string | undefined {
  if (months < 3) return '#EF4444';       // red — critical
  if (months < 6) return '#F97316';       // orange — concerning
  if (months < 12) return '#F59E0B';      // amber — watch
  return undefined;                        // default text color — safe
}
