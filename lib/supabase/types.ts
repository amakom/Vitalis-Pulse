export interface DbProject {
  id: string;
  name: string;
  slug: string;
  chain: string;
  category: string;
  website: string | null;
  logo_url: string | null;
  github_repos: string[];
  defillama_slug: string | null;
  coingecko_id: string | null;
  treasury_addresses: Record<string, string[]>;
  governance_type: string;
  token_contract: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbCurrentScore {
  project_id: string;
  vitalis_score: number;
  treasury_score: number;
  development_score: number;
  community_score: number;
  revenue_score: number;
  governance_score: number;
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
  health_summary: string | null;
  badges: string[];
  score_trend_24h: number;
  scored_at: string;
}

export interface DbScoreHistory {
  id: number;
  project_id: string;
  vitalis_score: number;
  treasury_score: number;
  development_score: number;
  community_score: number;
  revenue_score: number;
  governance_score: number;
  recorded_at: string;
}
