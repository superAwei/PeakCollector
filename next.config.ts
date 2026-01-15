import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack 配置（Next.js 16 預設使用 Turbopack）
  turbopack: {},

  // 圖片優化配置
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    qualities: [75, 90], // 支援百岳徽章的高質量顯示
  },
};

export default nextConfig;
