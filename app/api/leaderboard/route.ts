/**
 * Leaderboard API Route
 *
 * 提供排行榜資料的 API endpoint
 * 支援 SWR 快取機制
 */

import { NextResponse } from 'next/server';
import { getLeaderboard } from '@/lib/leaderboard';

// 設定快取策略
export const revalidate = 60; // 60 秒快取

export async function GET() {
  try {
    const data = await getLeaderboard();

    return NextResponse.json(data, {
      headers: {
        // 設定快取控制
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('API: 取得排行榜失敗:', error);

    return NextResponse.json(
      { error: '取得排行榜失敗' },
      { status: 500 }
    );
  }
}
