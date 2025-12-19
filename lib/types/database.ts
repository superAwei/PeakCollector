/**
 * Supabase 資料庫型別定義
 *
 * 這個檔案定義了所有資料庫表格的 TypeScript 型別
 * 確保前後端資料結構的一致性
 */

// ==================== 使用者相關型別 ====================

/**
 * 使用者基本資料（從 Supabase Auth 來的）
 *
 * 這是 Supabase Auth 自動管理的使用者資料
 * 包含在 auth.users 表格中
 */
export interface User {
  id: string; // Supabase User UUID
  email?: string;
  user_metadata?: {
    avatar_url?: string; // Google 頭像
    full_name?: string; // Google 顯示名稱
    name?: string; // 備用名稱欄位
  };
  created_at?: string;
}

/**
 * 使用者個人資料（擴展資料）
 *
 * 儲存在 public.profiles 表格
 * 一對一關聯到 auth.users
 */
export interface Profile {
  id: string; // 對應 auth.users.id
  username: string; // 唯一使用者名稱（用於公開 URL）
  display_name?: string; // 顯示名稱
  avatar_url?: string; // 頭像 URL
  bio?: string; // 個人簡介
  is_public: boolean; // 是否公開個人主頁（預設 true）
  created_at: string;
  updated_at: string;
}

// ==================== 百岳記錄相關型別 ====================

/**
 * 完成記錄（Supabase 版本）
 *
 * 儲存在 public.completed_peaks 表格
 * 相容舊版 localStorage 的 CompletedPeak 介面
 */
export interface CompletedPeak {
  // Supabase 新增欄位
  id?: string; // Supabase 自動生成的 UUID（新增時可省略）
  user_id?: string; // 關聯到 auth.users.id（新增時可省略，由後端填入）

  // 原有欄位（與 localStorage 版本相容）
  peakId: number; // 百岳 ID (1-100)
  completedAt: string; // 完成時間（ISO 8601 格式）
  gpxFileName?: string; // GPX 檔案名稱（選填）
  verificationMethod?: 'gpx_verified' | 'manual'; // 驗證方式

  // Supabase 時間戳記（自動管理）
  created_at?: string; // 記錄建立時間
  updated_at?: string; // 記錄更新時間
}

/**
 * 完成記錄（資料庫回傳格式）
 *
 * 從 Supabase 查詢回來的資料一定會包含 id 和 user_id
 */
export interface CompletedPeakRecord extends Required<Pick<CompletedPeak, 'id' | 'user_id'>> {
  peakId: number;
  completedAt: string;
  gpxFileName?: string;
  verificationMethod?: 'gpx_verified' | 'manual';
  created_at: string;
  updated_at: string;
}

/**
 * 完成記錄（新增資料格式）
 *
 * 新增記錄時需要提供的資料
 * id 會由資料庫自動填入，user_id 需要手動提供（符合 RLS policy）
 */
export interface CompletedPeakInsert {
  user_id: string; // 使用者 ID（必填，符合 RLS policy）
  peakId: number;
  completedAt: string;
  gpxFileName?: string;
  verificationMethod?: 'gpx_verified' | 'manual';
}

// ==================== Strava 相關型別（預留） ====================

/**
 * Strava 連結記錄
 *
 * 儲存在 public.strava_connections 表格
 * 用於未來整合 Strava API
 */
export interface StravaConnection {
  id: string; // UUID
  user_id: string; // 關聯到 auth.users.id
  strava_athlete_id: number; // Strava Athlete ID
  access_token: string; // Strava Access Token（加密儲存）
  refresh_token: string; // Strava Refresh Token（加密儲存）
  expires_at: number; // Token 過期時間（Unix timestamp）
  created_at: string;
  updated_at: string;
}

// ==================== 輔助型別 ====================

/**
 * 資料庫表格名稱
 *
 * 用於 Supabase 查詢，避免字串打錯
 */
export const TABLE_NAMES = {
  PROFILES: 'profiles',
  COMPLETED_PEAKS: 'completed_peaks',
  STRAVA_CONNECTIONS: 'strava_connections',
} as const;

/**
 * 資料庫錯誤型別
 */
export interface DatabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

/**
 * API 回應格式
 */
export interface ApiResponse<T> {
  data?: T;
  error?: DatabaseError;
}

// ==================== localStorage 遷移相關型別 ====================

/**
 * localStorage 舊版資料格式
 *
 * 用於從 localStorage 遷移資料到 Supabase
 */
export interface LegacyCompletedPeak {
  peakId: number;
  completedAt: string;
  gpxFileName?: string;
  verificationMethod?: 'gpx_verified' | 'manual';
}

/**
 * localStorage 遷移結果
 */
export interface MigrationResult {
  success: boolean;
  migratedCount: number; // 成功遷移的記錄數量
  skippedCount: number; // 跳過的記錄數量（已存在）
  errors: string[]; // 錯誤訊息
}
