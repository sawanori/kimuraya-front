import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs'
import path from 'path'
import { S3 } from 'aws-sdk'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const OLD_UPLOADS_DIR = process.env.OLD_UPLOADS_DIR || './public/uploads'

async function migrateMediaToR2() {
  try {
    console.log('🚀 Starting media migration to R2...')
    console.log(`Old uploads directory: ${OLD_UPLOADS_DIR}`)
    console.log(`S3 Endpoint: ${process.env.S3_ENDPOINT}`)
    console.log(`S3 Bucket: ${process.env.S3_BUCKET}`)

    // Initialize Payload
    const payload = await getPayload({ config })

    // Initialize S3 client for R2
    const s3 = new S3({
      endpoint: process.env.S3_ENDPOINT,
      region: 'auto',
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
      s3ForcePathStyle: true,
      signatureVersion: 'v4'
    })

    // 1. Process all media documents
    console.log('\n📁 Processing media collection...')
    let page = 1
    let done = false
    let migratedCount = 0
    let skippedCount = 0

    while (!done) {
      const media = await payload.find({
        collection: 'media',
        depth: 0,
        limit: 100,
        page,
      })

      if (!media.docs.length) break

      for (const doc of media.docs) {
        // Check if URL needs migration (not already on R2)
        if (doc.url && !doc.url.includes(process.env.S3_ENDPOINT!)) {
          const filename = doc.filename || path.basename(doc.url)
          const filePath = path.join(OLD_UPLOADS_DIR, filename)
          
          if (!fs.existsSync(filePath)) {
            console.warn(`⚠️  FILE NOT FOUND: ${filePath}`)
            skippedCount++
            continue
          }

          try {
            // Upload to R2
            console.log(`📤 Uploading ${filename}...`)
            await s3
              .upload({
                Bucket: process.env.S3_BUCKET!,
                Key: filename,
                Body: fs.readFileSync(filePath),
                ACL: 'public-read',
                ContentType: doc.mimeType || 'application/octet-stream',
              })
              .promise()

            // Update Media document with new URL
            const newUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${filename}`
            await payload.update({
              collection: 'media',
              id: doc.id,
              data: {
                url: newUrl,
              },
            })

            console.log(`✅ Migrated: ${filename} -> ${newUrl}`)
            migratedCount++
          } catch (error) {
            console.error(`❌ Failed to migrate ${filename}:`, error)
            skippedCount++
          }
        } else {
          console.log(`⏭️  Skipping (already on R2): ${doc.filename}`)
          skippedCount++
        }
      }

      done = !media.hasNextPage
      page++
    }

    // 2. Update rich text content with direct URLs
    console.log('\n📝 Updating rich text content...')
    const oldBases = [
      'https://pub-80984284daff45c78d253da105894787.r2.dev',
      'http://localhost:3000/uploads',
      'http://localhost:3001/uploads',
      'http://localhost:3002/uploads',
      '/uploads'
    ]
    const newBase = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}`

    // Check if we have Pages collection
    try {
      page = 1
      done = false
      let pagesUpdated = 0

      while (!done) {
        const pages = await payload.find({ 
          collection: 'pages', 
          limit: 100, 
          page 
        })

        for (const p of pages.docs) {
          let contentStr = JSON.stringify(p)
          let updated = false

          for (const oldBase of oldBases) {
            if (contentStr.includes(oldBase)) {
              contentStr = contentStr.replaceAll(oldBase, newBase)
              updated = true
            }
          }

          if (updated) {
            const updatedContent = JSON.parse(contentStr)
            await payload.update({ 
              collection: 'pages', 
              id: p.id, 
              data: updatedContent 
            })
            console.log(`✅ Updated URLs in page: ${p.id}`)
            pagesUpdated++
          }
        }

        done = !pages.hasNextPage
        page++
      }

      console.log(`\n📊 Pages updated: ${pagesUpdated}`)
    } catch (error) {
      console.log('ℹ️  Pages collection not found or error accessing it')
    }

    // 3. Also check page-content.json for any hardcoded URLs
    const pageContentPath = path.join(process.cwd(), 'src/data/page-content.json')
    if (fs.existsSync(pageContentPath)) {
      console.log('\n📄 Checking page-content.json...')
      let content = fs.readFileSync(pageContentPath, 'utf-8')
      let updated = false

      for (const oldBase of oldBases) {
        if (content.includes(oldBase)) {
          content = content.replaceAll(oldBase, newBase)
          updated = true
        }
      }

      if (updated) {
        fs.writeFileSync(pageContentPath, content, 'utf-8')
        console.log('✅ Updated URLs in page-content.json')
      } else {
        console.log('ℹ️  No URLs to update in page-content.json')
      }
    }

    console.log('\n✅ Migration complete!')
    console.log(`📊 Summary:`)
    console.log(`   - Media migrated: ${migratedCount}`)
    console.log(`   - Media skipped: ${skippedCount}`)
    console.log(`   - New base URL: ${newBase}`)

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }

  process.exit(0)
}

// Run migration
migrateMediaToR2()