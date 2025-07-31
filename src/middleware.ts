import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * テナント判定とルート保護を行うミドルウェア
 * - ドメイン名からテナントを判定
 * - 認証が必要なルートを保護
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const host = request.headers.get('host')
  
  // テナント判定ミドルウェア（環境変数で制御）
  if (process.env.NEXT_PUBLIC_ENABLE_HOST_MW === 'true' && host) {
    // 静的ファイルやAPIルートはスキップ
    if (!pathname.startsWith('/_next') && 
        !pathname.startsWith('/api/_') && 
        pathname !== '/favicon.ico') {
      
      // Payload APIへのリクエストにテナントクエリを追加
      if (pathname.startsWith('/api')) {
        const url = request.nextUrl.clone()
        
        // 既存のクエリパラメータを保持しつつ、テナントフィルタを追加
        url.searchParams.set('where[tenant.domains.url][equals]', host)
        url.searchParams.set('where[tenant.domains.isActive][equals]', 'true')
        
        return NextResponse.rewrite(url)
      }
      
      // 通常のページリクエストの場合、ヘッダーにテナント情報を追加
      const response = NextResponse.next()
      response.headers.set('x-tenant-host', host)
      
      // 認証チェックを継続
      if (pathname.startsWith('/home')) {
        const token = request.cookies.get('payload-token')
        
        if (!token) {
          return NextResponse.redirect(new URL('/login', request.url))
        }
      }
      
      if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        const token = request.cookies.get('payload-token')
        
        if (!token) {
          return NextResponse.redirect(new URL('/login', request.url))
        }
      }
      
      return response
    }
  }
  
  // テナント判定が無効の場合、従来の認証チェックのみ実行
  if (pathname.startsWith('/home')) {
    const token = request.cookies.get('payload-token')
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('payload-token')
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  // 全てのルートを対象にする（開発フェーズ）
  // 本番環境では必要に応じて絞り込む
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}