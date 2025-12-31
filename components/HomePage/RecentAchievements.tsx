'use client';

interface RecentPeak {
  id: number;
  name: string;
  elevation: number;
  completedDate?: string;
}

interface RecentAchievementsProps {
  recentPeaks: RecentPeak[];
  onViewDetails: (peakId: number) => void;
  onViewAll: () => void;
}

export default function RecentAchievements({
  recentPeaks,
  onViewDetails,
  onViewAll,
}: RecentAchievementsProps) {
  // 只顯示最近 5 座
  const displayPeaks = recentPeaks.slice(0, 5);

  if (displayPeaks.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-4 md:p-6">
        <h2 className="text-gray-900 text-lg md:text-xl font-bold mb-4">
          最近成就
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500 text-base">尚無完成紀錄</p>
          <p className="text-gray-400 text-sm mt-2">
            上傳 GPX 或手動標記來記錄你的登山成就！
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-900 text-lg md:text-xl font-bold">
          最近成就
        </h2>
        <button
          onClick={onViewAll}
          className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm md:text-base transition-colors"
          aria-label="查看全部成就"
        >
          查看全部 →
        </button>
      </div>

      {/* 手機版：橫向捲動 / 桌面版：Grid 佈局 */}
      <div className="overflow-x-auto md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-3 md:grid md:grid-cols-3 lg:grid-cols-5 md:gap-4 min-w-max md:min-w-0">
          {displayPeaks.map((peak) => (
            <button
              key={peak.id}
              onClick={() => onViewDetails(peak.id)}
              className="flex-shrink-0 w-40 md:w-auto bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border-2 border-emerald-200 hover:border-emerald-400 rounded-xl p-4 transition-all duration-200 active:scale-95 text-left"
              aria-label={`查看 ${peak.name} 詳情`}
            >
              {/* 山岳圖示 */}
              <div className="text-3xl mb-2" role="img" aria-label="山岳">
                ⛰️
              </div>

              {/* 山名 */}
              <h3 className="text-gray-900 font-bold text-base mb-1 line-clamp-1">
                {peak.name}
              </h3>

              {/* 標高 */}
              <p className="text-gray-600 text-sm mb-2">
                {peak.elevation.toLocaleString()}m
              </p>

              {/* 完成日期 */}
              {peak.completedDate && (
                <p className="text-gray-500 text-xs">
                  {new Date(peak.completedDate).toLocaleDateString('zh-TW', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
