/**
 * 關於我們頁面
 *
 * 介紹 PeakCollector 的故事、理念、團隊
 * 溫暖親切的設計風格，增加用戶信任感
 */

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '關於我們 | PeakCollector - 台灣百岳數位護照',
  description: '了解 PeakCollector 的故事，為什麼我們要做台灣百岳記錄平台。讓每一步登頂都值得被記錄。',
  openGraph: {
    title: '關於 PeakCollector',
    description: '每一步登頂，都值得被記錄。了解我們為台灣登山者打造數位百岳收集平台的故事。',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors min-h-[44px] px-2 -ml-2 flex items-center"
              aria-label="返回首頁"
            >
              ← <span className="ml-1">返回首頁</span>
            </Link>
            <div className="text-3xl sm:text-4xl flex-shrink-0">⛰️</div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">關於我們</h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">About PeakCollector</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Hero Section */}
        <article className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12 mb-6 sm:mb-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="text-5xl sm:text-6xl mb-4">🏔️</div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              每一步登頂，都值得被記錄
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
              你還記得第一次站在百岳山頂的感動嗎？
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              那份征服山峰的成就感、360 度環繞的壯闊山景、還有下山後想跟所有人分享的喜悅——這些珍貴的回憶，值得被好好保存。
            </p>
          </div>
        </article>

        {/* Story Section */}
        <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-6 flex items-center gap-3">
            <span className="text-3xl">🤔</span>
            <span>為什麼做這個網站？</span>
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p className="text-lg">
              我和你一樣，熱愛登山。
            </p>

            <p>
              在爬山的過程中，我發現一個奇怪的現象：台灣有這麼多人在挑戰百岳，但卻沒有一個專門記錄百岳進度的平台。
            </p>

            <p>
              有人用 Excel 表格打勾、有人在筆記本上手寫、有人靠記憶力硬記⋯⋯但這些方式都太分散、太不直覺了。
            </p>

            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-500 p-4 sm:p-6 rounded-r-lg my-6">
              <p className="font-medium text-gray-800 mb-3">我想：</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-1">✓</span>
                  <span>為什麼不能像收集寶可夢一樣，收集百岳？</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-1">✓</span>
                  <span>為什麼不能有漂亮的視覺化進度？</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-1">✓</span>
                  <span>為什麼不能輕鬆分享給朋友炫耀？</span>
                </li>
              </ul>
            </div>

            <p className="text-lg font-semibold text-emerald-700">
              於是，PeakCollector 誕生了。
            </p>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-6 text-center">
            我們的理念
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow-md border-2 border-emerald-100 p-6 hover:shadow-lg hover:border-emerald-300 transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">讓記錄變簡單</h3>
              <p className="text-gray-600 leading-relaxed">
                上傳 GPX 軌跡，系統自動幫你驗證。不用手動輸入，不用擔心記錯。
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow-md border-2 border-teal-100 p-6 hover:shadow-lg hover:border-teal-300 transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">讓成就被看見</h3>
              <p className="text-gray-600 leading-relaxed">
                每完成一座百岳，就點亮一個徽章。視覺化的進度，讓你的努力一目了然。
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow-md border-2 border-blue-100 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">讓回憶能分享</h3>
              <p className="text-gray-600 leading-relaxed">
                專屬的公開主頁、精美的分享圖，讓你的登山故事傳得更遠。
              </p>
            </div>
          </div>
        </section>

        {/* Future Section */}
        <section className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 mb-6 sm:mb-8 text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 flex items-center gap-3">
            <span className="text-3xl">🚀</span>
            <span>這只是開始</span>
          </h2>

          <div className="space-y-4 leading-relaxed">
            <p className="text-emerald-50">
              這個網站還很年輕，功能也還在持續優化中。
            </p>

            <p className="text-emerald-50">
              如果你在使用過程中遇到任何問題，或是有任何建議，都非常歡迎告訴我們！
            </p>

            <p className="text-emerald-50">
              也許你知道其他類似的平台？沒關係，歡迎分享給我們，讓我們一起把台灣的登山社群做得更好。
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-emerald-400">
            <p className="text-xl font-bold text-white text-center">
              一起收集屬於你的百岳地圖吧！ ⛰️
            </p>
            <p className="text-emerald-100 text-center mt-2">
              — PeakCollector 團隊
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-6 flex items-center gap-3">
            <span className="text-3xl">💬</span>
            <span>聯絡我們</span>
          </h2>

          <p className="text-gray-700 mb-6 leading-relaxed">
            有任何問題或建議嗎？我們很樂意聽到你的聲音：
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-2xl">📧</span>
              <div>
                <div className="font-semibold text-gray-900">Email</div>
                <a
                  href="mailto:contact@peakcollector.tw"
                  className="text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  contact@peakcollector.tw
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-2xl">📱</span>
              <div>
                <div className="font-semibold text-gray-900">問題回報</div>
                <a
                  href="https://github.com/superAwei/PeakCollector/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  點此填寫回饋表單 →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Open Source Section */}
        <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-6 flex items-center gap-3">
            <span className="text-3xl">💻</span>
            <span>開源專案</span>
          </h2>

          <p className="text-gray-700 mb-6 leading-relaxed">
            PeakCollector 是一個開源專案，技術愛好者歡迎一起貢獻！
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-r from-gray-50 to-emerald-50 rounded-lg border border-emerald-200">
              <div className="font-semibold text-gray-900 mb-2">GitHub</div>
              <a
                href="https://github.com/superAwei/PeakCollector"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-700 hover:underline text-sm break-all"
              >
                github.com/superAwei/PeakCollector →
              </a>
            </div>

            <div className="p-4 bg-gradient-to-r from-gray-50 to-teal-50 rounded-lg border border-teal-200">
              <div className="font-semibold text-gray-900 mb-2">技術棧</div>
              <p className="text-gray-600 text-sm">
                Next.js 16 + React 19 + Supabase + TypeScript
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            開始記錄你的百岳 🏔️
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">© 2024 PeakCollector. All rights reserved.</p>
            <p className="text-xs">
              Made with ❤️ for Taiwan mountain lovers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
