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
import ShareButton from '@/components/ShareButton';
import PeakBadgeIcon from '@/components/PeakBadgeIcon';

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

  // 輸出錯誤訊息以便除錯
  if (peaksError) {
    console.error('❌ 查詢 completed_peaks 失敗:', peaksError);
  }

  const completedPeakIds = completedPeaks?.map(p => p.peakId) || [];
  const completedCount = completedPeakIds.length;
  const totalCount = PEAKS.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity min-w-0 flex-1">
              <div className="text-3xl sm:text-4xl flex-shrink-0">⛰️</div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">PeakCollector</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">台灣百岳數位護照</p>
              </div>
            </Link>

            <Link
              href="/login"
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors whitespace-nowrap min-h-[44px] flex items-center flex-shrink-0"
            >
              <span className="hidden sm:inline">建立我的主頁 →</span>
              <span className="sm:hidden">建立主頁</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* 使用者資訊卡片 */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            {/* 頭像 */}
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name || profile.username}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-emerald-500 flex-shrink-0 self-center sm:self-auto"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-3xl sm:text-4xl text-white font-bold flex-shrink-0 self-center sm:self-auto">
                {(profile.display_name || profile.username).charAt(0).toUpperCase()}
              </div>
            )}

            {/* 使用者資訊 */}
            <div className="flex-1 w-full sm:w-auto text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                {profile.display_name || profile.username}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3">@{profile.username}</p>
              {profile.bio && (
                <p className="text-sm sm:text-base text-gray-700 mb-3 leading-relaxed">{profile.bio}</p>
              )}

              {/* 統計數字 */}
              <div className="flex gap-4 sm:gap-6 text-sm justify-center sm:justify-start">
                <div>
                  <span className="font-bold text-emerald-600 text-xl sm:text-2xl">{completedCount}</span>
                  <span className="text-gray-600 ml-1.5 sm:ml-2 text-xs sm:text-sm">座完成</span>
                </div>
                <div>
                  <span className="font-bold text-teal-600 text-xl sm:text-2xl">{progress}%</span>
                  <span className="text-gray-600 ml-1.5 sm:ml-2 text-xs sm:text-sm">進度</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 進度條 */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">百岳收集進度</h3>
            <span className="text-xs sm:text-sm text-gray-600">{completedCount} / {totalCount}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-5 sm:h-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-600 h-5 sm:h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2 sm:pr-3"
              style={{ width: `${progress}%` }}
            >
              {progress > 10 && (
                <span className="text-white text-xs sm:text-sm font-bold">{progress}%</span>
              )}
            </div>
          </div>
        </div>

        {/* 分享功能區 */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">分享我的成就</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                將百岳收集進度分享給朋友
                <span className="hidden sm:inline">，或匯出精美的成就報告</span>
              </p>
            </div>
            <div className="flex-shrink-0 self-end sm:self-auto">
              <ShareButton
                profile={profile}
                completedCount={completedCount}
                totalCount={totalCount}
                progress={progress}
              />
            </div>
          </div>
        </div>

        {/* 百岳徽章牆 */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">百岳徽章牆</h3>

          {completedCount === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🗻</div>
              <p className="text-gray-500 text-base sm:text-lg">尚未完成任何百岳</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-2">征途才剛開始！</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {PEAKS.filter(peak => completedPeakIds.includes(peak.id)).map((peak) => {
                const record = completedPeaks?.find(p => p.peakId === peak.id);
                return (
                  <div key={peak.id} className="flex flex-col items-center">
                    {/* 圓形徽章 */}
                    <div className="relative hover:scale-110 transition-transform">
                      <div className="w-20 h-20 sm:w-24 sm:h-24">
                        <PeakBadgeIcon isCompleted={true} className="w-full h-full drop-shadow-lg" />
                      </div>
                      {/* 排名徽章 */}
                      <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold bg-emerald-600 text-white shadow-md">
                        #{peak.id}
                      </div>
                    </div>

                    {/* 文字資訊 */}
                    <div className="mt-2 text-center w-full">
                      <h3 className="font-bold text-sm sm:text-base text-gray-900 truncate px-1">
                        {peak.name}
                      </h3>
                      <div className="text-xs sm:text-sm text-emerald-600 font-medium">
                        {peak.altitude.toLocaleString()}m
                      </div>
                      {record && (
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(record.completedAt).toLocaleDateString('zh-TW')}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500 px-3">
          <p>使用 <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-medium">PeakCollector</Link> 記錄你的百岳征途</p>
          <div className="mt-3 flex items-center justify-center gap-4">
            <Link
              href="/about"
              className="text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
            >
              關於我們
            </Link>
            <span className="text-gray-300">|</span>
            <a
              href="https://github.com/superAwei/PeakCollector/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
            >
              問題回報
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
