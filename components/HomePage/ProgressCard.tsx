'use client';

import { useEffect, useState } from 'react';

interface ProgressCardProps {
  completed: number;
  total: number;
  onExportPoster: () => void;
}

export default function ProgressCard({
  completed,
  total,
  onExportPoster,
}: ProgressCardProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const percentage = Math.round((completed / total) * 100);

  // 進度條動畫效果
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg overflow-hidden">
      <div className="p-4 md:p-6">
        {/* 手機版：垂直佈局 / 桌面版：橫向佈局 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
          {/* 左側：進度資訊 */}
          <div className="flex-1">
            {/* 標題與數字 */}
            <div className="flex items-center gap-3 mb-3">
              {/* 山岳圖示 */}
              <div className="text-3xl" role="img" aria-label="山岳">
                ⛰️
              </div>
              <div>
                <h2 className="text-white text-lg md:text-xl font-bold">
                  百岳收集進度
                </h2>
                <p className="text-emerald-50 text-sm">
                  持續探索台灣高山之美
                </p>
              </div>
            </div>

            {/* 進度數字 */}
            <div className="mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-bold text-white">
                  {completed}
                </span>
                <span className="text-2xl md:text-3xl text-emerald-100">
                  / {total}
                </span>
                <span className="text-lg text-emerald-100">座</span>
              </div>
              <p className="text-emerald-100 text-sm mt-1">
                已完成 {percentage}%
              </p>
            </div>

            {/* 進度條 */}
            <div className="relative">
              <div className="h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${animatedProgress}%` }}
                  role="progressbar"
                  aria-valuenow={percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`已完成 ${percentage}%`}
                />
              </div>
            </div>
          </div>

          {/* 右側：匯出按鈕 */}
          <div className="w-full md:w-auto">
            <button
              onClick={onExportPoster}
              className="w-full md:w-auto h-14 md:h-12 px-6 md:px-8 bg-white text-emerald-600 rounded-xl font-bold text-base md:text-lg hover:bg-emerald-50 active:scale-95 transition-all duration-200 shadow-md hover:shadow-xl flex items-center justify-center gap-2"
              aria-label="匯出成就海報"
            >
              <span className="text-xl" role="img" aria-label="圖片">
                🖼️
              </span>
              <span>匯出海報</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
