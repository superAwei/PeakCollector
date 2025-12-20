# 🏔️ PeakCollector - 台灣百岳數位護照

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/superAwei/PeakCollector)

## 🌐 線上網址

**正式網站：** [https://peak-collector-qchi.vercel.app](https://peak-collector-qchi.vercel.app)

## 📱 功能特色

- ✅ Google OAuth 登入
- ✅ GPX 軌跡檔案驗證
- ✅ 手動標記百岳完成記錄
- ✅ 個人公開主頁 (/@username)
- ✅ 分享與匯出功能（海報、QR Code、PDF）
- ✅ 完整的 100 座台灣百岳資料
- ✅ Supabase 雲端同步
- ✅ 響應式設計（手機/平板/電腦）

## 🚀 技術棧

- **前端框架：** Next.js 16 (App Router)
- **樣式：** Tailwind CSS
- **資料庫：** Supabase (PostgreSQL)
- **認證：** Supabase Auth (Google OAuth)
- **部署：** Vercel
- **語言：** TypeScript

## 📦 本地開發

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build
```

## 🔑 環境變數

需要在 `.env.local` 設定：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📄 授權

MIT License

---

**開發者：** [@superAwei](https://github.com/superAwei)

**專案連結：** [https://github.com/superAwei/PeakCollector](https://github.com/superAwei/PeakCollector)
