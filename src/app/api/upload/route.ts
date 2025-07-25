import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }
    
    // ファイルタイプの検証
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }
    
    // ファイル名の生成
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // 拡張子の取得
    const ext = path.extname(file.name).toLowerCase()
    const filename = `${uuidv4()}${ext}`
    
    // 保存先ディレクトリの確保
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadDir, { recursive: true })
    
    // ファイルを保存
    const filepath = path.join(uploadDir, filename)
    await fs.writeFile(filepath, buffer)
    
    // URLを返す
    const url = `/uploads/${filename}`
    
    return NextResponse.json({ url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}