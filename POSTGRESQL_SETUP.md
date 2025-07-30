# PostgreSQL Setup Guide

## ローカル開発環境でのPostgreSQLセットアップ

### 1. PostgreSQLのインストール

#### macOS (Homebrew)
```bash
brew install postgresql@16
brew services start postgresql@16
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Windows
[PostgreSQL公式サイト](https://www.postgresql.org/download/windows/)からインストーラーをダウンロードしてインストール

### 2. データベースとユーザーの作成

**注意: macOSの場合**
macOSでHomebrewを使用してPostgreSQLをインストールした場合、デフォルトではシステムのユーザー名（例: `noritakasawada`）でPostgreSQLユーザーが作成されます。

```bash
# macOSの場合（現在のユーザー名で接続）
psql -d postgres

# その他のOSの場合
psql -U postgres
```

データベースを作成：
```sql
CREATE DATABASE kimuraya;
\q
```

**macOSの場合の接続文字列:**
```
DATABASE_URI=postgresql://あなたのユーザー名@localhost:5432/kimuraya
```

**その他のOSの場合の接続文字列:**
```
DATABASE_URI=postgresql://postgres:password@localhost:5432/kimuraya
```

### 3. 環境変数の設定

`.env.local`ファイルに以下の設定があることを確認：

```
DATABASE_URI=postgresql://postgres:password@localhost:5432/kimuraya
```

### 4. アプリケーションの起動

```bash
# 依存関係のインストール（初回のみ）
npm install

# 管理者ユーザーの作成
npm run seed:admin

# 開発サーバーの起動
npm run dev
```

## Docker Composeを使用する場合

`docker-compose.yml`ファイルを作成：

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: kimuraya-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: kimuraya
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

起動：
```bash
docker-compose up -d
```

## トラブルシューティング

### 接続エラーが発生する場合

1. PostgreSQLサービスが起動しているか確認
   ```bash
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   ```

2. ポート5432が使用されていないか確認
   ```bash
   lsof -i :5432
   ```

3. 接続文字列が正しいか確認
   - ホスト名: localhost
   - ポート: 5432
   - データベース名: kimuraya
   - ユーザー名とパスワード

### 権限エラーが発生する場合

PostgreSQLの設定ファイル（pg_hba.conf）で認証方法を確認してください。