import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin');
    const isLoginPage = req.nextUrl.pathname === '/admin/login';

    // If accessing an admin page (except login) and not an admin
    if (isAdminPage && !isLoginPage) {
      if (!isAuth) {
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }
      if (token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // We handle logic inside the middleware function
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};
