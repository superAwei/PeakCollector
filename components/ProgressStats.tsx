'use client';

interface ProgressStatsProps {
  completed: number;
  total: number;
}

export default function ProgressStats({ completed, total }: ProgressStatsProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">收集進度</h2>
          <p className="text-gray-600 mt-1">
            已完成 <span className="text-emerald-600 font-bold">{completed}</span> / {total} 座百岳
          </p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-emerald-600">{percentage}%</div>
          <p className="text-sm text-gray-500 mt-1">完成率</p>
        </div>
      </div>

      {/* 進度條 */}
      <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-gray-700 drop-shadow-sm">
            {completed} / {total}
          </span>
        </div>
      </div>

      {/* 統計資訊 */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center p-3 bg-emerald-50 rounded-lg">
          <div className="text-2xl font-bold text-emerald-600">{completed}</div>
          <div className="text-xs text-gray-600 mt-1">已完成</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-600">{total - completed}</div>
          <div className="text-xs text-gray-600 mt-1">待挑戰</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{percentage}%</div>
          <div className="text-xs text-gray-600 mt-1">達成率</div>
        </div>
      </div>
    </div>
  );
}
