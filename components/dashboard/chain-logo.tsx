'use client';

import { Chain } from '@/lib/types';
import { getChainInfo } from '@/lib/constants';

interface ChainLogoProps {
  chain: Chain;
  size?: number;
  className?: string;
}

// SVG path data for each chain logo
const CHAIN_ICONS: Record<string, { path: string; viewBox: string }> = {
  ethereum: {
    viewBox: '0 0 24 24',
    path: 'M12 1.5l-7 11.5 7 4 7-4L12 1.5zM5 14.5l7 8 7-8-7 4-7-4z',
  },
  solana: {
    viewBox: '0 0 24 24',
    path: 'M4 17.5l2.5-2.5h13L17 17.5H4zM4 6.5l2.5 2.5h13L17 6.5H4zM4 12l2.5-2.5h13L17 12H4z',
  },
  arbitrum: {
    viewBox: '0 0 24 24',
    path: 'M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.5L18 8v8l-6 3.5L6 16V8l6-3.5z',
  },
  base: {
    viewBox: '0 0 24 24',
    path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5v10z',
  },
  polygon: {
    viewBox: '0 0 24 24',
    path: 'M16 8l-4-2.5L8 8v5l4 2.5L16 13V8zM20 6l-4-2.5L12 6v5l4 2.5L20 11V6z',
  },
  bnb: {
    viewBox: '0 0 24 24',
    path: 'M12 2l3 3-3 3-3-3 3-3zm-7 7l3 3-3 3-3-3 3-3zm14 0l3 3-3 3-3-3 3-3zm-7 7l3 3-3 3-3-3 3-3z',
  },
  optimism: {
    viewBox: '0 0 24 24',
    path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14v-8l6 4-6 4z',
  },
  avalanche: {
    viewBox: '0 0 24 24',
    path: 'M12 2L2 20h20L12 2zm0 5l6 11H6l6-11z',
  },
};

export function ChainLogo({ chain, size = 24, className }: ChainLogoProps) {
  const chainInfo = getChainInfo(chain);
  const icon = CHAIN_ICONS[chain];

  if (!icon) {
    return (
      <div
        className={`flex items-center justify-center rounded-full text-xs font-bold text-white ${className || ''}`}
        style={{ width: size, height: size, backgroundColor: chainInfo.color }}
      >
        {chainInfo.name.charAt(0)}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full ${className || ''}`}
      style={{ width: size, height: size, backgroundColor: chainInfo.color }}
    >
      <svg
        width={size * 0.55}
        height={size * 0.55}
        viewBox={icon.viewBox}
        fill="white"
      >
        <path d={icon.path} />
      </svg>
    </div>
  );
}
