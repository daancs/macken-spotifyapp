import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt';

import { env } from './env.mjs';

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        //'/((?!api/*|_next/static/*|_next/image|img|favicon.ico).*)',
        //Protected paths:
        '/playback'
    ],
}

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: env.NEXTAUTH_SECRET,
    });

    if (!request.nextUrl.pathname.startsWith('/')) {
        if (token) {
            return NextResponse.redirect(new URL('/home', request.url));
        }
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL('/', request.url))
    }


}