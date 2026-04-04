-- Watchlists table: user-project bookmarks
CREATE TABLE watchlists (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_slug TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, project_slug)
);

-- Indexes
CREATE INDEX idx_watchlists_user ON watchlists(user_id);
CREATE INDEX idx_watchlists_slug ON watchlists(project_slug);

-- Row Level Security
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;

-- Users can read their own watchlist
CREATE POLICY "Users read own watchlist" ON watchlists
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert to their own watchlist
CREATE POLICY "Users insert own watchlist" ON watchlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete from their own watchlist
CREATE POLICY "Users delete own watchlist" ON watchlists
  FOR DELETE USING (auth.uid() = user_id);
