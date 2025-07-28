#!/bin/bash

# レンタルサーバー用静的サイトビルドスクリプト

echo "🚀 レンタルサーバー用ビルドを開始します..."

# 1. 依存関係のインストール
echo "📦 依存関係をインストール中..."
npm install

# 2. 環境変数の設定
echo "⚙️  環境変数を設定中..."
export NEXT_PUBLIC_API_URL="/api"
export NEXT_PUBLIC_SITE_URL="https://kimuraya-honten.com"

# 3. ビルド実行
echo "🔨 ビルドを実行中..."
npm run build

# 4. 静的ファイルのエクスポート
echo "📤 静的ファイルをエクスポート中..."
npx next export -o dist

# 5. PHPファイルのコピー
echo "📄 PHPファイルをコピー中..."
mkdir -p dist/api
cp -r server/php/* dist/api/

# 6. .htaccessのコピー
echo "📋 .htaccessをコピー中..."
cp server/.htaccess dist/

# 7. アップロード用のZIPファイル作成
echo "🗜️  ZIPファイルを作成中..."
cd dist
zip -r ../kimuraya-static.zip .
cd ..

echo "✅ ビルド完了！"
echo "📦 kimuraya-static.zip をレンタルサーバーにアップロードしてください。"
echo ""
echo "アップロード後の手順："
echo "1. サーバーのpublic_htmlディレクトリに解凍"
echo "2. データベースファイル(kimuraya.db)をdata/ディレクトリに配置"
echo "3. uploads/ディレクトリに書き込み権限(777)を設定"
echo ""
echo "🌐 サイトURL: https://あなたのドメイン/"
echo "🔐 管理画面: https://あなたのドメイン/admin"