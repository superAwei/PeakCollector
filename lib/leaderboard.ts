/**
 * Leaderboard Service - 排行榜查詢功能
 *
 * 提供百岳排行榜的查詢功能
 * 包含隱私保護機制（show_in_leaderboard 設定）
 */

import { supabase } from './supabase/client';
import type { LeaderboardEntry, LeaderboardResult } from './types/database';
import { DEMO_PEAKS_COUNT } from './peaks-data';

/**
 * 取得百岳排行榜
 *
 * @returns 排行榜資料（前 20 名 + 當前使用者排名）
 */
export async function getLeaderboard(): Promise<LeaderboardResult> {
  try {
    // 取得當前使用者
    const { data: { user } } = await supabase.auth.getUser();

    // 查詢所有使用者的完成數
    // 使用 Supabase 的聚合查詢
    const { data: allUsers, error } = await supabase
      .from('profiles')
      .select(`
        id,
        username,
        display_name,
        avatar_url,
        show_in_leaderboard
      `);

    if (error) {
      console.error('查詢 profiles 失敗:', error);
      throw new Error(`查詢失敗: ${error.message}`);
    }

    if (!allUsers || allUsers.length === 0) {
      return {
        topRankers: [],
        currentUser: undefined,
        totalUsers: 0,
      };
    }

    // 查詢每個使用者的完成數
    const { data: completedCounts, error: countError } = await supabase
      .from('completed_peaks')
      .select('user_id, peakId');

    if (countError) {
      console.error('查詢 completed_peaks 失敗:', countError);
      throw new Error(`查詢失敗: ${countError.message}`);
    }

    // 統計每個使用者的完成數
    const userCompletionMap = new Map<string, Set<number>>();

    completedCounts?.forEach((record) => {
      if (!userCompletionMap.has(record.user_id)) {
        userCompletionMap.set(record.user_id, new Set());
      }
      userCompletionMap.get(record.user_id)!.add(record.peakId);
    });

    // 建立排行榜項目
    const leaderboardEntries: LeaderboardEntry[] = allUsers
      .map((profile) => {
        const completedPeaks = userCompletionMap.get(profile.id) || new Set();
        const completed_count = completedPeaks.size;
        const completion_rate = Math.round((completed_count / DEMO_PEAKS_COUNT) * 100);

        // 決定顯示名稱（隱私保護）
        let displayUsername = profile.username;
        if (!profile.show_in_leaderboard) {
          // 隱私模式：顯示「山友 #ID前8碼」
          displayUsername = `山友 #${profile.id.slice(0, 8)}`;
        }

        return {
          user_id: profile.id,
          username: displayUsername,
          display_name: profile.show_in_leaderboard ? profile.display_name : undefined,
          avatar_url: profile.show_in_leaderboard ? profile.avatar_url : undefined,
          completed_count,
          completion_rate,
          rank: 0, // 稍後計算排名
          show_in_leaderboard: profile.show_in_leaderboard,
        };
      })
      .filter((entry) => entry.completed_count > 0) // 只顯示有完成記錄的使用者
      .sort((a, b) => {
        // 按完成數降序排列
        if (b.completed_count !== a.completed_count) {
          return b.completed_count - a.completed_count;
        }
        // 完成數相同時，按 user_id 排序（確保穩定排序）
        return a.user_id.localeCompare(b.user_id);
      });

    // 計算排名（處理平手情況）
    let currentRank = 1;
    let previousCount = -1;
    let sameRankCount = 0;

    leaderboardEntries.forEach((entry, index) => {
      if (entry.completed_count === previousCount) {
        // 平手，使用相同排名
        entry.rank = currentRank;
        sameRankCount++;
      } else {
        // 新的排名
        currentRank = index + 1;
        entry.rank = currentRank;
        previousCount = entry.completed_count;
        sameRankCount = 0;
      }
    });

    // 取得前 20 名
    const topRankers = leaderboardEntries.slice(0, 20);

    // 找出當前使用者的排名
    let currentUser: LeaderboardEntry | undefined;
    if (user) {
      currentUser = leaderboardEntries.find((entry) => entry.user_id === user.id);
    }

    return {
      topRankers,
      currentUser,
      totalUsers: leaderboardEntries.length,
    };
  } catch (error) {
    console.error('取得排行榜失敗:', error);
    throw error;
  }
}

/**
 * 取得當前使用者排名及前後各 N 名
 *
 * @param contextSize 前後各顯示幾名（預設 2）
 * @returns 當前使用者及前後各 N 名的排行榜項目
 */
export async function getMyRankingContext(contextSize: number = 2): Promise<LeaderboardEntry[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return [];
    }

    const leaderboard = await getLeaderboard();
    const { topRankers, currentUser } = leaderboard;

    if (!currentUser) {
      return [];
    }

    // 如果在前 20 名，直接返回空（避免重複顯示）
    if (currentUser.rank <= 20) {
      return [];
    }

    // 從完整排行榜中取得當前使用者的排名（需要重新查詢完整資料）
    // 簡化版本：只返回當前使用者
    return [currentUser];
  } catch (error) {
    console.error('取得我的排名失敗:', error);
    return [];
  }
}
