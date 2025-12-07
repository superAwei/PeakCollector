'use client';

import { Peak } from '@/lib/peaks-data';

interface PeakBadgeProps {
  peak: Peak;
  isCompleted: boolean;
  isNewlyCompleted?: boolean;
}

export default function PeakBadge({ peak, isCompleted, isNewlyCompleted }: PeakBadgeProps) {
  return (
    <div
      className={`
        relative rounded-lg p-4 transition-all duration-300 transform
        ${isCompleted
          ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg hover:scale-105'
          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
        }
        ${isNewlyCompleted ? 'animate-bounce' : ''}
      `}
    >
      {/* 徽章內容 */}
      <div className="flex flex-col items-center text-center">
        {/* 山峰圖標 */}
        <div className={`
          text-4xl mb-2
          ${isCompleted ? 'animate-pulse' : ''}
        `}>
          {isCompleted ? '⛰️' : '🗻'}
        </div>

        {/* 排名徽章 */}
        <div className={`
          absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
          ${isCompleted
            ? 'bg-white text-emerald-600'
            : 'bg-gray-300 text-gray-500'
          }
        `}>
          #{peak.id}
        </div>

        {/* 山峰名稱 */}
        <h3 className={`
          font-bold text-lg mb-1
          ${isCompleted ? 'text-white' : 'text-gray-500'}
        `}>
          {peak.name}
        </h3>

        {/* 海拔高度 */}
        <div className={`
          text-sm font-medium
          ${isCompleted ? 'text-emerald-100' : 'text-gray-400'}
        `}>
          {peak.altitude.toLocaleString()}m
        </div>

        {/* 描述 */}
        {peak.description && (
          <p className={`
            text-xs mt-2 line-clamp-2
            ${isCompleted ? 'text-emerald-50' : 'text-gray-400'}
          `}>
            {peak.description}
          </p>
        )}

        {/* 完成標記 */}
        {isCompleted && (
          <div className="mt-3 flex items-center gap-1 text-xs font-semibold">
            <span>✓</span>
            <span>已完成</span>
          </div>
        )}

        {/* 新完成動畫標記 */}
        {isNewlyCompleted && (
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full animate-pulse">
            NEW!
          </div>
        )}
      </div>

      {/* 完成光暈效果 */}
      {isCompleted && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-transparent to-white/20 pointer-events-none"></div>
      )}
    </div>
  );
}
