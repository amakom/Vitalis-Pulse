import { cn } from '@/lib/utils';
import { getChainInfo } from '@/lib/constants';
import { Chain } from '@/lib/types';

interface ChainBadgeProps {
  chain: Chain;
  className?: string;
}

export function ChainBadge({ chain, className }: ChainBadgeProps) {
  const info = getChainInfo(chain);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        className
      )}
      style={{
        backgroundColor: `${info.color}20`,
        color: info.color,
      }}
    >
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: info.color }}
      />
      {info.name}
    </span>
  );
}
