import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, verifyAuthToken } from './lib/auth';

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  
  const publicRoutes = ['/login', '/api'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (isPublicRoute) {
    if (pathname === '/login') {
      const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
      if (token) {
        try {
          const payload = await verifyAuthToken(token);
          if (payload.role === 'admin') {
            return NextResponse.redirect(new URL('/admin/dashboard', req.url));
          }
          return NextResponse.redirect(new URL('/', req.url));
        } catch (err) {
          const response = NextResponse.next();
          response.cookies.delete(AUTH_COOKIE_NAME);
          return response;
        }
      }
    }
    return NextResponse.next();
  }

  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const payload = await verifyAuthToken(token);
    
    if (pathname.startsWith('/admin') && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  } catch (err) {
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.png$|.*\\.jpg$|.*\\.ico$).*)'],
};
