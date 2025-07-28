# デプロイメントガイド - コスト最適化版

## 推奨技術スタック：Cloudflare Pages + R2 Storage

### 月額コスト目安：0円〜約500円

## 技術スタック詳細

### 1. ホスティング：Cloudflare Pages（無料）
- Next.js静的サイト生成（SSG）対応
- 月100万リクエストまで無料
- 自動デプロイ（GitHub連携）
- グローバルCDN配信
- カスタムドメイン対応

### 2. データベース：Cloudflare D1（無料枠あり）
- SQLite互換
- 5GBストレージまで無料
- 現在のSQLiteからの移行が容易
- エッジで動作し高速

### 3. ファイルストレージ：Cloudflare R2（ほぼ無料）
- 10GB/月まで無料
- 画像・動画ファイルの保存
- S3互換API
- エグレス料金なし

### 4. 認証：Cloudflare Access（無料枠あり）
- 管理画面のアクセス制御
- 月50ユーザーまで無料

## 必要な変更点

### 1. Next.js設定の変更

```javascript
// next.config.js
module.exports = {
  output: 'export', // 静的サイト生成を有効化
  images: {
    unoptimized: true, // Cloudflare Pages用
  },
}
```

### 2. ファイルアップロードの変更

```typescript
// R2への画像アップロード処理に変更
// src/app/api/upload/route.ts を Cloudflare Workers で実装
```

### 3. データベース接続の変更

```typescript
// D1データベース接続
import { D1Database } from '@cloudflare/workers-types'
```

## デプロイ手順

### ステップ1：Cloudflareアカウント作成
1. https://cloudflare.com でアカウント作成
2. ダッシュボードにログイン

### ステップ2：R2バケット作成
1. R2 Storage > Create Bucket
2. バケット名：`kimuraya-uploads`
3. パブリックアクセスを有効化

### ステップ3：D1データベース作成
1. D1 > Create Database
2. データベース名：`kimuraya-db`
3. SQLiteデータをインポート

### ステップ4：Cloudflare Pages設定
1. Pages > Create a project
2. GitHubリポジトリを接続
3. ビルド設定：
   - フレームワーク：Next.js
   - ビルドコマンド：`npm run build`
   - 出力ディレクトリ：`out`

### ステップ5：環境変数設定
```
DATABASE_URL=<D1接続文字列>
R2_BUCKET_NAME=kimuraya-uploads
R2_ACCESS_KEY_ID=<R2アクセスキー>
R2_SECRET_ACCESS_KEY=<R2シークレットキー>
```

### ステップ6：カスタムドメイン設定
1. Pages > Custom domains
2. ドメインを追加
3. DNS設定を更新

## 代替案（さらに安価）

### GitHub Pages + Supabase（月額0円）
- **ホスティング**：GitHub Pages（完全無料）
- **データベース**：Supabase（500MBまで無料）
- **ストレージ**：GitHub LFS（1GBまで無料）
- **制限**：動的機能が限定的

### Netlify + Turso（月額0円）
- **ホスティング**：Netlify（100GB帯域まで無料）
- **データベース**：Turso（SQLite互換、500MBまで無料）
- **ストレージ**：Netlify Large Media

## パフォーマンス最適化

### 1. 画像最適化
```bash
# 画像を事前に最適化
npm install -D @squoosh/cli
npx @squoosh/cli --webp auto public/images/*.jpg
```

### 2. 静的生成の活用
```typescript
// ページを事前生成
export async function generateStaticParams() {
  return [{ slug: 'home' }]
}
```

### 3. CDNキャッシュ設定
```javascript
// Cache-Control ヘッダー設定
export const revalidate = 3600 // 1時間
```

## 監視とメンテナンス

### 無料監視ツール
1. **Cloudflare Analytics**（組み込み）
2. **UptimeRobot**（無料プラン）
3. **Google Analytics**

### バックアップ
```bash
# 自動バックアップスクリプト
#!/bin/bash
# D1データベースのエクスポート
wrangler d1 export kimuraya-db > backup-$(date +%Y%m%d).sql
```

## コスト内訳予測

| サービス | 無料枠 | 超過時の料金 |
|---------|--------|------------|
| Cloudflare Pages | 100万req/月 | $0 |
| D1 Database | 5GB | $0.75/GB |
| R2 Storage | 10GB | $0.015/GB |
| R2 Operations | 100万回/月 | $0.36/100万回 |
| Cloudflare Access | 50ユーザー | $3/ユーザー |

**想定月額：0円**（通常の飲食店サイトの場合）

## トラブルシューティング

### よくある問題と対処法

1. **ビルドエラー**
   - Node.jsバージョンを確認
   - 環境変数が正しく設定されているか確認

2. **画像が表示されない**
   - R2バケットの公開設定を確認
   - CORSポリシーを設定

3. **データベースエラー**
   - D1の接続文字列を確認
   - マイグレーションが完了しているか確認

## サポート

- Cloudflare Community: https://community.cloudflare.com
- Next.js Discord: https://nextjs.org/discord
- 本プロジェクトのIssues: GitHub Issues