import type { Project, Grade, RevenueTrend } from '@/lib/types';

// Maps Supabase data to the Project interface used by all frontend components
export function mapToDisplayProject(
  p: any,
  s: any,
  scoreHistory: number[]
): Project {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    chain: p.chain,
    category: p.category,
    vitalisScore: s?.vitalis_score || 0,
    scoreHistory,
    scoreTrend24h: s?.score_trend_24h || 0,
    treasury: {
      totalUsd: s?.treasury_total_usd || 0,
      runwayMonths: s?.treasury_runway_months || 0,
      diversificationGrade: (s?.treasury_diversification_grade || 'F') as Grade,
      composition: s?.treasury_composition || [],
      stablecoinRatio: s?.treasury_stablecoin_ratio || 0,
      monthlyBurnUsd: s?.treasury_monthly_burn || 0,
    },
    development: {
      commits30d: s?.dev_commits_30d || 0,
      activeDevs: s?.dev_active_devs || 0,
      prMergeTimeHours: s?.dev_pr_merge_hours || 0,
      lastDeployDaysAgo: s?.dev_last_push_days || 999,
      weeklyCommits: s?.dev_weekly_commits || [],
      grade: (s?.dev_grade || 'F') as Grade,
    },
    community: {
      dauMauRatio: s?.community_dau_mau || 0,
      holderGrowth30d: s?.community_holder_growth || 0,
      giniCoefficient: s?.community_gini || 0,
      churnRate: s?.community_churn || 0,
      dauHistory: s?.community_dau_history || [],
    },
    revenue: {
      monthlyRevenueUsd: s?.revenue_monthly_usd || 0,
      nonTokenIncomePercent: s?.revenue_non_token_pct || 0,
      burnMultiple: s?.revenue_burn_multiple || 0,
      trend: (s?.revenue_trend || 'declining') as RevenueTrend,
      monthlyHistory: s?.revenue_monthly_history || [],
      isRevenuePositive: s?.revenue_is_positive || false,
    },
    governance: {
      lastAuditDaysAgo: s?.gov_last_audit_days || 999,
      voterParticipation: s?.gov_voter_participation || 0,
      multisig: s?.gov_multisig || 'N/A',
      bugBountyActive: s?.gov_bug_bounty || false,
    },
    healthSummary: s?.health_summary || '',
    badges: s?.badges || [],
  };
}
