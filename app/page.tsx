'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProgressStats from '@/components/ProgressStats';
import PeakBadge from '@/components/PeakBadge';
import GPXUploader from '@/components/GPXUploader';
import UsageGuide from '@/components/UsageGuide';
import FirstTimeNotice from '@/components/FirstTimeNotice';
import UserMenu from '@/components/UserMenu';
import { useAuth } from '@/components/AuthProvider';
import { PEAKS, DEMO_PEAKS_COUNT } from '@/lib/peaks-data';
import { getCompletedPeakIds, clearCompletedPeaks } from '@/lib/storage';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [completedPeakIds, setCompletedPeakIds] = useState<number[]>([]);
  const [newlyCompletedIds, setNewlyCompletedIds] = useState<number[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // 檢查登入狀態
  useEffect(() => {
    if (!loading && !user) {
      // 未登入，重導向到登入頁面
      router.push('/login');
    }
  }, [user, loading, router]);

  // 載入已完成的百岳記錄
  useEffect(() => {
    async function loadCompletedPeaks() {
      if (user) {
        try {
          const ids = await getCompletedPeakIds();
          setCompletedPeakIds(ids);
        } catch (error) {
          console.error('載入完成記錄失敗:', error);
        } finally {
          setIsLoadingData(false);
        }
      }
    }

    loadCompletedPeaks();
  }, [user]);

  // 處理新驗證的百岳
  const handlePeaksVerified = async (peakIds: number[]) => {
    const currentCompleted = new Set(completedPeakIds);
    const newPeaks = peakIds.filter((id) => !currentCompleted.has(id));

    if (newPeaks.length > 0) {
      setNewlyCompletedIds(newPeaks);

      // 重新載入完成記錄
      try {
        const ids = await getCompletedPeakIds();
        setCompletedPeakIds(ids);
      } catch (error) {
        console.error('重新載入完成記錄失敗:', error);
      }

      // 3秒後移除 "NEW" 標記
      setTimeout(() => {
        setNewlyCompletedIds([]);
      }, 3000);
    }
  };

  // 重置進度
  const handleReset = async () => {
    if (confirm('確定要清除所有已完成記錄嗎？此操作無法復原。')) {
      try {
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
      const ids = await getCompletedPeakIds();
      setCompletedPeakIds(ids);
      setNewlyCompletedIds([]); // 清除 NEW 標記
    } catch (error) {
      console.error('重新載入完成記錄失敗:', error);
    }
  };

  // Loading 狀態
  if (loading || isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⛰️</div>
          <div className="text-xl text-gray-600">載入中...</div>
        </div>
      </div>
    );
  }

  // 未登入時不渲染（會被重導向）
  if (!user) {
    return null;
  }

  return (
    <>
      {/* 首次載入提示 */}
      <FirstTimeNotice />

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">⛰️</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">PeakCollector</h1>
                <p className="text-sm text-gray-600 mt-1">台灣百岳收集器</p>
              </div>
            </div>

            {/* 右側：使用者選單和重置按鈕 */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                重置進度
              </button>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 左右分欄佈局 */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 左側：GPX 上傳區域 (40%) */}
          <div className="w-full lg:w-[40%] flex flex-col gap-6">
            {/* 使用說明（上方） */}
            <UsageGuide />

            {/* GPX 上傳 */}
            <GPXUploader onPeaksVerified={handlePeaksVerified} />
          </div>

          {/* 右側：進度統計 + 百岳徽章牆 (60%) */}
          <div className="w-full lg:w-[60%] flex flex-col gap-6">
            {/* Progress Stats */}
            <ProgressStats completed={completedPeakIds.length} total={DEMO_PEAKS_COUNT} />

            {/* 提示訊息 */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">💡 提示：</span>
                GPX 驗證失敗？試試「手動標記」功能！點擊徽章上的「✓ 手動標記」按鈕即可。
              </p>
            </div>

            {/* Peaks Grid */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">百岳徽章牆</h2>
                <div className="text-sm text-gray-600">
                  完整版本：{DEMO_PEAKS_COUNT} 座百岳
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PEAKS.map((peak) => (
                  <PeakBadge
                    key={peak.id}
                    peak={peak}
                    isCompleted={completedPeakIds.includes(peak.id)}
                    isNewlyCompleted={newlyCompletedIds.includes(peak.id)}
                    onUpdate={handleUpdate}
                  />
                ))}
              </div>            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>PeakCollector - 記錄你的百岳征途</p>
          <p className="mt-1">
            完整版本：收錄台灣全部 100 座百岳資料
          </p>
        </div>
      </main>
      </div>
    </>
  );
}
