-- ============================================
-- 排行榜效能優化 SQL
-- 請在 Supabase SQL Editor 執行此檔案
-- ============================================

-- 步驟 1：建立索引（加速 JOIN 查詢）
-- ============================================

-- 為 completed_peaks 的 user_id 建立索引（如果尚未存在）
CREATE INDEX IF NOT EXISTS idx_completed_peaks_user_id
ON completed_peaks(user_id);

-- 為 completed_peaks 的 peakId 建立索引
CREATE INDEX IF NOT EXISTS idx_completed_peaks_peak_id
ON completed_peaks("peakId");

-- 為 profiles 的 id 建立索引（通常已有主鍵索引，但確保一下）
CREATE INDEX IF NOT EXISTS idx_profiles_id
ON profiles(id);


-- 步驟 2：建立排行榜 View
-- ============================================

-- 刪除舊的 View（如果存在）
DROP VIEW IF EXISTS leaderboard_view;

-- 建立新的排行榜 View
-- 這個 View 會預先計算每個使用者的完成數和排名
CREATE VIEW leaderboard_view AS
WITH user_completion AS (
  -- 計算每個使用者完成的百岳數量
  SELECT
    p.id as user_id,
    p.username,
    p.display_name,
    p.avatar_url,
    COALESCE(p.show_in_leaderboard, FALSE) as show_in_leaderboard,
    COUNT(DISTINCT cp."peakId") as completed_count
  FROM profiles p
  LEFT JOIN completed_peaks cp ON p.id = cp.user_id
  GROUP BY p.id, p.username, p.display_name, p.avatar_url, p.show_in_leaderboard
  HAVING COUNT(DISTINCT cp."peakId") > 0  -- 只顯示至少完成 1 座的使用者
),
ranked_users AS (
  -- 計算排名
  SELECT
    user_id,
    username,
    display_name,
    avatar_url,
    show_in_leaderboard,
    completed_count,
    ROUND((completed_count::NUMERIC / 100) * 100, 0) as completion_rate,  -- 假設總共 100 座
    ROW_NUMBER() OVER (ORDER BY completed_count DESC, user_id ASC) as rank
  FROM user_completion
)
SELECT
  user_id,
  username,
  display_name,
  avatar_url,
  show_in_leaderboard,
  completed_count,
  completion_rate,
  rank
FROM ranked_users
ORDER BY rank ASC;


-- 步驟 3：建立 Materialized View（進階優化，可選）
-- ============================================
-- 如果資料更新不頻繁，可以使用 Materialized View 來進一步提升效能
-- Materialized View 會快取結果，但需要手動或定期更新

-- 刪除舊的 Materialized View（如果存在）
DROP MATERIALIZED VIEW IF EXISTS leaderboard_materialized;

-- 建立 Materialized View
CREATE MATERIALIZED VIEW leaderboard_materialized AS
SELECT * FROM leaderboard_view;

-- 為 Materialized View 建立索引
CREATE UNIQUE INDEX IF NOT EXISTS idx_leaderboard_mat_user_id
ON leaderboard_materialized(user_id);

CREATE INDEX IF NOT EXISTS idx_leaderboard_mat_rank
ON leaderboard_materialized(rank);


-- 步驟 4：建立自動更新函數（可選）
-- ============================================
-- 每次有人完成新百岳時，自動更新 Materialized View

CREATE OR REPLACE FUNCTION refresh_leaderboard_materialized()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_materialized;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 建立觸發器：當 completed_peaks 有變動時自動更新
DROP TRIGGER IF EXISTS trigger_refresh_leaderboard ON completed_peaks;

CREATE TRIGGER trigger_refresh_leaderboard
AFTER INSERT OR DELETE OR UPDATE ON completed_peaks
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_leaderboard_materialized();


-- ============================================
-- 完成！
-- ============================================

-- 驗證 View 是否正常運作
SELECT * FROM leaderboard_view LIMIT 10;

-- 驗證 Materialized View 是否正常運作
SELECT * FROM leaderboard_materialized LIMIT 10;

-- 手動更新 Materialized View（如果需要）
-- REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_materialized;
