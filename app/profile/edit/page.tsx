/**
 * 個人資料編輯頁面
 *
 * 讓使用者可以編輯：
 * - username（使用者名稱）
 * - display_name（顯示名稱）
 * - bio（個人簡介）
 * - is_public（是否公開主頁）
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { getCurrentUserProfile, updateProfile, isUsernameAvailable } from '@/lib/profile';
import type { Profile } from '@/lib/types';

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 表單狀態
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  // 載入 profile
  useEffect(() => {
    async function loadProfile() {
      if (!authLoading && !user) {
        router.push('/login');
        return;
      }

      if (user) {
        const profileData = await getCurrentUserProfile();
        if (profileData) {
          setProfile(profileData);
          setUsername(profileData.username);
          setDisplayName(profileData.display_name || '');
          setBio(profileData.bio || '');
          setIsPublic(profileData.is_public ?? true);
        }
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [user, authLoading, router]);

  // 處理儲存
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // 驗證
    if (!username.trim()) {
      setError('使用者名稱不能空白');
      return;
    }

    if (username.length < 3) {
      setError('使用者名稱至少需要 3 個字元');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('使用者名稱只能包含英文、數字和底線');
      return;
    }

    try {
      setIsSaving(true);

      // 檢查 username 是否可用（如果有修改）
      if (profile && username !== profile.username) {
        const available = await isUsernameAvailable(username);
        if (!available) {
          setError('此使用者名稱已被使用');
          setIsSaving(false);
          return;
        }
      }

      // 更新 profile
      await updateProfile({
        username,
        display_name: displayName.trim() || null,
        bio: bio.trim() || null,
        is_public: isPublic,
      });

      setSuccess(true);

      // 3 秒後跳轉到公開主頁
      setTimeout(() => {
        router.push(`/@${username}`);
      }, 2000);
    } catch (err) {
      console.error('儲存失敗:', err);
      setError(err instanceof Error ? err.message : '儲存失敗，請稍後再試');
    } finally {
      setIsSaving(false);
    }
  };

  // Loading 狀態
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⛰️</div>
          <div className="text-xl text-gray-600">載入中...</div>
        </div>
      </div>
    );
  }

  // 未登入
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 transition-colors min-h-[44px] px-2 -ml-2 flex items-center"
              aria-label="返回"
            >
              ← <span className="hidden sm:inline ml-1">返回</span>
            </button>
            <div className="text-3xl sm:text-4xl flex-shrink-0">⛰️</div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">編輯個人資料</h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">設定你的公開主頁資訊</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 使用者名稱 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                使用者名稱 *
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 font-medium"
                  placeholder="your_username"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                你的公開主頁網址：peakcollector.com/@{username || 'username'}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                只能使用英文、數字和底線，至少 3 個字元
              </p>
            </div>

            {/* 顯示名稱 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                顯示名稱
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 font-medium"
                placeholder="你的名字"
              />
              <p className="mt-1 text-xs text-gray-500">
                在你的主頁上顯示的名稱（可使用中文）
              </p>
            </div>

            {/* 個人簡介 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                個人簡介
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 font-medium"
                placeholder="介紹一下自己的登山經歷..."
                maxLength={200}
              />
              <p className="mt-1 text-xs text-gray-500">
                {bio.length} / 200 字元
              </p>
            </div>

            {/* 公開設定 */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_public"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <label htmlFor="is_public" className="text-sm text-gray-700">
                公開我的主頁（其他人可以查看我的百岳收集進度）
              </label>
            </div>

            {/* 錯誤訊息 */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* 成功訊息 */}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">
                  ✅ 儲存成功！即將跳轉到你的公開主頁...
                </p>
              </div>
            )}

            {/* 按鈕 */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-auto px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] font-medium"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] font-medium"
              >
                {isSaving ? '儲存中...' : '儲存'}
              </button>
            </div>
          </form>
        </div>

        {/* 預覽提示 */}
        {username && (
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
              💡 儲存後，你可以將 <strong>/@{username}</strong> 分享給朋友
              <span className="hidden sm:inline">，展示你的百岳收集進度</span>！
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
