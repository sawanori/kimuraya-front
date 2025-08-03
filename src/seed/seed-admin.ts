import { getPayload } from 'payload'
import config from '../../payload.config'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
// Only load .env.local in development
if (!process.env.DATABASE_URI) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
}

async function seed() {
  console.log('Starting seed process...')
  console.log('DATABASE_URI:', process.env.DATABASE_URI ? 'Set' : 'Not set')
  const payload = await getPayload({ config })

  try {
    // Check if admin user already exists
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'admin@example.com',
        },
      },
    })

    if (existingUsers.docs.length === 0) {
      // Create admin user
      const admin = await payload.create({
        collection: 'users',
        data: {
          email: 'admin@example.com',
          password: 'password123',
          name: 'Admin',
          role: 'admin',
        },
      })
      console.log('管理者ユーザーを作成しました:', admin)
    } else {
      console.log('管理者ユーザーは既に存在します')
    }

    process.exit(0)
  } catch (error) {
    console.error('エラー:', error)
    process.exit(1)
  }
}

seed()