import { Client } from 'pg'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function testConnection() {
  console.log('Testing PostgreSQL connection...\n')
  
  const connectionString = process.env.DATABASE_URI || 'postgresql://noritakasawada@localhost:5432/kimuraya'
  console.log('Connection string:', connectionString.replace(/:[^:@]*@/, ':****@')) // Hide password
  
  const client = new Client({
    connectionString: connectionString
  })

  try {
    await client.connect()
    console.log('✅ Successfully connected to PostgreSQL\n')
    
    // Test query
    const result = await client.query('SELECT version()')
    console.log('PostgreSQL version:', result.rows[0].version)
    
    // Check if database exists
    const dbCheck = await client.query(`
      SELECT datname FROM pg_database WHERE datname = 'kimuraya'
    `)
    
    if (dbCheck.rows.length > 0) {
      console.log('✅ Database "kimuraya" exists')
    } else {
      console.log('❌ Database "kimuraya" does not exist')
      console.log('\nPlease create the database with:')
      console.log('psql -U postgres -c "CREATE DATABASE kimuraya;"')
    }
    
    await client.end()
    process.exit(0)
  } catch (error) {
    console.error('❌ Connection failed:', error)
    console.log('\nTroubleshooting tips:')
    console.log('1. Make sure PostgreSQL is running:')
    console.log('   brew services start postgresql@16  (macOS)')
    console.log('   sudo systemctl start postgresql   (Linux)')
    console.log('\n2. Check if the database exists:')
    console.log('   psql -U postgres -c "\\l"')
    console.log('\n3. Create the database if needed:')
    console.log('   psql -U postgres -c "CREATE DATABASE kimuraya;"')
    console.log('\n4. Check your .env.local file has the correct DATABASE_URI')
    
    process.exit(1)
  }
}

testConnection()