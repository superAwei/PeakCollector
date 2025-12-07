<div align="center">

# ⛰️ PeakCollector

### 台灣百岳數位收藏網站

*記錄你的每一步登頂時刻，點亮屬於你的百岳地圖*

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[功能特色](#-功能特色) • [快速開始](#-快速開始) • [使用教學](#-使用教學) • [技術架構](#-技術架構) • [部署指南](#-部署指南)

</div>

---

## 📖 專案簡介

**PeakCollector** 是一個專為台灣登山愛好者打造的數位成就收藏平台。透過上傳你的 GPX 登山軌跡檔案，系統會自動驗證你是否真的登頂，並點亮相應的百岳徽章。

不需要註冊帳號，所有資料儲存在你的瀏覽器本地，完全保護你的隱私。無論你是剛開始挑戰百岳的新手，還是即將完成百岳的高手，PeakCollector 都能幫你記錄每一次的登頂成就！

### 🎯 為什麼選擇 PeakCollector？

- 🔐 **隱私優先**：資料儲存在本地，不上傳雲端
- 🎯 **精準驗證**：使用 Haversine 公式計算距離，100公尺內即算完成
- 🎨 **視覺化成就**：直覺的徽章系統，讓你的成就一目了然
- 📱 **跨裝置支援**：響應式設計，手機、平板、電腦都能完美使用
- ⚡ **極速體驗**：Next.js 16 + Turbopack 帶來飛快的載入速度

---

## ✨ 功能特色

### 📤 智能 GPX 上傳
- 支援拖放上傳，也可點擊選擇檔案
- 相容 Strava、健行筆記、Garmin 等主流 App 匯出的 GPX 格式
- 即時處理，秒級驗證

### 🔍 自動軌跡驗證
- 採用精準的 Haversine 地理距離計算公式
- 檢查軌跡點是否在山頂 100 公尺範圍內
- 一次上傳可驗證多座百岳

### 🏅 互動式徽章系統
- 未完成：灰階顯示 🗻
- 已完成：彩色漸變 + 動畫效果 ⛰️
- 新完成：特殊 "NEW!" 標記與跳動動畫

### 📊 即時進度追蹤
- 動態進度條顯示完成度
- 詳細統計：已完成、待挑戰、達成率
- 視覺化資訊卡片

### 💾 本地資料儲存
- 使用 localStorage 技術
- 無需註冊、登入
- 資料完全掌握在自己手中
- 重新整理頁面不會遺失進度

### 🎨 現代化 UI 設計
- 清新的 emerald/teal 漸變配色
- 流暢的過渡動畫
- 卡片式設計語言
- 直覺的操作體驗

---

## 🚀 快速開始

### 環境需求

- Node.js 18.0 或更高版本
- npm、yarn、pnpm 或 bun 套件管理器

### 安裝步驟

1. **克隆專案**
   ```bash
   git clone https://github.com/yourusername/peak-collector.git
   cd peak-collector
   ```

2. **安裝依賴**
   ```bash
   npm install
   # 或
   yarn install
   # 或
   pnpm install
   ```

3. **啟動開發伺服器**
   ```bash
   npm run dev
   # 或
   yarn dev
   # 或
   pnpm dev
   ```

4. **開啟瀏覽器**

   訪問 [http://localhost:3000](http://localhost:3000)

### 快速測試

專案內建測試 GPX 檔案，讓你立即體驗功能：

- `public/test-yushan.gpx` - 玉山主峰軌跡
- `public/test-multiple.gpx` - 玉山群峰（主峰、東峰、北峰）

只需將這些檔案拖放到上傳區域，即可看到徽章點亮！

---

## 📱 使用教學

### 步驟一：準備 GPX 檔案

從你常用的登山 App 匯出 GPX 檔案：

- **Strava**：活動頁面 → 更多 → 匯出 GPX
- **健行筆記**：軌跡記錄 → 下載 GPX
- **Garmin Connect**：活動 → 齒輪圖示 → 匯出為 GPX

### 步驟二：上傳軌跡

<div align="center">

![上傳示意圖](https://via.placeholder.com/600x300/10b981/ffffff?text=拖放+GPX+檔案到此處)

*將 GPX 檔案拖放到上傳區域，或點擊選擇檔案*

</div>

1. 開啟 PeakCollector 網站
2. 在左側找到「上傳 GPX 軌跡」區域
3. 拖放 GPX 檔案，或點擊選擇檔案
4. 等待系統自動驗證（通常只需幾秒鐘）

### 步驟三：查看結果

<div align="center">

![驗證成功](https://via.placeholder.com/600x150/10b981/ffffff?text=✅+恭喜！驗證成功完成+3+座百岳)

*驗證成功後會顯示完成的百岳名稱*

</div>

- ✅ **驗證成功**：顯示綠色訊息，列出完成的百岳
- 🎨 **徽章點亮**：對應的百岳徽章從灰色變成彩色
- 🆕 **NEW 標記**：新完成的徽章會有特殊標記（3秒後消失）
- 📊 **進度更新**：右側進度條和統計數據即時更新

### 步驟四：追蹤進度

<div align="center">

![進度統計](https://via.placeholder.com/600x200/06b6d4/ffffff?text=收集進度：15%20/%2020%20座%20(15%))

*即時顯示你的收集進度*

</div>

- 查看已完成、待挑戰、達成率
- 滾動查看所有百岳徽章
- 灰色徽章代表尚未完成，可作為未來目標

### 重置功能

需要重新開始？點擊右上角「重置進度」按鈕即可清除所有記錄。

---

## 🛠️ 技術架構

### 核心技術棧

```
┌─────────────────────────────────────────┐
│         Next.js 16 (App Router)         │  前端框架
├─────────────────────────────────────────┤
│         TypeScript 5.0                  │  類型安全
├─────────────────────────────────────────┤
│         Tailwind CSS 4.0                │  樣式方案
├─────────────────────────────────────────┤
│         React 19                        │  UI 函式庫
└─────────────────────────────────────────┘
```

### 專案結構

```
peak-collector/
│
├── 📁 app/                    # Next.js App Router
│   ├── page.tsx              # 主頁面
│   ├── layout.tsx            # 根布局
│   └── globals.css           # 全域樣式
│
├── 📁 components/            # React 組件
│   ├── PeakBadge.tsx        # 百岳徽章卡片
│   ├── GPXUploader.tsx      # GPX 上傳組件
│   └── ProgressStats.tsx    # 進度統計組件
│
├── 📁 lib/                   # 核心邏輯
│   ├── peaks-data.ts        # 百岳資料（20座）
│   ├── gpx-utils.ts         # GPX 解析與驗證
│   └── storage.ts           # localStorage 工具
│
└── 📁 public/               # 靜態資源
    ├── test-yushan.gpx      # 測試檔案
    └── test-multiple.gpx    # 測試檔案
```

### 核心演算法

#### 1. Haversine 距離計算

用於計算地球表面兩點之間的距離：

```typescript
export function calculateDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
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

  return R * c; // 返回距離（公尺）
}
```

#### 2. GPX 解析

使用瀏覽器內建的 `DOMParser` 解析 GPX XML 格式：

```typescript
export function parseGPX(gpxContent: string): GPXData {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(gpxContent, 'text/xml');

  // 解析軌跡點 <trkpt>
  const trkpts = xmlDoc.querySelectorAll('trkpt');
  // ... 提取經緯度、海拔、時間等資訊
}
```

#### 3. 驗證邏輯

檢查 GPX 軌跡是否經過山頂 100 公尺範圍：

```typescript
export function verifyPeakVisit(
  gpxData: GPXData,
  peak: Peak,
  threshold: number = 100
): boolean {
  for (const point of gpxData.points) {
    const distance = calculateDistance(
      point.latitude, point.longitude,
      peak.latitude, peak.longitude
    );
    if (distance <= threshold) return true;
  }
  return false;
}
```

### 資料結構

#### Peak（百岳資料）

```typescript
interface Peak {
  id: number;          // 排名（1-100）
  name: string;        // 山峰名稱
  altitude: number;    // 海拔（公尺）
  latitude: number;    // 緯度
  longitude: number;   // 經度
  description?: string; // 描述
}
```

#### CompletedPeak（完成記錄）

```typescript
interface CompletedPeak {
  peakId: number;       // 百岳 ID
  completedAt: string;  // 完成時間（ISO 8601）
  gpxFileName?: string; // GPX 檔案名稱
}
```

---

## 🎯 Demo 版本說明

目前為 **Demo 版本**，包含台灣百岳排名前 20 座：

| 排名 | 山峰 | 海拔 | 位置 |
|:---:|:---:|:---:|:---:|
| 1 | 玉山 | 3,952m | 南投、嘉義、高雄 |
| 2 | 雪山 | 3,886m | 台中、苗栗 |
| 3 | 玉山東峰 | 3,869m | 南投、高雄 |
| 4 | 玉山北峰 | 3,858m | 南投 |
| 5 | 玉山南峰 | 3,844m | 高雄、南投 |
| ... | ... | ... | ... |
| 20 | 南湖北山 | 3,536m | 台中、花蓮 |

完整版本可擴展至全部 **100 座百岳**。

---

## 💻 本地開發指南

### 開發指令

```bash
# 啟動開發伺服器（支援 Hot Reload）
npm run dev

# 建置生產版本
npm run build

# 啟動生產伺服器
npm start

# 執行 ESLint 檢查
npm run lint
```

### 新增百岳資料

編輯 `lib/peaks-data.ts`：

```typescript
export const PEAKS: Peak[] = [
  // ... 現有資料
  {
    id: 21,
    name: '新增的百岳',
    altitude: 3500,
    latitude: 24.1234,
    longitude: 121.5678,
    description: '山峰描述'
  }
];
```

### 調整驗證閾值

修改 `lib/gpx-utils.ts` 中的預設值：

```typescript
// 將 100 公尺改為其他數值
export function verifyPeakVisit(
  gpxData: GPXData,
  peak: Peak,
  threshold: number = 150  // 改為 150 公尺
): boolean {
  // ...
}
```

### 除錯技巧

開啟瀏覽器開發者工具：

- **Console**：查看驗證過程的 log
- **Application > Local Storage**：查看儲存的進度資料
- **Network**：檢查資源載入狀況

---

## 🚀 部署指南

### Vercel 部署（推薦）

PeakCollector 完美支援 Vercel 一鍵部署：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/peak-collector)

**手動部署步驟：**

1. 安裝 Vercel CLI
   ```bash
   npm install -g vercel
   ```

2. 登入並部署
   ```bash
   vercel login
   vercel
   ```

3. 按照提示完成部署

### Netlify 部署

1. 連接你的 GitHub 儲存庫
2. 設定建置指令：
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
3. 點擊 Deploy

### Docker 部署

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

建置並執行：

```bash
docker build -t peak-collector .
docker run -p 3000:3000 peak-collector
```

### 環境變數

目前專案不需要設定環境變數，但未來若要整合第三方服務可在 `.env.local` 設定：

```env
# 範例：Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

---

## 🔮 未來規劃

### 短期目標（1-3 個月）

- [ ] 🗺️ 完整 100 座百岳資料與座標
- [ ] 📸 新增登頂照片上傳功能
- [ ] 🌐 支援 GPX 檔案預覽與地圖顯示
- [ ] 📤 匯出個人成就報告（PDF）
- [ ] 🎨 更多徽章樣式與主題

### 中期目標（3-6 個月）

- [ ] 👤 使用者帳號系統（Firebase / Supabase）
- [ ] ☁️ 雲端資料同步，跨裝置存取
- [ ] 🤝 社群功能：分享成就、追蹤好友
- [ ] 📊 進階統計：爬升高度、登山天數、最愛山峰
- [ ] 🏆 成就系統：完成特定挑戰解鎖徽章

### 長期目標（6-12 個月）

- [ ] 🗺️ 整合地形圖與即時天氣預報
- [ ] 🧭 登山路線推薦系統
- [ ] 📱 開發原生 App（React Native）
- [ ] 🌏 擴展至其他國家的高山收集
- [ ] 🎮 遊戲化機制：經驗值、等級、排行榜
- [ ] 🤖 AI 智慧助手：路線規劃、風險評估

---

## 🤝 參與貢獻

我們歡迎所有形式的貢獻！無論是回報 bug、建議新功能，或是提交程式碼。

### 如何貢獻

1. **Fork 專案**
2. **建立功能分支** (`git checkout -b feature/AmazingFeature`)
3. **提交變更** (`git commit -m 'Add some AmazingFeature'`)
4. **推送到分支** (`git push origin feature/AmazingFeature`)
5. **開啟 Pull Request**

### 回報問題

發現 bug 或有功能建議？歡迎在 [Issues](https://github.com/yourusername/peak-collector/issues) 頁面提出。

### 開發規範

- 遵循 TypeScript 嚴格模式
- 使用 ESLint 進行程式碼檢查
- 撰寫清晰的 commit message
- 新功能需附上說明文件

---

## 📄 授權聲明

本專案採用 **MIT License** 授權。

```
MIT License

Copyright (c) 2024 PeakCollector

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

詳見 [LICENSE](LICENSE) 檔案。

---

## 📞 聯絡資訊

- **專案網址**：[https://peak-collector.vercel.app](https://peak-collector.vercel.app)
- **GitHub**：[https://github.com/yourusername/peak-collector](https://github.com/yourusername/peak-collector)
- **問題回報**：[GitHub Issues](https://github.com/yourusername/peak-collector/issues)

---

## 🙏 致謝

- 感謝所有台灣百岳的登山前輩，為我們開闢了這些美麗的路線
- 感謝開源社群提供的優秀工具與函式庫
- 特別感謝 [Next.js](https://nextjs.org/)、[Tailwind CSS](https://tailwindcss.com/) 團隊

---

## ⭐ Star History

如果這個專案對你有幫助，歡迎給我們一個 Star ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/peak-collector&type=Date)](https://star-history.com/#yourusername/peak-collector&Date)

---

<div align="center">

### 🏔️ 開始你的百岳收集之旅吧！

**PeakCollector** - 記錄每一次登頂的榮耀時刻

Made with ❤️ by climbers, for climbers

[開始使用](http://localhost:3000) • [查看文檔](#) • [加入社群](#)

</div>
