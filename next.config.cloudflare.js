/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages用の静的エクスポート設定
  output: 'export',
  
  // 画像最適化を無効化（Cloudflareで処理）
  images: {
    unoptimized: true,
  },
  
  // トレイリングスラッシュを追加（静的サイト用）
  trailingSlash: true,
  
  // 環境変数の設定
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.SITE_URL || 'https://kimuraya.pages.dev',
  },
  
  // 静的ファイルの最適化
  compress: true,
  
  // ビルド時の最適化
  swcMinify: true,
  
  // 不要なページの除外
  pageExtensions: ['tsx', 'ts'],
  
  // カスタムWebpack設定
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // クライアントサイドでのSQLite除外
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      }
    }
    return config
  },
}

module.exports = nextConfig