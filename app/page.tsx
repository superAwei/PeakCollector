'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProgressStats from '@/components/ProgressStats';
import PeakBadge from '@/components/PeakBadge';
import GPXUploader from '@/components/GPXUploader';
import FirstTimeNotice from '@/components/FirstTimeNotice';
import UserMenu from '@/components/UserMenu';
import { useAuth } from '@/components/AuthProvider';
import { PEAKS, DEMO_PEAKS_COUNT } from '@/lib/peaks-data';
import { getCompletedPeakIds, getCompletedPeaks, clearCompletedPeaks } from '@/lib/storage';
import { getCurrentUserProfile } from '@/lib/profile';
import { trackResetProgress, trackViewAbout, trackReportIssue, trackViewPeakDetails } from '@/lib/analytics';
import type { CompletedPeak, Profile } from '@/lib/types';

// 導入新的首頁組件
import ProgressCard from '@/components/HomePage/ProgressCard';
import QuickActions from '@/components/HomePage/QuickActions';
import RecentAchievements from '@/components/HomePage/RecentAchievements';
import CollapsibleTutorial from '@/components/HomePage/CollapsibleTutorial';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [completedPeakIds, setCompletedPeakIds] = useState<number[]>([]);
  const [completedPeaks, setCompletedPeaks] = useState<CompletedPeak[]>([]);
  const [newlyCompletedIds, setNewlyCompletedIds] = useState<number[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [hasTempUsername, setHasTempUsername] = useState(false);
  const [showProfileBanner, setShowProfileBanner] = useState(false);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [selectedPeakId, setSelectedPeakId] = useState<number | null>(null);

  // Refs for scrolling
  const gpxUploaderRef = useRef<HTMLDivElement>(null);
  const badgeWallRef = useRef<HTMLDivElement>(null);

  // 檢查登入狀態
  useEffect(() => {
    if (!loading && !user) {
      // 未登入，重導向到登入頁面
      router.push('/login');
    }
  }, [user, loading, router]);

  // 載入已完成的百岳記錄和使用者資料
  useEffect(() => {
    async function loadData() {
      if (user) {
        try {
          // 載入完整的完成記錄（包含日期）
          const peaks = await getCompletedPeaks();
          setCompletedPeaks(peaks);
          setCompletedPeakIds(peaks.map(p => p.peakId));

          // 載入使用者資料
          const profile = await getCurrentUserProfile();
          setUserProfile(profile);
        } catch (error) {
          console.error('載入資料失敗:', error);
        } finally {
          setIsLoadingData(false);
        }
      }
    }

    loadData();
  }, [user]);

  // 檢查是否有臨時 username
  useEffect(() => {
    async function checkUsername() {
      if (user) {
        try {
          const profile = await getCurrentUserProfile();
          if (profile && profile.username.startsWith('user_')) {
            // 系統生成的臨時 username
            setHasTempUsername(true);

            // 檢查 localStorage 是否已經關閉過提示
            const dismissed = localStorage.getItem('profile-banner-dismissed');
            if (!dismissed) {
              setShowProfileBanner(true);
            }
          }
        } catch (error) {
          console.error('檢查 username 失敗:', error);
        }
      }
    }

    checkUsername();
  }, [user]);

  // 處理新驗證的百岳
  const handlePeaksVerified = async (peakIds: number[]) => {
    // 先取得目前已完成的 ID（從舊 state）
    const currentCompleted = new Set(completedPeakIds);

    // 稍微延遲以確保 Supabase 資料已完全寫入
    await new Promise(resolve => setTimeout(resolve, 100));

    // 重新載入完成記錄（從 Supabase 取得最新資料）
    try {
      const ids = await getCompletedPeakIds();
      setCompletedPeakIds(ids);

      // 用最新的資料判斷哪些是新完成的
      const newPeaks = peakIds.filter((id) => !currentCompleted.has(id));

      if (newPeaks.length > 0) {
        setNewlyCompletedIds(newPeaks);

        console.log(`✨ 新完成 ${newPeaks.length} 座百岳，徽章即時更新！`);

        // 3秒後移除 "NEW" 標記
        setTimeout(() => {
          setNewlyCompletedIds([]);
        }, 3000);
      }
    } catch (error) {
      console.error('重新載入完成記錄失敗:', error);
    }
  };

  // 重置進度
  const handleReset = async () => {
    if (confirm('確定要清除所有已完成記錄嗎？此操作無法復原。')) {
      try {
        // 追蹤重置進度事件（在清除前記錄數量）
        trackResetProgress(completedPeakIds.length);

        await clearCompletedPeaks();
        setCompletedPeakIds([]);
        setNewlyCompletedIds([]);
      } catch (error) {
        console.error('清除記錄失敗:', error);
        alert('清除失敗，請稍後再試');
      }
    }
  };

  // 刷新已完成列表（用於手動標記和刪除記錄後）
  const handleUpdate = async () => {
    try {
      const peaks = await getCompletedPeaks();
      setCompletedPeaks(peaks);
      setCompletedPeakIds(peaks.map(p => p.peakId));
      setNewlyCompletedIds([]); // 清除 NEW 標記
    } catch (error) {
      console.error('重新載入完成記錄失敗:', error);
    }
  };

  // Dashboard 處理函數
  const handleUploadGPX = () => {
    gpxUploaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleViewMap = () => {
    badgeWallRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleExportPoster = () => {
    // 導航到個人主頁，在那裡可以使用完整的匯出功能
    if (userProfile?.username) {
      router.push(`/${userProfile.username}`);
    } else {
      // 如果沒有設定 username，導航到設定頁面
      router.push('/profile/edit');
    }
  };

  const handleViewPeakDetails = (peakId: number) => {
    setSelectedPeakId(peakId);
    trackViewPeakDetails(peakId, PEAKS.find(p => p.id === peakId)?.name || '');
    // 可以在這裡打開詳情 modal 或導航到詳情頁
    badgeWallRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleViewAll = () => {
    badgeWallRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Loading 狀態
  if (loading || isLoadingData) {
    return (
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
    );
  }

  // 未登入時不渲染（會被重導向）
  if (!user) {
    return null;
  }

  // 準備最近完成的百岳資料（最多5座，按完成時間倒序）
  const recentPeaks = completedPeaks
    .slice(0, 5)
    .map(record => {
      const peak = PEAKS.find(p => p.id === record.peakId);
      return {
        id: record.peakId,
        name: peak?.name || '未知',
        elevation: peak?.altitude || 0,
        completedDate: record.completedAt,
      };
    });

  // 計算進度百分比
  const progress = Math.round((completedPeakIds.length / DEMO_PEAKS_COUNT) * 100);

  return (
    <>
      {/* 首次載入提示 */}
      <FirstTimeNotice />

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="flex-shrink-0">
                <Image
                  src="/weblogo.png"
                  alt="PeakCollector Logo"
                  width={48}
                  height={48}
                  className="w-10 h-10 sm:w-12 sm:h-12"
                  priority
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                  PeakCollector <span className="text-xs text-emerald-600">v1.3</span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 hidden sm:block">台灣百岳收集器</p>
              </div>
            </div>

            {/* 右側：使用者選單和重置按鈕 */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <button
                onClick={handleReset}
                className="px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap min-h-[44px]"
                aria-label="重置進度"
              >
                <span className="hidden sm:inline">重置進度</span>
                <span className="sm:hidden">重置</span>
              </button>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* 個人資料設定提示 */}
        {showProfileBanner && hasTempUsername && (
          <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-4 sm:p-5 shadow-lg animate-slide-up">
            <div className="flex items-start gap-3">
              <span className="text-2xl sm:text-3xl flex-shrink-0">🎯</span>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">
                  別忘了設定你的個人主頁！
                </h3>
                <p className="text-sm sm:text-base text-gray-700 mb-3 leading-relaxed">
                  你目前使用的是系統自動生成的臨時名稱。完成個人資料設定後，你就能：
                </p>
                <ul className="space-y-1.5 text-sm sm:text-base text-gray-700 mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>擁有專屬的公開主頁網址</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>分享你的百岳收集進度給朋友</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>生成帶有 QR Code 的精美分享圖片</span>
                  </li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={() => router.push('/profile/edit')}
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium text-sm sm:text-base min-h-[44px] shadow-sm"
                  >
                    立即設定個人資料 →
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem('profile-banner-dismissed', 'true');
                      setShowProfileBanner(false);
                    }}
                    className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base min-h-[44px]"
                  >
                    稍後再說
                  </button>
                </div>
              </div>
              <button
                onClick={() => {
                  localStorage.setItem('profile-banner-dismissed', 'true');
                  setShowProfileBanner(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 -mt-1 -mr-1 p-1"
                aria-label="關閉"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* 成就儀表板區域 */}
        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
          {/* 進度卡片 */}
          <ProgressCard
            completed={completedPeakIds.length}
            total={DEMO_PEAKS_COUNT}
            onExportPoster={handleExportPoster}
          />

          {/* 快速操作 */}
          <QuickActions
            onUploadGPX={handleUploadGPX}
            onViewMap={handleViewMap}
            onExportPoster={handleExportPoster}
          />

          {/* 最近成就 */}
          <RecentAchievements
            recentPeaks={recentPeaks}
            onViewDetails={handleViewPeakDetails}
            onViewAll={handleViewAll}
          />

          {/* 使用說明（可摺疊） */}
          <CollapsibleTutorial />
        </div>

        {/* GPX 上傳區域 */}
        <div ref={gpxUploaderRef} className="mb-6 sm:mb-8">
          <GPXUploader onPeaksVerified={handlePeaksVerified} />
        </div>

        {/* 提示訊息 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 rounded mb-6 sm:mb-8">
          <p className="text-xs sm:text-sm text-blue-900 leading-relaxed">
            <span className="font-semibold">💡 提示：</span>
            GPX 驗證失敗？試試<span className="font-medium">「手動標記」</span>功能！
            <span className="hidden sm:inline">點擊徽章上的「✓ 手動標記」按鈕即可。</span>
          </p>
        </div>

        {/* 百岳徽章牆 */}
        <div ref={badgeWallRef} className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">百岳徽章牆</h2>
            <div className="text-xs sm:text-sm text-gray-600">
              完整版本：{DEMO_PEAKS_COUNT} 座百岳
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {PEAKS.map((peak) => (
              <PeakBadge
                key={peak.id}
                peak={peak}
                isCompleted={completedPeakIds.includes(peak.id)}
                isNewlyCompleted={newlyCompletedIds.includes(peak.id)}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500 px-3">
          <p>PeakCollector - 記錄你的百岳征途</p>
          <p className="mt-1">
            完整版本：收錄台灣全部 100 座百岳資料
          </p>
          <div className="mt-3 flex items-center justify-center gap-4">
            <button
              onClick={() => {
                trackViewAbout();
                router.push('/about');
              }}
              className="text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
            >
              關於我們
            </button>
            <span className="text-gray-300">|</span>
            <a
              href="mailto:peakcollector2025@gmail.com?subject=問題回報"
              onClick={() => trackReportIssue()}
              className="text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
            >
              問題回報
            </a>
          </div>
        </div>
      </main>
      </div>
    </>
  );
}
