import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_12345';
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  
  // Protect /admin/dashboard and other admin routes EXCEPT /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = req.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    try {
      await jwtVerify(token, encodedSecret);
      return NextResponse.next();
    } catch (err) {
      // Invalid token
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  // If going to login but already authenticated, redirect to dashboard
  if (pathname === '/admin/login') {
    const token = req.cookies.get('auth_token')?.value;
    if (token) {
      try {
        await jwtVerify(token, encodedSecret);
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      } catch (err) {
        // Token invalid, clear it, continue to login
        const response = NextResponse.next();
        response.cookies.delete('auth_token');
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
