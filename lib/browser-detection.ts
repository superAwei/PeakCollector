/**
 * 瀏覽器偵測工具
 *
 * 用於偵測使用者是否在社群 App 的內建瀏覽器（WebView）中開啟網站
 * 這些內建瀏覽器無法使用 Google OAuth 登入
 */

/**
 * 偵測是否在嵌入式瀏覽器（WebView）中
 */
export function isInAppBrowser(): boolean {
  if (typeof window === 'undefined') return false;

  const ua = navigator.userAgent || navigator.vendor || (window as any).opera;

  // Instagram 內建瀏覽器
  if (ua.includes('Instagram')) return true;

  // Facebook 內建瀏覽器
  if (ua.includes('FBAN') || ua.includes('FBAV')) return true;

  // Line 內建瀏覽器
  if (ua.includes('Line/')) return true;

  // WeChat 內建瀏覽器
  if (ua.includes('MicroMessenger')) return true;

  // Twitter/X 內建瀏覽器
  if (ua.includes('Twitter')) return true;

  // Threads（Meta）內建瀏覽器
  // Threads 使用類似 FB 的 WebView
  if (ua.includes('Threads')) return true;

  // 其他常見的 WebView 標記
  if (ua.includes('wv') || ua.includes('WebView')) return true;

  return false;
}

/**
 * 偵測作業系統
 */
export function getOS(): 'ios' | 'android' | 'other' {
  if (typeof window === 'undefined') return 'other';

  const ua = navigator.userAgent;

  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
  if (/Android/.test(ua)) return 'android';

  return 'other';
}

/**
 * 獲取當前網址（用於引導）
 */
export function getCurrentUrl(): string {
  if (typeof window === 'undefined') return '';
  return window.location.href;
}
