'use client';

import { useState, useEffect } from 'react';
import { Peak } from '@/lib/peaks-data';
import { CompletedPeak, saveCompletedPeaks, getPeakRecord, deletePeakRecord } from '@/lib/storage';
import Modal from './Modal';
import PeakBadgeIcon from './PeakBadgeIcon';

interface PeakBadgeProps {
  peak: Peak;
  isCompleted: boolean;
  isNewlyCompleted?: boolean;
  onUpdate?: () => void; // 通知父組件更新
}

export default function PeakBadge({ peak, isCompleted, isNewlyCompleted, onUpdate }: PeakBadgeProps) {
  const [showManualConfirm, setShowManualConfirm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [record, setRecord] = useState<CompletedPeak | undefined>(undefined);

  // 載入完成記錄
  useEffect(() => {
    if (isCompleted) {
      getPeakRecord(peak.id).then(setRecord);
    } else {
      setRecord(undefined);
    }
  }, [isCompleted, peak.id]);

  const isManual = record?.verificationMethod === 'manual';

  // 手動標記
  const handleManualMark = async () => {
    try {
      await saveCompletedPeaks([peak.id], undefined, 'manual');
      setShowManualConfirm(false);
      onUpdate?.(); // 等資料儲存完成後再更新
    } catch (error) {
      console.error('手動標記失敗:', error);
      alert('標記失敗，請稍後再試');
    }
  };

  // 刪除記錄
  const handleDelete = async () => {
    try {
      await deletePeakRecord(peak.id);
      setShowDeleteConfirm(false);
      setShowDetails(false);
      onUpdate?.(); // 等資料刪除完成後再更新
    } catch (error) {
      console.error('刪除記錄失敗:', error);
      alert('刪除失敗，請稍後再試');
    }
  };

  // 取得座標精確度資訊
  const getAccuracyInfo = () => {
    if (peak.coordinateSource === 'peakvisor') {
      return { stars: '⭐⭐⭐⭐', label: '官方座標', color: 'bg-green-100 text-green-700' };
    } else if (peak.coordinateSource === 'reference') {
      return { stars: '⭐⭐⭐', label: '參考座標', color: 'bg-yellow-100 text-yellow-700' };
    } else {
      return { stars: '⭐⭐', label: '估計座標', color: 'bg-orange-100 text-orange-700' };
    }
  };

  const accuracy = getAccuracyInfo();
  const shouldShowManualHint = peak.coordinateSource === 'estimated' && !isCompleted;

  return (
    <>
      <div
        className={`
          relative rounded-lg p-4 transition-all duration-300 transform
          ${isCompleted
            ? `bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg hover:scale-105 cursor-pointer
               ${isManual ? 'ring-4 ring-blue-300' : ''}`
            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          }
          ${isNewlyCompleted ? 'animate-bounce' : ''}
        `}
        onClick={() => isCompleted && setShowDetails(true)}
      >
        {/* 徽章內容 */}
        <div className="flex flex-col items-center text-center">
          {/* 可愛日式圓形徽章圖標 */}
          <div className={`
            w-20 h-20 mb-2
            ${isCompleted ? 'animate-pulse' : ''}
          `}>
            <PeakBadgeIcon isCompleted={isCompleted} className="w-full h-full" />
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

          {/* 手動標記標籤 */}
          {isManual && (
            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
              手動
            </div>
          )}

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

          {/* 座標精確度標示（未完成時顯示） */}
          {!isCompleted && (
            <div className={`mt-2 text-xs px-2 py-1 rounded ${accuracy.color} font-medium`}>
              {accuracy.stars} {accuracy.label}
            </div>
          )}

          {/* 建議手動標記提示 */}
          {shouldShowManualHint && (
            <p className="text-xs mt-2 text-gray-500">
              建議手動標記
            </p>
          )}

          {/* 描述 */}
          {peak.description && !shouldShowManualHint && (
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

          {/* 手動標記按鈕（未完成時顯示） */}
          {!isCompleted && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowManualConfirm(true);
              }}
              className="mt-3 text-xs px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md font-medium transition-colors"
            >
              ✓ 手動標記
            </button>
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

      {/* 手動標記確認對話框 */}
      <Modal
        isOpen={showManualConfirm}
        onClose={() => setShowManualConfirm(false)}
        title="確認登頂"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            你確定已成功登頂
            <span className="font-bold text-emerald-600"> {peak.name}</span>
            （海拔 <span className="font-semibold">{peak.altitude.toLocaleString()}m</span>）嗎？
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowManualConfirm(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleManualMark}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium"
            >
              確認完成
            </button>
          </div>
        </div>
      </Modal>

      {/* 完成記錄詳情對話框 */}
      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title={`${peak.name} 完成記錄`}
      >
        {record && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">山峰名稱</p>
                <p className="font-semibold text-gray-900">{peak.name}</p>
              </div>
              <div>
                <p className="text-gray-500">海拔高度</p>
                <p className="font-semibold text-gray-900">{peak.altitude.toLocaleString()}m</p>
              </div>
              <div>
                <p className="text-gray-500">所屬山脈</p>
                <p className="font-semibold text-gray-900">{peak.range || '未知'}</p>
              </div>
              <div>
                <p className="text-gray-500">完成日期</p>
                <p className="font-semibold text-gray-900">
                  {new Date(record.completedAt).toLocaleString('zh-TW', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">驗證方式</p>
                <p className="font-semibold text-gray-900">
                  {record.verificationMethod === 'manual' ? '手動標記' : 'GPX 自動驗證'}
                </p>
              </div>
              {record.gpxFileName && (
                <div className="col-span-2">
                  <p className="text-gray-500">GPX 檔名</p>
                  <p className="font-semibold text-gray-900 break-all">{record.gpxFileName}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                刪除此記錄
              </button>
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium"
              >
                關閉
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* 刪除確認對話框 */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="確認刪除"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            確定要刪除
            <span className="font-bold text-red-600"> {peak.name}</span>
            的完成記錄嗎？此操作無法復原。
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
            >
              確認刪除
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
