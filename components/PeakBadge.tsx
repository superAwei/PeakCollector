'use client';

import { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import { Peak } from '@/lib/peaks-data';
import { CompletedPeak, saveCompletedPeaks, getPeakRecord, deletePeakRecord } from '@/lib/storage';
import Modal from './Modal';
import { getBadgeStyle, getBadgeImagePath, getBadgeStyleName } from '@/lib/badge-styles';
import { trackManualMarkPeak, trackUnmarkPeak, trackViewPeakDetails } from '@/lib/analytics';

interface PeakBadgeProps {
  peak: Peak;
  isCompleted: boolean;
  isNewlyCompleted?: boolean;
  onUpdate?: () => void; // 通知父組件更新
}

function PeakBadge({ peak, isCompleted, isNewlyCompleted, onUpdate }: PeakBadgeProps) {
  const [showManualConfirm, setShowManualConfirm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [record, setRecord] = useState<CompletedPeak | undefined>(undefined);
  const [showHoverCard, setShowHoverCard] = useState(false);

  // 取得徽章樣式
  const badgeStyle = getBadgeStyle(peak);
  const badgeImagePath = getBadgeImagePath(badgeStyle);
  const badgeAltText = `${peak.name} - ${getBadgeStyleName(badgeStyle)}`;

  // 載入完成記錄
  useEffect(() => {
    if (isCompleted) {
      getPeakRecord(peak.id).then(setRecord);
    } else {
      setRecord(undefined);
    }
  }, [isCompleted, peak.id]);

  const isManual = record?.verificationMethod === 'manual';

  // 手動標記（樂觀更新版本）
  const handleManualMark = async () => {
    try {
      // ✅ Step 1: 立即關閉對話框（給使用者即時回饋）
      setShowManualConfirm(false);

      // ✅ Step 2: 立即更新本地 UI（樂觀更新，不等資料庫）
      onUpdate?.();

      // ✅ Step 3: 追蹤事件（不阻塞）
      try {
        trackManualMarkPeak(peak.id, peak.name);
      } catch (trackError) {
        console.warn('追蹤事件失敗（不影響功能）:', trackError);
      }

      // ✅ Step 4: 背景同步到資料庫（不阻塞 UI）
      await saveCompletedPeaks([peak.id], undefined, 'manual');

      // ✅ Step 5: 資料庫同步成功後再次更新（確保資料一致性）
      onUpdate?.();

    } catch (error) {
      console.error('手動標記失敗:', error);

      // ❌ 如果資料庫同步失敗，回滾並顯示錯誤
      const errorMessage = error instanceof Error ? error.message : '未知錯誤';

      // 重新開啟對話框讓使用者重試
      setShowManualConfirm(true);

      // 顯示錯誤訊息
      alert(`標記失敗：${errorMessage}\n\n請重新標記或稍後再試。`);

      // 回滾 UI 狀態
      onUpdate?.();
    }
  };

  // 刪除記錄
  const handleDelete = async () => {
    try {
      // 先刪除記錄
      await deletePeakRecord(peak.id);

      // 刪除成功後再關閉對話框
      setShowDeleteConfirm(false);
      setShowDetails(false);

      // 追蹤取消標記事件（不阻塞UI更新）
      try {
        trackUnmarkPeak(peak.id, peak.name);
      } catch (trackError) {
        console.warn('追蹤事件失敗（不影響功能）:', trackError);
      }

      // 最後才更新UI
      onUpdate?.();
    } catch (error) {
      console.error('刪除記錄失敗:', error);
      // 保持對話框開啟，讓使用者知道失敗了
      const errorMessage = error instanceof Error ? error.message : '未知錯誤';
      alert(`刪除失敗：${errorMessage}\n\n請稍後再試或聯絡客服。`);
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
      <div className={`flex flex-col items-center relative ${showHoverCard ? 'z-[100]' : 'z-0'}`}>
        {/* 圓形徽章容器 */}
        <div
          className={`
            relative transition-all duration-300 transform cursor-pointer
            ${isCompleted
              ? 'shadow-lg hover:scale-110'
              : 'hover:scale-105'
            }
            ${isNewlyCompleted ? 'animate-bounce' : ''}
          `}
          onClick={() => {
            // 追蹤查看百岳詳情事件
            trackViewPeakDetails(peak.id, peak.name);
            setShowDetails(true);
          }}
          onMouseEnter={() => setShowHoverCard(true)}
          onMouseLeave={() => setShowHoverCard(false)}
        >
          {/* 手動標記的圓形光暈效果 */}
          {isManual && (
            <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-pulse"></div>
          )}
          {/* 主徽章圖標（圓形） */}
          <div className={`
            relative w-24 h-24 sm:w-28 sm:h-28
            ${!isCompleted ? 'grayscale opacity-30' : ''}
            transition-all duration-300
          `}>
            <Image
              src={badgeImagePath}
              alt={badgeAltText}
              width={112}
              height={112}
              className="w-full h-full drop-shadow-lg rounded-full object-cover"
              loading="lazy"
              quality={90}
              priority={false}
            />
          </div>

          {/* 排名徽章（右上角） */}
          <div className={`
            absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-md
            ${isCompleted
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-400 text-white'
            }
          `}>
            #{peak.id}
          </div>

          {/* 手動標記標籤（左上角） */}
          {isManual && (
            <div className="absolute -top-1 -left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold shadow-md">
              手動
            </div>
          )}

          {/* 新完成動畫標記 */}
          {isNewlyCompleted && (
            <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full animate-pulse shadow-lg">
              NEW!
            </div>
          )}

          {/* 手動標記按鈕（未完成時，顯示在徽章中心） */}
          {!isCompleted && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowManualConfirm(true);
              }}
              className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50 rounded-full"
            >
              <span className="text-white text-sm font-medium px-3 py-1.5 bg-emerald-500 rounded-full">
                ✓ 標記
              </span>
            </button>
          )}

          {/* Desktop Hover Card - 僅在電腦版顯示 */}
          {showHoverCard && peak.description && (
            <div className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-80 max-w-[90vw] z-[110] pointer-events-none">
              <div className="bg-white rounded-lg shadow-2xl border-2 border-emerald-500 p-4">
                <h4 className="font-bold text-lg text-gray-900 mb-2">{peak.name}</h4>
                <div className="flex flex-wrap gap-1 mb-2">
                  {peak.tags?.map((tag, index) => (
                    <span key={index} className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">{peak.description}</p>
                <div className="text-xs text-gray-500">
                  <div>海拔：{peak.altitude.toLocaleString()}m</div>
                  {peak.range && <div>山脈：{peak.range}</div>}
                </div>
                {/* 三角形箭頭指向徽章 */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px]">
                  <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-emerald-500"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 文字資訊（圓形下方） */}
        <div className="mt-2 text-center w-full">
          {/* 山峰名稱 */}
          <h3 className={`
            font-bold text-base sm:text-lg mb-0.5
            ${isCompleted ? 'text-gray-900' : 'text-gray-500'}
          `}>
            {peak.name}
          </h3>

          {/* 海拔高度 */}
          <div className={`
            text-xs sm:text-sm font-medium
            ${isCompleted ? 'text-emerald-600' : 'text-gray-400'}
          `}>
            {peak.altitude.toLocaleString()}m
          </div>

          {/* 座標精確度標示（未完成時顯示） */}
          {!isCompleted && (
            <div className={`mt-1 text-xs px-2 py-0.5 rounded inline-block ${accuracy.color} font-medium`}>
              {accuracy.stars}
            </div>
          )}

          {/* 完成標記 */}
          {isCompleted && (
            <div className="mt-1 text-xs text-emerald-600 font-semibold">
              ✓ 已完成
            </div>
          )}

          {/* 手動標記按鈕（未完成時，顯示在下方） */}
          {!isCompleted && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowManualConfirm(true);
              }}
              className="mt-2 text-xs px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-medium transition-colors shadow-sm w-full"
            >
              ✓ 手動標記
            </button>
          )}
        </div>
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

      {/* 百岳詳情對話框 - 支援所有山峰 */}
      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title={peak.name}
      >
        <div className="space-y-4">
          {/* 特殊標籤 */}
          {peak.tags && peak.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {peak.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-semibold text-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* 山峰簡介 */}
          {peak.description && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">{peak.description}</p>
            </div>
          )}

          {/* 基本資訊 */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">排名</p>
              <p className="font-semibold text-gray-900">#{peak.id}</p>
            </div>
            <div>
              <p className="text-gray-500">海拔高度</p>
              <p className="font-semibold text-gray-900">{peak.altitude.toLocaleString()}m</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500">所屬山脈</p>
              <p className="font-semibold text-gray-900">{peak.range || '未知'}</p>
            </div>
          </div>

          {/* 完成記錄（僅已完成的山峰顯示） */}
          {record && (
            <>
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">完成記錄</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
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
                  <div>
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
              </div>
            </>
          )}

          {/* 操作按鈕 */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            {record && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                刪除記錄
              </button>
            )}
            <button
              onClick={() => setShowDetails(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium"
            >
              關閉
            </button>
          </div>
        </div>
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

// 使用 memo 優化效能，避免不必要的重新渲染
export default memo(PeakBadge);
