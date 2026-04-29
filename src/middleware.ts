import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySession } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Inject pathname header for use in server components
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  const token = request.cookies.get('simex_session')?.value
  const session = token ? await verifySession(token) : null

  // --- Hide old /admin and /login routes (security: obscure them) ---
  if (pathname.startsWith('/admin') || pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // --- Protect /api/admin/* — ADMIN and STAFF only (must come before page checks) ---
  if (pathname.startsWith('/api/admin')) {
    if (!session || (session.role !== 'ADMIN' && session.role !== 'STAFF')) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  // --- Protect /api/delivery/* — DELIVERY, ADMIN, STAFF ---
  if (pathname.startsWith('/api/delivery')) {
    if (!session || (session.role !== 'DELIVERY' && session.role !== 'ADMIN' && session.role !== 'STAFF')) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  // --- Protect /simexdash/dashboard/* — ADMIN and STAFF only ---
  if (pathname.startsWith('/simexdash/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/simexdash', request.url))
    }
    if (session.role === 'DELIVERY') {
      return NextResponse.redirect(new URL('/delivery', request.url))
    }
    if (session.role !== 'ADMIN' && session.role !== 'STAFF') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // --- Protect /delivery/* — DELIVERY, ADMIN, STAFF ---
  if (pathname.startsWith('/delivery')) {
    if (!session) {
      return NextResponse.redirect(new URL('/simexdash', request.url))
    }
    if (session.role !== 'DELIVERY' && session.role !== 'ADMIN' && session.role !== 'STAFF') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
