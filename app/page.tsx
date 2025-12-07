'use client';

import { useState, useEffect } from 'react';
import ProgressStats from '@/components/ProgressStats';
import PeakBadge from '@/components/PeakBadge';
import GPXUploader from '@/components/GPXUploader';
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

  // 避免水合錯誤
  if (!isClient) {
    return null;
  }

  return (
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
            <GPXUploader onPeaksVerified={handlePeaksVerified} />

            {/* 使用說明 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">使用說明</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">1.</span>
                  <span>上傳你的登山 GPX 軌跡檔案（可從 Strava、健行筆記等 App 匯出）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">2.</span>
                  <span>系統會自動檢查軌跡是否經過百岳山頂（100公尺範圍內）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">3.</span>
                  <span>驗證成功後，對應的百岳徽章會自動點亮</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">4.</span>
                  <span>收集進度會儲存在瀏覽器本地，換瀏覽器需重新驗證</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 右側：進度統計 + 百岳徽章牆 (60%) */}
          <div className="w-full lg:w-[60%] flex flex-col gap-6">
            {/* Progress Stats */}
            <ProgressStats completed={completedPeakIds.length} total={DEMO_PEAKS_COUNT} />

            {/* Peaks Grid */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">百岳徽章牆</h2>
                <div className="text-sm text-gray-600">
                  Demo 版本：前 {DEMO_PEAKS_COUNT} 座
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PEAKS.map((peak) => (
                  <PeakBadge
                    key={peak.id}
                    peak={peak}
                    isCompleted={completedPeakIds.includes(peak.id)}
                    isNewlyCompleted={newlyCompletedIds.includes(peak.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>PeakCollector - 記錄你的百岳征途</p>
          <p className="mt-1">
            目前為 Demo 版本，僅包含前 20 座百岳資料
          </p>
        </div>
      </main>
    </div>
  );
}
