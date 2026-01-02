import { Peak } from './peaks-data';

/**
 * 徽章風格類型
 * 根據山脈和地理特徵分類，每種風格對應不同的視覺設計
 */
export type BadgeStyle =
  | 'yushan'         // 玉山山脈
  | 'xueshan'        // 雪山山脈
  | 'central-north'  // 中央北段
  | 'central-mid'    // 中央中段
  | 'central-south'  // 中央南段
  | 'qilai'          // 奇萊連峰
  | 'volcano'        // 火山群峰
  | 'flower'         // 花蓮山區
  | 'shengling'      // 聖稜線
  | 'ocean'          // 海岸山脈
  | 'wuling'         // 武陵四秀

/**
 * 根據山峰資料決定徽章風格
 * 優先使用山峰資料中的 badgeStyle 屬性
 */
export function getBadgeStyle(peak: Peak): BadgeStyle {
  // 優先使用預設的 badgeStyle
  if (peak.badgeStyle) {
    return peak.badgeStyle;
  }

  // 備用邏輯：根據山脈自動決定（向下相容）
  if (peak.range === '玉山山脈') {
    return 'yushan';
  }

  if (peak.range === '雪山山脈') {
    return 'xueshan';
  }

  if (peak.range === '中央山脈') {
    if (peak.latitude >= 24.5) {
      return 'central-north';
    }
    if (peak.latitude >= 23.5) {
      return 'central-mid';
    }
    return 'central-south';
  }

  // 預設
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
    'qilai': '奇萊連峰',
    'volcano': '火山群峰',
    'flower': '花蓮山區',
    'shengling': '聖稜線',
    'ocean': '海岸山脈',
    'wuling': '武陵四秀',
  };
  return names[style];
}
