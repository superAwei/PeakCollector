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

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import { getCurrentUserProfile, updateProfile, isUsernameAvailable } from '@/lib/profile';
import type { Profile } from '@/lib/types';
import { trackEditProfile, trackProfileComplete } from '@/lib/analytics';

// 強制動態渲染
export const dynamic = 'force-dynamic';

function ProfileEditContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  // 表單狀態
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [showInLeaderboard, setShowInLeaderboard] = useState(false);

  // 檢查是否為首次設定
  useEffect(() => {
    const firstTimeParam = searchParams.get('first_time');
    if (firstTimeParam === 'true') {
      setIsFirstTime(true);
    }
  }, [searchParams]);

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
          setShowInLeaderboard(profileData.show_in_leaderboard ?? false);
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
        display_name: displayName.trim() || undefined,
        bio: bio.trim() || undefined,
        is_public: isPublic,
        show_in_leaderboard: showInLeaderboard,
      });

      // 追蹤個人資料編輯事件
      trackEditProfile(isFirstTime);

      // 如果是首次設定，追蹤完成個人資料設定
      if (isFirstTime) {
        trackProfileComplete();
      }

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
          <div className="flex justify-center mb-4">
            <Image
              src="/weblogo.png"
              alt="PeakCollector Logo"
              width={96}
              height={96}
              className="w-20 h-20 sm:w-24 sm:h-24"
              priority
            />
          </div>
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
            <div className="flex-shrink-0">
              <Image
                src="/weblogo.png"
                alt="PeakCollector Logo"
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12"
                priority
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">編輯個人資料</h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">設定你的公開主頁資訊</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* 首次設定歡迎訊息 */}
        {isFirstTime && (
          <div className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-lg p-4 sm:p-6 animate-slide-up">
            <div className="flex items-start gap-3">
              <span className="text-3xl sm:text-4xl flex-shrink-0">👋</span>
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  歡迎來到 PeakCollector！
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
                  讓我們先設定你的個人資料，這樣你就可以：
                </p>
                <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>擁有專屬的公開主頁網址（例如：/@your_username）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>分享你的百岳收集進度給朋友</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>生成精美的 IG Stories 圖片和 QR Code</span>
                  </li>
                </ul>
                <p className="mt-3 text-xs sm:text-sm text-emerald-700 font-medium">
                  💡 系統已自動生成一個臨時使用者名稱，你可以修改成喜歡的名稱！
                </p>
              </div>
            </div>
          </div>
        )}

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

            {/* 隱私設定區塊 */}
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">隱私設定</h3>

              {/* 公開設定 */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="is_public"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <div className="flex-1">
                  <label htmlFor="is_public" className="text-sm text-gray-900 font-medium cursor-pointer">
                    公開我的主頁
                  </label>
                  <p className="text-xs text-gray-600 mt-0.5">
                    其他人可以透過你的專屬網址查看你的百岳收集進度
                  </p>
                </div>
              </div>

              {/* 排行榜設定 */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="show_in_leaderboard"
                  checked={showInLeaderboard}
                  onChange={(e) => setShowInLeaderboard(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <div className="flex-1">
                  <label htmlFor="show_in_leaderboard" className="text-sm text-gray-900 font-medium cursor-pointer">
                    在排行榜顯示我的真實名稱 🏆
                  </label>
                  <p className="text-xs text-gray-600 mt-0.5">
                    開啟後，你的名稱會顯示在排行榜上。未開啟時將以「山友 #ID」匿名顯示
                  </p>
                </div>
              </div>
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

// 包裝 Suspense（避免 useSearchParams 錯誤）
export default function ProfileEditPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/weblogo.png"
              alt="PeakCollector Logo"
              width={96}
              height={96}
              className="w-20 h-20 sm:w-24 sm:h-24"
              priority
            />
          </div>
          <div className="text-xl text-gray-600">載入中...</div>
        </div>
      </div>
    }>
      <ProfileEditContent />
    </Suspense>
  );
}
