import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Ruta de admin solo para administradores
    if (path.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/biblioteca', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname

        // Rutas públicas
        if (path === '/' || path.startsWith('/login') || path.startsWith('/registro')) {
          return true
        }

        // Rutas protegidas requieren autenticación
        return !!token
      }
    }
  }
)

export const config = {
  matcher: [
    '/biblioteca/:path*',
    '/buscador/:path*',
    '/chat/:path*',
    '/boletin/:path*',
    '/admin/:path*'
  ]
}
