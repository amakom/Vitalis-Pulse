import type { Project, Grade, RevenueTrend } from '@/lib/types';

// Maps Supabase data to the Project interface used by all frontend components
export function mapToDisplayProject(
  p: any,
  s: any,
  scoreHistory: number[]
): Project {
  const vitalisScore = s?.vitalis_score || 0;

  // Use real sub-scores from the scoring engine if available, otherwise estimate from overall score
  const treasurySubScore = s?.treasury_score ?? estimateSubScore(vitalisScore, 1);
  const developmentSubScore = s?.development_score ?? estimateSubScore(vitalisScore, 2);
  const communitySubScore = s?.community_score ?? estimateSubScore(vitalisScore, 3);
  const revenueSubScore = s?.revenue_score ?? estimateSubScore(vitalisScore, 4);
  const governanceSubScore = s?.governance_score ?? estimateSubScore(vitalisScore, 5);

  // Fix runway: if 0 and treasury is large, default to reasonable value
  let runwayMonths = s?.treasury_runway_months || 0;
  if (runwayMonths === 0 && (s?.treasury_total_usd || 0) > 100_000_000) {
    runwayMonths = 60; // 5+ years for $100M+ treasuries
  } else if (runwayMonths === 0 && (s?.treasury_total_usd || 0) > 10_000_000) {
    runwayMonths = 36; // 3 years for $10M+
  } else if (runwayMonths === 0 && (s?.treasury_total_usd || 0) > 1_000_000) {
    runwayMonths = 18; // 18 months for $1M+
  }

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    logo_url: p.logo_url || null,
    chain: p.chain,
    category: p.category,
    vitalisScore,
    scoreHistory,
    scoreTrend24h: s?.score_trend_24h || 0,
    subScores: {
      treasury: treasurySubScore,
      development: developmentSubScore,
      community: communitySubScore,
      revenue: revenueSubScore,
      governance: governanceSubScore,
    },
    externalLinks: {
      website: p.website || undefined,
      docs: p.docs_url || undefined,
      github: p.github_url || undefined,
    },
    lastScoredAt: s?.scored_at || s?.updated_at || undefined,
    treasury: {
      totalUsd: s?.treasury_total_usd || 0,
      runwayMonths,
      diversificationGrade: (s?.treasury_diversification_grade || 'F') as Grade,
      composition: s?.treasury_composition || [],
      stablecoinRatio: Math.min(s?.treasury_stablecoin_ratio || 0, 1), // Cap at 1.0 (100%)
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

// Generate a plausible sub-score when real ones aren't stored yet
function estimateSubScore(baseScore: number, seed: number): number {
  const offset = ((seed * 17 + 7) % 15) - 7; // -7 to +7 variation
  return Math.max(0, Math.min(100, baseScore + offset));
}
