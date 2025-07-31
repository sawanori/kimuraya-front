# テナント判定ミドルウェア テストガイド

## 概要

このガイドでは、ローカル環境でマルチテナント機能をテストする方法を説明します。

## セットアップ手順

### 1. hostsファイルの設定

macOSの場合、以下のコマンドを実行してローカルドメインを設定します：

```bash
# hostsファイルをバックアップ（念のため）
sudo cp /etc/hosts /etc/hosts.backup

# テスト用ドメインを追加
sudo sh -c "echo '127.0.0.1   kimuraya.localhost' >> /etc/hosts"
sudo sh -c "echo '127.0.0.1   ramen-taro.localhost' >> /etc/hosts"
sudo sh -c "echo '127.0.0.1   sushi-hime.localhost' >> /etc/hosts"
```

### 2. 環境変数の確認

`.env.local`ファイルで以下が設定されていることを確認：

```env
NEXT_PUBLIC_ENABLE_HOST_MW=true
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

### 4. テナントごとのアクセステスト

以下のURLにアクセスして、各テナントが正しく動作することを確認：

- **木村屋本店**: http://kimuraya.localhost:3000
  - デフォルトテナント
  - http://localhost:3000 でもアクセス可能

- **ラーメン太郎**: http://ramen-taro.localhost:3000
  - 別テナントのテスト用

- **寿司姫**: http://sushi-hime.localhost:3000
  - 別テナントのテスト用

## 動作確認ポイント

### 1. ミドルウェアの動作確認

ブラウザの開発者ツールでネットワークタブを開き、APIリクエストを確認：

- `/api`へのリクエストにテナントフィルタが追加されているか
- `where[tenant.domains.url][equals]`パラメータが含まれているか

### 2. データの分離確認

各ドメインでログインして以下を確認：

- 各テナントのデータのみが表示される
- 他テナントのデータが見えない
- 管理画面で正しいテナントのみ操作可能

### 3. RLSの動作確認

PostgreSQLで直接確認：

```sql
-- セッション変数を設定してデータを確認
SELECT set_tenant_context(1, 1, false);
SELECT * FROM media;
```

## トラブルシューティング

### ドメインが解決されない場合

1. hostsファイルが正しく更新されているか確認：
   ```bash
   cat /etc/hosts | grep localhost
   ```

2. DNSキャッシュをクリア：
   ```bash
   sudo dscacheutil -flushcache
   ```

### ミドルウェアが動作しない場合

1. 環境変数が正しく設定されているか確認
2. 開発サーバーを再起動
3. ブラウザのキャッシュをクリア

## 本番環境への移行

1. 実際のドメインを取得
2. DNSレコードを設定
3. Tenantsテーブルのdomainsを本番ドメインに更新
4. SSL証明書を設定（Render/Vercelは自動）

## 元に戻す方法

hostsファイルから追加した行を削除：

```bash
# バックアップから復元
sudo cp /etc/hosts.backup /etc/hosts

# または手動で編集
sudo nano /etc/hosts
# 追加した行を削除
```