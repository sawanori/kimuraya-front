// Cloudflare Workers用アップロードハンドラー
export default {
  async fetch(request, env) {
    // CORSヘッダー
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    // OPTIONSリクエストの処理
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    // POSTリクエストのみ許可
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: corsHeaders 
      })
    }

    try {
      const formData = await request.formData()
      const file = formData.get('file')
      
      if (!file) {
        return new Response(JSON.stringify({ error: 'No file uploaded' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // ファイルタイプの検証
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg']
      const validTypes = [...validImageTypes, ...validVideoTypes]
      
      if (!validTypes.includes(file.type)) {
        return new Response(JSON.stringify({ error: 'Invalid file type' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // ファイルサイズの検証
      const maxSize = validVideoTypes.includes(file.type) ? 100 * 1024 * 1024 : 10 * 1024 * 1024
      if (file.size > maxSize) {
        return new Response(JSON.stringify({ 
          error: `File size exceeds limit (${validVideoTypes.includes(file.type) ? '100MB' : '10MB'})` 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // ユニークなファイル名を生成
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const ext = file.name.split('.').pop()
      const filename = `${timestamp}-${randomString}.${ext}`
      
      // R2にアップロード
      const objectKey = `uploads/${filename}`
      await env.R2_BUCKET.put(objectKey, file.stream(), {
        httpMetadata: {
          contentType: file.type,
        },
      })

      // 公開URLを生成
      const url = `${env.PUBLIC_BUCKET_URL}/${objectKey}`
      
      return new Response(JSON.stringify({ url }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
      
    } catch (error) {
      console.error('Upload error:', error)
      return new Response(JSON.stringify({ error: 'Failed to upload file' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  },
}