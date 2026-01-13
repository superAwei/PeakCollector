/**
 * UserMenu - 使用者選單（右上角）
 *
 * 顯示：
 * - 使用者頭像和名稱
 * - 下拉選單（個人主頁、設定、登出）
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from './AuthProvider';
import { getCurrentUserProfile } from '@/lib/profile';

export default function UserMenu() {
  const router = useRouter();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // 載入使用者 profile（取得 username）
  useEffect(() => {
    async function loadProfile() {
      if (user) {
        const profile = await getCurrentUserProfile();
        if (profile) {
          setUsername(profile.username);
        }
      }
    }
    loadProfile();
  }, [user]);

  // 每次打開選單時重新載入 username（確保是最新的）
  const handleMenuToggle = async () => {
    if (!isOpen && user) {
      // 打開選單時重新載入 username
      const profile = await getCurrentUserProfile();
      if (profile) {
        setUsername(profile.username);
      }
    }
    setIsOpen(!isOpen);
  };

  // 取得使用者顯示名稱
  const displayName = user?.user_metadata?.full_name ||
                      user?.user_metadata?.name ||
                      user?.email?.split('@')[0] ||
                      '使用者';

  // 取得使用者頭像
  const avatarUrl = user?.user_metadata?.avatar_url;

  // 處理登出
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      // 登出成功，重導向到登入頁面
      router.push('/login');
    } catch (error) {
      console.error('登出失敗:', error);
      alert('登出失敗，請稍後再試');
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="relative">
      {/* 使用者按鈕 */}
      <button
        onClick={handleMenuToggle}
        className="flex items-center gap-1.5 sm:gap-3 px-2 sm:px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px]"
        aria-label="使用者選單"
      >
        {/* 頭像 */}
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}

        {/* 使用者名稱 - 只在平板以上顯示 */}
        <span className="text-sm font-medium text-gray-700 hidden md:block max-w-[120px] truncate">
          {displayName}
        </span>

        {/* 下拉箭頭 */}
        <svg
          className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 下拉選單 */}
      {isOpen && (
        <>
          {/* 背景遮罩（點擊關閉） */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* 選單內容 */}
          <div className="absolute right-0 mt-2 w-64 sm:w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
            {/* 使用者資訊 */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
              <p className="text-xs text-gray-500 mt-1 truncate">{user.email}</p>
            </div>

            {/* 選單項目 */}
            <div className="py-1">
              {/* 個人主頁 */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (username) {
                    router.push(`/@${username}`);
                  } else {
                    alert('正在載入個人資料...');
                  }
                }}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors flex items-center gap-2 min-h-[44px]"
              >
                <span className="text-base">👤</span>
                <span>我的主頁</span>
              </button>

              {/* 設定個人資料 */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push('/profile/edit');
                }}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors flex items-center gap-2 min-h-[44px]"
              >
                <span className="text-base">⚙️</span>
                <span>編輯個人資料</span>
              </button>

              {/* 百岳排行榜 */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push('/leaderboard');
                }}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors flex items-center gap-2 min-h-[44px]"
              >
                <span className="text-base">🏆</span>
                <span>百岳排行榜</span>
              </button>
            </div>

            {/* 分隔線 */}
            <div className="border-t border-gray-100 my-1" />

            {/* 關於我們 */}
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/about');
              }}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors flex items-center gap-2 min-h-[44px]"
            >
              <span className="text-base">ℹ️</span>
              <span>關於我們</span>
            </button>

            {/* 分隔線 */}
            <div className="border-t border-gray-100 my-1" />

            {/* 登出按鈕 */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              {isLoggingOut ? '登出中...' : '🚪 登出'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
