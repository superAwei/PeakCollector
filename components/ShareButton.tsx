/**
 * ShareButton - 匯出成就海報按鈕
 *
 * v2.0：支援使用者上傳登山照片，生成個人化成就海報
 * - 1080x1080px 正方形海報（適合 Instagram）
 * - 左側 70%：使用者照片或預設漸層背景
 * - 右側 30%：成就資訊（進度、用戶名、簡介）
 */

'use client';

import { useState, useRef } from 'react';
import type { Profile } from '@/lib/types';
import { trackGenerateShareImage } from '@/lib/analytics';
import Modal from './Modal';

interface ShareButtonProps {
  profile: Profile;
  completedCount: number;
  totalCount: number;
  progress: number;
}

export default function ShareButton({
  profile,
  completedCount,
  totalCount,
  progress
}: ShareButtonProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 處理照片上傳
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 檢查檔案類型
    if (!file.type.startsWith('image/')) {
      alert('❌ 請上傳圖片檔案');
      return;
    }

    // 檢查檔案大小（限制 10MB）
    if (file.size > 10 * 1024 * 1024) {
      alert('❌ 圖片檔案過大，請上傳小於 10MB 的圖片');
      return;
    }

    // 讀取圖片並轉換為 base64
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
    };
    reader.onerror = () => {
      alert('❌ 圖片讀取失敗，請重試');
    };
    reader.readAsDataURL(file);
  };

  // 文字換行函式（用於 Canvas）
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
    lineHeight: number,
    maxLines: number
  ): string[] => {
    const words = text.split('');
    const lines: string[] = [];
    let currentLine = '';

    for (const char of words) {
      const testLine = currentLine + char;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = char;

        if (lines.length >= maxLines) {
          break;
        }
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine && lines.length < maxLines) {
      lines.push(currentLine);
    }

    // 如果超過最大行數，最後一行加上省略號
    if (lines.length === maxLines && currentLine.length > 0) {
      lines[maxLines - 1] = lines[maxLines - 1].slice(0, -3) + '...';
    }

    return lines;
  };

  // 生成海報（Canvas）
  const handleGeneratePoster = async () => {
    try {
      setIsGenerating(true);

      // 追蹤事件
      trackGenerateShareImage(profile.username, 'achievement_poster_v2');

      // 創建 Canvas
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('無法創建 Canvas 上下文');
      }

      // === 左側 70%：使用者照片或預設漸層背景 ===
      const leftWidth = 1080 * 0.7; // 756px

      if (uploadedImage) {
        // 載入使用者上傳的照片
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = uploadedImage;
        });

        // 使用 cover 模式繪製圖片（裁切置中）
        const imgAspect = img.width / img.height;
        const canvasAspect = leftWidth / 1080;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgAspect > canvasAspect) {
          // 圖片較寬，以高度為準
          drawHeight = 1080;
          drawWidth = drawHeight * imgAspect;
          offsetX = -(drawWidth - leftWidth) / 2;
          offsetY = 0;
        } else {
          // 圖片較高，以寬度為準
          drawWidth = leftWidth;
          drawHeight = drawWidth / imgAspect;
          offsetX = 0;
          offsetY = -(drawHeight - 1080) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      } else {
        // 預設漸層背景
        const gradient = ctx.createLinearGradient(0, 0, leftWidth, 1080);
        gradient.addColorStop(0, '#10b981'); // emerald-500
        gradient.addColorStop(1, '#14b8a6'); // teal-500
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, leftWidth, 1080);
      }

      // === 右側 30%：成就資訊 ===
      const rightX = leftWidth;
      const rightWidth = 1080 - leftWidth; // 324px

      // 背景色（淺灰色）
      ctx.fillStyle = '#f9fafb'; // gray-50
      ctx.fillRect(rightX, 0, rightWidth, 1080);

      // 設定文字繪製起點（右側區域內的 padding）
      const textX = rightX + 40;
      let currentY = 80;

      // 1. PeakCollector 品牌名稱
      ctx.fillStyle = '#059669'; // emerald-600
      ctx.font = 'bold 32px system-ui, -apple-system, sans-serif';
      ctx.fillText('Peak', textX, currentY);
      currentY += 36;
      ctx.fillText('Collector', textX, currentY);
      currentY += 80;

      // 2. 進度數字（大號）
      ctx.fillStyle = '#059669'; // emerald-600
      ctx.font = 'bold 72px system-ui, -apple-system, sans-serif';
      ctx.fillText(`${completedCount}`, textX, currentY);
      currentY += 80;

      // "/ 100 座" 文字
      ctx.fillStyle = '#9ca3af'; // gray-400
      ctx.font = '500 28px system-ui, -apple-system, sans-serif';
      ctx.fillText(`/ ${totalCount} 座`, textX, currentY);
      currentY += 60;

      // 3. 進度條
      const barWidth = rightWidth * 0.8; // 80% 寬度
      const barHeight = 12;
      const barX = textX;
      const barY = currentY;

      // 背景條（灰色）
      ctx.fillStyle = '#e5e7eb'; // gray-200
      ctx.roundRect(barX, barY, barWidth, barHeight, 6);
      ctx.fill();

      // 進度條（emerald 漸層）
      const progressWidth = (barWidth * progress) / 100;
      const progressGradient = ctx.createLinearGradient(barX, barY, barX + progressWidth, barY);
      progressGradient.addColorStop(0, '#10b981'); // emerald-500
      progressGradient.addColorStop(1, '#14b8a6'); // teal-500
      ctx.fillStyle = progressGradient;
      ctx.beginPath();
      ctx.roundRect(barX, barY, progressWidth, barHeight, 6);
      ctx.fill();

      currentY += 60;

      // 4. @username
      ctx.fillStyle = '#374151'; // gray-700
      ctx.font = '500 24px system-ui, -apple-system, sans-serif';
      ctx.fillText(`@${profile.username}`, textX, currentY);
      currentY += 60;

      // 5. Bio（個人簡介，最多 3 行）
      if (profile.bio) {
        const bioText = profile.bio.slice(0, 100); // 限制 100 字元
        ctx.fillStyle = '#4b5563'; // gray-600
        ctx.font = '400 18px system-ui, -apple-system, sans-serif';

        const bioLines = wrapText(ctx, bioText, rightWidth - 80, 28, 3);
        bioLines.forEach((line) => {
          ctx.fillText(line, textX, currentY);
          currentY += 28;
        });
      }

      // 下載圖片
      const link = document.createElement('a');
      link.download = `peak-collector-${profile.username}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 0.95);
      link.click();

      setIsGenerating(false);
      setShowUploadModal(false);
      setUploadedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // 顯示成功提示
      alert('✅ 成就海報已下載！');
    } catch (error) {
      console.error('生成海報失敗:', error);
      alert('❌ 生成失敗，請稍後再試');
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* 觸發按鈕 */}
      <button
        onClick={() => setShowUploadModal(true)}
        disabled={isGenerating}
        className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg shadow-lg transition-all duration-200 font-medium text-sm sm:text-base min-h-[44px] whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
        aria-label="匯出成就海報"
      >
        <span className="text-lg sm:text-xl">📥</span>
        <span className="hidden xs:inline sm:hidden">海報</span>
        <span className="hidden sm:inline">匯出成就海報</span>
        <span className="xs:hidden">📥</span>
      </button>

      {/* 照片上傳 Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setUploadedImage(null);
        }}
        title="匯出成就海報"
      >
        <div className="space-y-4">
          {/* 說明文字 */}
          <p className="text-sm text-gray-600">
            上傳你的登山照片，或使用預設背景生成專屬成就海報
          </p>

          {/* 照片上傳區域 */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {uploadedImage ? (
              // 預覽已上傳的照片
              <div className="space-y-3">
                <img
                  src={uploadedImage}
                  alt="預覽照片"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={() => {
                    setUploadedImage(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  移除照片
                </button>
              </div>
            ) : (
              // 上傳提示
              <div className="space-y-3">
                <div className="text-4xl">📷</div>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="inline-block px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg cursor-pointer transition-colors font-medium"
                  >
                    上傳照片
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  支援 JPG、PNG 格式，檔案大小限制 10MB
                </p>
              </div>
            )}
          </div>

          {/* 預設背景說明 */}
          {!uploadedImage && (
            <p className="text-xs text-gray-500 text-center">
              💡 未上傳照片時，將使用 PeakCollector 預設漸層背景
            </p>
          )}

          {/* 操作按鈕 */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              onClick={() => {
                setShowUploadModal(false);
                setUploadedImage(null);
              }}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isGenerating}
            >
              取消
            </button>
            <button
              onClick={handleGeneratePoster}
              disabled={isGenerating}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin">⏳</span>
                  生成中...
                </>
              ) : (
                <>
                  <span>📥</span>
                  生成海報
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

/* ============================================
 * 以下為已移除的功能（保留作為備份參考）
 * ============================================

// 2. QR Code 名片功能 - 已移除
// 使用套件: qrcode, html2canvas
// 函式: handleExportQRCard() (原 129-207 行)

// 3. PDF 報告功能 - 已移除
// 使用套件: jspdf, qrcode
// 函式: handleExportPDF() (原 209-288 行)

// 4. IG Stories 圖片功能 - 已移除
// 使用套件: qrcode, Canvas API
// 函式: handleExportIGStory() (原 291-435 行)

// 5. 社群媒體分享功能 - 已移除
// 使用 Web Share API
// 函式: handleShareToSocial() (原 437-466 行)

============================================ */
