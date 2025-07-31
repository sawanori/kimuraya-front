# Row-Level Security (RLS) ガイド

## 概要

このプロジェクトでは、PostgreSQLのRow-Level Security (RLS)を使用して、データベースレベルでマルチテナントのデータ分離を実現しています。

## RLSの仕組み

### 1. 有効化されているテーブル

以下のテーブルでRLSが有効になっています：

- **media** - メディアファイル（tenant_idカラムで分離）
- **users** - ユーザー（テナントリレーションで分離）
- **tenants** - テナント（アクセス権限で分離）

### 2. セッション変数

RLSは以下のPostgreSQLセッション変数を使用します：

- `app.current_tenant` - 現在のテナントID
- `app.current_user_id` - 現在のユーザーID
- `app.is_super_admin` - スーパー管理者フラグ

### 3. ポリシー

#### media_isolate_by_tenant
- tenant_idが現在のセッションテナントと一致するレコードのみアクセス可能
- スーパー管理者は全レコードにアクセス可能

#### users_isolate_by_tenant
- 同じテナントに属するユーザーのみアクセス可能
- 自分自身のレコードは常にアクセス可能
- スーパー管理者は全ユーザーにアクセス可能

#### tenants_isolate_by_access
- ユーザーが所属するテナントのみアクセス可能
- スーパー管理者は全テナントにアクセス可能

## Payloadとの統合

`payload.config.ts`で`beforeOperation`フックを使用して、各操作の前にRLSコンテキストを設定します：

```typescript
hooks: {
  beforeOperation: [
    async ({ req }) => {
      await setTenantContext(req)
    },
  ],
}
```

## テスト方法

### 1. RLSステータスの確認

```bash
npx tsx src/test/test-rls-simple.ts
```

### 2. SQLでの確認

```sql
-- RLSが有効か確認
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('media', 'users', 'tenants');

-- ポリシーの確認
SELECT * FROM pg_policies 
WHERE tablename IN ('media', 'users', 'tenants');
```

## トラブルシューティング

### RLSが機能しない場合

1. セッション変数が正しく設定されているか確認
2. ユーザーのテナント関連付けを確認
3. `NODE_ENV=development`でデバッグログを有効化

### パフォーマンスの問題

1. インデックスが作成されているか確認
2. ポリシーのクエリが複雑すぎないか確認

## セキュリティの考慮事項

1. スーパー管理者の権限は慎重に管理
2. テナントIDはHTTPヘッダーやクエリパラメータでも設定可能だが、認証されたユーザーの情報を優先
3. RLSはアプリケーションレベルの検証と併用することを推奨