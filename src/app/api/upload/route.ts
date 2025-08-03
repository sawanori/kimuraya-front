import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

// R2クライアントの初期化
const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT!,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true, // R2の場合は必要
})

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API called')
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      console.error('No file in request')
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }
    
    console.log('File received:', file.name, 'Type:', file.type, 'Size:', file.size)
    
    // ファイルタイプの検証
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
    const validTypes = [...validImageTypes, ...validVideoTypes]
    
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }
    
    // ファイルサイズの検証（動画は100MB、画像は10MBまで）
    const maxSize = validVideoTypes.includes(file.type) ? 100 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `File size exceeds limit (${validVideoTypes.includes(file.type) ? '100MB' : '10MB'})` 
      }, { status: 400 })
    }
    
    // ファイル名の生成
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // 拡張子の取得
    const ext = path.extname(file.name).toLowerCase()
    const filename = `${uuidv4()}${ext}`
    
    // R2にアップロード
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: filename,
      Body: buffer,
      ContentType: file.type,
      // R2はACLをサポートしていないため削除
    })
    
    console.log('Uploading to R2:', filename)
    await s3Client.send(command)
    console.log('Upload successful')
    
    // プロキシエンドポイント経由でアクセスするURLを生成
    const url = `/api/media/${filename}`
    console.log('Generated URL:', url)
    
    return NextResponse.json({ url })
  } catch (error) {
    console.error('Upload error details:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to upload file', details: errorMessage }, { status: 500 })
  }
}