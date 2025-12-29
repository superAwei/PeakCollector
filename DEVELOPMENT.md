# PeakCollector 開發指南

## 🌿 分支策略

### 分支說明

```
main (正式環境)
  ├─ https://peak-collector-qchi.vercel.app
  └─ 穩定版本，對外公開

develop (開發環境)
  ├─ https://peak-collector-qchi-git-develop-xxx.vercel.app
  └─ 開發測試版本

feature/* (功能分支)
  └─ 新功能開發
```

---

## 🚀 日常開發流程

### 開發新功能

```bash
# 1. 切換到 develop 分支
git checkout develop
git pull origin develop

# 2. 建立功能分支（可選）
git checkout -b feature/新功能名稱

# 3. 開發並測試
# ... 寫程式 ...

# 4. 提交變更
git add .
git commit -m "描述你的變更"

# 5. 推送到 develop
git checkout develop
git merge feature/新功能名稱  # 如果有建立功能分支
git push origin develop

# 6. Vercel 會自動部署 develop 預覽版本
# 測試網址：https://peak-collector-qchi-git-develop-xxx.vercel.app
```

### 發布到正式環境

```bash
# 確認 develop 分支穩定後

# 1. 切換到 main
git checkout main
git pull origin main

# 2. 合併 develop
git merge develop

# 3. 推送到正式環境
git push origin main

# 4. Vercel 自動部署到正式網站
# https://peak-collector-qchi.vercel.app
```

---

## 🐛 緊急 Bug 修復

如果正式網站有緊急 bug：

```bash
# 1. 從 main 建立 hotfix 分支
git checkout main
git checkout -b hotfix/bug描述

# 2. 修復 bug
# ... 寫程式 ...

# 3. 提交並合併回 main
git add .
git commit -m "🐛 緊急修復: bug描述"
git checkout main
git merge hotfix/bug描述
git push origin main

# 4. 同步回 develop
git checkout develop
git merge main
git push origin develop
```

---

## 📦 環境說明

### Vercel 部署環境

| 分支 | 環境 | 網址 | 用途 |
|------|------|------|------|
| `main` | Production | https://peak-collector-qchi.vercel.app | 正式環境 |
| `develop` | Preview | https://peak-collector-qchi-git-develop-xxx.vercel.app | 測試環境 |
| `feature/*` | Preview | 自動產生 | 功能測試 |

### 環境變數

- `.env.local`: 本地開發環境
- Vercel Production: 正式環境變數
- Vercel Preview: 測試環境變數

---

## ⚠️ 注意事項

### 資料庫變更

**❌ 避免破壞性變更：**
- 不要刪除欄位
- 不要修改欄位類型
- 不要刪除資料表

**✅ 安全的變更：**
- 新增欄位
- 新增資料表
- 新增索引

### 測試檢查清單

在合併到 main 之前：
- [ ] 本地測試通過
- [ ] develop 預覽環境測試通過
- [ ] 沒有 console 錯誤
- [ ] 手機版正常運作
- [ ] 關鍵功能測試（登入、GPX 上傳、手動標記）

---

## 📋 版本發布

### 語義化版本

- `v1.x.x`: 主要版本更新
- `v1.4.x`: 次要版本更新（新功能）
- `v1.4.1`: 修訂版本更新（bug 修復）

### 建立版本標籤

```bash
git checkout main
git tag -a v1.4 -m "品牌視覺升級完成"
git push --tags
```

---

## 🔄 回滾機制

### 透過 Vercel Dashboard

1. 前往 https://vercel.com/dashboard
2. 選擇專案 > Deployments
3. 找到之前的穩定版本
4. 點擊 "Promote to Production"

### 透過 Git

```bash
# 回滾到上一個 commit
git checkout main
git revert HEAD
git push origin main

# 回滾到特定版本
git checkout main
git reset --hard <commit-hash>
git push -f origin main  # ⚠️ 謹慎使用
```

---

## 🛠️ 開發工具

### 本地開發

```bash
npm run dev        # 啟動開發伺服器
npm run build      # 建置專案
npm run start      # 啟動 production 伺服器
```

### Git 常用指令

```bash
git status                  # 查看狀態
git branch                  # 查看所有分支
git checkout <branch>       # 切換分支
git pull origin <branch>    # 拉取遠端分支
git push origin <branch>    # 推送到遠端
```

---

## 📞 聯絡資訊

如有問題請聯絡：
- Email: peakcollector2025@gmail.com
- GitHub: https://github.com/superAwei/PeakCollector

---

**最後更新：** 2024-12-29
**目前版本：** v1.4
