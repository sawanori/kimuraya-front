import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs'
import path from 'path'
import { S3 } from 'aws-sdk'
import * as dotenv from 'dotenv'
import mime from 'mime-types'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const UPLOADS_DIR = './public/uploads'

async function bulkUploadToR2() {
  try {
    console.log('🚀 Starting bulk upload to R2...')
    console.log(`Uploads directory: ${UPLOADS_DIR}`)
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

    // Get all files from uploads directory
    const files = fs.readdirSync(UPLOADS_DIR).filter(file => {
      const filePath = path.join(UPLOADS_DIR, file)
      return fs.statSync(filePath).isFile()
    })

    console.log(`\n📁 Found ${files.length} files to upload`)

    let uploadedCount = 0
    let failedCount = 0

    for (const filename of files) {
      const filePath = path.join(UPLOADS_DIR, filename)
      const fileStats = fs.statSync(filePath)
      const mimeType = mime.lookup(filename) || 'application/octet-stream'
      
      try {
        console.log(`\n📤 Uploading ${filename}...`)
        
        // 1. Upload to R2
        await s3
          .upload({
            Bucket: process.env.S3_BUCKET!,
            Key: filename,
            Body: fs.readFileSync(filePath),
            ACL: 'public-read',
            ContentType: mimeType,
          })
          .promise()

        const url = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${filename}`
        console.log(`✅ Uploaded to R2: ${url}`)

        // 2. Create media document in Payload CMS
        try {
          // Check if media already exists
          const existing = await payload.find({
            collection: 'media',
            where: {
              filename: {
                equals: filename
              }
            },
            limit: 1
          })

          if (existing.docs.length > 0) {
            console.log(`⏭️  Media document already exists for ${filename}`)
          } else {
            // Create new media document
            const mediaDoc = await payload.create({
              collection: 'media',
              data: {
                filename,
                url,
                mimeType,
                filesize: fileStats.size,
                alt: filename.replace(/\.[^/.]+$/, ''), // Remove extension for alt text
                // Note: tenant field will be auto-filled by hooks if user has currentTenant
              },
            })
            console.log(`✅ Created media document: ${mediaDoc.id}`)
          }
        } catch (mediaError) {
          console.error(`⚠️  Failed to create media document for ${filename}:`, mediaError)
          // Continue even if media document creation fails
        }

        uploadedCount++
      } catch (error) {
        console.error(`❌ Failed to upload ${filename}:`, error)
        failedCount++
      }
    }

    console.log('\n✅ Bulk upload complete!')
    console.log(`📊 Summary:`)
    console.log(`   - Files uploaded: ${uploadedCount}`)
    console.log(`   - Files failed: ${failedCount}`)
    console.log(`   - Total files: ${files.length}`)
    console.log(`\n🔗 Base URL: ${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/`)

    // List all media documents to verify
    console.log('\n📋 Verifying media collection...')
    const allMedia = await payload.find({
      collection: 'media',
      limit: 100,
    })
    console.log(`   - Total media documents: ${allMedia.docs.length}`)

  } catch (error) {
    console.error('❌ Bulk upload failed:', error)
    process.exit(1)
  }

  process.exit(0)
}

// Run bulk upload
bulkUploadToR2()