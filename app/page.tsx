'use client';

import { useState, useEffect } from 'react';
import ProgressStats from '@/components/ProgressStats';
import PeakBadge from '@/components/PeakBadge';
import GPXUploader from '@/components/GPXUploader';
import UsageGuide from '@/components/UsageGuide';
import FirstTimeNotice from '@/components/FirstTimeNotice';
import { PEAKS, DEMO_PEAKS_COUNT } from '@/lib/peaks-data';
import { getCompletedPeakIds, clearCompletedPeaks } from '@/lib/storage';

export default function Home() {
  const [completedPeakIds, setCompletedPeakIds] = useState<number[]>([]);
  const [newlyCompletedIds, setNewlyCompletedIds] = useState<number[]>([]);
  const [isClient, setIsClient] = useState(false);

  // 載入已完成的百岳記錄
  useEffect(() => {
    setIsClient(true);
    setCompletedPeakIds(getCompletedPeakIds());
  }, []);

  // 處理新驗證的百岳
  const handlePeaksVerified = (peakIds: number[]) => {
    const currentCompleted = new Set(completedPeakIds);
    const newPeaks = peakIds.filter((id) => !currentCompleted.has(id));

    if (newPeaks.length > 0) {
      setNewlyCompletedIds(newPeaks);
      setCompletedPeakIds(getCompletedPeakIds());

      // 3秒後移除 "NEW" 標記
      setTimeout(() => {
        setNewlyCompletedIds([]);
      }, 3000);
    }
  };

  // 重置進度
  const handleReset = () => {
    if (confirm('確定要清除所有已完成記錄嗎？此操作無法復原。')) {
      clearCompletedPeaks();
      setCompletedPeakIds([]);
      setNewlyCompletedIds([]);
    }
  };

  // 刷新已完成列表（用於手動標記和刪除記錄後）
  const handleUpdate = () => {
    setCompletedPeakIds(getCompletedPeakIds());
    setNewlyCompletedIds([]); // 清除 NEW 標記
  };

  // 避免水合錯誤
  if (!isClient) {
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
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              重置進度
            </button>
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
