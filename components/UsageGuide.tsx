'use client';

import { useState } from 'react';

export default function UsageGuide() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header - 可點擊摺疊 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">📱</span>
          <h3 className="text-lg font-bold text-gray-800">如何使用 PeakCollector</h3>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Content - 可摺疊 */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 text-sm text-gray-700 border-t">
          <div className="flex items-start gap-3 mt-3">
            <span className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xs">
              1
            </span>
            <div>
              <p className="font-semibold text-gray-900">上傳登山 GPX 軌跡檔案</p>
              <p className="text-gray-600">支援：Strava、健行筆記、Garmin 等格式</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xs">
              2
            </span>
            <div>
              <p className="font-semibold text-gray-900">系統自動驗證登頂</p>
              <p className="text-gray-600">檢查軌跡是否經過山頂 100 公尺範圍內</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xs">
              3
            </span>
            <div>
              <p className="font-semibold text-gray-900">手動標記已完成的百岳</p>
              <p className="text-gray-600">如果 GPX 驗證失敗，也可以手動標記</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xs">
              4
            </span>
            <div>
              <p className="font-semibold text-gray-900">追蹤你的百岳收集進度</p>
              <p className="text-gray-600">資料自動儲存在瀏覽器中</p>
            </div>
          </div>

          {/* 測試版警告 */}
          <div className="mt-4 p-3 bg-amber-50 border-l-4 border-amber-400 rounded">
            <p className="font-semibold text-amber-900 mb-1">⚠️ 測試版說明</p>
            <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside">
              <li>目前僅前 20 座座標較準確</li>
              <li>第 21-100 座為參考值，建議手動標記</li>
              <li>我們持續改進中，歡迎回報座標問題！</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
