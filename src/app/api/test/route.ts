import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    message: 'API is working',
    timestamp: new Date().toISOString(),
    env: {
      hasS3Endpoint: !!process.env.S3_ENDPOINT,
      hasS3Bucket: !!process.env.S3_BUCKET,
      hasS3AccessKey: !!process.env.S3_ACCESS_KEY,
      hasS3SecretKey: !!process.env.S3_SECRET_KEY,
    }
  })
}