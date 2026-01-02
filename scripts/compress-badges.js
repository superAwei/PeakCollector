/**
 * 徽章圖片壓縮腳本
 *
 * 將所有徽章圖片壓縮至適合網頁使用的大小
 * 目標：每個圖片 < 50KB
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const BADGES_DIR = path.join(__dirname, '../public/badges');
const BACKUP_DIR = path.join(__dirname, '../public/badges/original');
const TARGET_SIZE = 50 * 1024; // 50KB

async function compressBadges() {
  // 創建備份目錄
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  // 讀取所有 PNG 檔案
  const files = fs.readdirSync(BADGES_DIR)
    .filter(file => file.endsWith('.png') && !file.startsWith('original'));

  console.log(`📦 找到 ${files.length} 個徽章圖片需要壓縮`);
  console.log('');

  for (const file of files) {
    const inputPath = path.join(BADGES_DIR, file);
    const backupPath = path.join(BACKUP_DIR, file);
    const stats = fs.statSync(inputPath);
    const originalSize = stats.size;

    console.log(`🔧 處理: ${file}`);
    console.log(`   原始大小: ${(originalSize / 1024).toFixed(1)} KB`);

    // 備份原始檔案
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(inputPath, backupPath);
      console.log(`   ✅ 已備份到: original/${file}`);
    }

    try {
      // 壓縮圖片
      await sharp(inputPath)
        .resize(512, 512, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .png({
          quality: 80,
          compressionLevel: 9,
          palette: true // 使用調色盤模式進一步壓縮
        })
        .toFile(inputPath + '.tmp');

      // 替換原檔案
      fs.renameSync(inputPath + '.tmp', inputPath);

      // 檢查壓縮後大小
      const newStats = fs.statSync(inputPath);
      const newSize = newStats.size;
      const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);

      console.log(`   ✅ 壓縮完成: ${(newSize / 1024).toFixed(1)} KB (減少 ${reduction}%)`);

      if (newSize > TARGET_SIZE) {
        console.log(`   ⚠️  警告: 仍超過目標大小 50KB`);
      }
    } catch (error) {
      console.error(`   ❌ 壓縮失敗: ${error.message}`);
    }

    console.log('');
  }

  console.log('🎉 所有圖片處理完成！');
  console.log(`📁 原始檔案已備份至: public/badges/original/`);
}

compressBadges().catch(console.error);
