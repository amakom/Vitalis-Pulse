import { Chain, Category, ScoreTier } from './types';

export const SCORE_TIERS: { tier: ScoreTier; label: string; min: number; max: number; color: string; bgColor: string }[] = [
  { tier: 'thriving', label: 'Thriving', min: 90, max: 100, color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.15)' },
  { tier: 'healthy', label: 'Healthy', min: 70, max: 89, color: '#14B8A6', bgColor: 'rgba(20, 184, 166, 0.15)' },
  { tier: 'at-risk', label: 'At Risk', min: 50, max: 69, color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.15)' },
  { tier: 'critical', label: 'Critical', min: 25, max: 49, color: '#F97316', bgColor: 'rgba(249, 115, 22, 0.15)' },
  { tier: 'terminal', label: 'Terminal', min: 0, max: 24, color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.15)' },
];

export function getScoreTier(score: number) {
  return SCORE_TIERS.find(t => score >= t.min && score <= t.max) || SCORE_TIERS[4];
}

export function getScoreColor(score: number): string {
  return getScoreTier(score).color;
}

export const CHAINS: { id: Chain; name: string; color: string }[] = [
  { id: 'ethereum', name: 'Ethereum', color: '#627EEA' },
  { id: 'solana', name: 'Solana', color: '#9945FF' },
  { id: 'arbitrum', name: 'Arbitrum', color: '#28A0F0' },
  { id: 'base', name: 'Base', color: '#0052FF' },
  { id: 'polygon', name: 'Polygon', color: '#8247E5' },
  { id: 'bnb', name: 'BNB Chain', color: '#F0B90B' },
  { id: 'optimism', name: 'Optimism', color: '#FF0420' },
  { id: 'avalanche', name: 'Avalanche', color: '#E84142' },
];

export function getChainInfo(chain: Chain) {
  return CHAINS.find(c => c.id === chain) || CHAINS[0];
}

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'defi', label: 'DeFi' },
  { id: 'gamefi', label: 'GameFi' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'nft', label: 'NFT' },
  { id: 'l1-l2', label: 'L1/L2' },
  { id: 'dao', label: 'DAO' },
  { id: 'socialfi', label: 'SocialFi' },
];

export function getCategoryLabel(category: Category): string {
  return CATEGORIES.find(c => c.id === category)?.label || category;
}

export const GRADE_COLORS: Record<string, { text: string; bg: string }> = {
  A: { text: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
  B: { text: '#14B8A6', bg: 'rgba(20, 184, 166, 0.15)' },
  C: { text: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' },
  D: { text: '#F97316', bg: 'rgba(249, 115, 22, 0.15)' },
  F: { text: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)' },
};
