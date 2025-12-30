/**
 * Google Analytics 4 事件追蹤工具
 *
 * 提供型別安全的 GA4 事件追蹤函數
 */

// 擴展 Window 介面以支援 gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

/**
 * 發送 GA4 事件
 */
function sendEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, params);
    console.log(`📊 GA4 事件已發送: ${eventName}`, params);
  }
}

// ==================== 使用者認證事件 ====================

/**
 * 追蹤使用者註冊
 */
export function trackSignUp(method: 'google' | 'email' = 'google') {
  sendEvent('sign_up', {
    method,
    timestamp: new Date().toISOString(),
  });
}

/**
 * 追蹤使用者登入
 */
export function trackLogin(method: 'google' | 'email' = 'google') {
  sendEvent('login', {
    method,
    timestamp: new Date().toISOString(),
  });
}

// ==================== 百岳相關事件 ====================

/**
 * 追蹤手動標記百岳
 */
export function trackManualMarkPeak(peakId: number, peakName: string) {
  sendEvent('manual_mark_peak', {
    peak_id: peakId,
    peak_name: peakName,
    method: 'manual',
  });
}

/**
 * 追蹤取消標記百岳
 */
export function trackUnmarkPeak(peakId: number, peakName: string) {
  sendEvent('unmark_peak', {
    peak_id: peakId,
    peak_name: peakName,
  });
}

/**
 * 追蹤查看百岳詳情
 */
export function trackViewPeakDetails(peakId: number, peakName: string) {
  sendEvent('view_peak_details', {
    peak_id: peakId,
    peak_name: peakName,
  });
}

// ==================== GPX 上傳事件 ====================

/**
 * 追蹤 GPX 上傳成功
 */
export function trackGPXUploadSuccess(
  peaksCount: number,
  fileName?: string
) {
  sendEvent('gpx_upload_success', {
    peaks_verified: peaksCount,
    file_name: fileName,
    method: 'gpx',
  });
}

/**
 * 追蹤 GPX 上傳失敗
 */
export function trackGPXUploadFail(errorMessage: string) {
  sendEvent('gpx_upload_fail', {
    error_message: errorMessage,
  });
}

// ==================== 進度管理事件 ====================

/**
 * 追蹤重置進度
 */
export function trackResetProgress(completedCount: number) {
  sendEvent('reset_progress', {
    peaks_completed: completedCount,
    timestamp: new Date().toISOString(),
  });
}

// ==================== 個人資料事件 ====================

/**
 * 追蹤編輯個人資料
 */
export function trackEditProfile(isFirstTime: boolean = false) {
  sendEvent('edit_profile', {
    is_first_time: isFirstTime,
    timestamp: new Date().toISOString(),
  });
}

/**
 * 追蹤首次完成個人資料設定
 */
export function trackProfileComplete() {
  sendEvent('profile_complete', {
    timestamp: new Date().toISOString(),
  });
}

// ==================== 分享功能事件 ====================

/**
 * 追蹤查看公開主頁
 */
export function trackViewPublicProfile(username: string) {
  sendEvent('share_profile_view', {
    username,
    timestamp: new Date().toISOString(),
  });
}

// ============================================
// 以下追蹤函式已停用（分享功能簡化後不再使用）
// ============================================

/*
// 追蹤複製主頁連結 - 已停用
export function trackCopyProfileLink(username: string) {
  sendEvent('copy_profile_link', {
    username,
    share_method: 'copy_link',
  });
}

// 追蹤下載 QR Code - 已停用
export function trackDownloadQRCode(username: string) {
  sendEvent('download_qr_code', {
    username,
    share_method: 'qr_code',
  });
}
*/

/**
 * 追蹤生成分享圖片
 */
export function trackGenerateShareImage(username: string, imageType: string) {
  sendEvent('generate_share_image', {
    username,
    image_type: imageType,
    share_method: 'share_image',
  });
}

// ==================== 其他事件 ====================

/**
 * 追蹤使用說明展開/收合
 */
export function trackToggleGuide(isExpanded: boolean) {
  sendEvent('toggle_usage_guide', {
    action: isExpanded ? 'expand' : 'collapse',
  });
}

/**
 * 追蹤首次載入提示關閉
 */
export function trackDismissFirstTimeNotice() {
  sendEvent('dismiss_first_time_notice', {
    timestamp: new Date().toISOString(),
  });
}

/**
 * 追蹤點擊關於我們
 */
export function trackViewAbout() {
  sendEvent('view_about', {
    timestamp: new Date().toISOString(),
  });
}

/**
 * 追蹤問題回報
 */
export function trackReportIssue() {
  sendEvent('report_issue', {
    timestamp: new Date().toISOString(),
  });
}
