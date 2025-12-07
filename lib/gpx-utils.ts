import { Peak } from './peaks-data';

export interface GPXPoint {
  latitude: number;
  longitude: number;
  elevation?: number;
  time?: string;
}

export interface GPXData {
  points: GPXPoint[];
  trackName?: string;
}

/**
 * 計算兩個經緯度座標之間的距離（使用 Haversine 公式）
 * @returns 距離（公尺）
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // 地球半徑（公尺）
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * 解析 GPX 檔案內容
 */
export function parseGPX(gpxContent: string): GPXData {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(gpxContent, 'text/xml');

  // 檢查解析錯誤
  const parseError = xmlDoc.querySelector('parsererror');
  if (parseError) {
    throw new Error('無效的 GPX 檔案格式');
  }

  const points: GPXPoint[] = [];
  let trackName: string | undefined;

  // 取得軌跡名稱
  const nameElement = xmlDoc.querySelector('trk > name');
  if (nameElement) {
    trackName = nameElement.textContent || undefined;
  }

  // 解析軌跡點
  const trkpts = xmlDoc.querySelectorAll('trkpt');
  trkpts.forEach((trkpt) => {
    const lat = parseFloat(trkpt.getAttribute('lat') || '0');
    const lon = parseFloat(trkpt.getAttribute('lon') || '0');
    const eleElement = trkpt.querySelector('ele');
    const timeElement = trkpt.querySelector('time');

    points.push({
      latitude: lat,
      longitude: lon,
      elevation: eleElement ? parseFloat(eleElement.textContent || '0') : undefined,
      time: timeElement ? timeElement.textContent || undefined : undefined,
    });
  });

  if (points.length === 0) {
    throw new Error('GPX 檔案中沒有找到軌跡點');
  }

  return { points, trackName };
}

/**
 * 驗證 GPX 軌跡是否經過指定的山峰
 * @param gpxData GPX 資料
 * @param peak 山峰資料
 * @param threshold 距離閾值（公尺），預設 100 公尺
 * @returns 是否通過驗證
 */
export function verifyPeakVisit(
  gpxData: GPXData,
  peak: Peak,
  threshold: number = 100
): boolean {
  for (const point of gpxData.points) {
    const distance = calculateDistance(
      point.latitude,
      point.longitude,
      peak.latitude,
      peak.longitude
    );

    if (distance <= threshold) {
      return true;
    }
  }

  return false;
}

/**
 * 檢查 GPX 軌跡經過了哪些山峰
 * @param gpxData GPX 資料
 * @param peaks 山峰列表
 * @param threshold 距離閾值（公尺），預設 100 公尺
 * @returns 經過的山峰 ID 列表
 */
export function findVisitedPeaks(
  gpxData: GPXData,
  peaks: Peak[],
  threshold: number = 100
): number[] {
  const visitedPeakIds: number[] = [];

  for (const peak of peaks) {
    if (verifyPeakVisit(gpxData, peak, threshold)) {
      visitedPeakIds.push(peak.id);
    }
  }

  return visitedPeakIds;
}

/**
 * 讀取檔案為文字內容
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('無法讀取檔案'));
      }
    };
    reader.onerror = () => reject(new Error('檔案讀取失敗'));
    reader.readAsText(file);
  });
}
