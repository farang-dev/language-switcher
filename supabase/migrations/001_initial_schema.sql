-- Language Switcher / 言語切り替えくん Database Schema

-- ユーザープロファイルテーブル
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  native_language TEXT DEFAULT 'ja',
  widget_position TEXT DEFAULT 'bottom-right' CHECK (widget_position IN ('bottom-right', 'bottom-left', 'top-right', 'top-left')),
  widget_theme TEXT DEFAULT 'light' CHECK (widget_theme IN ('light', 'dark', 'auto')),
  widget_size TEXT DEFAULT 'medium' CHECK (widget_size IN ('small', 'medium', 'large')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- サイト設定テーブル
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  domain TEXT NOT NULL,
  site_name TEXT,
  api_key TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  allowed_languages TEXT[] DEFAULT ARRAY['en','ja','es','fr','de','zh','ko','pt','it','ru','ar','hi','th','vi','id','ms','tr','pl','nl','sv'],
  default_target_language TEXT DEFAULT 'en',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, domain)
);

-- 翻訳ログテーブル
CREATE TABLE translation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
  visitor_id TEXT NOT NULL,
  source_language TEXT NOT NULL,
  target_language TEXT NOT NULL,
  page_url TEXT,
  translated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_translation_logs_site_id ON translation_logs(site_id);
CREATE INDEX idx_translation_logs_translated_at ON translation_logs(translated_at);
CREATE INDEX idx_translation_logs_target_language ON translation_logs(target_language);
CREATE INDEX idx_sites_api_key ON sites(api_key);
CREATE INDEX idx_sites_user_id ON sites(user_id);

-- RLS (Row Level Security) 有効化
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_logs ENABLE ROW LEVEL SECURITY;

-- user_profiles: ユーザーは自分のプロファイルのみ参照・更新可能
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- sites: ユーザーは自分のサイトのみ参照・更新可能
CREATE POLICY "Users can view own sites" ON sites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sites" ON sites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sites" ON sites
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sites" ON sites
  FOR DELETE USING (auth.uid() = user_id);

-- translation_logs: サイトオーナーのみ参照可能、匿名書き込み可能（Widget用）
CREATE POLICY "Site owners can view translation logs" ON translation_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM sites
      WHERE sites.id = translation_logs.site_id
      AND sites.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert translation logs" ON translation_logs
  FOR INSERT WITH CHECK (true);

-- 月次集計ビュー
CREATE VIEW monthly_translation_stats AS
SELECT
  site_id,
  DATE_TRUNC('month', translated_at) AS month,
  target_language,
  COUNT(*) AS translation_count,
  COUNT(DISTINCT visitor_id) AS unique_visitors
FROM translation_logs
GROUP BY site_id, DATE_TRUNC('month', translated_at), target_language;

-- 日次集計ビュー
CREATE VIEW daily_translation_stats AS
SELECT
  site_id,
  DATE_TRUNC('day', translated_at) AS day,
  target_language,
  COUNT(*) AS translation_count,
  COUNT(DISTINCT visitor_id) AS unique_visitors
FROM translation_logs
GROUP BY site_id, DATE_TRUNC('day', translated_at), target_language;

-- 自動プロファイル作成トリガー
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
