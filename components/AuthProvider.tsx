/**
 * AuthProvider - 全域登入狀態管理
 *
 * 這個組件會：
 * 1. 監聽 Supabase Auth 狀態變化
 * 2. 在使用者登入後自動遷移 localStorage 資料
 * 3. 提供登入狀態給所有子組件
 */

'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { migrateFromLocalStorage, hasLegacyData } from '@/lib/storage';
import type { User } from '@/lib/types';

// 定義 Context 型別
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// 建立 Context
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

// 自訂 Hook：使用 Auth Context
export function useAuth() {
  return useContext(AuthContext);
}

// AuthProvider 組件
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false); // 修正 Hydration 問題
  const migrationAttemptedRef = useRef(false); // 使用 useRef 避免觸發重新渲染

  // 修正 Hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return; // 等待 client-side mount
    // 初始化：取得目前使用者
    const initAuth = async () => {
      try {
        console.log('🔧 初始化 Auth...');
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);

        // 如果使用者已登入，檢查是否需要遷移 localStorage 資料
        if (currentUser && hasLegacyData() && !migrationAttemptedRef.current) {
          console.log('🔄 發現 localStorage 舊資料，開始遷移...');
          migrationAttemptedRef.current = true; // 標記已嘗試遷移

          try {
            const result = await migrateFromLocalStorage();
            console.log('📊 遷移結果:', result);

            if (result.success) {
              console.log(`✅ 成功遷移 ${result.migratedCount} 筆記錄`);
              if (result.skippedCount > 0) {
                console.log(`⏭️ 跳過 ${result.skippedCount} 筆已存在的記錄`);
              }
            } else {
              console.error('❌ 遷移失敗:', result.errors);
              // 即使遷移失敗，也繼續進入主頁面（不要卡住）
            }
          } catch (migrationError) {
            console.error('❌ 遷移過程發生錯誤:', migrationError);
            // 即使遷移出錯，也繼續進入主頁面
          }
        }
      } catch (error) {
        console.error('❌ 初始化 Auth 失敗:', error);
      } finally {
        console.log('✅ Auth 初始化完成，設定 loading = false');
        setLoading(false);
      }
    };

    initAuth();

    // 監聽 Auth 狀態變化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth 狀態變化:', event);

        if (session?.user) {
          setUser(session.user);

          // 登入成功後，嘗試遷移 localStorage 資料（只在首次登入時）
          if (event === 'SIGNED_IN' && hasLegacyData() && !migrationAttemptedRef.current) {
            console.log('🔄 登入後發現 localStorage 舊資料，開始遷移...');
            migrationAttemptedRef.current = true; // 標記已嘗試遷移

            try {
              const result = await migrateFromLocalStorage();
              console.log('📊 遷移結果:', result);

              if (result.success && result.migratedCount > 0) {
                console.log(`✅ 成功遷移 ${result.migratedCount} 筆記錄，刷新頁面...`);
                // 延遲 500ms 後刷新，確保資料已儲存
                setTimeout(() => {
                  window.location.reload();
                }, 500);
              } else if (result.success) {
                console.log('⏭️ 沒有需要遷移的新資料');
              } else {
                console.error('❌ 遷移失敗:', result.errors);
                // 即使遷移失敗，也繼續使用（不要卡住）
              }
            } catch (migrationError) {
              console.error('❌ 遷移過程發生錯誤:', migrationError);
              // 即使遷移出錯，也繼續使用
            }
          }
        } else {
          setUser(null);

          // 登出後重導向到登入頁面
          if (event === 'SIGNED_OUT') {
            router.push('/login');
          }
        }
      }
    );

    // 清理 subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [router, isMounted]); // 加入 isMounted，確保 client mount 後會重新執行

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
