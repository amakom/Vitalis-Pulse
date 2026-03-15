'use client';

import { cn } from '@/lib/utils';
import { Category, Chain } from '@/lib/types';

interface FilterBarProps {
  selectedChain: string;
  onChainChange: (chain: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedScoreRange: string;
  onScoreRangeChange: (range: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const CHAIN_TABS = [
  { id: 'all', label: 'All Chains' },
  { id: 'ethereum', label: 'Ethereum' },
  { id: 'solana', label: 'Solana' },
  { id: 'arbitrum', label: 'Arbitrum' },
  { id: 'base', label: 'Base' },
  { id: 'polygon', label: 'Polygon' },
];

const CATEGORY_OPTIONS = [
  { id: 'all', label: 'All Categories' },
  { id: 'defi', label: 'DeFi' },
  { id: 'gamefi', label: 'GameFi' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'nft', label: 'NFT' },
  { id: 'l1-l2', label: 'L1/L2' },
  { id: 'dao', label: 'DAO' },
  { id: 'socialfi', label: 'SocialFi' },
];

const SCORE_RANGES = [
  { id: 'all', label: 'All Scores' },
  { id: 'thriving', label: 'Thriving (90+)' },
  { id: 'healthy', label: 'Healthy (70+)' },
  { id: 'at-risk', label: 'At Risk (<70)' },
  { id: 'critical', label: 'Critical (<50)' },
];

const SORT_OPTIONS = [
  { id: 'score-desc', label: 'Highest Score' },
  { id: 'score-asc', label: 'Lowest Score' },
  { id: 'trend-desc', label: 'Biggest Movers (24h)' },
  { id: 'runway-asc', label: 'Shortest Runway' },
];

export function FilterBar({
  selectedChain, onChainChange,
  selectedCategory, onCategoryChange,
  selectedScoreRange, onScoreRangeChange,
  sortBy, onSortChange,
}: FilterBarProps) {
  return (
    <div className="space-y-3">
      {/* Chain tabs */}
      <div className="flex flex-wrap gap-1.5">
        {CHAIN_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChainChange(tab.id)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              selectedChain === tab.id
                ? 'bg-teal text-white'
                : 'bg-card text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Second row: category, score range, sort */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={selectedCategory}
          onChange={e => onCategoryChange(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-teal"
        >
          {CATEGORY_OPTIONS.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>

        <select
          value={selectedScoreRange}
          onChange={e => onScoreRangeChange(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-teal"
        >
          {SCORE_RANGES.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={e => onSortChange(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-teal"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
