-- ════════════════════════════════════════════
-- VITALIS PULSE DATABASE SCHEMA
-- ════════════════════════════════════════════

-- Projects table: the registry of all tracked projects
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  chain TEXT NOT NULL,
  category TEXT NOT NULL,
  website TEXT,
  logo_url TEXT,

  -- Data source configuration
  github_repos TEXT[] DEFAULT '{}',
  defillama_slug TEXT,
  coingecko_id TEXT,
  treasury_addresses JSONB DEFAULT '{}',
  governance_type TEXT DEFAULT 'none',
  token_contract TEXT,

  -- Status
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  submitted_by TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Current scores: latest score for each project (what the dashboard reads)
CREATE TABLE current_scores (
  project_id TEXT PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
  vitalis_score INTEGER NOT NULL DEFAULT 0,

  -- Sub-scores (0-100 each)
  treasury_score INTEGER DEFAULT 0,
  development_score INTEGER DEFAULT 0,
  community_score INTEGER DEFAULT 0,
  revenue_score INTEGER DEFAULT 0,
  governance_score INTEGER DEFAULT 0,

  -- Key display metrics
  treasury_runway_months INTEGER DEFAULT 0,
  treasury_total_usd BIGINT DEFAULT 0,
  treasury_diversification_grade TEXT DEFAULT 'F',
  treasury_stablecoin_ratio INTEGER DEFAULT 0,
  treasury_monthly_burn BIGINT DEFAULT 0,
  treasury_composition JSONB DEFAULT '[]',

  dev_commits_30d INTEGER DEFAULT 0,
  dev_active_devs INTEGER DEFAULT 0,
  dev_pr_merge_hours NUMERIC DEFAULT 0,
  dev_last_push_days INTEGER DEFAULT 999,
  dev_weekly_commits JSONB DEFAULT '[]',
  dev_grade TEXT DEFAULT 'F',

  community_dau_mau NUMERIC DEFAULT 0,
  community_holder_growth NUMERIC DEFAULT 0,
  community_gini NUMERIC DEFAULT 0,
  community_churn NUMERIC DEFAULT 0,
  community_dau_history JSONB DEFAULT '[]',

  revenue_monthly_usd BIGINT DEFAULT 0,
  revenue_non_token_pct INTEGER DEFAULT 0,
  revenue_burn_multiple NUMERIC DEFAULT 0,
  revenue_trend TEXT DEFAULT 'declining',
  revenue_monthly_history JSONB DEFAULT '[]',
  revenue_is_positive BOOLEAN DEFAULT false,

  gov_last_audit_days INTEGER DEFAULT 999,
  gov_voter_participation NUMERIC DEFAULT 0,
  gov_multisig TEXT DEFAULT 'N/A',
  gov_bug_bounty BOOLEAN DEFAULT false,

  -- Meta
  health_summary TEXT,
  badges TEXT[] DEFAULT '{}',
  score_trend_24h NUMERIC DEFAULT 0,

  scored_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Score history: daily snapshots for trend charts
CREATE TABLE score_history (
  id BIGSERIAL PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  vitalis_score INTEGER NOT NULL,
  treasury_score INTEGER,
  development_score INTEGER,
  community_score INTEGER,
  revenue_score INTEGER,
  governance_score INTEGER,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Raw API data: cache of the last API response per project per source
CREATE TABLE raw_api_data (
  id BIGSERIAL PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  source TEXT NOT NULL, -- 'github', 'defillama', 'coingecko', 'onchain'
  data JSONB NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project submissions: queue for user-submitted projects
CREATE TABLE project_submissions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  website TEXT NOT NULL,
  chain TEXT NOT NULL,
  category TEXT NOT NULL,
  github_url TEXT,
  defillama_slug TEXT,
  coingecko_id TEXT,
  treasury_wallet TEXT,
  contact_email TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_score_history_project ON score_history(project_id, recorded_at DESC);
CREATE INDEX idx_raw_data_project ON raw_api_data(project_id, source, fetched_at DESC);
CREATE INDEX idx_current_scores_score ON current_scores(vitalis_score DESC);
CREATE INDEX idx_projects_chain ON projects(chain);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_active ON projects(is_active);

-- Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE current_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE score_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE raw_api_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_submissions ENABLE ROW LEVEL SECURITY;

-- Public read access for dashboard
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (is_active = true);
CREATE POLICY "Public read scores" ON current_scores FOR SELECT USING (true);
CREATE POLICY "Public read history" ON score_history FOR SELECT USING (true);

-- Service role can do everything (used by cron/admin)
CREATE POLICY "Service full access projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access scores" ON current_scores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access history" ON score_history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service full access raw" ON raw_api_data FOR ALL USING (true) WITH CHECK (true);

-- Anyone can submit a project
CREATE POLICY "Public insert submissions" ON project_submissions FOR INSERT WITH CHECK (true);
-- Only service role can read/update submissions
CREATE POLICY "Service read submissions" ON project_submissions FOR SELECT USING (true);
CREATE POLICY "Service update submissions" ON project_submissions FOR UPDATE USING (true);
