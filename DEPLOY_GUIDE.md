# 🚀 部署指南

## 準備完成！✅

你的專案已經準備好推送到 GitHub 了！

---

## 📋 下一步操作

### 步驟 1：在 GitHub 建立新的 Repository

1. 訪問 **https://github.com/new**
2. 填寫資訊：
   - **Repository name**: `PeakCollector`
   - **Description**: `台灣百岳數位收藏網站 - 上傳 GPX 軌跡，點亮你的登山成就徽章 🏔️`
   - **Visibility**: 選擇 `Public`（公開）或 `Private`（私人）
   - **不要勾選** "Initialize this repository with:"（已經有檔案了）
3. 點擊 **Create repository**

---

### 步驟 2：推送程式碼到 GitHub

在終端機執行以下指令：

```bash
cd /Users/awei/Desktop/peak-collector

# 連結到你的 GitHub Repository
git remote add origin https://github.com/你的GitHub帳號/PeakCollector.git

# 推送程式碼
git push -u origin main
```

**注意**：記得把 `你的GitHub帳號` 替換成你的實際帳號！

---

### 步驟 3：部署到 Vercel（推薦）

#### 方法一：一鍵部署（最簡單）

1. 訪問 **https://vercel.com/new**
2. 選擇 "Import Git Repository"
3. 選擇你剛建立的 `PeakCollector` repository
4. 點擊 **Deploy**
5. 等待部署完成（約 1-2 分鐘）
6. 你會得到一個網址：`https://peak-collector.vercel.app`

#### 方法二：使用 Vercel CLI

```bash
# 安裝 Vercel CLI（如果還沒安裝）
npm install -g vercel

# 登入 Vercel
vercel login

# 部署到生產環境
vercel --prod
```

---

### 步驟 4：設定自訂網域（選用）

在 Vercel 專案設定中：

1. 點擊 **Settings** → **Domains**
2. 輸入你的網域名稱
3. 按照指示設定 DNS

---

## 🎉 完成！你會得到

### ✅ GitHub Repository
- **網址**: `https://github.com/你的帳號/PeakCollector`
- **特色**:
  - ⭐ 完整的專案說明（README.md）
  - 📄 MIT 開源授權
  - 📚 詳細的使用文檔
  - 🧪 內建測試檔案
  - 💻 專業的程式碼結構

### ✅ 線上網站
- **Vercel 網址**: `https://peak-collector.vercel.app`
- **特色**:
  - ⚡ 極速載入（Vercel Edge Network）
  - 🌍 全球 CDN 加速
  - 🔄 自動部署（推送新程式碼即自動更新）
  - 📊 內建分析工具
  - 🔒 免費 SSL 憑證

### ✅ 專業形象
- 可以放在履歷或作品集
- 展示你的全端開發能力
- 開源專案貢獻記錄

---

## 📊 其他部署選項

### GitHub Pages

```bash
# 安裝 gh-pages
npm install --save-dev gh-pages

# 在 package.json 新增 scripts
"deploy": "next build && next export && gh-pages -d out"

# 部署
npm run deploy
```

網址：`https://你的帳號.github.io/PeakCollector`

### Netlify

1. 訪問 **https://app.netlify.com/start**
2. 選擇 GitHub repository
3. 設定：
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
4. 點擊 **Deploy site**

---

## 🛠️ 常見問題

### Q: 推送失敗，顯示 "Permission denied"
**A**: 需要設定 GitHub SSH key 或使用 Personal Access Token

```bash
# 使用 HTTPS + Token
git remote set-url origin https://TOKEN@github.com/帳號/PeakCollector.git
```

### Q: Vercel 部署失敗
**A**: 檢查：
1. Node.js 版本是否 >= 18
2. `package.json` 中的 scripts 是否正確
3. 查看 Vercel 部署日誌找出錯誤

### Q: 如何更新網站內容？
**A**: 只需推送新程式碼，Vercel 會自動重新部署

```bash
git add .
git commit -m "更新內容"
git push
```

---

## 📞 需要幫助？

- **GitHub Issues**: 在你的 repo 建立 Issue
- **Vercel 文檔**: https://vercel.com/docs
- **Next.js 文檔**: https://nextjs.org/docs

---

## 🎯 檢查清單

部署前確認：

- [ ] ✅ Git 已提交所有變更
- [ ] ✅ GitHub Repository 已建立
- [ ] ✅ 程式碼已推送到 GitHub
- [ ] ✅ Vercel 部署成功
- [ ] ✅ 網站可以正常訪問
- [ ] ✅ GPX 上傳功能正常
- [ ] ✅ 徽章點亮功能正常
- [ ] ✅ 進度儲存功能正常

---

## 🌟 下一步

1. 在 GitHub repo 新增話題標籤：
   - `taiwan`
   - `hiking`
   - `gpx`
   - `nextjs`
   - `typescript`

2. 建立 GitHub Actions 自動化測試

3. 新增 CONTRIBUTING.md 貢獻指南

4. 設定 GitHub Discussions 讓使用者討論

5. 申請加入 awesome-taiwan 清單

---

<div align="center">

### 🎊 恭喜！你的專案已經上線了！

**開始分享你的作品吧！** 🚀

Made with ❤️ for Taiwan hikers

</div>
