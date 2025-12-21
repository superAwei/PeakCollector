/**
 * ShareButton - 分享按鈕元件
 *
 * 提供多種分享選項：
 * 1. 匯出成就海報（圖片）
 * 2. 生成 QR Code 名片
 * 3. 匯出 PDF 報告
 * 4. 社群媒體分享
 */

'use client';

import { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import type { Profile } from '@/lib/types';

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
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 產生公開主頁網址
  const profileUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/@${profile.username}`
    : `https://peakcollector.com/@${profile.username}`;

  // 檢測是否為手機裝置
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 1. 匯出成就海報（圖片）
  const handleExportPoster = async () => {
    try {
      setIsGenerating(true);

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
      setIsOpen(false);
    } catch (error) {
      console.error('匯出海報失敗:', error);
      alert('匯出失敗，請稍後再試');
      setIsGenerating(false);
    }
  };

  // 2. 生成 QR Code 名片
  const handleExportQRCard = async () => {
    try {
      setIsGenerating(true);

      // 生成 QR Code
      const qrCodeDataUrl = await QRCode.toDataURL(profileUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: '#10b981',
          light: '#ffffff',
        },
      });

      // 創建名片元素
      const cardElement = document.createElement('div');
      cardElement.style.width = '800px';
      cardElement.style.height = '500px';
      cardElement.style.padding = '40px';
      cardElement.style.background = 'white';
      cardElement.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      cardElement.style.position = 'fixed';
      cardElement.style.left = '-9999px';
      cardElement.style.display = 'flex';
      cardElement.style.gap = '40px';
      cardElement.style.alignItems = 'center';
      cardElement.style.border = '4px solid #10b981';
      cardElement.style.borderRadius = '20px';

      cardElement.innerHTML = `
        <div style="flex: 1;">
          <div style="font-size: 48px; margin-bottom: 20px;">⛰️</div>
          <h2 style="font-size: 36px; font-weight: bold; color: #1f2937; margin-bottom: 10px;">
            ${profile.display_name || profile.username}
          </h2>
          <p style="font-size: 20px; color: #6b7280; margin-bottom: 20px;">
            @${profile.username}
          </p>
          <div style="font-size: 24px; color: #10b981; font-weight: bold;">
            ${completedCount} / ${totalCount} 座百岳
          </div>
          <div style="font-size: 18px; color: #6b7280; margin-top: 10px;">
            完成度 ${progress}%
          </div>
        </div>
        <div style="text-align: center;">
          <img src="${qrCodeDataUrl}" style="width: 300px; height: 300px; border-radius: 10px;" />
          <p style="font-size: 14px; color: #6b7280; margin-top: 10px;">
            掃描查看我的百岳收集
          </p>
        </div>
      `;

      document.body.appendChild(cardElement);

      // 轉換為圖片
      const canvas = await html2canvas(cardElement, {
        scale: 2,
        backgroundColor: '#ffffff',
      });

      // 移除臨時元素
      document.body.removeChild(cardElement);

      // 下載圖片
      const link = document.createElement('a');
      link.download = `peak-collector-qr-${profile.username}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      setIsGenerating(false);
      setIsOpen(false);
    } catch (error) {
      console.error('匯出 QR 名片失敗:', error);
      alert('匯出失敗，請稍後再試');
      setIsGenerating(false);
    }
  };

  // 3. 匯出 PDF 報告
  const handleExportPDF = async () => {
    try {
      setIsGenerating(true);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // 設定字體（使用內建字體，中文會顯示為方框，但結構正確）
      pdf.setFont('helvetica');

      // 標題
      pdf.setFontSize(32);
      pdf.setTextColor(16, 185, 129);
      pdf.text('PeakCollector', 105, 30, { align: 'center' });

      // 使用者資訊
      pdf.setFontSize(24);
      pdf.setTextColor(0, 0, 0);
      pdf.text(profile.display_name || profile.username, 105, 50, { align: 'center' });

      pdf.setFontSize(14);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`@${profile.username}`, 105, 60, { align: 'center' });

      // 統計資訊
      pdf.setFontSize(48);
      pdf.setTextColor(16, 185, 129);
      pdf.text(`${completedCount}`, 105, 90, { align: 'center' });

      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Completed ${completedCount} of ${totalCount} Taiwan 100 Peaks`, 105, 105, { align: 'center' });

      pdf.setFontSize(14);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Progress: ${progress}%`, 105, 115, { align: 'center' });

      // 個人簡介
      if (profile.bio) {
        pdf.setFontSize(12);
        pdf.setTextColor(60, 60, 60);
        const bioLines = pdf.splitTextToSize(`"${profile.bio}"`, 160);
        pdf.text(bioLines, 105, 130, { align: 'center' });
      }

      // 生成 QR Code
      const qrCodeDataUrl = await QRCode.toDataURL(profileUrl, {
        width: 300,
        margin: 2,
      });

      // 添加 QR Code 到 PDF
      pdf.addImage(qrCodeDataUrl, 'PNG', 70, 150, 70, 70);

      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Scan to view my peak collection', 105, 230, { align: 'center' });
      pdf.text(profileUrl, 105, 237, { align: 'center' });

      // 頁尾
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text('Generated by PeakCollector - Taiwan 100 Peaks Digital Passport', 105, 280, { align: 'center' });
      pdf.text(new Date().toLocaleDateString('zh-TW'), 105, 285, { align: 'center' });

      // 下載 PDF
      pdf.save(`peak-collector-${profile.username}.pdf`);

      setIsGenerating(false);
      setIsOpen(false);
    } catch (error) {
      console.error('匯出 PDF 失敗:', error);
      alert('匯出失敗，請稍後再試');
      setIsGenerating(false);
    }
  };

  // 4. IG Stories 專用圖片（9:16 比例）
  const handleExportIGStory = async () => {
    try {
      setIsGenerating(true);

      // 先生成 QR Code Canvas（不是 DataURL）
      const qrCanvas = document.createElement('canvas');
      await QRCode.toCanvas(qrCanvas, profileUrl, {
        width: 400,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });

      // 創建最終的 Canvas（1080x1920）
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = 1080;
      finalCanvas.height = 1920;
      const ctx = finalCanvas.getContext('2d')!;

      // 繪製漸層背景
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1920);
      gradient.addColorStop(0, '#10b981');
      gradient.addColorStop(0.5, '#06b6d4');
      gradient.addColorStop(1, '#3b82f6');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1920);

      // 設定文字樣式
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';

      // 繪製 emoji（⛰️）
      ctx.font = 'bold 100px Arial';
      ctx.fillText('⛰️', 540, 180);

      // 繪製名稱
      ctx.font = 'bold 80px Arial';
      ctx.fillText(profile.display_name || profile.username, 540, 300);

      // 繪製 @username
      ctx.globalAlpha = 0.95;
      ctx.font = '50px Arial';
      ctx.fillText(`@${profile.username}`, 540, 370);
      ctx.globalAlpha = 1;

      // 繪製成就區塊背景
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.beginPath();
      ctx.roundRect(140, 460, 800, 360, 30);
      ctx.fill();

      // 繪製成就數字
      ctx.fillStyle = 'white';
      ctx.font = 'bold 240px Arial';
      ctx.fillText(completedCount.toString(), 540, 680);

      ctx.font = '50px Arial';
      ctx.globalAlpha = 0.95;
      ctx.fillText('座台灣百岳', 540, 750);

      ctx.font = '48px Arial';
      ctx.globalAlpha = 0.9;
      ctx.fillText(`完成度 ${progress}%`, 540, 810);
      ctx.globalAlpha = 1;

      // 繪製 QR Code 背景（白色圓角矩形）
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.roundRect(260, 890, 560, 560, 30);
      ctx.fill();

      // 繪製 QR Code（居中）
      ctx.drawImage(qrCanvas, 340, 970, 400, 400);

      // 繪製說明文字
      ctx.fillStyle = 'white';
      ctx.globalAlpha = 0.95;
      ctx.font = '42px Arial';
      ctx.fillText('掃描 QR Code 查看我的百岳收集', 540, 1530);

      ctx.globalAlpha = 0.85;
      ctx.font = '36px monospace';
      ctx.fillText(profileUrl.replace('https://', ''), 540, 1590);

      // 繪製底部標語
      ctx.globalAlpha = 0.8;
      ctx.font = '34px Arial';
      ctx.fillText('使用 PeakCollector 記錄百岳征途', 540, 1740);
      ctx.globalAlpha = 1;

      const canvas = finalCanvas;

      // 轉換為 Blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/png');
      });

      // 嘗試使用 Web Share API（手機原生分享）
      if (navigator.share && navigator.canShare) {
        try {
          const file = new File([blob], `ig-story-${profile.username}.png`, { type: 'image/png' });

          // 檢查是否可以分享檔案
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: `${profile.display_name || profile.username} 的百岳收集`,
              text: `我已完成 ${completedCount} 座台灣百岳！`,
            });

            setIsGenerating(false);
            setIsOpen(false);
            return;
          }
        } catch (error) {
          // 用戶取消分享或不支援，繼續執行降級方案
          if ((error as Error).name === 'AbortError') {
            setIsGenerating(false);
            setIsOpen(false);
            return;
          }
        }
      }

      // 降級方案：下載圖片
      const link = document.createElement('a');
      link.download = `ig-story-${profile.username}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      // 顯示提示
      alert('✅ IG Story 圖片已下載！\n\n📱 請在「下載」或「檔案」中找到圖片，然後：\n1. 長按圖片選擇「儲存圖片」存到相簿\n2. 或直接開啟 Instagram 上傳');

      setIsGenerating(false);
      setIsOpen(false);
    } catch (error) {
      console.error('匯出 IG Story 失敗:', error);
      alert('匯出失敗，請稍後再試');
      setIsGenerating(false);
    }
  };

  // 5. 社群媒體分享
  const handleShareToSocial = async () => {
    const shareText = `我在 PeakCollector 已經完成了 ${completedCount} 座台灣百岳！進度 ${progress}%\n\n查看我的百岳收集：${profileUrl}`;

    // 檢查是否支援 Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.display_name || profile.username} 的百岳收集`,
          text: shareText,
          url: profileUrl,
        });
        setIsOpen(false);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('分享失敗:', error);
        }
      }
    } else {
      // 降級方案：複製到剪貼簿
      try {
        await navigator.clipboard.writeText(shareText);
        alert('已複製分享文字到剪貼簿！');
        setIsOpen(false);
      } catch (error) {
        console.error('複製失敗:', error);
        alert('無法複製，請手動複製網址：' + profileUrl);
      }
    }
  };

  // 處理分享按鈕點擊
  const handleShareClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* 分享按鈕 */}
      <button
        onClick={handleShareClick}
        className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg shadow-lg transition-all duration-200 font-medium text-sm sm:text-base min-h-[44px] whitespace-nowrap"
        aria-label="分享成就"
      >
        <span className="text-lg sm:text-xl">📤</span>
        <span className="hidden xs:inline sm:hidden">分享</span>
        <span className="hidden sm:inline">分享我的成就</span>
        <span className="xs:hidden">📤</span>
      </button>

      {/* 分享選單 */}
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* 選單內容 - 手機版從底部彈出，桌面版下拉 */}
          <div className={`
            fixed bottom-0 left-0 right-0
            md:absolute md:right-0 md:left-auto md:bottom-auto md:top-full md:mt-2
            bg-white
            rounded-t-2xl md:rounded-lg
            shadow-xl border-t md:border
            border-gray-200
            z-50
            w-full md:w-72
            max-h-[80vh] overflow-y-auto
            animate-slide-up md:animate-none
          `}>
            {/* 手機版拖拽指示器 */}
            <div className="md:hidden flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>

            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-base md:text-sm font-semibold md:font-medium text-gray-800 md:text-gray-700 text-center md:text-left">選擇分享方式</p>
            </div>

            <div className="py-2">
              {/* IG Stories 專用 */}
              <button
                onClick={handleExportIGStory}
                disabled={isGenerating}
                className="w-full text-left px-5 md:px-4 py-4 md:py-3 text-base md:text-sm text-gray-700 hover:bg-emerald-50 active:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4 md:gap-3 min-h-[60px] md:min-h-0"
              >
                <span className="text-2xl md:text-xl">📸</span>
                <div className="flex-1">
                  <div className="font-semibold md:font-medium text-gray-900 md:text-gray-700">分享到 IG Stories</div>
                  <div className="text-sm md:text-xs text-gray-500 mt-0.5">下載專用圖片（含 QR Code）</div>
                </div>
              </button>

              {/* 成就海報 */}
              <button
                onClick={handleExportPoster}
                disabled={isGenerating}
                className="w-full text-left px-5 md:px-4 py-4 md:py-3 text-base md:text-sm text-gray-700 hover:bg-emerald-50 active:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4 md:gap-3 min-h-[60px] md:min-h-0"
              >
                <span className="text-2xl md:text-xl">🖼️</span>
                <div className="flex-1">
                  <div className="font-semibold md:font-medium text-gray-900 md:text-gray-700">匯出成就海報</div>
                  <div className="text-sm md:text-xs text-gray-500 mt-0.5">精美圖片格式</div>
                </div>
              </button>

              {/* QR Code 名片 */}
              <button
                onClick={handleExportQRCard}
                disabled={isGenerating}
                className="w-full text-left px-5 md:px-4 py-4 md:py-3 text-base md:text-sm text-gray-700 hover:bg-emerald-50 active:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4 md:gap-3 min-h-[60px] md:min-h-0"
              >
                <span className="text-2xl md:text-xl">📇</span>
                <div className="flex-1">
                  <div className="font-semibold md:font-medium text-gray-900 md:text-gray-700">QR Code 名片</div>
                  <div className="text-sm md:text-xs text-gray-500 mt-0.5">附 QR Code 的個人名片</div>
                </div>
              </button>

              {/* PDF 報告 */}
              <button
                onClick={handleExportPDF}
                disabled={isGenerating}
                className="w-full text-left px-5 md:px-4 py-4 md:py-3 text-base md:text-sm text-gray-700 hover:bg-emerald-50 active:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4 md:gap-3 min-h-[60px] md:min-h-0"
              >
                <span className="text-2xl md:text-xl">📄</span>
                <div className="flex-1">
                  <div className="font-semibold md:font-medium text-gray-900 md:text-gray-700">匯出 PDF 報告</div>
                  <div className="text-sm md:text-xs text-gray-500 mt-0.5">完整的成就報告</div>
                </div>
              </button>

              {/* 社群分享 */}
              <button
                onClick={handleShareToSocial}
                disabled={isGenerating}
                className="w-full text-left px-5 md:px-4 py-4 md:py-3 text-base md:text-sm text-gray-700 hover:bg-emerald-50 active:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4 md:gap-3 min-h-[60px] md:min-h-0"
              >
                <span className="text-2xl md:text-xl">🔗</span>
                <div className="flex-1">
                  <div className="font-semibold md:font-medium text-gray-900 md:text-gray-700">分享到社群媒體</div>
                  <div className="text-sm md:text-xs text-gray-500 mt-0.5">快速分享連結</div>
                </div>
              </button>
            </div>

            {isGenerating && (
              <div className="px-5 md:px-4 py-3 md:py-2 border-t border-gray-100">
                <p className="text-sm md:text-xs text-emerald-600 flex items-center gap-2 justify-center md:justify-start">
                  <span className="animate-spin">⏳</span>
                  生成中...
                </p>
              </div>
            )}

            {/* 手機版取消按鈕 */}
            <div className="md:hidden border-t border-gray-100">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-4 text-base font-semibold text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
