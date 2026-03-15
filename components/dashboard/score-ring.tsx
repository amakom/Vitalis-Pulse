'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getScoreColor } from '@/lib/constants';

interface ScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const SIZES = {
  sm: { width: 48, stroke: 4, fontSize: 14 },
  md: { width: 80, stroke: 5, fontSize: 22 },
  lg: { width: 160, stroke: 8, fontSize: 44 },
};

export function ScoreRing({ score, size = 'md', animated = true }: ScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(animated ? 0 : score);
  const config = SIZES[size];
  const radius = (config.width - config.stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = getScoreColor(score);

  useEffect(() => {
    if (!animated) return;
    const duration = 1000;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setAnimatedScore(Math.round(score * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [score, animated]);

  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: config.width, height: config.width }}>
      <svg width={config.width} height={config.width} className="-rotate-90">
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.stroke}
          className="text-border opacity-30"
        />
        <motion.circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={config.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: animated ? 1 : 0, ease: 'easeOut' }}
        />
      </svg>
      <span
        className="absolute font-mono font-bold"
        style={{ fontSize: config.fontSize, color }}
      >
        {animatedScore}
      </span>
    </div>
  );
}
