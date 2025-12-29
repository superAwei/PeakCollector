import { Peak } from './peaks-data';

/**
 * 徽章風格類型
 * 根據山脈分類，每種風格對應不同的視覺設計
 */
export type BadgeStyle =
  | 'yushan'         // 玉山山脈 - 紅褐岩石風格
  | 'xueshan'        // 雪山山脈 - 藍白雪景風格
  | 'central-north'  // 中央北段 - 深綠森林風格
  | 'central-mid'    // 中央中段 - 灰綠草原風格
  | 'central-south'; // 中央南段 - 金黃草坡風格

/**
 * 根據山峰資料自動決定徽章風格
 * 使用緯度自動區分中央山脈的北/中/南段
 *
 * 分類邏輯：
 * - 玉山山脈：直接對應
 * - 雪山山脈：直接對應
 * - 中央山脈北段：緯度 >= 24.5° (宜蘭、南投北部)
 * - 中央山脈中段：23.5° <= 緯度 < 24.5° (花蓮、南投)
 * - 中央山脈南段：緯度 < 23.5° (高雄、台東)
 */
export function getBadgeStyle(peak: Peak): BadgeStyle {
  // 玉山山脈
  if (peak.range === '玉山山脈') {
    return 'yushan';
  }

  // 雪山山脈
  if (peak.range === '雪山山脈') {
    return 'xueshan';
  }

  // 中央山脈 - 用緯度細分
  if (peak.range === '中央山脈') {
    if (peak.latitude >= 24.5) {
      return 'central-north';  // 北段
    }
    if (peak.latitude >= 23.5) {
      return 'central-mid';    // 中段
    }
    return 'central-south';    // 南段
  }

  // 預設（理論上不會執行到）
  return 'central-mid';
}

/**
 * 取得徽章圖片路徑
 * @param style 徽章風格
 * @returns 圖片的公開路徑
 */
export function getBadgeImagePath(style: BadgeStyle): string {
  return `/badges/${style}.png`;
}

/**
 * 取得徽章風格的中文名稱
 * 用於圖片 alt 屬性，提升 SEO 和無障礙體驗
 */
export function getBadgeStyleName(style: BadgeStyle): string {
  const names: Record<BadgeStyle, string> = {
    'yushan': '玉山山脈',
    'xueshan': '雪山山脈',
    'central-north': '中央山脈北段',
    'central-mid': '中央山脈中段',
    'central-south': '中央山脈南段',
  };
  return names[style];
}
