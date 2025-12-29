/**
 * 頁面瀏覽追蹤組件
 *
 * 用於在 Server Component 中追蹤頁面瀏覽事件
 */

'use client';

import { useEffect } from 'react';
import { trackViewPublicProfile } from '@/lib/analytics';

interface PageViewTrackerProps {
  username: string;
}

export default function PageViewTracker({ username }: PageViewTrackerProps) {
  useEffect(() => {
    // 追蹤查看公開主頁事件
    trackViewPublicProfile(username);
  }, [username]);

  // 這個組件不渲染任何內容
  return null;
}
