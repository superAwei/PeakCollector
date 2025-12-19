-- =================================================================
-- PeakCollector Supabase 資料庫設定
-- =================================================================
--
-- 請在 Supabase Dashboard > SQL Editor 執行此 SQL
--
-- =================================================================

-- 1. 建立 profiles 表格（使用者個人資料）
-- =================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 為 username 建立索引（查詢公開主頁時使用）
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);

-- 啟用 Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: 所有人可以讀取公開的 profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  USING (is_public = true);

-- RLS Policy: 使用者可以讀取自己的 profile
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- RLS Policy: 使用者可以更新自己的 profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policy: 使用者可以插入自己的 profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);


-- =================================================================
-- 2. 建立 completed_peaks 表格（百岳完成記錄）
-- =================================================================
CREATE TABLE IF NOT EXISTS public.completed_peaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  "peakId" INTEGER NOT NULL,  -- 使用駝峰式命名（與前端一致）
  "completedAt" TIMESTAMPTZ NOT NULL,  -- 完成時間
  "gpxFileName" TEXT,  -- GPX 檔案名稱
  "verificationMethod" TEXT CHECK ("verificationMethod" IN ('gpx_verified', 'manual')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- 確保每個使用者的每座山只能有一筆記錄
  UNIQUE(user_id, "peakId")
);

-- 為 user_id 建立索引（查詢效能）
CREATE INDEX IF NOT EXISTS completed_peaks_user_id_idx ON public.completed_peaks(user_id);

-- 為 peakId 建立索引（查詢效能）
CREATE INDEX IF NOT EXISTS completed_peaks_peak_id_idx ON public.completed_peaks("peakId");

-- 啟用 Row Level Security (RLS)
ALTER TABLE public.completed_peaks ENABLE ROW LEVEL SECURITY;

-- RLS Policy: 使用者只能讀取自己的記錄
CREATE POLICY "Users can read own peaks"
  ON public.completed_peaks
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: 使用者只能插入自己的記錄（user_id 自動填入）
CREATE POLICY "Users can insert own peaks"
  ON public.completed_peaks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: 使用者只能更新自己的記錄
CREATE POLICY "Users can update own peaks"
  ON public.completed_peaks
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policy: 使用者只能刪除自己的記錄
CREATE POLICY "Users can delete own peaks"
  ON public.completed_peaks
  FOR DELETE
  USING (auth.uid() = user_id);


-- =================================================================
-- 3. 建立自動更新 updated_at 的 Trigger
-- =================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- profiles 表格的 trigger
DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- completed_peaks 表格的 trigger
DROP TRIGGER IF EXISTS set_updated_at_completed_peaks ON public.completed_peaks;
CREATE TRIGGER set_updated_at_completed_peaks
  BEFORE UPDATE ON public.completed_peaks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();


-- =================================================================
-- 4. 建立自動建立 profile 的 Trigger（使用者註冊時）
-- =================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- 從 email 生成預設 username（移除 @ 後的部分）
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    SPLIT_PART(NEW.email, '@', 1) || '_' || SUBSTRING(NEW.id::TEXT FROM 1 FOR 8),  -- 預設 username
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),  -- 從 Google 取得名稱
    NEW.raw_user_meta_data->>'avatar_url'  -- 從 Google 取得頭像
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 建立 trigger（在 auth.users 新增使用者時自動執行）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- =================================================================
-- 5. 建立 strava_connections 表格（預留，未來實作）
-- =================================================================
CREATE TABLE IF NOT EXISTS public.strava_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  strava_athlete_id INTEGER NOT NULL,
  access_token TEXT NOT NULL,  -- 應該加密儲存（未來改進）
  refresh_token TEXT NOT NULL,  -- 應該加密儲存（未來改進）
  expires_at BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 啟用 Row Level Security (RLS)
ALTER TABLE public.strava_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policy: 使用者只能讀取自己的 Strava 連結
CREATE POLICY "Users can read own strava connection"
  ON public.strava_connections
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: 使用者只能插入自己的 Strava 連結
CREATE POLICY "Users can insert own strava connection"
  ON public.strava_connections
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: 使用者只能更新自己的 Strava 連結
CREATE POLICY "Users can update own strava connection"
  ON public.strava_connections
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policy: 使用者只能刪除自己的 Strava 連結
CREATE POLICY "Users can delete own strava connection"
  ON public.strava_connections
  FOR DELETE
  USING (auth.uid() = user_id);


-- =================================================================
-- 設定完成！
-- =================================================================
--
-- 接下來請：
-- 1. 在 Supabase Dashboard > Authentication > Providers 啟用 Google
-- 2. 設定 Google OAuth Client ID 和 Secret
-- 3. 在 URL Configuration 加入：
--    - http://localhost:3000/auth/callback (開發環境)
--    - https://yourdomain.com/auth/callback (正式環境)
--
-- =================================================================
