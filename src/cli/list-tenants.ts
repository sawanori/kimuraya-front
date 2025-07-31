#!/usr/bin/env tsx
import chalk from 'chalk'
import { getPayload } from 'payload'
import config from '@payload-config'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../../.env.local') })

async function listTenants() {
  console.log(chalk.blue.bold('\n🏢 テナント一覧\n'))

  const payload = await getPayload({
    config,
  })

  try {
    const tenants = await payload.find({
      collection: 'tenants',
      limit: 100,
      sort: '-createdAt',
    })

    if (tenants.docs.length === 0) {
      console.log(chalk.yellow('テナントが登録されていません'))
      console.log(chalk.gray('\nnpm run add:tenant でテナントを追加してください'))
      process.exit(0)
    }

    console.log(chalk.cyan(`合計: ${tenants.totalDocs} テナント\n`))

    // テーブルヘッダー
    console.log(
      chalk.gray('─'.repeat(100))
    )
    console.log(
      chalk.bold(
        '名前'.padEnd(20) +
        'スラッグ'.padEnd(20) +
        'ステータス'.padEnd(12) +
        'ドメイン'.padEnd(30) +
        '作成日'
      )
    )
    console.log(
      chalk.gray('─'.repeat(100))
    )

    // テナント一覧
    tenants.docs.forEach((tenant) => {
      const status = tenant.status === 'active' 
        ? chalk.green('アクティブ') 
        : tenant.status === 'inactive'
        ? chalk.gray('非アクティブ')
        : chalk.yellow('メンテナンス')

      const isDefault = tenant.isDefault ? chalk.cyan(' [デフォルト]') : ''
      
      console.log(
        tenant.name.padEnd(20) +
        tenant.slug.padEnd(20) +
        status.padEnd(20) +
        (tenant.settings?.domain || '-').padEnd(30) +
        new Date(tenant.createdAt).toLocaleDateString('ja-JP') +
        isDefault
      )

      // 追加情報（ユーザー数、記事数など）
      if (tenant.settings?.limits) {
        console.log(
          chalk.gray(
            '  └─ ' +
            `制限: ユーザー ${tenant.settings.limits.maxUsers}名, ` +
            `記事 ${tenant.settings.limits.maxArticles}件`
          )
        )
      }
    })

    console.log(
      chalk.gray('─'.repeat(100))
    )

    // 統計情報
    const activeCount = tenants.docs.filter(t => t.status === 'active').length
    const inactiveCount = tenants.docs.filter(t => t.status === 'inactive').length
    const maintenanceCount = tenants.docs.filter(t => t.status === 'maintenance').length

    console.log(chalk.cyan('\n📊 統計:'))
    console.log(chalk.white(`   アクティブ: ${activeCount}`))
    console.log(chalk.white(`   非アクティブ: ${inactiveCount}`))
    console.log(chalk.white(`   メンテナンス中: ${maintenanceCount}`))

    // コマンドヒント
    console.log(chalk.yellow('\n💡 コマンド:'))
    console.log(chalk.gray('   npm run add:tenant        - 新しいテナントを追加'))
    console.log(chalk.gray('   npm run remove:tenant     - テナントを削除（未実装）'))
    console.log(chalk.gray('   npm run edit:tenant       - テナントを編集（未実装）'))

  } catch (error) {
    console.error(chalk.red('\n❌ エラーが発生しました:'), error)
    process.exit(1)
  }

  process.exit(0)
}

// メイン実行
listTenants()