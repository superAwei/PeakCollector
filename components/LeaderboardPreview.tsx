/**
 * LeaderboardPreview - 排行榜預覽卡片（首頁用）
 *
 * 顯示：
 * - 前 3 名使用者（金銀銅牌）
 * - 我的排名
 * - 「查看完整排行榜」按鈕
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getLeaderboard } from '@/lib/leaderboard';
import type { LeaderboardEntry } from '@/lib/types/database';

export default function LeaderboardPreview() {
  const router = useRouter();
  const [topThree, setTopThree] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<LeaderboardEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const data = await getLeaderboard();
        setTopThree(data.topRankers.slice(0, 3));
        setMyRank(data.currentUser || null);
      } catch (error) {
        console.error('載入排行榜失敗:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadLeaderboard();
  }, []);

  // 取得排名圖示
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  // Loading 狀態
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="space-y-3">
          <div className="h-16 bg-gray-100 rounded"></div>
          <div className="h-16 bg-gray-100 rounded"></div>
          <div className="h-16 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  // 如果沒有資料，不顯示
  if (topThree.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      {/* 標題 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
          🏆 百岳排行榜
        </h2>
        <button
          onClick={() => router.push('/leaderboard')}
          className="text-xs sm:text-sm text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
        >
          查看更多 →
        </button>
      </div>

      {/* 前 3 名 */}
      <div className="space-y-2 sm:space-y-3 mb-4">
        {topThree.map((entry) => (
          <div
            key={entry.user_id}
            className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-emerald-200 transition-colors"
          >
            {/* 排名圖示 */}
            <div className="text-2xl sm:text-3xl flex-shrink-0">
              {getRankIcon(entry.rank)}
            </div>

            {/* 頭像 */}
            {entry.avatar_url ? (
              <img
                src={entry.avatar_url}
                alt={entry.username}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                <span className="text-sm">🏔️</span>
              </div>
            )}

            {/* 使用者資訊 */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                {entry.username}
              </div>
              {entry.display_name && (
                <div className="text-xs text-gray-500 truncate">{entry.display_name}</div>
              )}
            </div>

            {/* 完成數 */}
            <div className="text-right flex-shrink-0">
              <div className="text-lg sm:text-xl font-bold text-emerald-600">
                {entry.completed_count}
              </div>
              <div className="text-xs text-gray-500">座</div>
            </div>
          </div>
        ))}
      </div>

      {/* 我的排名 */}
      {myRank && myRank.rank > 3 && (
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
            {/* 排名 */}
            <div className="text-lg sm:text-xl font-bold text-emerald-700 flex-shrink-0">
              #{myRank.rank}
            </div>

            {/* 頭像 */}
            {myRank.avatar_url ? (
              <img
                src={myRank.avatar_url}
                alt={myRank.username}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-emerald-300 flex items-center justify-center flex-shrink-0">
                <span className="text-sm">🏔️</span>
              </div>
            )}

            {/* 使用者資訊 */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-emerald-900 truncate text-sm sm:text-base flex items-center gap-2">
                {myRank.username}
                <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full">你</span>
              </div>
              <div className="text-xs text-emerald-700">我的排名</div>
            </div>

            {/* 完成數 */}
            <div className="text-right flex-shrink-0">
              <div className="text-lg sm:text-xl font-bold text-emerald-700">
                {myRank.completed_count}
              </div>
              <div className="text-xs text-emerald-600">座</div>
            </div>
          </div>
        </div>
      )}

      {/* 查看完整排行榜按鈕 */}
      <div className="mt-4">
        <button
          onClick={() => router.push('/leaderboard')}
          className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg transition-colors font-medium text-sm sm:text-base shadow-sm"
        >
          查看完整排行榜 →
        </button>
      </div>
    </div>
  );
}
