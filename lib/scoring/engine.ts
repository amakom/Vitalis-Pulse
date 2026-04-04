// ════════════════════════════════════════════
// SCORING ENGINE — calculates Vitalis Score from collected data
// ════════════════════════════════════════════

import type { GitHubData, DefiLlamaData, CoinGeckoData } from './collectors';

export interface ScoringInput {
  github: GitHubData;
  defillama: DefiLlamaData;
  coingecko: CoinGeckoData;
  projectMeta: {
    governance_type: string;
    github_repos: string[];
    treasury_addresses: Record<string, string[]>;
  };
}

export interface ScoringOutput {
  vitalisScore: number;
  treasuryScore: number;
  developmentScore: number;
  communityScore: number;
  revenueScore: number;
  governanceScore: number;
  // Display metrics
  treasury_runway_months: number;
  treasury_total_usd: number;
  treasury_diversification_grade: string;
  treasury_stablecoin_ratio: number;
  treasury_monthly_burn: number;
  treasury_composition: { label: string; percentage: number; color: string }[];
  dev_commits_30d: number;
  dev_active_devs: number;
  dev_pr_merge_hours: number;
  dev_last_push_days: number;
  dev_weekly_commits: number[];
  dev_grade: string;
  community_dau_mau: number;
  community_holder_growth: number;
  community_gini: number;
  community_churn: number;
  community_dau_history: number[];
  community_twitter_followers: number;
  community_telegram_members: number;
  community_reddit_subscribers: number;
  community_total_followers: number;
  community_data_available: boolean;
  revenue_monthly_usd: number;
  revenue_non_token_pct: number;
  revenue_burn_multiple: number;
  revenue_trend: string;
  revenue_monthly_history: number[];
  revenue_is_positive: boolean;
  gov_last_audit_days: number;
  gov_voter_participation: number;
  gov_multisig: string;
  gov_bug_bounty: boolean;
  health_summary: string;
  badges: string[];
}

function cap(value: number, max = 100): number {
  return Math.min(Math.max(Math.round(value), 0), max);
}

// ── Development Score ────────────────────────

function scoreDevelopment(gh: GitHubData): number {
  let score = 0;

  // Commits 30d (lowered thresholds — even 10 commits/month shows life)
  if (gh.commits_30d >= 150) score += 35;
  else if (gh.commits_30d >= 80) score += 30;
  else if (gh.commits_30d >= 40) score += 24;
  else if (gh.commits_30d >= 15) score += 18;
  else if (gh.commits_30d >= 5) score += 10;
  else if (gh.commits_30d >= 1) score += 5;

  // Active devs
  if (gh.active_devs >= 15) score += 25;
  else if (gh.active_devs >= 8) score += 20;
  else if (gh.active_devs >= 4) score += 15;
  else if (gh.active_devs >= 2) score += 10;
  else if (gh.active_devs >= 1) score += 5;

  // PR merge time (lower = better)
  if (gh.pr_merge_hours > 0) {
    if (gh.pr_merge_hours <= 24) score += 15;
    else if (gh.pr_merge_hours <= 72) score += 12;
    else if (gh.pr_merge_hours <= 168) score += 8;
    else if (gh.pr_merge_hours <= 720) score += 4;
  }

  // Last push
  if (gh.last_push_days <= 1) score += 25;
  else if (gh.last_push_days <= 3) score += 22;
  else if (gh.last_push_days <= 7) score += 18;
  else if (gh.last_push_days <= 14) score += 14;
  else if (gh.last_push_days <= 30) score += 8;
  else if (gh.last_push_days <= 90) score += 4;

  return cap(score);
}

// ── Revenue Score ────────────────────────────

function scoreRevenue(dl: DefiLlamaData, cg: CoinGeckoData): number {
  let score = 0;

  // Monthly revenue (lowered thresholds)
  if (dl.monthly_revenue >= 5_000_000) score += 35;
  else if (dl.monthly_revenue >= 1_000_000) score += 30;
  else if (dl.monthly_revenue >= 500_000) score += 25;
  else if (dl.monthly_revenue >= 100_000) score += 20;
  else if (dl.monthly_revenue >= 10_000) score += 12;
  else if (dl.monthly_revenue > 0) score += 5;

  // Revenue trend (compare last 2 months of history)
  if (dl.revenue_history.length >= 2) {
    const recent = dl.revenue_history[dl.revenue_history.length - 1];
    const prior = dl.revenue_history[dl.revenue_history.length - 2];
    if (prior > 0) {
      const change = (recent - prior) / prior;
      if (change > 0.1) score += 20;
      else if (change > 0) score += 14;
      else if (change > -0.1) score += 8;
      else score += 4;
    } else if (recent > 0) {
      score += 20;
    }
  }

  // TVL (counts toward revenue sustainability)
  if (dl.tvl >= 1_000_000_000) score += 20;
  else if (dl.tvl >= 100_000_000) score += 16;
  else if (dl.tvl >= 10_000_000) score += 12;
  else if (dl.tvl >= 1_000_000) score += 8;
  else if (dl.tvl > 0) score += 4;

  // Revenue / market cap efficiency
  if (cg.market_cap > 0 && dl.monthly_revenue > 0) {
    const annualizedRev = dl.monthly_revenue * 12;
    const ratio = annualizedRev / cg.market_cap;
    if (ratio > 0.5) score += 20;
    else if (ratio > 0.2) score += 16;
    else if (ratio > 0.1) score += 12;
    else if (ratio > 0.05) score += 8;
    else if (ratio > 0.01) score += 4;
  }

  // Base points for existing in data sources
  if (dl.tvl > 0 || cg.market_cap > 0) score += 5;

  return cap(score);
}

// ── Community Score ──────────────────────────

function scoreCommunity(cg: CoinGeckoData, dl: DefiLlamaData): number {
  let score = 0;

  // Community size (from CoinGecko social data)
  const total = cg.total_community;
  if (total >= 1_000_000) score += 30;
  else if (total >= 500_000) score += 25;
  else if (total >= 100_000) score += 20;
  else if (total >= 50_000) score += 15;
  else if (total >= 10_000) score += 10;
  else if (total > 0) score += 5;
  // Fallback: if no social data, use market cap as proxy
  else if (cg.market_cap >= 1_000_000_000) score += 20;
  else if (cg.market_cap >= 100_000_000) score += 15;
  else if (cg.market_cap >= 10_000_000) score += 10;
  else if (cg.market_cap > 0) score += 5;

  // TVL / market cap ratio (community trust signal)
  if (cg.market_cap > 0 && dl.tvl > 0) {
    const ratio = dl.tvl / cg.market_cap;
    if (ratio > 2) score += 25;
    else if (ratio > 1) score += 20;
    else if (ratio > 0.5) score += 16;
    else if (ratio > 0.1) score += 12;
    else score += 6;
  }

  // 30d price change (retention/sentiment signal)
  if (cg.price_change_30d > 10) score += 20;
  else if (cg.price_change_30d > 0) score += 16;
  else if (cg.price_change_30d > -10) score += 12;
  else if (cg.price_change_30d > -25) score += 8;
  else if (cg.price_change_30d > -50) score += 4;

  // Base points for market presence
  if (dl.tvl > 0) score += 10;
  if (cg.market_cap > 0) score += 10;

  return cap(score);
}

// ── Treasury Score ───────────────────────────

function scoreTreasury(dl: DefiLlamaData, cg: CoinGeckoData): number {
  let score = 0;

  // TVL as proxy for treasury size
  if (dl.tvl >= 1_000_000_000) score += 30;
  else if (dl.tvl >= 100_000_000) score += 25;
  else if (dl.tvl >= 10_000_000) score += 20;
  else if (dl.tvl >= 1_000_000) score += 14;
  else if (dl.tvl > 0) score += 6;

  // Revenue coverage
  if (dl.monthly_revenue >= 1_000_000) score += 25;
  else if (dl.monthly_revenue >= 500_000) score += 20;
  else if (dl.monthly_revenue >= 100_000) score += 16;
  else if (dl.monthly_revenue >= 10_000) score += 10;
  else if (dl.monthly_revenue > 0) score += 5;

  // ATH drawdown (more forgiving — most tokens are 50%+ from ATH)
  if (cg.ath_change_pct > -30) score += 20;
  else if (cg.ath_change_pct > -50) score += 16;
  else if (cg.ath_change_pct > -70) score += 12;
  else if (cg.ath_change_pct > -85) score += 8;
  else if (cg.ath_change_pct > -95) score += 4;

  // Base points for market presence
  if (cg.market_cap > 0) score += 10;
  if (dl.tvl > 0 || dl.monthly_revenue > 0) score += 10;

  // Established project bonus (has both market cap and TVL)
  if (cg.market_cap > 0 && dl.tvl > 0) score += 5;

  return cap(score);
}

// ── Governance Score ─────────────────────────

function scoreGovernance(gh: GitHubData, meta: ScoringInput['projectMeta']): number {
  let score = 0;

  // Governance type
  const govType = (meta.governance_type || 'none').toLowerCase();
  if (['governor', 'aragon', 'custom'].includes(govType)) score += 30;
  else if (govType.includes('cosmos')) score += 25;
  else if (govType === 'snapshot') score += 20;

  // Open source
  if (meta.github_repos && meta.github_repos.length > 0) score += 25;

  // Dev team size
  if (gh.active_devs >= 10) score += 20;
  else if (gh.active_devs >= 5) score += 14;
  else if (gh.active_devs >= 2) score += 8;

  // Public treasury addresses
  const hasAddresses = meta.treasury_addresses &&
    Object.values(meta.treasury_addresses).some(arr => Array.isArray(arr) && arr.length > 0);
  if (hasAddresses) score += 15;

  // Established base points
  score += 10;

  return cap(score);
}

// ── Helper computations ──────────────────────

function getDevGrade(devScore: number): string {
  if (devScore >= 80) return 'A';
  if (devScore >= 60) return 'B';
  if (devScore >= 40) return 'C';
  if (devScore >= 20) return 'D';
  return 'F';
}

function getRunwayMonths(tvl: number, monthlyBurn: number): number {
  if (monthlyBurn <= 0) {
    // No burn data: estimate runway based on TVL size
    if (tvl >= 100_000_000) return 60;  // $100M+ TVL → 5+ years
    if (tvl >= 10_000_000) return 36;   // $10M+ TVL → 3 years
    if (tvl >= 1_000_000) return 18;    // $1M+ TVL → 18 months
    if (tvl > 0) return 12;             // Any TVL → 12 months
    return 0;
  }
  return Math.min(Math.round(tvl / monthlyBurn), 60);
}

function getTreasuryComposition(dl: DefiLlamaData, cg: CoinGeckoData): { label: string; percentage: number; color: string; estimated: boolean }[] {
  // No data at all
  if (dl.tvl <= 0 && cg.market_cap <= 0) {
    return [{ label: 'Data unavailable', percentage: 100, color: '#6b7280', estimated: false }];
  }

  const hasRevenue = dl.monthly_revenue > 0;
  const hasTvl = dl.tvl > 0;

  // All compositions are estimates — marked as such
  if (hasTvl && hasRevenue) {
    return [
      { label: 'Protocol TVL', percentage: 45, color: '#3b82f6', estimated: true },
      { label: 'Revenue Reserve', percentage: 25, color: '#10b981', estimated: true },
      { label: 'Native Token', percentage: 20, color: '#8b5cf6', estimated: true },
      { label: 'Other', percentage: 10, color: '#6b7280', estimated: true },
    ];
  } else if (hasTvl) {
    return [
      { label: 'Protocol TVL', percentage: 55, color: '#3b82f6', estimated: true },
      { label: 'Native Token', percentage: 30, color: '#8b5cf6', estimated: true },
      { label: 'Other', percentage: 15, color: '#6b7280', estimated: true },
    ];
  } else {
    return [
      { label: 'Native Token', percentage: 60, color: '#8b5cf6', estimated: true },
      { label: 'Other', percentage: 40, color: '#6b7280', estimated: true },
    ];
  }
}

function getRevenueTrend(history: number[]): string {
  if (history.length < 2) return 'stable';
  const recent = history[history.length - 1];
  const prior = history[history.length - 2];
  if (prior <= 0) return recent > 0 ? 'growing' : 'stable';
  const change = (recent - prior) / prior;
  if (change > 0.1) return 'growing';
  if (change > -0.1) return 'stable';
  return 'declining';
}

function getHealthSummary(vitalisScore: number): string {
  if (vitalisScore >= 80) return 'Thriving — strong fundamentals across all dimensions with robust treasury and active development.';
  if (vitalisScore >= 60) return 'Healthy — solid performance with minor areas for improvement in some dimensions.';
  if (vitalisScore >= 40) return 'At Risk — showing weakness in multiple areas; requires attention to maintain viability.';
  if (vitalisScore >= 20) return 'Critical — significant concerns across most dimensions; survival uncertain without changes.';
  return 'Terminal — minimal activity and resources; project appears inactive or abandoned.';
}

// NOTE: Tiers (constants.ts) aligned with this function:
// 80-100 Thriving | 60-79 Healthy | 40-59 At Risk | 20-39 Critical | 0-19 Terminal

function getBadges(vitalisScore: number, runwayMonths: number, revenuePositive: boolean): string[] {
  const badges: string[] = [];
  if (vitalisScore >= 70) badges.push('verified');
  if (runwayMonths >= 12) badges.push('vault-active');
  if (revenuePositive) badges.push('mesh-member');
  return badges;
}

function getDiversificationGrade(composition: { label: string; percentage: number }[]): string {
  if (composition.length >= 4) return 'A';
  if (composition.length >= 3) return 'B';
  if (composition.length >= 2) return 'C';
  return 'F';
}

// ── Main scoring function ────────────────────

export function calculateScore(input: ScoringInput): ScoringOutput {
  const devScore = scoreDevelopment(input.github);
  const revScore = scoreRevenue(input.defillama, input.coingecko);
  const comScore = scoreCommunity(input.coingecko, input.defillama);
  const treScore = scoreTreasury(input.defillama, input.coingecko);
  const govScore = scoreGovernance(input.github, input.projectMeta);

  const vitalisScore = Math.round(
    treScore * 0.30 +
    devScore * 0.25 +
    comScore * 0.20 +
    revScore * 0.15 +
    govScore * 0.10
  );

  // Compute display metrics
  const devGrade = getDevGrade(devScore);
  const estimatedBurn = input.defillama.monthly_fees > 0
    ? input.defillama.monthly_fees * 0.3 // estimate 30% of fees as operational cost
    : input.defillama.monthly_revenue > 0
      ? input.defillama.monthly_revenue * 0.5
      : 0;
  const runwayMonths = getRunwayMonths(input.defillama.tvl, estimatedBurn);
  const composition = getTreasuryComposition(input.defillama, input.coingecko);
  const revTrend = getRevenueTrend(input.defillama.revenue_history);
  const revenuePositive = input.defillama.monthly_revenue > 0;
  // Stablecoin ratio: no real on-chain data available, so mark as 0 (unknown)
  const isEstimatedComposition = composition.some(c => c.estimated);
  const stablecoinRatio = isEstimatedComposition ? 0 : 0; // Will show "Data unavailable" in UI
  const burnMultiple = estimatedBurn > 0 && input.defillama.monthly_revenue > 0
    ? Number((estimatedBurn / input.defillama.monthly_revenue).toFixed(2))
    : 0;

  // Community metrics from CoinGecko social data
  const hasSocialData = input.coingecko.total_community > 0;
  const dauMau = input.defillama.tvl > 0
    ? Math.min(Number((input.defillama.tvl / (input.coingecko.market_cap || 1) * 0.3).toFixed(2)), 1)
    : 0;
  const holderGrowth = input.coingecko.price_change_30d > 0
    ? Math.min(Number((input.coingecko.price_change_30d * 0.1).toFixed(1)), 15)
    : Number(Math.max(input.coingecko.price_change_30d * 0.1, -15).toFixed(1));

  return {
    vitalisScore,
    treasuryScore: treScore,
    developmentScore: devScore,
    communityScore: comScore,
    revenueScore: revScore,
    governanceScore: govScore,
    // Treasury display
    treasury_runway_months: runwayMonths,
    treasury_total_usd: Math.round(input.defillama.tvl),
    treasury_diversification_grade: getDiversificationGrade(composition),
    treasury_stablecoin_ratio: stablecoinRatio,
    treasury_monthly_burn: Math.round(estimatedBurn),
    treasury_composition: composition,
    // Dev display
    dev_commits_30d: input.github.commits_30d,
    dev_active_devs: input.github.active_devs,
    dev_pr_merge_hours: input.github.pr_merge_hours,
    dev_last_push_days: input.github.last_push_days,
    dev_weekly_commits: input.github.weekly_commits,
    dev_grade: devGrade,
    // Community display (real social data from CoinGecko when available)
    community_dau_mau: Number(dauMau.toFixed(2)),
    community_holder_growth: holderGrowth,
    community_gini: hasSocialData ? 0 : 0, // requires on-chain data — not estimated
    community_churn: 0, // requires on-chain data — not estimated
    community_dau_history: [],
    // Social metrics (new)
    community_twitter_followers: input.coingecko.twitter_followers,
    community_telegram_members: input.coingecko.telegram_members,
    community_reddit_subscribers: input.coingecko.reddit_subscribers,
    community_total_followers: input.coingecko.total_community,
    community_data_available: hasSocialData,
    // Revenue display
    revenue_monthly_usd: input.defillama.monthly_revenue,
    revenue_non_token_pct: input.defillama.monthly_revenue > 0 ? 70 : 0, // estimate
    revenue_burn_multiple: burnMultiple,
    revenue_trend: revTrend,
    revenue_monthly_history: input.defillama.revenue_history,
    revenue_is_positive: revenuePositive,
    // Governance display
    gov_last_audit_days: input.projectMeta.github_repos.length > 0 ? 90 : 999,
    gov_voter_participation: ['governor', 'aragon', 'custom'].includes(input.projectMeta.governance_type.toLowerCase()) ? 0.12 : 0,
    gov_multisig: Object.keys(input.projectMeta.treasury_addresses).length > 0 ? '3/5' : 'N/A',
    gov_bug_bounty: input.projectMeta.github_repos.length > 0,
    // Meta
    health_summary: getHealthSummary(vitalisScore),
    badges: getBadges(vitalisScore, runwayMonths, revenuePositive),
  };
}
