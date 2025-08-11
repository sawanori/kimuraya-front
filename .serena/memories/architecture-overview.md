# プロジェクトアーキテクチャ概要

## 技術スタック
- **フレームワーク**: Next.js 15.4.3 (App Router)
- **言語**: TypeScript
- **データベース**: PostgreSQL
- **ORM**: Payload CMS + Prisma (デュアルORM)
- **認証**: Payload CMS セッションベース認証
- **スタイリング**: Tailwind CSS v4 + カスタムCSS
- **ストレージ**: Cloudflare R2 (S3互換)
- **分析**: Plausible Analytics

## マルチテナントアーキテクチャ
- ホストベースのテナント検出
- PostgreSQL Row-Level Security (RLS)
- ミドルウェアによるテナントコンテキスト管理
- Super Admin権限での全テナントアクセス

## 多言語対応
- 対応言語: 日本語(デフォルト)、英語、韓国語、中国語
- LanguageContextによる状態管理
- Cookieベースの言語設定保存

## 主要ディレクトリ構造
```
/src
  /app          # Next.jsアプリケーションルート
  /collections  # Payload CMSコレクション定義
  /components   # Reactコンポーネント
  /contexts     # Reactコンテキスト
  /lib          # ユーティリティライブラリ
  /util         # DBテナント管理等
  /data         # JSONコンテンツストレージ
```

## データフロー
1. クライアント → Middleware(認証・テナント判定)
2. → APIルート/ページコンポーネント
3. → Payload CMS/Prisma
4. → PostgreSQL (RLS適用)
5. → レスポンス

## APIエンドポイント
- `/api/content` - コンテンツ管理
- `/api/upload` - ファイルアップロード
- `/api/users/*` - ユーザー認証
- `/api/[...slug]` - Payload CMS APIプロキシ

## セキュリティ
- APIキー暗号化 (AES-256-GCM)
- RLSによるデータ分離
- Cookieベース認証 (payload-token)
- ミドルウェアによるルート保護