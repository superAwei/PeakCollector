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

    // 優先使用 Materialized View（最快）
    // 如果不存在則降級到普通 View
    // 如果 View 也不存在則使用舊方法
    let leaderboardEntries: LeaderboardEntry[] = [];
    let useViewFailed = false;

    try {
      // 嘗試使用 Materialized View
      const { data: materializedData, error: matError } = await supabase
        .from('leaderboard_materialized')
        .select('*')
        .order('rank', { ascending: true });

      if (!matError && materializedData && materializedData.length > 0) {
        // Materialized View 查詢成功
        console.log('✅ 使用 Materialized View 查詢排行榜');
        leaderboardEntries = processLeaderboardData(materializedData);
      } else {
        throw new Error('Materialized View 不可用，嘗試普通 View');
      }
    } catch (matError) {
      // Materialized View 失敗，嘗試普通 View
      console.log('⚠️ Materialized View 不可用，使用普通 View');

      try {
        const { data: viewData, error: viewError } = await supabase
          .from('leaderboard_view')
          .select('*')
          .order('rank', { ascending: true });

        if (!viewError && viewData && viewData.length > 0) {
          console.log('✅ 使用普通 View 查詢排行榜');
          leaderboardEntries = processLeaderboardData(viewData);
        } else {
          throw new Error('View 不可用，使用舊方法');
        }
      } catch (viewError) {
        // View 也失敗，使用舊方法
        console.log('⚠️ View 不可用，使用舊方法查詢');
        useViewFailed = true;
      }
    }

    // 如果 View 查詢失敗，使用舊方法（向下相容）
    if (useViewFailed) {
      return await getLeaderboardLegacy();
    }

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
 * 處理從 View 取得的排行榜資料
 * 套用隱私保護設定
 */
function processLeaderboardData(data: any[]): LeaderboardEntry[] {
  return data.map((entry) => {
    const showInLeaderboard = entry.show_in_leaderboard ?? false;

    return {
      user_id: entry.user_id,
      username: showInLeaderboard ? entry.username : `山友 #${entry.user_id.slice(0, 8)}`,
      display_name: showInLeaderboard ? entry.display_name : undefined,
      avatar_url: showInLeaderboard ? entry.avatar_url : undefined,
      completed_count: entry.completed_count,
      completion_rate: entry.completion_rate,
      rank: entry.rank,
      show_in_leaderboard: showInLeaderboard,
    };
  });
}

/**
 * 舊版排行榜查詢方法（向下相容）
 * 當 View 不可用時使用
 */
async function getLeaderboardLegacy(): Promise<LeaderboardResult> {
  const { data: { user } } = await supabase.auth.getUser();

  const { data: allUsers, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, show_in_leaderboard');

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

  const { data: completedCounts, error: countError } = await supabase
    .from('completed_peaks')
    .select('user_id, peakId');

  if (countError) {
    console.error('查詢 completed_peaks 失敗:', countError);
    throw new Error(`查詢失敗: ${countError.message}`);
  }

  const userCompletionMap = new Map<string, Set<number>>();

  completedCounts?.forEach((record) => {
    if (!userCompletionMap.has(record.user_id)) {
      userCompletionMap.set(record.user_id, new Set());
    }
    userCompletionMap.get(record.user_id)!.add(record.peakId);
  });

  const leaderboardEntries: LeaderboardEntry[] = allUsers
    .map((profile) => {
      const completedPeaks = userCompletionMap.get(profile.id) || new Set();
      const completed_count = completedPeaks.size;
      const completion_rate = Math.round((completed_count / DEMO_PEAKS_COUNT) * 100);

      const showInLeaderboard = profile.show_in_leaderboard ?? false;
      let displayUsername = profile.username;
      if (!showInLeaderboard) {
        displayUsername = `山友 #${profile.id.slice(0, 8)}`;
      }

      return {
        user_id: profile.id,
        username: displayUsername,
        display_name: showInLeaderboard ? profile.display_name : undefined,
        avatar_url: showInLeaderboard ? profile.avatar_url : undefined,
        completed_count,
        completion_rate,
        rank: 0,
        show_in_leaderboard: showInLeaderboard,
      };
    })
    .filter((entry) => entry.completed_count > 0)
    .sort((a, b) => {
      if (b.completed_count !== a.completed_count) {
        return b.completed_count - a.completed_count;
      }
      return a.user_id.localeCompare(b.user_id);
    });

  let currentRank = 1;
  let previousCount = -1;

  leaderboardEntries.forEach((entry, index) => {
    if (entry.completed_count === previousCount) {
      entry.rank = currentRank;
    } else {
      currentRank = index + 1;
      entry.rank = currentRank;
      previousCount = entry.completed_count;
    }
  });

  const topRankers = leaderboardEntries.slice(0, 20);

  let currentUser: LeaderboardEntry | undefined;
  if (user) {
    currentUser = leaderboardEntries.find((entry) => entry.user_id === user.id);
  }

  return {
    topRankers,
    currentUser,
    totalUsers: leaderboardEntries.length,
  };
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
