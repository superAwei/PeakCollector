'use client';

import { useState, useCallback } from 'react';
import { parseGPX, findVisitedPeaks, readFileAsText } from '@/lib/gpx-utils';
import { PEAKS } from '@/lib/peaks-data';
import { saveCompletedPeaks } from '@/lib/storage';

interface GPXUploaderProps {
  onPeaksVerified: (peakIds: number[]) => void;
}

export default function GPXUploader({ onPeaksVerified }: GPXUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  const processGPXFile = async (file: File) => {
    setIsProcessing(true);
    setMessage(null);

    try {
      // 驗證檔案類型
      if (!file.name.toLowerCase().endsWith('.gpx')) {
        throw new Error('請上傳 GPX 檔案（.gpx）');
      }

      // 讀取檔案內容
      const content = await readFileAsText(file);

      // 解析 GPX
      const gpxData = parseGPX(content);

      // 驗證經過的山峰
      const visitedPeakIds = findVisitedPeaks(gpxData, PEAKS);

      if (visitedPeakIds.length === 0) {
        setMessage({
          type: 'info',
          text: '此 GPX 檔案沒有經過任何百岳山頂（100公尺範圍內）',
        });
      } else {
        // 儲存到 Supabase（等待完成）
        await saveCompletedPeaks(visitedPeakIds, file.name);

        // 通知父組件（等資料儲存完成後再通知）
        onPeaksVerified(visitedPeakIds);

        const peakNames = visitedPeakIds
          .map((id) => PEAKS.find((p) => p.id === id)?.name)
          .filter(Boolean)
          .join('、');

        setMessage({
          type: 'success',
          text: `恭喜！驗證成功完成 ${visitedPeakIds.length} 座百岳：${peakNames}`,
        });
      }
    } catch (error) {
      console.error('GPX 處理錯誤:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'GPX 檔案處理失敗',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processGPXFile(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processGPXFile(file);
    }
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">上傳 GPX 軌跡</h2>

      {/* 拖放區域 */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${isDragging
            ? 'border-emerald-500 bg-emerald-50'
            : 'border-gray-300 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50/50'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <input
          type="file"
          accept=".gpx"
          onChange={handleFileSelect}
          disabled={isProcessing}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          id="gpx-upload"
        />

        <div className="pointer-events-none">
          {/* 圖標 */}
          <div className="text-6xl mb-4">
            {isProcessing ? '⏳' : isDragging ? '📍' : '📂'}
          </div>

          {/* 文字說明 */}
          <div className="text-lg font-semibold text-gray-700 mb-2">
            {isProcessing
              ? '處理中...'
              : isDragging
              ? '放開以上傳檔案'
              : '拖放 GPX 檔案到此處'}
          </div>

          <div className="text-sm text-gray-500">
            或點擊此處選擇檔案
          </div>

          <div className="text-xs text-gray-400 mt-4">
            支援 .gpx 格式，系統將自動驗證軌跡是否經過百岳山頂
          </div>
        </div>
      </div>

      {/* 訊息顯示 */}
      {message && (
        <div
          className={`
            mt-4 p-4 rounded-lg border
            ${message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : message.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
            }
          `}
        >
          <div className="flex items-start gap-2">
            <span className="text-xl">
              {message.type === 'success' ? '✅' : message.type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <div className="flex-1">
              <p className="font-medium">{message.text}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
