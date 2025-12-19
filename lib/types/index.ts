/**
 * 型別定義統一匯出
 *
 * 使用方式：
 * import { User, CompletedPeak, Profile } from '@/lib/types';
 */

// 匯出資料庫型別
export type {
  User,
  Profile,
  CompletedPeak,
  CompletedPeakRecord,
  CompletedPeakInsert,
  StravaConnection,
  DatabaseError,
  ApiResponse,
  LegacyCompletedPeak,
  MigrationResult,
} from './database';

// 匯出常數
export { TABLE_NAMES } from './database';

// 匯出現有的 Peak 型別（從 peaks-data.ts）
export type { Peak } from '../peaks-data';
