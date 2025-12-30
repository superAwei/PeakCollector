/**
 * ShareButton - 匯出成就海報按鈕
 *
 * 簡化版：只保留「匯出成就海報」功能
 * 點擊按鈕直接生成並下載成就海報（PNG 格式）
 */

'use client';

import { useState } from 'react';
import html2canvas from 'html2canvas';
import type { Profile } from '@/lib/types';
import { trackGenerateShareImage } from '@/lib/analytics';

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
  const [isGenerating, setIsGenerating] = useState(false);

  // 產生公開主頁網址
  const profileUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/@${profile.username}`
    : `https://peakcollector.com/@${profile.username}`;

  // 匯出成就海報（圖片）
  const handleExportPoster = async () => {
    try {
      setIsGenerating(true);

      // 追蹤事件
      trackGenerateShareImage(profile.username, 'achievement_poster');

      // 創建一個臨時的海報元素
      const posterElement = document.createElement('div');
      posterElement.style.width = '1200px';
      posterElement.style.padding = '60px';
      posterElement.style.background = 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)';
      posterElement.style.color = 'white';
      posterElement.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      posterElement.style.position = 'fixed';
      posterElement.style.left = '-9999px';

      posterElement.innerHTML = `
        <div style="text-align: center;">
          <div style="font-size: 72px; margin-bottom: 20px;">⛰️</div>
          <h1 style="font-size: 48px; font-weight: bold; margin-bottom: 10px;">
            ${profile.display_name || profile.username}
          </h1>
          <p style="font-size: 24px; opacity: 0.9; margin-bottom: 40px;">
            @${profile.username}
          </p>

          <div style="background: rgba(255, 255, 255, 0.2); border-radius: 20px; padding: 40px; margin-bottom: 40px;">
            <div style="font-size: 96px; font-weight: bold; margin-bottom: 10px;">
              ${completedCount}
            </div>
            <div style="font-size: 32px; opacity: 0.9;">
              已完成 ${totalCount} 座台灣百岳中的 ${completedCount} 座
            </div>
            <div style="font-size: 28px; opacity: 0.8; margin-top: 20px;">
              進度：${progress}%
            </div>
          </div>

          ${profile.bio ? `
            <p style="font-size: 24px; opacity: 0.9; margin-bottom: 40px; font-style: italic;">
              "${profile.bio}"
            </p>
          ` : ''}

          <div style="font-size: 20px; opacity: 0.8;">
            使用 PeakCollector 記錄百岳征途
          </div>
          <div style="font-size: 18px; opacity: 0.7; margin-top: 10px;">
            ${profileUrl}
          </div>
        </div>
      `;

      document.body.appendChild(posterElement);

      // 轉換為圖片
      const canvas = await html2canvas(posterElement, {
        scale: 2,
        backgroundColor: null,
      });

      // 移除臨時元素
      document.body.removeChild(posterElement);

      // 下載圖片
      const link = document.createElement('a');
      link.download = `peak-collector-${profile.username}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      setIsGenerating(false);

      // 顯示成功提示
      alert('✅ 成就海報已下載！');
    } catch (error) {
      console.error('匯出海報失敗:', error);
      alert('❌ 匯出失敗，請稍後再試');
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleExportPoster}
      disabled={isGenerating}
      className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg shadow-lg transition-all duration-200 font-medium text-sm sm:text-base min-h-[44px] whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
      aria-label="匯出成就海報"
    >
      {isGenerating ? (
        <>
          <span className="animate-spin text-lg sm:text-xl">⏳</span>
          <span className="hidden sm:inline">生成中...</span>
          <span className="sm:hidden">⏳</span>
        </>
      ) : (
        <>
          <span className="text-lg sm:text-xl">📥</span>
          <span className="hidden xs:inline sm:hidden">海報</span>
          <span className="hidden sm:inline">匯出成就海報</span>
          <span className="xs:hidden">📥</span>
        </>
      )}
    </button>
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
