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
  const uaLower = ua.toLowerCase();

  // === 明確的社群 App 內建瀏覽器偵測 ===

  // Instagram 內建瀏覽器
  if (uaLower.includes('instagram')) return true;

  // Facebook 內建瀏覽器
  if (uaLower.includes('fban') || uaLower.includes('fbav')) return true;
  if (uaLower.includes('fb_iab') || uaLower.includes('fb4a')) return true;

  // LINE 內建瀏覽器
  if (uaLower.includes('line/')) return true;

  // WeChat 內建瀏覽器
  if (uaLower.includes('micromessenger')) return true;

  // Twitter/X 內建瀏覽器
  if (uaLower.includes('twitter')) return true;

  // Threads（Meta）內建瀏覽器
  if (uaLower.includes('threads')) return true;
  // Threads 在某些版本可能使用 Barcelona (Threads 內部代號)
  if (uaLower.includes('barcelona')) return true;

  // TikTok 內建瀏覽器
  if (uaLower.includes('tiktok')) return true;
  if (uaLower.includes('bytedance')) return true;

  // Snapchat 內建瀏覽器
  if (uaLower.includes('snapchat')) return true;

  // LinkedIn 內建瀏覽器
  if (uaLower.includes('linkedin')) return true;

  // Pinterest 內建瀏覽器
  if (uaLower.includes('pinterest')) return true;

  // === 通用 WebView 偵測 ===

  // Android WebView
  if (uaLower.includes('wv')) return true;
  if (uaLower.includes('webview')) return true;

  // iOS WebView (通常缺少 Safari 關鍵字)
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const hasSafari = uaLower.includes('safari');

  // iOS 裝置但不包含 Safari = 很可能是 in-app browser
  if (isIOS && !hasSafari) return true;

  // === 額外安全檢查：檢查是否為已知的安全瀏覽器 ===

  // 如果明確包含這些關鍵字，則認為是安全的
  const safeKeywords = ['chrome', 'safari', 'firefox', 'edge', 'opera'];
  const hasSafeBrowser = safeKeywords.some(keyword => uaLower.includes(keyword));

  // 如果 iOS 裝置且有 Safari，認為是安全的
  if (isIOS && hasSafari) return false;

  // 如果有安全瀏覽器關鍵字，認為是安全的
  if (hasSafeBrowser) return false;

  // 預設：如果都不符合，為了安全起見，返回 false（允許登入）
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
