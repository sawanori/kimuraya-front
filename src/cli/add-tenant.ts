#!/usr/bin/env tsx
import prompts from 'prompts'
import chalk from 'chalk'
import ora from 'ora'
import { getPayload } from 'payload'
import config from '@payload-config'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../../.env.local') })

// テナントプリセット
const PRESETS = {
  restaurant: {
    name: 'レストラン',
    settings: {
      features: {
        enableNews: true,
        enableReservation: true,
        enableAnalytics: true,
      },
      limits: {
        maxUsers: 10,
        maxArticles: 1000,
      },
    },
  },
  cafe: {
    name: 'カフェ',
    settings: {
      features: {
        enableNews: true,
        enableReservation: true,
        enableAnalytics: false,
      },
      limits: {
        maxUsers: 5,
        maxArticles: 500,
      },
    },
  },
  branch: {
    name: '支店',
    settings: {
      features: {
        enableNews: true,
        enableReservation: true,
        enableAnalytics: true,
      },
      limits: {
        maxUsers: 20,
        maxArticles: 2000,
      },
    },
  },
}

async function addTenant() {
  console.log(chalk.blue.bold('\n🏢 テナント登録CLI\n'))

  const payload = await getPayload({
    config,
  })

  try {
    // コマンドライン引数をチェック
    const args = process.argv.slice(2)
    const configPath = args.find(arg => arg.startsWith('--config='))?.split('=')[1]

    let tenantData: any

    if (configPath) {
      // 設定ファイルから読み込み
      const fs = await import('fs')
      const configContent = fs.readFileSync(resolve(process.cwd(), configPath), 'utf-8')
      tenantData = JSON.parse(configContent)
      console.log(chalk.green(`✅ 設定ファイルを読み込みました: ${configPath}`))
    } else {
      // 対話形式で入力
      const response = await prompts([
        {
          type: 'text',
          name: 'name',
          message: '店舗名を入力してください',
          validate: (value) => value.length > 0 || '店舗名は必須です',
        },
        {
          type: 'text',
          name: 'slug',
          message: 'スラッグを入力してください（例: shinjuku-branch）',
          initial: (prev: string) => prev.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
          validate: (value) => {
            if (!value) return 'スラッグは必須です'
            if (!/^[a-z0-9-]+$/.test(value)) return '半角英数字（小文字）とハイフンのみ使用可能です'
            return true
          },
        },
        {
          type: 'select',
          name: 'preset',
          message: 'プリセットを選択してください',
          choices: [
            { title: 'レストラン', value: 'restaurant' },
            { title: 'カフェ', value: 'cafe' },
            { title: '支店', value: 'branch' },
            { title: 'カスタム', value: 'custom' },
          ],
        },
      ])

      if (!response.name) {
        console.log(chalk.yellow('\n❌ キャンセルされました'))
        process.exit(0)
      }

      // プリセットを適用
      const preset = response.preset !== 'custom' ? PRESETS[response.preset as keyof typeof PRESETS] : null

      // 詳細設定
      let detailsResponse: any = {}
      if (response.preset === 'custom' || preset) {
        detailsResponse = await prompts([
          {
            type: 'text',
            name: 'domain',
            message: 'カスタムドメイン（オプション）',
            initial: `${response.slug}.kimuraya.com`,
          },
          {
            type: 'text',
            name: 'primaryColor',
            message: 'プライマリカラー',
            initial: preset ? '#0066ff' : '#0066ff',
          },
          {
            type: 'text',
            name: 'address',
            message: '住所',
          },
          {
            type: 'text',
            name: 'phone',
            message: '電話番号',
          },
          {
            type: 'text',
            name: 'email',
            message: 'メールアドレス',
            validate: (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || '有効なメールアドレスを入力してください',
          },
          {
            type: 'text',
            name: 'businessHours',
            message: '営業時間',
            initial: '平日 17:00-23:00\n土日祝 11:00-23:00',
          },
        ])
      }

      // 管理者ユーザー設定
      const adminResponse = await prompts([
        {
          type: 'confirm',
          name: 'createAdmin',
          message: 'このテナント用の管理者ユーザーを作成しますか？',
          initial: true,
        },
        {
          type: prev => prev ? 'text' : null,
          name: 'adminEmail',
          message: '管理者のメールアドレス',
          validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || '有効なメールアドレスを入力してください',
        },
        {
          type: prev => prev ? 'password' : null,
          name: 'adminPassword',
          message: '管理者のパスワード',
          validate: (value) => value.length >= 8 || 'パスワードは8文字以上必要です',
        },
        {
          type: prev => prev ? 'text' : null,
          name: 'adminName',
          message: '管理者の名前',
        },
      ])

      tenantData = {
        ...response,
        ...detailsResponse,
        admin: adminResponse.createAdmin ? adminResponse : null,
        preset: preset || null,
      }
    }

    // テナント作成
    const spinner = ora('テナントを作成中...').start()

    // 重複チェック
    const existingTenants = await payload.find({
      collection: 'tenants',
      where: {
        slug: {
          equals: tenantData.slug,
        },
      },
    })

    if (existingTenants.docs.length > 0) {
      spinner.fail(chalk.red('このスラッグは既に使用されています'))
      process.exit(1)
    }

    // テナント作成
    const tenant = await payload.create({
      collection: 'tenants',
      data: {
        name: tenantData.name,
        slug: tenantData.slug,
        status: 'active',
        isDefault: false,
        settings: {
          domain: tenantData.domain,
          theme: {
            primaryColor: tenantData.primaryColor || '#0066ff',
          },
          ...(tenantData.preset?.settings || {
            features: {
              enableNews: true,
              enableReservation: true,
              enableAnalytics: true,
            },
            limits: {
              maxUsers: 10,
              maxArticles: 1000,
            },
          }),
        },
        contact: {
          address: tenantData.address,
          phone: tenantData.phone,
          email: tenantData.email,
          businessHours: tenantData.businessHours,
        },
      },
    })

    spinner.succeed(chalk.green('テナントを作成しました'))

    // 管理者ユーザー作成
    if (tenantData.admin && tenantData.admin.createAdmin) {
      const userSpinner = ora('管理者ユーザーを作成中...').start()

      try {
        const adminUser = await payload.create({
          collection: 'users',
          data: {
            email: tenantData.admin.adminEmail,
            password: tenantData.admin.adminPassword,
            name: tenantData.admin.adminName,
            role: 'admin',
            tenants: [tenant.id],
            currentTenant: tenant.id,
            isSuperAdmin: false,
          },
        })

        userSpinner.succeed(chalk.green('管理者ユーザーを作成しました'))
        
        console.log(chalk.cyan('\n📋 ログイン情報:'))
        console.log(chalk.white(`   メールアドレス: ${adminUser.email}`))
        console.log(chalk.white(`   パスワード: ********`))
      } catch (error) {
        userSpinner.fail(chalk.red('管理者ユーザーの作成に失敗しました'))
        console.error(error)
      }
    }

    // 初期データ作成（オプション）
    const initDataResponse = await prompts({
      type: 'confirm',
      name: 'createInitialData',
      message: '初期データ（サンプル記事等）を作成しますか？',
      initial: false,
    })

    if (initDataResponse.createInitialData) {
      const dataSpinner = ora('初期データを作成中...').start()
      
      // TODO: 記事やカテゴリーなどの初期データを作成
      // 現在は記事システムがマルチテナント対応していないため、スキップ
      
      dataSpinner.succeed(chalk.green('初期データを作成しました'))
    }

    // 完了メッセージ
    console.log(chalk.green.bold('\n✅ テナントの登録が完了しました！\n'))
    console.log(chalk.cyan('📋 テナント情報:'))
    console.log(chalk.white(`   名前: ${tenant.name}`))
    console.log(chalk.white(`   スラッグ: ${tenant.slug}`))
    console.log(chalk.white(`   ID: ${tenant.id}`))
    
    if (tenantData.domain) {
      console.log(chalk.white(`   ドメイン: ${tenantData.domain}`))
    }

    console.log(chalk.yellow('\n💡 次のステップ:'))
    console.log(chalk.white('   1. 管理画面にログインしてテナントを確認'))
    console.log(chalk.white('   2. 必要に応じて追加の設定を行う'))
    console.log(chalk.white('   3. コンテンツの作成を開始'))

  } catch (error) {
    console.error(chalk.red('\n❌ エラーが発生しました:'), error)
    process.exit(1)
  }

  process.exit(0)
}

// メイン実行
addTenant()