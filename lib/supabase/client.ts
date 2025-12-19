/**
 * Supabase Client (瀏覽器端)
 *
 * 用於客戶端組件（'use client'）
 * 使用 @supabase/ssr 套件，支援 Next.js App Router
 */

import { createBrowserClient } from '@supabase/ssr';

/**
 * 建立瀏覽器端 Supabase Client
 *
 * 注意：此函數每次呼叫都會建立新的 client 實例
 * 在組件中建議使用 useMemo 或在模組層級建立單例
 */
export function createClient() {
  // 從環境變數讀取 Supabase 設定
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 錯誤處理：檢查環境變數是否設定
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      '❌ Supabase 環境變數未設定！\n' +
      '請確認 .env.local 檔案中包含：\n' +
      '- NEXT_PUBLIC_SUPABASE_URL\n' +
      '- NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }

  // 建立瀏覽器端 Supabase Client
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// 匯出單例模式的 client（推薦用法）
export const supabase = createClient();
