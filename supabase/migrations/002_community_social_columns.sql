-- Add community social metrics columns to current_scores
ALTER TABLE current_scores
  ADD COLUMN IF NOT EXISTS community_twitter_followers INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS community_telegram_members INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS community_reddit_subscribers INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS community_total_followers INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS community_data_available BOOLEAN DEFAULT FALSE;
