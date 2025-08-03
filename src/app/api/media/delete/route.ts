import { NextRequest, NextResponse } from 'next/server'
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'

// R2クライアントの初期化
const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT!,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true,
})

export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json()
    
    if (!key) {
      return NextResponse.json({ error: 'No key provided' }, { status: 400 })
    }
    
    console.log('Deleting file from R2:', key)
    
    // R2から削除
    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
    })
    
    await s3Client.send(command)
    console.log('File deleted successfully:', key)
    
    return NextResponse.json({ success: true, message: 'File deleted successfully' })
  } catch (error) {
    console.error('Failed to delete file:', error)
    return NextResponse.json({ 
      error: 'Failed to delete file', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}