'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { getScoreColor, getScoreTier } from '@/lib/constants';

interface ScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showLabel?: boolean;
}

const SIZES = {
  sm: { width: 48, stroke: 4, fontSize: '14px', labelSize: '0px' },
  md: { width: 80, stroke: 5, fontSize: '22px', labelSize: '10px' },
  lg: { width: 160, stroke: 8, fontSize: '42px', labelSize: '13px' },
};

export function ScoreRing({ score, size = 'md', animated = true, showLabel = false }: ScoreRingProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const config = SIZES[size];
  const radius = (config.width - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = getScoreColor(score);
  const tier = getScoreTier(score);

  // Spring animation for smooth count-up
  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.01,
  });

  const strokeDashoffset = useTransform(
    springValue,
    (v) => circumference - (v / 100) * circumference
  );

  const displayScore = useTransform(springValue, (v) => Math.round(v));

  useEffect(() => {
    if (mounted && animated) {
      springValue.set(score);
    } else if (!animated) {
      springValue.jump(score);
    }
  }, [mounted, score, animated, springValue]);

  const [displayNum, setDisplayNum] = useState(animated ? 0 : score);

  useEffect(() => {
    const unsubscribe = displayScore.on('change', (v) => {
      setDisplayNum(v as number);
    });
    return unsubscribe;
  }, [displayScore]);

  return (
    <div className="relative flex flex-col items-center">
      <svg width={config.width} height={config.width} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.stroke}
          className="text-slate-200 dark:text-[#1E3A5F]"
        />
        {/* Animated score ring */}
        <motion.circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={config.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
        />
      </svg>
      {/* Score number in center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-mono font-bold"
          style={{ fontSize: config.fontSize, color }}
        >
          {displayNum}
        </span>
        {showLabel && size === 'lg' && (
          <span
            className="mt-0.5 text-muted-foreground"
            style={{ fontSize: config.labelSize }}
          >
            {tier.label}
          </span>
        )}
      </div>
    </div>
  );
}
