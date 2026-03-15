'use client';

import { getScoreColor } from '@/lib/constants';

interface ScoreSparklineProps {
  data: number[];
  score: number;
  width?: number;
  height?: number;
}

export function ScoreSparkline({ data, score, width = 60, height = 24 }: ScoreSparklineProps) {
  if (data.length < 2) return null;

  // Use last 7 data points for the sparkline
  const points = data.slice(-7);
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const color = getScoreColor(score);

  const pathPoints = points.map((value, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - ((value - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });

  const pathD = `M ${pathPoints.join(' L ')}`;

  return (
    <svg width={width} height={height} className="inline-block">
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
