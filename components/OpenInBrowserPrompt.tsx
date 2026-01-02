/**
 * OpenInBrowserPrompt - 引導使用者在外部瀏覽器開啟
 *
 * 當偵測到使用者在社群 App 的內建瀏覽器（WebView）中時，
 * 顯示全螢幕提示，引導使用者在 Safari、Chrome 等瀏覽器中開啟，
 * 以便正常使用 Google OAuth 登入功能。
 */

'use client';

import { useState, useEffect } from 'react';
import { isInAppBrowser, getOS, getCurrentUrl } from '@/lib/browser-detection';
import { ExternalLink, AlertCircle, Copy, Check } from 'lucide-react';

export default function OpenInBrowserPrompt() {
  // 使用 state 儲存檢測結果
  const [isInApp, setIsInApp] = useState(false);
  const [os, setOs] = useState<'ios' | 'android' | 'other'>('other');
  const [currentUrl, setCurrentUrl] = useState('');
  const [mounted, setMounted] = useState(false);

  const [copied, setCopied] = useState(false);

  // 只在客戶端掛載後執行檢測，避免 hydration mismatch
  useEffect(() => {
    setIsInApp(isInAppBrowser());
    setOs(getOS());
    setCurrentUrl(getCurrentUrl());
    setMounted(true);
  }, []);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 未掛載或不在內建瀏覽器中，不顯示提示
  if (!mounted || !isInApp) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6">
        {/* 圖示 */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-amber-600" />
          </div>
        </div>

        {/* 標題 */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            請使用瀏覽器開啟
          </h2>
          <p className="text-gray-600">
            為了確保登入安全，請在瀏覽器中開啟本網站
          </p>
        </div>

        {/* 說明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <p className="text-sm text-blue-900 font-medium">
            為什麼需要這樣做？
          </p>
          <p className="text-sm text-blue-800">
            Google 基於安全考量，不允許在社群 App 內建瀏覽器中登入。
            請使用 Safari、Chrome 等瀏覽器開啟。
          </p>
        </div>

        {/* 操作指引 */}
        <div className="space-y-4">
          <div className="text-sm text-gray-700 space-y-2">
            <p className="font-semibold">📱 如何開啟？</p>

            {os === 'ios' && (
              <ol className="list-decimal list-inside space-y-1 text-gray-600">
                <li>點擊右上角的「⋯」選單</li>
                <li>選擇「在 Safari 中開啟」</li>
                <li>即可正常登入使用</li>
              </ol>
            )}

            {os === 'android' && (
              <ol className="list-decimal list-inside space-y-1 text-gray-600">
                <li>點擊右上角的「⋮」選單</li>
                <li>選擇「在瀏覽器中開啟」</li>
                <li>選擇 Chrome 或其他瀏覽器</li>
              </ol>
            )}

            {os === 'other' && (
              <p className="text-gray-600">
                請點擊右上角選單，選擇「在瀏覽器中開啟」
              </p>
            )}
          </div>

          {/* 複製網址按鈕 */}
          <button
            onClick={handleCopyUrl}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                已複製網址
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                複製網址
              </>
            )}
          </button>

          <p className="text-xs text-center text-gray-500">
            或直接複製此網址，在瀏覽器中開啟
          </p>
        </div>

        {/* 底部說明 */}
        <div className="text-center">
          <a
            href="https://support.google.com/accounts/answer/7675428"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-emerald-600 hover:underline inline-flex items-center gap-1"
          >
            了解更多關於 Google 安全政策
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
