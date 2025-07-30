import { getPayload } from 'payload'
import config from '../../payload.config'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// テスト用ユーザーデータ
const testUsers = [
  {
    email: 'admin@example.com',
    password: 'password123',
    name: '管理者',
    role: 'admin',
  },
  {
    email: 'manager@kimuraya.com',
    password: 'manager2024',
    name: 'レストランマネージャー',
    role: 'admin',
  },
  {
    email: 'editor@kimuraya.com',
    password: 'editor2024',
    name: 'コンテンツ編集者',
    role: 'admin',
  },
  {
    email: 'test@kimuraya.com',
    password: 'test2024',
    name: 'テストユーザー',
    role: 'admin',
  },
]

async function seedUsers() {
  const payload = await getPayload({ config })

  try {
    console.log('ユーザーの作成を開始します...\n')

    for (const userData of testUsers) {
      // ユーザーが既に存在するかチェック
      const existingUsers = await payload.find({
        collection: 'users',
        where: {
          email: {
            equals: userData.email,
          },
        },
      })

      if (existingUsers.docs.length === 0) {
        // ユーザーを作成
        const user = await payload.create({
          collection: 'users',
          data: userData,
        })
        console.log(`✅ ユーザーを作成しました:`)
        console.log(`   メール: ${userData.email}`)
        console.log(`   パスワード: ${userData.password}`)
        console.log(`   名前: ${userData.name}`)
        console.log(`   権限: ${userData.role}\n`)
      } else {
        console.log(`⏭️  ユーザーは既に存在します: ${userData.email}\n`)
      }
    }

    console.log('\n=====================================')
    console.log('ログイン情報:')
    console.log('=====================================')
    testUsers.forEach(user => {
      console.log(`\n${user.name}:`)
      console.log(`  メール: ${user.email}`)
      console.log(`  パスワード: ${user.password}`)
    })
    console.log('\n=====================================\n')

    process.exit(0)
  } catch (error) {
    console.error('エラー:', error)
    process.exit(1)
  }
}

seedUsers()