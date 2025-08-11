import { NextRequest, NextResponse } from 'next/server'
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

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

export async function GET(_request: NextRequest) {
  console.log('Media list API called')
  console.log('S3_ENDPOINT:', process.env.S3_ENDPOINT)
  console.log('S3_BUCKET:', process.env.S3_BUCKET)
  
  try {
    // R2バケットからオブジェクト一覧を取得
    const command = new ListObjectsV2Command({
      Bucket: process.env.S3_BUCKET!,
      MaxKeys: 1000, // 最大1000個まで取得
    })
    
    const response = await s3Client.send(command)
    console.log('S3 response received, contents:', response.Contents?.length || 0)
    
    // ファイル情報を整形
    const files = (response.Contents || []).map(item => ({
      key: item.Key,
      url: `/api/media/${item.Key}`,
      size: item.Size,
      lastModified: item.LastModified,
      isImage: /\.(jpg|jpeg|png|gif|webp)$/i.test(item.Key || ''),
      isVideo: /\.(mp4|webm|ogg|mov)$/i.test(item.Key || ''),
    })).filter(file => file.isImage || file.isVideo) // 画像と動画のみフィルタリング
    
    // 最新のものから順にソート
    files.sort((a, b) => {
      const dateA = a.lastModified ? new Date(a.lastModified).getTime() : 0
      const dateB = b.lastModified ? new Date(b.lastModified).getTime() : 0
      return dateB - dateA
    })
    
    console.log('Returning files:', files.length)
    return NextResponse.json({ files })
  } catch (error) {
    console.error('Failed to list media:', error)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: 'Failed to list media files', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}