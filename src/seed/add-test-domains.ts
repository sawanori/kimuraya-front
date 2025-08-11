import { getPayload } from 'payload'
import type { Payload as _Payload } from 'payload'
import * as dotenv from 'dotenv'
import path from 'path'

// 環境変数を読み込む
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

/**
 * テスト用ドメインをテナントに追加するスクリプト
 * 
 * Run with: npx tsx src/seed/add-test-domains.ts
 */

async function addTestDomains() {
  console.log('🌐 Adding test domains to tenants...\n')

  try {
    // Payload初期化
    const payloadInstance = await getPayload({
      config: await import('../../payload.config.js'),
    })

    // 既存のテナントを取得
    const tenants = await payloadInstance.find({
      collection: 'tenants',
      limit: 100,
    })

    if (tenants.docs.length === 0) {
      console.log('No tenants found. Please run the migration script first.')
      process.exit(1)
    }

    // テスト用ドメインマッピング
    const domainMappings = [
      {
        slug: 'kimuraya-honten',
        domains: [
          { url: 'kimuraya.localhost', isActive: true },
          { url: 'localhost', isActive: true }, // デフォルトドメイン
        ]
      },
      {
        slug: 'ramen-taro',
        domains: [
          { url: 'ramen-taro.localhost', isActive: true },
        ]
      },
      {
        slug: 'sushi-hime',
        domains: [
          { url: 'sushi-hime.localhost', isActive: true },
        ]
      },
    ]

    // 各テナントにドメインを追加
    for (const mapping of domainMappings) {
      const tenant = tenants.docs.find(t => t.slug === mapping.slug)
      
      if (!tenant) {
        // テナントが存在しない場合は作成
        const newTenant = await payloadInstance.create({
          collection: 'tenants',
          data: {
            name: mapping.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            slug: mapping.slug,
            status: 'active',
            domains: mapping.domains,
          },
        })
        console.log(`✅ Created tenant: ${newTenant.name} with domains:`)
        mapping.domains.forEach(d => console.log(`   - ${d.url}`))
      } else {
        // 既存のテナントにドメインを追加
        const updatedTenant = await payloadInstance.update({
          collection: 'tenants',
          id: tenant.id,
          data: {
            domains: mapping.domains,
          },
        })
        console.log(`✅ Updated tenant: ${updatedTenant.name} with domains:`)
        mapping.domains.forEach(d => console.log(`   - ${d.url}`))
      }
    }

    console.log('\n📝 Next steps:')
    console.log('1. Add these entries to your /etc/hosts file:')
    console.log('   127.0.0.1   kimuraya.localhost')
    console.log('   127.0.0.1   ramen-taro.localhost')
    console.log('   127.0.0.1   sushi-hime.localhost')
    console.log('\n2. Run the development server:')
    console.log('   npm run dev')
    console.log('\n3. Test the domains:')
    console.log('   - http://kimuraya.localhost:3000')
    console.log('   - http://ramen-taro.localhost:3000')
    console.log('   - http://sushi-hime.localhost:3000')

  } catch (error) {
    console.error('❌ Error adding test domains:', error)
    process.exit(1)
  }

  process.exit(0)
}

// スクリプト実行
addTestDomains().catch(console.error)