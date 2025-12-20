/**
 * 公開主頁 - 顯示使用者的百岳收集進度
 *
 * 路由：/username 或 /@username（支援兩種格式）
 * 任何人都可以查看（不需登入）
 */

import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PEAKS } from '@/lib/peaks-data';
import Link from 'next/link';

// 強制動態渲染（因為內容依賴使用者資料）
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function PublicProfilePage({ params }: PageProps) {
  // 取得 username（移除開頭的 @）
  const { username: rawUsername } = await params;

  // 先 decode URL（處理 %40 等編碼）
  const decodedUsername = decodeURIComponent(rawUsername);

  // 移除開頭的 @ 符號
  const username = decodedUsername.startsWith('@')
    ? decodedUsername.slice(1)
    : decodedUsername;

  // 建立 Supabase client（server-side）
  const supabase = await createClient();

  // 查詢使用者 profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .eq('is_public', true)
    .single();

  // 使用者不存在或 profile 未公開
  if (profileError || !profile) {
    notFound();
  }

  // 查詢該使用者的完成記錄
  const { data: completedPeaks, error: peaksError } = await supabase
    .from('completed_peaks')
    .select('*')
    .eq('user_id', profile.id)
    .order('completedAt', { ascending: false });

  const completedPeakIds = completedPeaks?.map(p => p.peakId) || [];
  const completedCount = completedPeakIds.length;
  const totalCount = PEAKS.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="text-4xl">⛰️</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">PeakCollector</h1>
                <p className="text-sm text-gray-600">台灣百岳數位護照</p>
              </div>
            </Link>

            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              建立我的主頁 →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 使用者資訊卡片 */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center gap-6">
            {/* 頭像 */}
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name || profile.username}
                className="w-24 h-24 rounded-full border-4 border-emerald-500"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-4xl text-white font-bold">
                {(profile.display_name || profile.username).charAt(0).toUpperCase()}
              </div>
            )}

            {/* 使用者資訊 */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {profile.display_name || profile.username}
              </h2>
              <p className="text-gray-600 mb-3">@{profile.username}</p>
              {profile.bio && (
                <p className="text-gray-700 mb-3">{profile.bio}</p>
              )}

              {/* 統計數字 */}
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="font-bold text-emerald-600 text-2xl">{completedCount}</span>
                  <span className="text-gray-600 ml-2">座完成</span>
                </div>
                <div>
                  <span className="font-bold text-teal-600 text-2xl">{progress}%</span>
                  <span className="text-gray-600 ml-2">進度</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 進度條 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-800">百岳收集進度</h3>
            <span className="text-sm text-gray-600">{completedCount} / {totalCount}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-600 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
              style={{ width: `${progress}%` }}
            >
              {progress > 10 && (
                <span className="text-white text-sm font-bold">{progress}%</span>
              )}
            </div>
          </div>
        </div>

        {/* 百岳徽章牆 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">百岳徽章牆</h3>

          {completedCount === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🗻</div>
              <p className="text-gray-500 text-lg">尚未完成任何百岳</p>
              <p className="text-gray-400 text-sm mt-2">征途才剛開始！</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {PEAKS.filter(peak => completedPeakIds.includes(peak.id)).map((peak) => {
                const record = completedPeaks?.find(p => p.peakId === peak.id);
                return (
                  <div
                    key={peak.id}
                    className="relative rounded-lg p-4 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="text-3xl mb-2">⛰️</div>
                      <div className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-white text-emerald-600">
                        #{peak.id}
                      </div>
                      <h3 className="font-bold text-lg mb-1">{peak.name}</h3>
                      <div className="text-sm text-emerald-100">
                        {peak.altitude.toLocaleString()}m
                      </div>
                      {record && (
                        <div className="text-xs text-emerald-100 mt-2">
                          {new Date(record.completedAt).toLocaleDateString('zh-TW')}
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-transparent to-white/20 pointer-events-none"></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>使用 <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-medium">PeakCollector</Link> 記錄你的百岳征途</p>
        </div>
      </main>
    </div>
  );
}
