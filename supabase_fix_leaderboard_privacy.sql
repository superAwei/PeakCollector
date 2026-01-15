-- ============================================
-- 修復排行榜隱私設定問題
-- ============================================
--
-- 問題：當使用者更新 profiles.show_in_leaderboard 時
-- Materialized View 不會自動更新
--
-- 解決：新增觸發器監聽 profiles 表的變動
-- ============================================

-- 步驟 1：新增觸發器監聽 profiles 表變動
-- ============================================

-- 刪除舊的觸發器（如果存在）
DROP TRIGGER IF EXISTS trigger_refresh_leaderboard_on_profile_update ON profiles;

-- 建立新的觸發器：當 profiles 有變動時自動更新 Materialized View
CREATE TRIGGER trigger_refresh_leaderboard_on_profile_update
AFTER INSERT OR DELETE OR UPDATE ON profiles
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_leaderboard_materialized();


-- 步驟 2：確保 refresh_leaderboard_materialized 函數存在
-- ============================================
-- （如果之前沒有執行過 supabase_leaderboard_optimization.sql）

CREATE OR REPLACE FUNCTION refresh_leaderboard_materialized()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_materialized;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;


-- 步驟 3：手動更新一次 Materialized View
-- ============================================
-- 確保立即生效

REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_materialized;


-- ============================================
-- 驗證
-- ============================================

-- 1. 檢查觸發器是否已建立
SELECT
  trigger_name,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name LIKE '%leaderboard%';

-- 2. 檢查 Materialized View 資料
SELECT
  user_id,
  username,
  display_name,
  show_in_leaderboard,
  completed_count,
  rank
FROM leaderboard_materialized
LIMIT 10;

-- ============================================
-- 完成！
-- ============================================
--
-- 執行此檔案後：
-- 1. ✅ profiles 表更新時會自動更新 Materialized View
-- 2. ✅ completed_peaks 表更新時也會自動更新
-- 3. ✅ 隱私設定會即時生效
-- ============================================
