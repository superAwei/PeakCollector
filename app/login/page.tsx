/**
 * 登入頁面
 *
 * 提供 Google OAuth 登入功能
 * 保持與現有網站風格一致（emerald/teal 配色）
 */

'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { isInAppBrowser, getOS } from '@/lib/browser-detection';
import { AlertTriangle } from 'lucide-react';

// 強制動態渲染（避免 build 時 prerender 錯誤）
export const dynamic = 'force-dynamic';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 立即執行偵測（同步，不是在 useEffect 中）避免競態條件
  const isInApp = useMemo(() => isInAppBrowser(), []);
  const os = useMemo(() => getOS(), []);

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
            <div className="flex justify-center mb-4">
              <Image
                src="/weblogo.png"
                alt="PeakCollector Logo"
                width={96}
                height={96}
                className="w-20 h-20 sm:w-24 sm:h-24"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              PeakCollector
            </h1>
            <p className="text-gray-600 mb-2">台灣百岳數位護照</p>
            <p className="text-xs text-emerald-600 font-medium">
              完全免費 • 資料安全 • 隨時取用
            </p>
          </div>

          {/* 為什麼需要登入 */}
          <div className="mb-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <span>🔐</span>
                <span>為什麼需要 Google 登入？</span>
              </h3>
              <p className="text-xs text-blue-800 leading-relaxed">
                我們使用 Google 登入來<strong>保護您的資料安全</strong>，確保只有您能查看和管理自己的百岳記錄。登入後，所有記錄都會安全地儲存在雲端，<strong>永不丟失、隨處可用</strong>！
              </p>
            </div>
          </div>

          {/* 功能說明 */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-5 border border-emerald-200">
              <h2 className="text-base font-bold text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
                <span>✨</span>
                <span>強大功能，完全免費</span>
              </h2>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-lg flex-shrink-0">🏔️</span>
                  <div>
                    <div className="font-semibold text-gray-800">百岳徽章牆</div>
                    <div className="text-xs text-gray-600">完整 100 座台灣百岳，視覺化追蹤進度</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg flex-shrink-0">📍</span>
                  <div>
                    <div className="font-semibold text-gray-800">GPX 自動驗證</div>
                    <div className="text-xs text-gray-600">上傳登山軌跡，自動識別完成的百岳</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg flex-shrink-0">☁️</span>
                  <div>
                    <div className="font-semibold text-gray-800">雲端同步</div>
                    <div className="text-xs text-gray-600">資料安全儲存，手機、電腦隨時查看</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg flex-shrink-0">🎯</span>
                  <div>
                    <div className="font-semibold text-gray-800">手動標記</div>
                    <div className="text-xs text-gray-600">沒有 GPX？也能彈性記錄完成的百岳</div>
                  </div>
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

          {/* 社群 App 內建瀏覽器警告 */}
          {isInApp && (
            <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-300 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-amber-900 mb-2">
                    無法在此登入
                  </h3>
                  <p className="text-xs text-amber-800 leading-relaxed mb-3">
                    Google 基於安全考量，不允許在社群 App 內建瀏覽器中登入。
                    請在 Safari、Chrome 等瀏覽器中開啟。
                  </p>
                  <div className="bg-white rounded-lg p-3 border border-amber-200">
                    <p className="text-xs font-semibold text-amber-900 mb-2">📱 如何開啟？</p>
                    {os === 'ios' && (
                      <ol className="text-xs text-amber-800 space-y-1.5 list-decimal list-inside">
                        <li>點擊右上角的 <strong>「⋯」</strong> 選單</li>
                        <li>選擇 <strong>「在 Safari 中開啟」</strong></li>
                        <li>即可正常登入使用</li>
                      </ol>
                    )}
                    {os === 'android' && (
                      <ol className="text-xs text-amber-800 space-y-1.5 list-decimal list-inside">
                        <li>點擊右上角的 <strong>「⋮」</strong> 選單</li>
                        <li>選擇 <strong>「在瀏覽器中開啟」</strong></li>
                        <li>選擇 Chrome 或其他瀏覽器</li>
                      </ol>
                    )}
                    {os === 'other' && (
                      <p className="text-xs text-amber-800">
                        請點擊右上角選單，選擇「在瀏覽器中開啟」
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Google 登入按鈕 */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading || isInApp}
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
          <div className="mt-6 text-xs text-gray-500 text-center space-y-1">
            <p className="font-medium text-gray-600">
              🔒 您的資料 100% 安全
            </p>
            <p className="leading-relaxed">
              我們只會儲存您的百岳記錄，不會取得其他 Google 資料。<br />
              您可以隨時刪除所有記錄，完全掌控自己的資料。
            </p>
          </div>
        </div>

        {/* 底部資訊 */}
        <div className="mt-8 text-center">
          <div className="bg-white/50 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              ⛰️ 開始你的百岳收集之旅
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              一鍵登入，立即開始記錄你的登頂成就<br />
              加入台灣登山社群，分享你的百岳故事
            </p>
            <div className="mt-4 pt-4 border-t border-gray-300">
              <a
                href="/about"
                className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
              >
                關於 PeakCollector →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 包裝 Suspense（避免 useSearchParams 錯誤）
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/weblogo.png"
              alt="PeakCollector Logo"
              width={96}
              height={96}
              className="w-20 h-20 sm:w-24 sm:h-24"
              priority
            />
          </div>
          <div className="text-xl text-gray-600">載入中...</div>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
