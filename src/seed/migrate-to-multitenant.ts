import { getPayload } from 'payload'
import config from '@payload-config'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../../.env.local') })

async function migrateToMultiTenant() {
  console.log('🔄 マルチテナント移行を開始します...')
  
  const payload = await getPayload({
    config,
  })

  try {
    // 1. デフォルトテナントを作成
    console.log('📦 デフォルトテナントを作成中...')
    
    // 既存のデフォルトテナントを確認
    const existingTenants = await payload.find({
      collection: 'tenants',
      where: {
        slug: {
          equals: 'kimuraya-main',
        },
      },
    })

    let defaultTenant
    if (existingTenants.docs.length === 0) {
      defaultTenant = await payload.create({
        collection: 'tenants',
        data: {
          name: '木村屋本店',
          slug: 'kimuraya-main',
          status: 'active',
          isDefault: true,
          settings: {
            theme: {
              primaryColor: '#0066ff',
            },
            features: {
              enableNews: true,
              enableReservation: true,
              enableAnalytics: true,
            },
            limits: {
              maxUsers: 100,
              maxArticles: 10000,
            },
          },
          contact: {
            address: '東京都渋谷区...',
            phone: '03-1234-5678',
            email: 'info@kimuraya.com',
            businessHours: '平日 17:00-23:00\n土日祝 11:00-23:00',
          },
        },
      })
      console.log('✅ デフォルトテナントを作成しました')
    } else {
      defaultTenant = existingTenants.docs[0]
      console.log('ℹ️  デフォルトテナントは既に存在します')
    }

    // 2. 既存ユーザーをマルチテナント対応に更新
    console.log('👥 既存ユーザーを更新中...')
    
    const users = await payload.find({
      collection: 'users',
      limit: 1000,
    })

    let updatedCount = 0
    for (const user of users.docs) {
      // 既にテナントが設定されているユーザーはスキップ
      if (user.tenants && user.tenants.length > 0) {
        continue
      }

      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          ...user,
          tenants: [defaultTenant.id],
          currentTenant: defaultTenant.id,
          // 最初のユーザーをスーパー管理者に設定
          isSuperAdmin: updatedCount === 0 ? true : user.isSuperAdmin || false,
        },
      })
      updatedCount++
    }
    
    console.log(`✅ ${updatedCount}名のユーザーを更新しました`)

    // 3. 既存コレクションにテナントフィールドを追加（将来の実装用）
    console.log('📝 今後のステップ:')
    console.log('   - 記事（Articles）コレクションにテナントフィールドを追加')
    console.log('   - 設定（Settings）コレクションにテナントフィールドを追加')
    console.log('   - その他のコレクションにテナントフィールドを追加')

    console.log('\n✅ マルチテナント移行が完了しました！')
    console.log('\n📋 次のステップ:')
    console.log('   1. npm run dev でアプリケーションを起動')
    console.log('   2. 管理画面にログイン')
    console.log('   3. テナント管理からテナントを確認')
    console.log('   4. npm run add:tenant で新しいテナントを追加')

  } catch (error) {
    console.error('❌ 移行中にエラーが発生しました:', error)
    process.exit(1)
  }

  process.exit(0)
}

migrateToMultiTenant()