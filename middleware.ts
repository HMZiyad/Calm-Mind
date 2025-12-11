import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

const PROTECTED_ROUTES = ['/meditate', '/progress', '/session', '/history'];

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isProtectedRoute = PROTECTED_ROUTES.some((route) => path.startsWith(route));

    if (isProtectedRoute) {
        const cookie = request.cookies.get('session')?.value;
        const session = await decrypt(cookie || '');

        if (!session?.user) {
            return NextResponse.redirect(new URL('/login', request.nextUrl));
        }
    }

    // Redirect authenticated users away from auth pages
    if (path.startsWith('/login') || path.startsWith('/signup')) {
        const cookie = request.cookies.get('session')?.value;
        const session = await decrypt(cookie || '');
        if (session?.user) {
            return NextResponse.redirect(new URL('/', request.nextUrl));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
