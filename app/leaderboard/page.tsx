'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import useSWR from 'swr';
import { useAuth } from '@/components/AuthProvider';
import type { LeaderboardResult } from '@/lib/types/database';
import { DEMO_PEAKS_COUNT } from '@/lib/peaks-data';

// SWR fetcher 函數
const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('載入排行榜失敗');
  return res.json();
});

export default function LeaderboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // 使用 SWR 進行資料快取和自動重新驗證
  const { data: leaderboardData, error, isLoading } = useSWR<LeaderboardResult>(
    user ? '/api/leaderboard' : null, // 只有登入後才載入
    fetcher,
    {
      revalidateOnFocus: false, // 切換視窗不重新載入
      revalidateOnReconnect: true, // 重新連線時更新
      dedupingInterval: 60000, // 60 秒內不重複請求
      refreshInterval: 300000, // 5 分鐘自動更新
      onError: (err) => {
        console.error('SWR 載入排行榜失敗:', err);
      },
    }
  );

  // 檢查登入狀態
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // 取得排名圖示和樣式
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return { icon: '🥇', bgColor: 'bg-gradient-to-r from-yellow-400 to-yellow-600', textColor: 'text-yellow-900', label: '冠軍' };
      case 2:
        return { icon: '🥈', bgColor: 'bg-gradient-to-r from-gray-300 to-gray-500', textColor: 'text-gray-900', label: '亞軍' };
      case 3:
        return { icon: '🥉', bgColor: 'bg-gradient-to-r from-orange-400 to-orange-600', textColor: 'text-orange-900', label: '季軍' };
      default:
        return null;
    }
  };

  // 未登入時不渲染（只在驗證載入完成後才判斷）
  if (!loading && !user) {
    return null;
  }

  // LoadingSkeleton 組件 - 專業的載入骨架
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {/* 我的排名骨架 */}
      <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg shadow-lg p-4 sm:p-6 animate-pulse">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-6 bg-gray-400 rounded w-24"></div>
            <div className="h-4 bg-gray-400 rounded w-32"></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="h-12 bg-gray-400 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-400 rounded w-12"></div>
            </div>
            <div className="h-12 w-px bg-gray-400"></div>
            <div className="text-center">
              <div className="h-10 bg-gray-400 rounded w-14 mb-2"></div>
              <div className="h-3 bg-gray-400 rounded w-12"></div>
            </div>
            <div className="h-12 w-px bg-gray-400"></div>
            <div className="text-center">
              <div className="h-10 bg-gray-400 rounded w-14 mb-2"></div>
              <div className="h-3 bg-gray-400 rounded w-12"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 說明骨架 */}
      <div className="bg-blue-50 border-l-4 border-blue-200 p-3 sm:p-4 rounded animate-pulse">
        <div className="h-4 bg-blue-200 rounded w-3/4"></div>
      </div>

      {/* 排行榜骨架 */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* 表頭 */}
        <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center">
            <div className="col-span-2 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="col-span-5 sm:col-span-6 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="col-span-2 sm:col-span-2 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="col-span-3 sm:col-span-2 h-4 bg-gray-200 rounded animate-pulse hidden sm:block"></div>
          </div>
        </div>

        {/* 前 3 名骨架 - 特別樣式 */}
        <div className="divide-y divide-gray-200">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-4 sm:px-6 py-4 sm:py-5 animate-pulse">
              <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center">
                <div className="col-span-2 flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="col-span-5 sm:col-span-6 flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-2 space-y-1">
                  <div className="h-5 bg-gray-200 rounded w-12 mx-auto"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
                </div>
                <div className="col-span-3 sm:col-span-2 space-y-2 hidden sm:block">
                  <div className="h-5 bg-gray-200 rounded w-12 mx-auto"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </div>
          ))}

          {/* 其他排名骨架 */}
          {[...Array(10)].map((_, i) => (
            <div key={`other-${i}`} className="px-4 sm:px-6 py-3 sm:py-4 animate-pulse">
              <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center">
                <div className="col-span-2">
                  <div className="h-6 bg-gray-200 rounded w-10 mx-auto"></div>
                </div>
                <div className="col-span-5 sm:col-span-6 flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-2">
                  <div className="h-5 bg-gray-200 rounded w-10 mx-auto"></div>
                </div>
                <div className="col-span-3 sm:col-span-2 space-y-2 hidden sm:block">
                  <div className="h-5 bg-gray-200 rounded w-12 mx-auto"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 直接渲染頁面，不再阻塞
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <button
                onClick={() => router.push('/')}
                className="flex-shrink-0 hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/weblogo.png"
                  alt="PeakCollector Logo"
                  width={64}
                  height={64}
                  className="w-12 h-12 md:w-16 md:h-16"
                  priority
                />
              </button>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                  百岳排行榜 🏆
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                  看看誰是台灣百岳收集王！
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push('/')}
              className="px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors whitespace-nowrap min-h-[44px]"
            >
              返回首頁
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* 載入狀態 - 顯示骨架 UI */}
        {isLoading && <LoadingSkeleton />}

        {/* 排行榜內容 - 只在載入完成且無錯誤時顯示 */}
        {!isLoading && !error && (
          <>
            {/* 我的排名區塊 */}
            {leaderboardData?.currentUser && (
          <div className="mb-6 sm:mb-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-lg p-4 sm:p-6 text-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h2 className="text-lg sm:text-xl font-bold mb-1">你的排名</h2>
                <p className="text-sm sm:text-base opacity-90">
                  在 {leaderboardData.totalUsers} 位山友中
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold">#{leaderboardData.currentUser.rank}</div>
                  <div className="text-xs sm:text-sm opacity-90 mt-1">名次</div>
                </div>
                <div className="h-12 w-px bg-white/30"></div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold">{leaderboardData.currentUser.completed_count}</div>
                  <div className="text-xs sm:text-sm opacity-90 mt-1">座百岳</div>
                </div>
                <div className="h-12 w-px bg-white/30"></div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold">{leaderboardData.currentUser.completion_rate}%</div>
                  <div className="text-xs sm:text-sm opacity-90 mt-1">完成率</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 排行榜說明 */}
        <div className="mb-6 sm:mb-8 bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 rounded">
          <p className="text-xs sm:text-sm text-blue-900 leading-relaxed">
            <span className="font-semibold">💡 排行榜說明：</span>
            排名依照完成的百岳數量排序。
            <span className="hidden sm:inline">未開啟「顯示在排行榜」設定的使用者會以「山友 #ID」匿名顯示。</span>
            你可以在<button
              onClick={() => router.push('/profile/edit')}
              className="text-blue-700 hover:underline font-medium mx-1"
            >
              個人設定
            </button>中調整隱私設定。
          </p>
        </div>

        {/* 排行榜主體 */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* 表頭 */}
          <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center text-xs sm:text-sm font-semibold text-gray-700">
              <div className="col-span-2 text-center">排名</div>
              <div className="col-span-5 sm:col-span-6">使用者</div>
              <div className="col-span-2 sm:col-span-2 text-center">完成數</div>
              <div className="col-span-3 sm:col-span-2 text-center hidden sm:block">完成率</div>
            </div>
          </div>

          {/* 排行榜列表 */}
          <div className="divide-y divide-gray-200">
            {leaderboardData?.topRankers.map((entry) => {
              const rankBadge = getRankBadge(entry.rank);
              const isCurrentUser = user && entry.user_id === user.id;

              return (
                <div
                  key={entry.user_id}
                  className={`px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors ${
                    isCurrentUser ? 'bg-emerald-50 border-l-4 border-emerald-500' : ''
                  } ${rankBadge ? rankBadge.bgColor + ' hover:brightness-105' : ''}`}
                >
                  <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center">
                    {/* 排名 */}
                    <div className="col-span-2 text-center">
                      {rankBadge ? (
                        <div className="flex flex-col items-center">
                          <span className="text-2xl sm:text-3xl">{rankBadge.icon}</span>
                          <span className={`text-xs font-bold mt-1 ${rankBadge.textColor}`}>
                            {rankBadge.label}
                          </span>
                        </div>
                      ) : (
                        <span className={`text-lg sm:text-xl font-bold ${isCurrentUser ? 'text-emerald-600' : 'text-gray-700'}`}>
                          #{entry.rank}
                        </span>
                      )}
                    </div>

                    {/* 使用者資訊 */}
                    <div className="col-span-5 sm:col-span-6 flex items-center gap-2 sm:gap-3 min-w-0">
                      {entry.avatar_url ? (
                        <img
                          src={entry.avatar_url}
                          alt={entry.username}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm sm:text-base">🏔️</span>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className={`font-semibold truncate text-sm sm:text-base ${rankBadge ? rankBadge.textColor : isCurrentUser ? 'text-emerald-700' : 'text-gray-900'}`}>
                          {entry.username}
                          {isCurrentUser && <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">你</span>}
                        </div>
                        {entry.display_name && (
                          <div className="text-xs sm:text-sm text-gray-500 truncate">{entry.display_name}</div>
                        )}
                      </div>
                    </div>

                    {/* 完成數 */}
                    <div className="col-span-2 sm:col-span-2 text-center">
                      <div className={`text-base sm:text-lg font-bold ${rankBadge ? rankBadge.textColor : isCurrentUser ? 'text-emerald-600' : 'text-gray-900'}`}>
                        {entry.completed_count}
                      </div>
                      <div className="text-xs text-gray-500">/ {DEMO_PEAKS_COUNT}</div>
                    </div>

                    {/* 完成率 */}
                    <div className="col-span-3 sm:col-span-2 text-center hidden sm:block">
                      <div className={`text-base sm:text-lg font-bold ${rankBadge ? rankBadge.textColor : isCurrentUser ? 'text-emerald-600' : 'text-gray-900'}`}>
                        {entry.completion_rate}%
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className={`h-2 rounded-full ${rankBadge ? 'bg-white/50' : isCurrentUser ? 'bg-emerald-500' : 'bg-gray-400'}`}
                          style={{ width: `${entry.completion_rate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 空狀態 */}
          {(!leaderboardData?.topRankers || leaderboardData.topRankers.length === 0) && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏔️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">目前還沒有排行榜資料</h3>
              <p className="text-gray-600">快去完成你的第一座百岳吧！</p>
            </div>
          )}
        </div>

            {/* Footer */}
            <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500 px-3">
              <p>排行榜每次載入時更新</p>
              <p className="mt-1">
                想要在排行榜顯示真實名稱？前往
                <button
                  onClick={() => router.push('/profile/edit')}
                  className="text-emerald-600 hover:text-emerald-700 hover:underline transition-colors mx-1"
                >
                  個人設定
                </button>
                開啟選項
              </p>
            </div>
          </>
        )}

        {/* 錯誤訊息顯示 */}
        {!isLoading && error && (
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">載入失敗</h2>
              <p className="text-gray-600 mb-4">
                {error?.message || '載入排行榜失敗，請稍後再試'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
              >
                重新載入
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
