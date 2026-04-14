-- Phase 5: Score Alerts
-- Add alert opt-in + threshold to watchlists, and an alert log for dedupe/audit.

ALTER TABLE watchlists
  ADD COLUMN IF NOT EXISTS alert_threshold INT DEFAULT 5,
  ADD COLUMN IF NOT EXISTS alerts_enabled BOOLEAN DEFAULT true;

-- Allow users to update their own watchlist rows (toggle alerts, threshold)
DROP POLICY IF EXISTS "Users update own watchlist" ON watchlists;
CREATE POLICY "Users update own watchlist" ON watchlists
  FOR UPDATE USING (auth.uid() = user_id);

-- Alert send log: prevents duplicate sends and powers history
CREATE TABLE IF NOT EXISTS alert_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  old_score INT NOT NULL,
  new_score INT NOT NULL,
  delta INT NOT NULL,
  biggest_dimension TEXT,
  email_to TEXT NOT NULL,
  resend_id TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  error TEXT
);

CREATE INDEX IF NOT EXISTS idx_alert_log_user ON alert_log(user_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_alert_log_project ON alert_log(project_id, sent_at DESC);

ALTER TABLE alert_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own alert log" ON alert_log;
CREATE POLICY "Users read own alert log" ON alert_log
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Staff read all alert logs" ON alert_log;
CREATE POLICY "Staff read all alert logs" ON alert_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('owner', 'admin'))
  );
