'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // 模擬載入進度（0-100%，總時長約 2.5 秒）
    const duration = 2500; // 2.5 秒
    const steps = 60; // 60 個步驟
    const interval = duration / steps;

    let currentProgress = 0;

    const timer = setInterval(() => {
      currentProgress += 100 / steps;

      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        clearInterval(timer);

        // 完成後等待 300ms 再開始淡出
        setTimeout(() => {
          setIsComplete(true);

          // 淡出動畫完成後（500ms）通知父組件
          setTimeout(() => {
            onLoadingComplete?.();
          }, 500);
        }, 300);
      } else {
        setProgress(currentProgress);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  // 根據進度計算百分比文字顏色
  const getTextColor = () => {
    if (progress < 30) return 'text-gray-400';
    if (progress < 70) return 'text-gray-600';
    return 'text-emerald-600';
  };

  return (
    <div
      className={`
        fixed inset-0 z-50 flex flex-col items-center justify-center bg-white
        transition-opacity duration-500
        ${isComplete ? 'opacity-0' : 'opacity-100'}
      `}
    >
      {/* LOGO 容器 */}
      <div className="relative w-48 h-48 mb-6">
        {/* 灰色底層（未填充） */}
        <Image
          src="/weblogo.png"
          alt="PeakCollector Logo"
          width={192}
          height={192}
          className="absolute inset-0 opacity-30 grayscale"
          priority
        />

        {/* 彩色填充層（從底部往上填充） */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: `inset(${100 - progress}% 0 0 0)`,
          }}
        >
          <Image
            src="/weblogo.png"
            alt="PeakCollector Logo"
            width={192}
            height={192}
            className="absolute inset-0"
            priority
          />
        </div>
      </div>

      {/* 載入百分比 */}
      <div className={`text-2xl font-bold transition-colors duration-300 ${getTextColor()}`}>
        {Math.round(progress)}%
      </div>

      {/* 載入文字 */}
      <div className="mt-2 text-sm text-gray-500">
        載入中...
      </div>
    </div>
  );
}
