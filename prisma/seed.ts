import { PrismaClient } from '../src/generated/prisma'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const plainPassword = 'password123'
  const hash = await bcrypt.hash(plainPassword, 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      role: 'admin',
      hash: hash,
      isSuperAdmin: true,
    },
  })

  console.log('✅ Admin user created:', admin)
}

main()
  .catch((e) => {
    console.error('❌ Failed to seed admin user:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })