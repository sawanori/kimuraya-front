import { Client } from 'pg'
import * as dotenv from 'dotenv'
import path from 'path'

// 環境変数を読み込む
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

/**
 * 直接データベースにテスト用ドメインを追加するスクリプト
 * 
 * Run with: npx tsx src/seed/add-test-domains-direct.ts
 */

async function addTestDomainsDirect() {
  console.log('🌐 Adding test domains to tenants directly...\n')

  const client = new Client({
    connectionString: process.env.DATABASE_URI || 'postgresql://noritakasawada@localhost:5432/kimuraya'
  })

  try {
    await client.connect()
    console.log('✅ Connected to PostgreSQL\n')

    // 既存のテナントを確認
    const tenantsResult = await client.query('SELECT id, name, slug FROM tenants')
    
    if (tenantsResult.rows.length === 0) {
      console.log('No tenants found. Creating test tenants...')
      
      // テストテナントを作成
      const testTenants = [
        { name: '木村屋本店', slug: 'kimuraya-honten' },
        { name: 'ラーメン太郎', slug: 'ramen-taro' },
        { name: '寿司姫', slug: 'sushi-hime' },
      ]
      
      for (const tenant of testTenants) {
        const insertResult = await client.query(
          'INSERT INTO tenants (name, slug, status, is_default, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id',
          [tenant.name, tenant.slug, 'active', tenant.slug === 'kimuraya-honten']
        )
        console.log(`✅ Created tenant: ${tenant.name} (ID: ${insertResult.rows[0].id})`)
      }
      
      // 再度テナントを取得
      const updatedTenantsResult = await client.query('SELECT id, name, slug FROM tenants')
      tenantsResult.rows = updatedTenantsResult.rows
    }

    console.log('\n📋 Current tenants:')
    tenantsResult.rows.forEach(tenant => {
      console.log(`   - ${tenant.name} (${tenant.slug})`)
    })

    // domainsカラムを更新
    const domainUpdates = [
      {
        slug: 'kimuraya-honten',
        domains: [
          { url: 'kimuraya.localhost', isActive: true },
          { url: 'localhost', isActive: true },
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

    console.log('\n🔄 Updating domains...')
    for (const update of domainUpdates) {
      const result = await client.query(
        'UPDATE tenants SET domains = $1, updated_at = NOW() WHERE slug = $2 RETURNING name',
        [JSON.stringify(update.domains), update.slug]
      )
      
      if (result.rows.length > 0) {
        console.log(`✅ Updated ${result.rows[0].name} with domains:`)
        update.domains.forEach(d => console.log(`   - ${d.url}`))
      }
    }

    console.log('\n📝 Next steps:')
    console.log('1. Add these entries to your /etc/hosts file:')
    console.log('   sudo sh -c "echo \'127.0.0.1   kimuraya.localhost\' >> /etc/hosts"')
    console.log('   sudo sh -c "echo \'127.0.0.1   ramen-taro.localhost\' >> /etc/hosts"')
    console.log('   sudo sh -c "echo \'127.0.0.1   sushi-hime.localhost\' >> /etc/hosts"')
    console.log('\n2. Run the development server:')
    console.log('   npm run dev')
    console.log('\n3. Test the domains:')
    console.log('   - http://kimuraya.localhost:3000 (木村屋本店)')
    console.log('   - http://ramen-taro.localhost:3000 (ラーメン太郎)')
    console.log('   - http://sushi-hime.localhost:3000 (寿司姫)')

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

// スクリプト実行
addTestDomainsDirect().catch(console.error)