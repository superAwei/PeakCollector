'use client';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  ariaLabel: string;
  onClick: () => void;
}

interface QuickActionsProps {
  onUploadGPX: () => void;
  onViewMap: () => void;
  onExportPoster: () => void;
}

export default function QuickActions({
  onUploadGPX,
  onViewMap,
  onExportPoster,
}: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      id: 'upload',
      label: '上傳軌跡',
      icon: '📤',
      ariaLabel: '上傳 GPX 軌跡檔案',
      onClick: onUploadGPX,
    },
    {
      id: 'map',
      label: '查看地圖',
      icon: '🗺️',
      ariaLabel: '查看已完成的百岳地圖',
      onClick: onViewMap,
    },
    {
      id: 'export',
      label: '匯出海報',
      icon: '🖼️',
      ariaLabel: '匯出成就海報',
      onClick: onExportPoster,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 md:p-6">
      <h2 className="text-gray-900 text-lg md:text-xl font-bold mb-4">
        快速操作
      </h2>

      {/* 三個操作按鈕 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className="h-14 md:h-12 px-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-emerald-50 hover:to-teal-50 border-2 border-gray-200 hover:border-emerald-400 rounded-xl font-semibold text-gray-700 hover:text-emerald-700 transition-all duration-200 active:scale-95 flex items-center justify-center gap-3"
            aria-label={action.ariaLabel}
          >
            <span className="text-2xl" role="img" aria-hidden="true">
              {action.icon}
            </span>
            <span className="text-base md:text-lg">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
