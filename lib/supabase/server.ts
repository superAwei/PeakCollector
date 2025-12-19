/**
 * Supabase Server Client (伺服器端)
 *
 * 用於：
 * - Server Components
 * - API Routes
 * - Server Actions
 *
 * 使用 @supabase/ssr 套件，自動處理 cookies
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * 建立伺服器端 Supabase Client
 *
 * 此函數會自動處理 cookies，用於身份驗證
 * 必須在 async 函數中呼叫（因為使用了 Next.js cookies）
 */
export async function createClient() {
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

  // 取得 Next.js cookies
  const cookieStore = await cookies();

  // 建立伺服器端 Supabase Client，並設定 cookie 處理邏輯
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      // 讀取 cookie
      getAll() {
        return cookieStore.getAll();
      },
      // 設定 cookie
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // 在 Server Components 中呼叫 set 可能會失敗
          // 這是預期行為，可以忽略
        }
      },
    },
  });
}
