'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';

const NOTICE_STORAGE_KEY = 'peak-collector-notice-read';

export default function FirstTimeNotice() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 檢查是否已讀過
    const hasRead = localStorage.getItem(NOTICE_STORAGE_KEY);
    if (!hasRead) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(NOTICE_STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="📍 座標精確度說明">
      <div className="space-y-4">
        <p className="text-gray-700">
          歡迎使用 <span className="font-bold text-emerald-600">PeakCollector</span>！
        </p>

        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg space-y-3">
          <h3 className="font-bold text-gray-900">目前座標精確度：</h3>

          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold">⭐⭐⭐⭐</span>
              <div>
                <span className="font-semibold">前10座（玉山、雪山等）</span>
                <p className="text-gray-600">PeakVisor 官方資料，驗證可靠</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-yellow-600 font-bold">⭐⭐⭐</span>
              <div>
                <span className="font-semibold">第11-20座</span>
                <p className="text-gray-600">參考資料，可能有小誤差</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-orange-600 font-bold">⭐⭐</span>
              <div>
                <span className="font-semibold">第21-100座</span>
                <p className="text-gray-600">估計值，建議使用手動標記</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">💡 提示：</span>
            如果 GPX 驗證失敗，可以使用「手動標記」功能！
          </p>
        </div>

        <p className="text-sm text-gray-600">
          我們持續收集真實 GPX 數據來改進座標！感謝你的使用 🏔️
        </p>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium"
          >
            我知道了
          </button>
        </div>
      </div>
    </Modal>
  );
}
