# Renderデプロイメントガイド

このガイドは、新しい機能（テナントAPI設定）を本番環境にデプロイする手順を説明します。

## 前提条件
- Renderアカウントにログイン済み
- GitHubリポジトリとRenderが連携済み
- データベースがPostgreSQLで設定済み

## デプロイ手順

### ステップ1: ローカル環境での準備

1. **コードの変更をコミット**
   ```bash
   git add .
   git commit -m "Add tenant API settings and fix build errors"
   git push origin main
   ```

### ステップ2: Renderでのデータベース更新

1. **Renderダッシュボードにアクセス**
   - https://dashboard.render.com にログイン
   - 該当のWebサービスを選択

2. **Shell タブを開く**
   - 左側のメニューから「Shell」タブをクリック

3. **データベースに新しいカラムを追加**
   
   RenderのShellではPostgreSQLクライアントが利用できないため、Node.jsスクリプトを使用します：

   ```bash
   # Node.jsスクリプトでデータベースを更新
   node -e "
   const { Client } = require('pg');
   const client = new Client({ connectionString: process.env.DATABASE_URI });

   async function updateDB() {await client.connect();
     try {
       await client.query('ALTER TABLE tenants ADD COLUMN IF NOT EXISTS settings_api_settings_google_business_profile_api_key_encrypted TEXT');
       await client.query('ALTER TABLE tenants ADD COLUMN IF NOT EXISTS settings_api_settings_google_business_profile_place_id VARCHAR');
       await client.query('ALTER TABLE tenants ADD COLUMN IF NOT EXISTS settings_api_settings_google_business_profile_is_enabled BOOLEAN DEFAULT false');
       await client.query('ALTER TABLE tenants ADD COLUMN IF NOT EXISTS settings_api_settings_custom_api_endpoint VARCHAR');
       console.log('Columns added successfully');
     } catch (err) {
       console.error('Error:', err);
     } finally {
       await client.end();
     }
   }

   updateDB();
   "
   ```

   **代替方法**: Prismaを使用する場合
   ```bash
   # Prismaでスキーマを同期
   npx prisma db push
   ```

### ステップ3: 環境変数の設定

1. **Environment タブを開く**
   - 左側のメニューから「Environment」タブをクリック

2. **必要な環境変数を追加/更新**
   ```
   NEXT_PUBLIC_ENABLE_HOST_MW=true
   PAYLOAD_SECRET=[セキュアなランダム文字列に変更]
   ```

3. **「Save Changes」をクリック**

### ステップ4: アプリケーションの再デプロイ

1. **Manual Deploy を実行**
   - ダッシュボードの右上にある「Manual Deploy」ボタンをクリック
   - 「Deploy latest commit」を選択
   - デプロイが完了するまで待つ（約5-10分）

### ステップ5: デプロイ後の初期設定

1. **再度 Shell タブを開く**

2. **マルチテナント機能の設定（必要な場合）**
   ```bash
   # Row Level Securityポリシーを適用
   npm run migrate:multitenant
   ```

3. **管理者ユーザーの作成**
   ```bash
   # 管理者ユーザーを作成（既に存在する場合はスキップ）
   npm run seed:admin
   ```

### ステップ6: 動作確認

1. **アプリケーションにアクセス**
   - https://[your-app].onrender.com にアクセス

2. **ログインテスト**
   - `/login` ページにアクセス
   - 作成した管理者アカウントでログイン
   - 資格情報：
     - Email: admin@example.com
     - Password: password123

3. **機能確認**
   - 管理画面にアクセスできることを確認
   - テナント設定でAPI設定が表示されることを確認

## トラブルシューティング

### ログインできない場合

1. **ブラウザのキャッシュをクリア**
   - Cookieを削除（特に`payload-token`）
   - ハードリロード（Ctrl+Shift+R または Cmd+Shift+R）

2. **ログを確認**
   - Renderダッシュボードの「Logs」タブでエラーを確認

3. **データベース接続を確認**
   ```bash
   npm run test:db
   ```

### 500エラーが発生する場合

1. **Prisma Clientを再生成**
   ```bash
   npm run prisma:generate
   ```

2. **環境変数を確認**
   - `DATABASE_URL`が正しく設定されているか
   - `PAYLOAD_SECRET`が設定されているか

3. **サービスを再起動**
   - Manual Deployを再実行

## 重要な注意事項

- 本番環境のデータベースを変更する前に、必ずバックアップを取ることを推奨
- 環境変数の`PAYLOAD_SECRET`は必ずセキュアな値に変更すること
- デプロイ中はサービスが一時的に利用できなくなる可能性があります

## 関連ドキュメント

- [CLAUDE.md](./CLAUDE.md) - プロジェクトの概要と開発ガイド
- [Render公式ドキュメント](https://render.com/docs)
- [Payload CMS ドキュメント](https://payloadcms.com/docs)