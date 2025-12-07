const STORAGE_KEY = 'peak-collector-completed-peaks';

export interface CompletedPeak {
  peakId: number;
  completedAt: string; // ISO 8601 日期字串
  gpxFileName?: string;
}

/**
 * 取得已完成的百岳記錄
 */
export function getCompletedPeaks(): CompletedPeak[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored) as CompletedPeak[];
  } catch (error) {
    console.error('讀取已完成百岳記錄失敗:', error);
    return [];
  }
}

/**
 * 取得已完成的百岳 ID 列表
 */
export function getCompletedPeakIds(): number[] {
  return getCompletedPeaks().map((record) => record.peakId);
}

/**
 * 儲存新完成的百岳記錄
 */
export function saveCompletedPeaks(
  peakIds: number[],
  gpxFileName?: string
): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const existingRecords = getCompletedPeaks();
    const existingIds = new Set(existingRecords.map((r) => r.peakId));
    const now = new Date().toISOString();

    // 只添加尚未記錄的百岳
    const newRecords: CompletedPeak[] = peakIds
      .filter((id) => !existingIds.has(id))
      .map((id) => ({
        peakId: id,
        completedAt: now,
        gpxFileName,
      }));

    if (newRecords.length > 0) {
      const updatedRecords = [...existingRecords, ...newRecords];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
    }
  } catch (error) {
    console.error('儲存已完成百岳記錄失敗:', error);
    throw error;
  }
}

/**
 * 清除所有記錄（用於重置）
 */
export function clearCompletedPeaks(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('清除記錄失敗:', error);
  }
}

/**
 * 檢查某座百岳是否已完成
 */
export function isPeakCompleted(peakId: number): boolean {
  return getCompletedPeakIds().includes(peakId);
}
