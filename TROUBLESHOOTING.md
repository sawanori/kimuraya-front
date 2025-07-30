# トラブルシューティングガイド

## `npm run seed:admin`でエラーが発生する場合

### 1. データベース接続の確認

まず、PostgreSQLへの接続を確認します：

```bash
npm run test:db
```

このコマンドで以下を確認します：
- PostgreSQLサーバーが起動しているか
- データベース`kimuraya`が存在するか
- 接続文字列が正しいか

### 2. よくあるエラーと解決方法

#### エラー: `ECONNREFUSED ::1:5432`
PostgreSQLが起動していません。

**解決方法:**
```bash
# macOS
brew services start postgresql@16

# Linux
sudo systemctl start postgresql

# Docker
docker-compose up -d
```

#### エラー: `database "kimuraya" does not exist`
データベースが作成されていません。

**解決方法:**
```bash
psql -U postgres
CREATE DATABASE kimuraya;
\q
```

#### エラー: `password authentication failed`
パスワードが間違っているか、ユーザーが存在しません。

**解決方法:**
1. `.env.local`ファイルの`DATABASE_URI`を確認
2. PostgreSQLのユーザーとパスワードを確認：
   ```bash
   psql -U postgres
   ALTER USER postgres PASSWORD 'password';
   \q
   ```

#### エラー: `relation "payload_preferences" does not exist`
Payloadのテーブルがまだ作成されていません。

**解決方法:**
開発サーバーを一度起動してテーブルを自動作成：
```bash
npm run dev
```
サーバーが起動したら、Ctrl+Cで停止してから再度：
```bash
npm run seed:admin
```

### 3. 環境変数の確認

`.env.local`ファイルが正しく設定されているか確認：

```bash
cat .env.local
```

以下のような内容になっているはずです：
```
# PostgreSQL Database Configuration
DATABASE_URI=postgresql://postgres:password@localhost:5432/kimuraya

# Payload CMS
PAYLOAD_SECRET=your-super-secret-key-change-this-in-production
```

### 4. 手動でのデータベースセットアップ

完全に新しくセットアップする場合：

```bash
# PostgreSQLにログイン
psql -U postgres

# 既存のデータベースを削除（注意！）
DROP DATABASE IF EXISTS kimuraya;

# 新しいデータベースを作成
CREATE DATABASE kimuraya;

# 権限を付与
GRANT ALL PRIVILEGES ON DATABASE kimuraya TO postgres;

# 終了
\q
```

### 5. ログの確認

詳細なエラーログを確認するには：

```bash
# PostgreSQLのログを確認（macOS）
tail -f /usr/local/var/log/postgresql@16.log

# または
tail -f /opt/homebrew/var/log/postgresql@16.log
```

### 6. それでも解決しない場合

1. すべての依存関係を再インストール：
   ```bash
   rm -rf node_modules
   npm install
   ```

2. TypeScriptのキャッシュをクリア：
   ```bash
   rm -rf .next
   rm -rf tsconfig.tsbuildinfo
   ```

3. 最小限のテストスクリプトで確認：
   ```bash
   npm run test:db
   ```

### エラーメッセージを共有する際の情報

問題が解決しない場合は、以下の情報を含めてエラーを報告してください：

1. 完全なエラーメッセージ
2. `npm run test:db`の出力
3. Node.jsのバージョン: `node --version`
4. PostgreSQLのバージョン: `psql --version`
5. OSとバージョン