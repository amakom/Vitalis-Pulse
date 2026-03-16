export type Chain = 'ethereum' | 'solana' | 'arbitrum' | 'base' | 'polygon' | 'bnb' | 'optimism' | 'avalanche';

export type Category = 'defi' | 'gamefi' | 'infrastructure' | 'nft' | 'l1-l2' | 'dao' | 'socialfi';

export type Grade = 'A' | 'B' | 'C' | 'D' | 'F';

export type ScoreTier = 'thriving' | 'healthy' | 'at-risk' | 'critical' | 'terminal';

export type RevenueTrend = 'growing' | 'stable' | 'declining';

export interface TreasuryComposition {
  label: string;
  percentage: number;
  color: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  logo_url?: string | null;
  chain: Chain;
  category: Category;
  vitalisScore: number;
  scoreHistory: number[];
  scoreTrend24h: number;
  treasury: {
    totalUsd: number;
    runwayMonths: number;
    diversificationGrade: Grade;
    composition: TreasuryComposition[];
    stablecoinRatio: number;
    monthlyBurnUsd: number;
  };
  development: {
    commits30d: number;
    activeDevs: number;
    prMergeTimeHours: number;
    lastDeployDaysAgo: number;
    weeklyCommits: number[];
    grade: Grade;
  };
  community: {
    dauMauRatio: number;
    holderGrowth30d: number;
    giniCoefficient: number;
    churnRate: number;
    dauHistory: number[];
  };
  revenue: {
    monthlyRevenueUsd: number;
    nonTokenIncomePercent: number;
    burnMultiple: number;
    trend: RevenueTrend;
    monthlyHistory: number[];
    isRevenuePositive: boolean;
  };
  governance: {
    lastAuditDaysAgo: number;
    voterParticipation: number;
    multisig: string;
    bugBountyActive: boolean;
  };
  healthSummary: string;
  badges: string[];
}

export interface EcosystemData {
  chain: Chain;
  name: string;
  projectCount: number;
  avgScore: number;
  atRiskPercent: number;
  totalTreasury: number;
  color: string;
}
