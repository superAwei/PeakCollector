/**
 * 登入頁面
 *
 * 提供 Google OAuth 登入功能
 * 保持與現有網站風格一致（emerald/teal 配色）
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 檢查 URL 中的錯誤參數
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      const errorMessages: Record<string, string> = {
        auth_failed: '登入失敗，請稍後再試',
        server_error: '伺服器錯誤，請稍後再試',
        no_code: '登入過程異常，請重新嘗試',
      };
      setError(errorMessages[errorParam] || '發生未知錯誤');
    }
  }, [searchParams]);

  /**
   * 處理 Google 登入
   */
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 使用 Supabase Auth 進行 Google OAuth 登入
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // 登入成功後重導向到首頁
          redirectTo: `${window.location.origin}/auth/callback`,
          // 請求額外的 Google 權限
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        throw error;
      }

      // OAuth 會自動跳轉到 Google 登入頁面
      // 所以不需要在這裡做任何事
    } catch (err) {
      console.error('登入失敗:', err);
      setError(err instanceof Error ? err.message : '登入失敗，請稍後再試');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* 登入卡片 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12">
          {/* Logo 和標題 */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">⛰️</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              PeakCollector
            </h1>
            <p className="text-gray-600">台灣百岳數位護照</p>
          </div>

          {/* 說明文字 */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
              <p className="text-sm text-gray-700 text-center">
                <span className="font-semibold">✨ 登入後你的百岳記錄將同步到雲端</span>
              </p>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">✓</span>
                  <span>跨裝置同步你的登頂記錄</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">✓</span>
                  <span>建立你的個人公開主頁</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">✓</span>
                  <span>分享你的百岳成就到社群</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 錯誤訊息 */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

          {/* Google 登入按鈕 */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                <span>登入中...</span>
              </>
            ) : (
              <>
                {/* Google Logo SVG */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>使用 Google 帳號登入</span>
              </>
            )}
          </button>

          {/* 隱私說明 */}
          <p className="mt-6 text-xs text-gray-500 text-center">
            登入即表示你同意我們的服務條款與隱私政策
            <br />
            我們只會儲存你的百岳記錄，不會取得其他 Google 資料
          </p>
        </div>

        {/* 底部資訊 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            還沒使用過 PeakCollector？
          </p>
          <p className="text-xs text-gray-500 mt-2">
            登入後即可開始記錄你的百岳征途 🏔️
          </p>
        </div>
      </div>
    </div>
  );
}
