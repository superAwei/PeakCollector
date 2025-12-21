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
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('OAuth code exchange 失敗:', error);
        // 重導向到登入頁面並顯示錯誤
        return NextResponse.redirect(`${origin}/login?error=auth_failed`);
      }

      // 檢查是否為首次登入（profile 不存在）
      if (data.user) {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single();

        // 如果 profile 不存在，自動建立一個
        if (!existingProfile) {
          console.log('🆕 首次登入，建立 profile...');

          // 從 Google 資料取得預設值
          const fullName = data.user.user_metadata?.full_name ||
                          data.user.user_metadata?.name ||
                          data.user.email?.split('@')[0] ||
                          'user';

          // 生成一個臨時 username（使用者稍後可以修改）
          const tempUsername = `user_${data.user.id.slice(0, 8)}`;

          await supabase.from('profiles').insert({
            id: data.user.id,
            username: tempUsername,
            display_name: fullName,
            avatar_url: data.user.user_metadata?.avatar_url,
            is_public: true, // 預設公開
            bio: null,
          });

          console.log('✅ Profile 建立成功，引導使用者設定個人資料');
          // 重導向到個人資料編輯頁面（首次登入）
          return NextResponse.redirect(`${origin}/profile/edit?first_time=true`);
        }
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
