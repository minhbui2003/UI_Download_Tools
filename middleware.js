import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, verifyAuthToken } from './lib/auth';

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  
  // Public routes that don't need authentication
  const publicRoutes = ['/login', '/api/auth/login', '/api/setup'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Protect all other routes
  if (!isPublicRoute) {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      const payload = await verifyAuthToken(token);
      
      // Admin only routes
      if (pathname.startsWith('/admin') && payload.role !== 'admin') {
         return NextResponse.redirect(new URL('/', req.url));
      }

      return NextResponse.next();
    } catch (err) {
      // Invalid token
      const response = NextResponse.redirect(new URL('/login', req.url));
      response.cookies.delete(AUTH_COOKIE_NAME);
      return response;
    }
  }

  // If going to login but already authenticated, redirect based on role
  if (pathname === '/login') {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (token) {
      try {
        const payload = await verifyAuthToken(token);
        if (payload.role === 'admin') {
          return NextResponse.redirect(new URL('/admin/dashboard', req.url));
        } else {
          return NextResponse.redirect(new URL('/', req.url));
        }
      } catch (err) {
        // Token invalid, clear it, continue to login
        const response = NextResponse.next();
        response.cookies.delete(AUTH_COOKIE_NAME);
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
