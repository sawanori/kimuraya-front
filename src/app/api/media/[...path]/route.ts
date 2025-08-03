import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params
    const filename = resolvedParams.path.join('/')
    
    // まずローカルファイルをチェック
    const localPath = join(process.cwd(), 'public', 'uploads', filename)
    if (existsSync(localPath)) {
      const buffer = await readFile(localPath)
      
      // MIMEタイプを推定
      const ext = filename.split('.').pop()?.toLowerCase() || ''
      const mimeTypes: { [key: string]: string } = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        webp: 'image/webp',
        mp4: 'video/mp4',
        webm: 'video/webm',
        ogg: 'video/ogg',
        mov: 'video/quicktime',
      }
      
      const headers = new Headers()
      headers.set('Content-Type', mimeTypes[ext] || 'application/octet-stream')
      headers.set('Cache-Control', 'public, max-age=31536000')
      
      return new NextResponse(buffer, {
        status: 200,
        headers,
      })
    }
    
    // ローカルに存在しない場合はR2から取得を試みる
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: filename,
    })
    
    const response = await s3Client.send(command)
    
    // ストリームをバッファに変換
    const chunks = []
    for await (const chunk of response.Body as any) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)
    
    // レスポンスヘッダーの設定
    const headers = new Headers()
    if (response.ContentType) {
      headers.set('Content-Type', response.ContentType)
    }
    headers.set('Cache-Control', 'public, max-age=31536000')
    
    return new NextResponse(buffer, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error('Failed to fetch media:', error)
    return NextResponse.json({ error: 'Media not found' }, { status: 404 })
  }
}