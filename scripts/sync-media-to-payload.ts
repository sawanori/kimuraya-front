import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'
import FormData from 'form-data'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const UPLOADS_DIR = './public/uploads'

async function syncMediaToPayload() {
  try {
    console.log('🚀 Starting media sync to Payload CMS...')
    console.log(`Uploads directory: ${UPLOADS_DIR}`)

    // Initialize Payload
    const payload = await getPayload({ config })

    // Get all files from uploads directory
    const files = fs.readdirSync(UPLOADS_DIR).filter(file => {
      const filePath = path.join(UPLOADS_DIR, file)
      return fs.statSync(filePath).isFile()
    })

    console.log(`\n📁 Found ${files.length} files to sync`)

    let syncedCount = 0
    let skippedCount = 0

    // First, let's check what's already in the media collection
    const existingMedia = await payload.find({
      collection: 'media',
      limit: 1000,
    })
    
    const existingFilenames = new Set(existingMedia.docs.map(doc => doc.filename))
    console.log(`📋 Existing media documents: ${existingMedia.docs.length}`)

    for (const filename of files) {
      // Skip if already exists
      if (existingFilenames.has(filename)) {
        console.log(`⏭️  Skipping ${filename} (already exists)`)
        skippedCount++
        continue
      }

      const filePath = path.join(UPLOADS_DIR, filename)
      const fileBuffer = fs.readFileSync(filePath)
      const mimeType = filename.endsWith('.mp4') ? 'video/mp4' : 
                       filename.endsWith('.jpeg') || filename.endsWith('.jpg') ? 'image/jpeg' : 
                       'image/png'
      
      try {
        console.log(`\n📤 Creating media document for ${filename}...`)
        
        // Create media document with direct file buffer
        const mediaDoc = await payload.create({
          collection: 'media',
          data: {
            // Payload will handle the upload to R2
          },
          file: {
            data: fileBuffer,
            mimetype: mimeType,
            name: filename,
            size: fileBuffer.length,
          },
        })

        console.log(`✅ Created media document: ${mediaDoc.id}`)
        syncedCount++
      } catch (error) {
        console.error(`❌ Failed to create media document for ${filename}:`, error)
        skippedCount++
      }
    }

    console.log('\n✅ Media sync complete!')
    console.log(`📊 Summary:`)
    console.log(`   - Documents created: ${syncedCount}`)
    console.log(`   - Files skipped: ${skippedCount}`)
    console.log(`   - Total files: ${files.length}`)

    // Verify final state
    const finalMedia = await payload.find({
      collection: 'media',
      limit: 1000,
    })
    console.log(`\n📋 Final media collection count: ${finalMedia.docs.length}`)

    // Show some URLs as examples
    if (finalMedia.docs.length > 0) {
      console.log('\n🔗 Example URLs:')
      finalMedia.docs.slice(0, 3).forEach(doc => {
        console.log(`   - ${doc.filename}: ${doc.url}`)
      })
    }

  } catch (error) {
    console.error('❌ Media sync failed:', error)
    process.exit(1)
  }

  process.exit(0)
}

// Run sync
syncMediaToPayload()