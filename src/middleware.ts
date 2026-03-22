import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  const isAuthRoute = pathname.startsWith('/api/auth') || pathname === '/login' || pathname === '/register';
  const isAdminRoute = pathname.startsWith('/admin');
  const isDashboardRoute = pathname.startsWith('/dashboard');

  if (!token) {
    if (isAdminRoute || isDashboardRoute) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your_jwt_secret_here');
    const { payload } = await jwtVerify(token, secret);

    if (isAdminRoute && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url)); // Unauthorized for admin
    }

    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', req.url)); // Already logged in
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/register'],
};
