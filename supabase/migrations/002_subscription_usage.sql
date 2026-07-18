-- Subscription and Usage Tracking
-- Free tier: 50 translations/month, Pro: ¥980/month unlimited

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free'
    CHECK (subscription_tier IN ('free', 'pro')),
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_updated_at TIMESTAMPTZ;

-- Monthly translation usage tracking
CREATE TABLE IF NOT EXISTS monthly_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  translation_count INTEGER DEFAULT 0,
  UNIQUE(user_id, year, month)
);

CREATE INDEX IF NOT EXISTS idx_monthly_usage_user ON monthly_usage(user_id, year, month);

-- Function to check if user can translate
CREATE OR REPLACE FUNCTION can_translate(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_tier TEXT;
  v_count INTEGER;
  v_year INTEGER := EXTRACT(YEAR FROM NOW());
  v_month INTEGER := EXTRACT(MONTH FROM NOW());
BEGIN
  SELECT subscription_tier INTO v_tier
  FROM user_profiles
  WHERE id = p_user_id;

  -- Pro users have unlimited translations
  IF v_tier = 'pro' THEN
    RETURN true;
  END IF;

  -- Free users: check monthly limit (50)
  SELECT COALESCE(
    (SELECT translation_count FROM monthly_usage
     WHERE user_id = p_user_id AND year = v_year AND month = v_month),
    0
  ) INTO v_count;

  RETURN v_count < 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment usage counter
CREATE OR REPLACE FUNCTION increment_usage(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_year INTEGER := EXTRACT(YEAR FROM NOW());
  v_month INTEGER := EXTRACT(MONTH FROM NOW());
BEGIN
  INSERT INTO monthly_usage (user_id, year, month, translation_count)
  VALUES (p_user_id, v_year, v_month, 1)
  ON CONFLICT (user_id, year, month)
  DO UPDATE SET translation_count = monthly_usage.translation_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
