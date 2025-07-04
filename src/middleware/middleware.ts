import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    if (!isValidRoute(request.nextUrl.pathname)) {
        return NextResponse.rewrite(new URL('/not-found', request.url));
    }
    return NextResponse.next();
}

function isValidRoute(pathname: string) {
    const validRoutes = ['/', '/projects', '/agencies'];
    return validRoutes.includes(pathname) || pathname.startsWith('/projects/');
}
