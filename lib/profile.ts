/**
 * Profile Service - 處理使用者個人資料
 *
 * 這個檔案處理所有 profile 相關的操作
 * 不會影響現有的 storage.ts 功能
 */

import { supabase } from './supabase/client';
import type { Profile } from './types';

const TABLE_NAME = 'profiles';

/**
 * 取得目前使用者的 profile
 */
export async function getCurrentUserProfile(): Promise<Profile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('取得 profile 失敗:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('取得 profile 失敗:', error);
    return null;
  }
}

/**
 * 透過 username 取得 profile（公開查詢）
 */
export async function getProfileByUsername(username: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('username', username)
      .eq('is_public', true) // 只查詢公開的 profile
      .single();

    if (error) {
      console.error('查詢 profile 失敗:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('查詢 profile 失敗:', error);
    return null;
  }
}

/**
 * 更新目前使用者的 profile
 */
export async function updateProfile(updates: Partial<Profile>): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('使用者未登入');
    }

    // 移除不可更新的欄位
    const { id, created_at, updated_at, ...safeUpdates } = updates as any;

    const { error } = await supabase
      .from(TABLE_NAME)
      .update(safeUpdates)
      .eq('id', user.id);

    if (error) {
      console.error('更新 profile 失敗:', error);
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    console.error('更新 profile 失敗:', error);
    throw error;
  }
}

/**
 * 檢查 username 是否可用
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('id')
      .eq('username', username)
      .single();

    // 如果查詢失敗（沒找到），表示 username 可用
    if (error) {
      return true;
    }

    // 如果找到的是自己的 profile，也算可用
    if (user && data.id === user.id) {
      return true;
    }

    // 被別人使用了
    return false;
  } catch (error) {
    console.error('檢查 username 失敗:', error);
    return false;
  }
}
