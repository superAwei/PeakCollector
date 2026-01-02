/**
 * 激進的徽章圖片壓縮腳本
 *
 * 使用更小的尺寸和更高的壓縮率
 * 目標：每個圖片 < 50KB
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const BADGES_DIR = path.join(__dirname, '../public/badges');
const TARGET_SIZE = 50 * 1024; // 50KB

async function compressBadges() {
  // 讀取所有 PNG 檔案
  const files = fs.readdirSync(BADGES_DIR)
    .filter(file => file.endsWith('.png') && !file.startsWith('original'));

  console.log(`📦 激進壓縮模式：處理 ${files.length} 個徽章圖片`);
  console.log('');

  for (const file of files) {
    const inputPath = path.join(BADGES_DIR, file);
    const stats = fs.statSync(inputPath);
    const originalSize = stats.size;

    console.log(`🔧 處理: ${file}`);
    console.log(`   當前大小: ${(originalSize / 1024).toFixed(1)} KB`);

    try {
      // 更激進的壓縮：縮小到 400px，降低品質到 60
      await sharp(inputPath)
        .resize(400, 400, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .png({
          quality: 60,
          compressionLevel: 9,
          palette: true,
          colors: 128 // 限制顏色數量
        })
        .toFile(inputPath + '.tmp');

      // 替換原檔案
      fs.renameSync(inputPath + '.tmp', inputPath);

      // 檢查壓縮後大小
      const newStats = fs.statSync(inputPath);
      const newSize = newStats.size;
      const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);

      console.log(`   ✅ 壓縮完成: ${(newSize / 1024).toFixed(1)} KB (減少 ${reduction}%)`);

      if (newSize <= TARGET_SIZE) {
        console.log(`   🎯 已達到目標！`);
      } else {
        console.log(`   ⚠️  仍超過目標 ${((newSize - TARGET_SIZE) / 1024).toFixed(1)} KB`);
      }
    } catch (error) {
      console.error(`   ❌ 壓縮失敗: ${error.message}`);
    }

    console.log('');
  }

  console.log('🎉 激進壓縮完成！');
}

compressBadges().catch(console.error);
