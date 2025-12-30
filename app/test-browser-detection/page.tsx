'use client';

import { useState, useEffect } from 'react';
import { isInAppBrowser, getOS, getCurrentUrl } from '@/lib/browser-detection';

export default function TestBrowserDetection() {
  const [isInApp, setIsInApp] = useState<boolean | null>(null);
  const [os, setOS] = useState<string>('');
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [userAgent, setUserAgent] = useState<string>('');

  useEffect(() => {
    const inApp = isInAppBrowser();
    const userOS = getOS();
    const url = getCurrentUrl();
    const ua = navigator.userAgent;

    setIsInApp(inApp);
    setOS(userOS);
    setCurrentUrl(url);
    setUserAgent(ua);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          🔍 瀏覽器偵測測試
        </h1>

        <div className="space-y-6">
          {/* 偵測結果 */}
          <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
            <h2 className="font-bold text-lg mb-3 text-blue-900">偵測結果</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">是否為內建瀏覽器：</span>
                <span className={`px-3 py-1 rounded-full font-bold ${
                  isInApp
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {isInApp === null ? '載入中...' : isInApp ? '✅ 是（會顯示提示）' : '❌ 否（不會顯示提示）'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">作業系統：</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-900 rounded">
                  {os || '載入中...'}
                </span>
              </div>
            </div>
          </div>

          {/* User Agent */}
          <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded">
            <h2 className="font-bold text-lg mb-3 text-purple-900">User Agent</h2>
            <p className="text-xs text-gray-700 break-all font-mono bg-white p-3 rounded">
              {userAgent || '載入中...'}
            </p>
          </div>

          {/* 當前網址 */}
          <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
            <h2 className="font-bold text-lg mb-3 text-green-900">當前網址</h2>
            <p className="text-sm text-gray-700 break-all">
              {currentUrl || '載入中...'}
            </p>
          </div>

          {/* 偵測關鍵字 */}
          <div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded">
            <h2 className="font-bold text-lg mb-3 text-amber-900">偵測關鍵字分析</h2>
            <div className="space-y-2 text-sm">
              {[
                { name: 'Instagram', keyword: 'Instagram' },
                { name: 'Facebook', keyword: 'FBAN' },
                { name: 'Facebook App', keyword: 'FBAV' },
                { name: 'LINE', keyword: 'Line/' },
                { name: 'WeChat', keyword: 'MicroMessenger' },
                { name: 'Twitter/X', keyword: 'Twitter' },
                { name: 'Threads', keyword: 'Threads' },
                { name: 'WebView (通用)', keyword: 'wv' },
                { name: 'WebView (標準)', keyword: 'WebView' },
              ].map(({ name, keyword }) => (
                <div key={keyword} className="flex items-center gap-2">
                  <span className={`w-20 px-2 py-1 rounded text-center text-xs font-bold ${
                    userAgent.includes(keyword)
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {userAgent.includes(keyword) ? '找到' : '未找到'}
                  </span>
                  <span className="text-gray-700">{name} ({keyword})</span>
                </div>
              ))}
            </div>
          </div>

          {/* 說明 */}
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">📱 如何測試？</h3>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>在 Safari/Chrome 開啟：應該顯示「否」，不會顯示提示</li>
              <li>在 Instagram App 中開啟連結：應該顯示「是」，會顯示全螢幕提示</li>
              <li>在 Facebook App 中開啟連結：應該顯示「是」，會顯示全螢幕提示</li>
              <li>在 LINE App 中開啟連結：應該顯示「是」，會顯示全螢幕提示</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
