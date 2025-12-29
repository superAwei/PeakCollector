'use client';

import { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [showLoading, setShowLoading] = useState(true);
  const [hasShownLoading, setHasShownLoading] = useState(false);

  useEffect(() => {
    // 檢查 sessionStorage 是否已經顯示過載入動畫
    const hasLoaded = sessionStorage.getItem('hasLoadedBefore');

    if (hasLoaded) {
      // 已經載入過，直接顯示內容
      setShowLoading(false);
    } else {
      // 首次載入，顯示載入動畫
      setHasShownLoading(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    // 載入完成，記錄到 sessionStorage（關閉分頁後會重置）
    sessionStorage.setItem('hasLoadedBefore', 'true');
    setShowLoading(false);
  };

  // 如果還沒檢查過 sessionStorage，先不顯示任何內容
  if (showLoading && hasShownLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return <>{children}</>;
}
