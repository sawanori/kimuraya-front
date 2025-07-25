import { getPayload } from 'payload'
import config from '../../payload.config'

async function seed() {
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