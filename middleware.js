import { NextResponse } from 'next/server';

export function middleware(request) {
    // Check if accessing admin pages (excluding login)
    if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
        const token = request.cookies.get('admin_token');

        // If no token, redirect to login
        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
