'use client';

import { useState } from 'react';
import { trackToggleGuide } from '@/lib/analytics';

export default function CollapsibleTutorial() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    trackToggleGuide(newState);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Header - 可點擊展開/收合 */}
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-gray-50 transition-colors"
        aria-expanded={isExpanded}
        aria-controls="tutorial-content"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl md:text-3xl" role="img" aria-label="手機">
            📱
          </span>
          <h3 className="text-lg md:text-xl font-bold text-gray-900">
            如何使用 PeakCollector
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 hidden md:inline">
            {isExpanded ? '收合' : '展開'}
          </span>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Content - 可摺疊 */}
      <div
        id="tutorial-content"
        className={`transition-all duration-300 ease-in-out ${
          isExpanded
            ? 'max-h-[800px] opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-4 md:px-6 pb-4 md:pb-6 space-y-4 border-t">
          {/* 使用步驟 */}
          <div className="space-y-3 mt-4">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                1
              </span>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-base mb-1">
                  上傳登山 GPX 軌跡檔案
                </p>
                <p className="text-gray-600 text-sm">
                  支援：Strava、健行筆記、Garmin 等格式
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                2
              </span>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-base mb-1">
                  系統自動驗證登頂
                </p>
                <p className="text-gray-600 text-sm">
                  檢查軌跡是否經過山頂 100 公尺範圍內
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                3
              </span>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-base mb-1">
                  手動標記已完成的百岳
                </p>
                <p className="text-gray-600 text-sm">
                  如果 GPX 驗證失敗，也可以手動標記
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                4
              </span>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-base mb-1">
                  追蹤你的百岳收集進度
                </p>
                <p className="text-gray-600 text-sm">
                  資料自動儲存在雲端，隨時查看成就
                </p>
              </div>
            </div>
          </div>

          {/* 測試版警告 */}
          <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-lg">
            <p className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
              <span role="img" aria-label="警告">
                ⚠️
              </span>
              座標精確度說明
            </p>
            <ul className="text-sm text-amber-800 space-y-1.5 list-disc list-inside">
              <li>前 10 座座標來自 PeakVisor 官方資料，精確度高</li>
              <li>第 11-20 座為參考資料，可能有小誤差</li>
              <li>第 21-100 座為估計值，建議使用手動標記</li>
              <li>我們持續收集真實 GPX 數據來改進座標！</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
