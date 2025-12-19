/**
 * OAuth 回調處理
 *
 * 當使用者完成 Google 登入後，會被重導向到這個頁面
 * 這個 Route Handler 會：
 * 1. 處理 OAuth code exchange
 * 2. 設定 session cookies
 * 3. 重導向回主頁
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    try {
      // 建立 Supabase server client
      const supabase = await createClient();

      // 使用 code 交換 session
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('OAuth code exchange 失敗:', error);
        // 重導向到登入頁面並顯示錯誤
        return NextResponse.redirect(`${origin}/login?error=auth_failed`);
      }

      // 成功！重導向到首頁
      console.log('✅ OAuth 登入成功');
      return NextResponse.redirect(`${origin}/`);
    } catch (err) {
      console.error('OAuth 處理錯誤:', err);
      return NextResponse.redirect(`${origin}/login?error=server_error`);
    }
  }

  // 如果沒有 code，重導向到登入頁面
  console.warn('OAuth callback 缺少 code 參數');
  return NextResponse.redirect(`${origin}/login?error=no_code`);
}
