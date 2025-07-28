# レンタルサーバーでの運用ガイド

## 結論：可能です！（月額500円〜1,000円）

### 🎯 推奨レンタルサーバー

#### 1. **エックスサーバー（月額990円〜）**
- Node.js対応（v18以上）
- SQLite利用可能
- 無料SSL
- 自動バックアップ
- 電話サポートあり

#### 2. **ConoHa WING（月額678円〜）**
- Node.js対応
- 高速SSD
- 無料SSL
- WordPressかんたん移行（不要だが）

#### 3. **さくらのレンタルサーバー（月額425円〜）**
- スタンダードプラン以上でNode.js可
- 老舗の安定性
- 日本語サポート充実

## 必要な変更点

### 方法1：静的サイトとして運用（簡単・推奨）

Next.jsを静的HTMLにビルドして、通常のWebサイトとしてアップロード。

```bash
# package.jsonを修正
{
  "scripts": {
    "build": "next build && next export",
    "export": "next export -o dist"
  }
}
```

```javascript
// next.config.js
module.exports = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // APIルートは使えないので注意
}
```

### 方法2：Node.js対応サーバーで動的運用

```javascript
// server.js（カスタムサーバー）
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = false
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true)
    await handle(req, res, parsedUrl)
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
```

## レンタルサーバー用の構成変更

### 1. データベースをファイルベースに

```javascript
// lib/db.js
import Database from 'better-sqlite3'
import path from 'path'

// レンタルサーバーの書き込み可能ディレクトリに配置
const dbPath = path.join(process.cwd(), 'data', 'kimuraya.db')
const db = new Database(dbPath)

export default db
```

### 2. ファイルアップロードをローカル保存に

```javascript
// api/upload.js
import formidable from 'formidable'
import path from 'path'
import fs from 'fs/promises'

export default async function handler(req, res) {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  
  // ディレクトリ作成
  await fs.mkdir(uploadDir, { recursive: true })
  
  const form = formidable({
    uploadDir: uploadDir,
    keepExtensions: true,
  })
  
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Upload failed' })
      return
    }
    
    const file = files.file
    const url = `/uploads/${path.basename(file.filepath)}`
    res.json({ url })
  })
}
```

### 3. 管理画面の認証を簡易実装

```javascript
// middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
  // Basic認証
  const basicAuth = request.headers.get('authorization')
  
  if (!basicAuth) {
    return new Response('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"'
      }
    })
  }
  
  const auth = basicAuth.split(' ')[1]
  const [user, pwd] = Buffer.from(auth, 'base64').toString().split(':')
  
  // 環境変数で設定
  if (user !== process.env.ADMIN_USER || pwd !== process.env.ADMIN_PASS) {
    return new Response('Authentication failed', { status: 401 })
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
}
```

## デプロイ手順（エックスサーバーの例）

### 1. サーバーの準備

```bash
# SSHでログイン
ssh username@svXXXX.xserver.jp

# Node.jsの確認
node -v  # v18以上であること

# プロジェクトディレクトリ作成
mkdir ~/kimuraya-site
cd ~/kimuraya-site
```

### 2. ファイルのアップロード

```bash
# ローカルでビルド
npm run build
npm run export

# FTPまたはSCPでアップロード
scp -r dist/* username@svXXXX.xserver.jp:~/public_html/
```

### 3. .htaccessの設定

```apache
# public_html/.htaccess
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # HTTPSリダイレクト
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  
  # SPAのルーティング対応
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)$ /index.html [L]
</IfModule>

# キャッシュ設定
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType video/mp4 "access plus 1 year"
</IfModule>
```

### 4. データベースの設定

```bash
# SQLiteファイルを配置
mkdir ~/kimuraya-site/data
chmod 777 ~/kimuraya-site/data

# データベースファイルをアップロード
scp kimuraya.db username@svXXXX.xserver.jp:~/kimuraya-site/data/
```

## PHP経由での運用（もっと簡単）

レンタルサーバーの多くはPHPが標準なので、PHPで簡易CMSを作る方法も：

```php
<?php
// api/content.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$dataFile = '../data/content.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo file_get_contents($dataFile);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    file_put_contents($dataFile, $input);
    echo json_encode(['success' => true]);
}
?>
```

## コスト比較

| サービス | 月額 | 容量 | 転送量 | Node.js | サポート |
|---------|------|------|--------|---------|----------|
| エックスサーバー | 990円 | 300GB | 無制限 | ○ | 日本語電話 |
| ConoHa WING | 678円 | 300GB | 無制限 | ○ | 日本語 |
| さくらサーバー | 425円 | 100GB | 無制限 | △ | 日本語 |
| ロリポップ | 440円 | 400GB | 無制限 | × | 日本語 |
| Cloudflare | 0円 | 無制限 | 無制限 | ○ | 英語 |

## メリット・デメリット

### メリット
- 日本語サポートが充実
- 請求書払い対応
- 電話サポートあり
- なじみのある管理画面
- メールアドレス無制限

### デメリット
- Node.jsのバージョンが古い場合がある
- グローバルCDNなし
- 自動デプロイは手動設定が必要
- パフォーマンスはクラウドに劣る

## まとめ

レンタルサーバーでの運用は**十分可能**です！

### おすすめの構成
1. **静的サイト生成**（Next.js export）
2. **コンテンツ管理はJSONファイル**
3. **画像は直接アップロード**
4. **Basic認証で管理画面保護**

これなら月額500円〜1,000円で、日本語サポート付きで運用できます。