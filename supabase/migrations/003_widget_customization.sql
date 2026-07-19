-- ウィジェットのカスタム背景色と透明度
ALTER TABLE user_profiles
  ADD COLUMN widget_bg_color TEXT DEFAULT '#00a67e',
  ADD COLUMN widget_opacity REAL DEFAULT 1.0 CHECK (widget_opacity >= 0.0 AND widget_opacity <= 1.0);
