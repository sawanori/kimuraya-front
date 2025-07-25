import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Protect /home route - this is for authenticated users only
  if (pathname.startsWith('/home')) {
    const token = request.cookies.get('payload-token')
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Protect /admin routes - require authentication
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('payload-token')
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/home/:path*', '/admin/:path*']
}