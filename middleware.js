import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, verifyAuthToken } from './lib/auth';

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  
  // Protect /admin/dashboard and other admin routes EXCEPT /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    try {
      await verifyAuthToken(token);
      return NextResponse.next();
    } catch (err) {
      // Invalid token
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  // If going to login but already authenticated, redirect to dashboard
  if (pathname === '/admin/login') {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (token) {
      try {
        await verifyAuthToken(token);
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
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
  matcher: ['/admin/:path*'],
};
