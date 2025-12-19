/**
 * Storage Layer - Supabase 版本
 *
 * 這個檔案處理所有完成記錄的儲存邏輯
 * 已從 localStorage 升級為 Supabase 雲端儲存
 *
 * 注意：所有函數都改成 async，因為需要呼叫 Supabase API
 */

import { supabase } from './supabase/client';
import type { CompletedPeak, CompletedPeakInsert, MigrationResult } from './types';

// localStorage key（用於遷移）
const LEGACY_STORAGE_KEY = 'peak-collector-completed-peaks';

// Supabase 表格名稱
const TABLE_NAME = 'completed_peaks';

// ==================== 公開 API ====================

/**
 * 取得已完成的百岳記錄
 *
 * @returns 完成記錄陣列（包含 Supabase 欄位）
 */
export async function getCompletedPeaks(): Promise<CompletedPeak[]> {
  try {
    // 檢查是否已登入
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn('使用者未登入，返回空陣列');
      return [];
    }

    // 從 Supabase 查詢資料
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('user_id', user.id)
      .order('completedAt', { ascending: false });

    if (error) {
      console.error('Supabase 查詢失敗:', error);
      throw new Error(`查詢失敗: ${error.message}`);
    }

    // 將 Supabase 欄位轉換為前端格式
    return (data || []).map(record => ({
      id: record.id,
      user_id: record.user_id,
      peakId: record.peakId,
      completedAt: record.completedAt,
      gpxFileName: record.gpxFileName,
      verificationMethod: record.verificationMethod,
      created_at: record.created_at,
      updated_at: record.updated_at,
    }));
  } catch (error) {
    console.error('讀取已完成百岳記錄失敗:', error);
    return [];
  }
}

/**
 * 取得已完成的百岳 ID 列表
 *
 * @returns 百岳 ID 陣列
 */
export async function getCompletedPeakIds(): Promise<number[]> {
  const records = await getCompletedPeaks();
  return records.map(record => record.peakId);
}

/**
 * 儲存新完成的百岳記錄
 *
 * @param peakIds - 完成的百岳 ID 列表
 * @param gpxFileName - GPX 檔案名稱（選填）
 * @param verificationMethod - 驗證方式（預設 'gpx_verified'）
 */
export async function saveCompletedPeaks(
  peakIds: number[],
  gpxFileName?: string,
  verificationMethod: 'gpx_verified' | 'manual' = 'gpx_verified'
): Promise<void> {
  try {
    // 檢查是否已登入
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('使用者未登入，無法儲存記錄');
    }

    // 取得已完成的記錄
    const existingRecords = await getCompletedPeaks();
    const existingIds = new Set(existingRecords.map(r => r.peakId));
    const now = new Date().toISOString();

    // 只添加尚未記錄的百岳（需要加入 user_id 以符合 RLS policy）
    const newRecords: CompletedPeakInsert[] = peakIds
      .filter(id => !existingIds.has(id))
      .map(id => ({
        user_id: user.id, // 加入 user_id
        peakId: id,
        completedAt: now,
        gpxFileName,
        verificationMethod,
      }));

    if (newRecords.length === 0) {
      console.log('沒有新的記錄需要儲存');
      return;
    }

    // 插入到 Supabase（user_id 會由 RLS policy 自動填入）
    const { error } = await supabase
      .from(TABLE_NAME)
      .insert(newRecords);

    if (error) {
      console.error('Supabase 插入失敗:', error);
      throw new Error(`儲存失敗: ${error.message}`);
    }

    console.log(`✅ 成功儲存 ${newRecords.length} 筆記錄`);
  } catch (error) {
    console.error('儲存已完成百岳記錄失敗:', error);
    throw error;
  }
}

/**
 * 清除所有記錄（用於重置）
 *
 * 注意：這會刪除目前使用者的所有完成記錄！
 */
export async function clearCompletedPeaks(): Promise<void> {
  try {
    // 檢查是否已登入
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('使用者未登入，無法清除記錄');
    }

    // 刪除目前使用者的所有記錄
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Supabase 刪除失敗:', error);
      throw new Error(`清除失敗: ${error.message}`);
    }

    console.log('✅ 成功清除所有記錄');
  } catch (error) {
    console.error('清除記錄失敗:', error);
    throw error;
  }
}

/**
 * 檢查某座百岳是否已完成
 *
 * @param peakId - 百岳 ID
 * @returns 是否已完成
 */
export async function isPeakCompleted(peakId: number): Promise<boolean> {
  const ids = await getCompletedPeakIds();
  return ids.includes(peakId);
}

/**
 * 取得特定百岳的完成記錄
 *
 * @param peakId - 百岳 ID
 * @returns 完成記錄（如果不存在則返回 undefined）
 */
export async function getPeakRecord(peakId: number): Promise<CompletedPeak | undefined> {
  const records = await getCompletedPeaks();
  return records.find(record => record.peakId === peakId);
}

/**
 * 刪除特定百岳的記錄
 *
 * @param peakId - 百岳 ID
 */
export async function deletePeakRecord(peakId: number): Promise<void> {
  try {
    // 檢查是否已登入
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('使用者未登入，無法刪除記錄');
    }

    // 刪除指定的記錄
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('user_id', user.id)
      .eq('peakId', peakId);

    if (error) {
      console.error('Supabase 刪除失敗:', error);
      throw new Error(`刪除失敗: ${error.message}`);
    }

    console.log(`✅ 成功刪除百岳 #${peakId} 的記錄`);
  } catch (error) {
    console.error('刪除記錄失敗:', error);
    throw error;
  }
}

// ==================== localStorage 遷移邏輯 ====================

/**
 * 從 localStorage 讀取舊版資料
 *
 * @returns 舊版完成記錄陣列
 */
function getLegacyCompletedPeaks(): CompletedPeak[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored) as CompletedPeak[];
  } catch (error) {
    console.error('讀取 localStorage 失敗:', error);
    return [];
  }
}

/**
 * 清除 localStorage 舊版資料
 */
function clearLegacyStorage(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    console.log('✅ 已清除 localStorage 舊版資料');
  } catch (error) {
    console.error('清除 localStorage 失敗:', error);
  }
}

/**
 * 遷移 localStorage 資料到 Supabase
 *
 * 這個函數會在使用者登入後自動執行
 * 將舊的 localStorage 資料匯入到 Supabase
 *
 * @returns 遷移結果
 */
export async function migrateFromLocalStorage(): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: false,
    migratedCount: 0,
    skippedCount: 0,
    errors: [],
  };

  try {
    console.log('📦 [遷移] 步驟 1/5: 檢查使用者登入狀態');

    // 檢查是否已登入
    let user;
    try {
      const { data, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('❌ [遷移] Auth 錯誤:', authError);
        throw authError;
      }
      user = data.user;
    } catch (authErr) {
      const error = `取得使用者資訊失敗: ${authErr instanceof Error ? authErr.message : '未知錯誤'}`;
      result.errors.push(error);
      console.error('❌ [遷移]', error);
      return result;
    }

    if (!user) {
      const error = '使用者未登入，無法遷移資料';
      result.errors.push(error);
      console.error('❌ [遷移]', error);
      return result;
    }
    console.log('✅ [遷移] 使用者已登入:', user.email);

    console.log('📦 [遷移] 步驟 2/5: 讀取 localStorage 舊版資料');
    // 讀取 localStorage 舊版資料
    const legacyRecords = getLegacyCompletedPeaks();
    if (legacyRecords.length === 0) {
      console.log('ℹ️ [遷移] 沒有需要遷移的 localStorage 資料');
      result.success = true;
      return result;
    }
    console.log(`✅ [遷移] 發現 ${legacyRecords.length} 筆 localStorage 舊版資料`);

    console.log('📦 [遷移] 步驟 3/5: 查詢 Supabase 現有記錄');

    // 取得 Supabase 現有記錄
    let existingRecords;
    try {
      existingRecords = await getCompletedPeaks();
      console.log(`✅ [遷移] Supabase 現有 ${existingRecords.length} 筆記錄`);
    } catch (queryErr) {
      console.error('❌ [遷移] 查詢現有記錄失敗:', queryErr);
      // 假設沒有現有記錄，繼續遷移
      existingRecords = [];
      console.log('⚠️ [遷移] 無法查詢現有記錄，假設為空，繼續遷移...');
    }

    const existingIds = new Set(existingRecords.map(r => r.peakId));

    // 過濾出尚未存在的記錄
    const recordsToMigrate = legacyRecords.filter(record => {
      if (existingIds.has(record.peakId)) {
        result.skippedCount++;
        return false;
      }
      return true;
    });

    console.log(`📦 [遷移] 步驟 4/5: 準備插入資料`);
    if (recordsToMigrate.length === 0) {
      console.log('ℹ️ [遷移] 所有記錄已存在，不需要遷移');
      result.success = true;
      clearLegacyStorage(); // 清除舊資料
      return result;
    }
    console.log(`✅ [遷移] 需要遷移 ${recordsToMigrate.length} 筆新記錄`);

    // 準備要插入的資料（需要加入 user_id 以符合 RLS policy）
    const recordsToInsert: CompletedPeakInsert[] = recordsToMigrate.map(record => ({
      user_id: user.id, // 加入 user_id
      peakId: record.peakId,
      completedAt: record.completedAt,
      gpxFileName: record.gpxFileName,
      verificationMethod: record.verificationMethod || 'manual', // 舊資料沒有此欄位，預設為 manual
    }));

    console.log('📦 [遷移] 步驟 5/5: 插入到 Supabase');
    console.log('📝 [遷移] 插入資料:', recordsToInsert);

    // 插入到 Supabase
    const { error, data: insertedData } = await supabase
      .from(TABLE_NAME)
      .insert(recordsToInsert)
      .select(); // 取得插入的資料

    if (error) {
      const errorMsg = `Supabase 插入失敗: ${error.message}`;
      result.errors.push(errorMsg);
      console.error('❌ [遷移]', errorMsg);
      console.error('❌ [遷移] 錯誤詳情:', error);
      console.error('❌ [遷移] 錯誤代碼:', error.code);
      console.error('❌ [遷移] 錯誤提示:', error.hint);

      // 檢查是否是表格不存在的錯誤
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.error('❌ [遷移] 表格不存在！請在 Supabase Dashboard 執行 SUPABASE_SETUP.sql');
      }

      return result;
    }

    console.log('✅ [遷移] 插入成功:', insertedData);

    // 遷移成功
    result.migratedCount = recordsToInsert.length;
    result.success = true;

    console.log(`✅ [遷移] 成功遷移 ${result.migratedCount} 筆記錄`);
    if (result.skippedCount > 0) {
      console.log(`⏭️ [遷移] 跳過 ${result.skippedCount} 筆已存在的記錄`);
    }

    // 清除 localStorage 舊資料
    console.log('🧹 [遷移] 清除 localStorage 舊資料');
    clearLegacyStorage();

    console.log('🎉 [遷移] 遷移完成！');
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知錯誤';
    result.errors.push(errorMessage);
    console.error('❌ [遷移] 遷移失敗:', error);
    console.error('❌ [遷移] 錯誤訊息:', errorMessage);
    return result;
  }
}

/**
 * 檢查是否有 localStorage 舊版資料需要遷移
 *
 * @returns 是否有舊資料
 */
export function hasLegacyData(): boolean {
  return getLegacyCompletedPeaks().length > 0;
}

// ==================== 型別匯出（向後相容） ====================

// 從 types 匯出 CompletedPeak，保持與舊版 storage.ts 相容
export type { CompletedPeak } from './types';
