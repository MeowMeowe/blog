import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getAdminPath } from '@/lib/admin-path';
import prisma from '@/lib/prisma';
import { allowedRequestOrigin } from '@/lib/request-origin';

const INTERNAL_ADMIN_PATH = '/admin';
const ADMIN_PATH = getAdminPath();
const ADMIN_LOGIN_PATH = `${ADMIN_PATH}/login`;
const publicReadApiPaths = ['/api/articles', '/api/article/detail', '/api/tags'];

function matchesPath(pathname: string, path: string) {
    return pathname === path || pathname.startsWith(`${path}/`);
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isMutation = !['GET', 'HEAD', 'OPTIONS'].includes(request.method);
    const origin = request.headers.get('origin');
    const fetchSite = request.headers.get('sec-fetch-site');

    if (['/api/auth/signin', '/api/auth/error'].some((path) => matchesPath(pathname, path))) {
        return new NextResponse(null, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    }

    if (matchesPath(pathname, '/api/test')) {
        return new NextResponse(null, {
            status: 404,
            headers: {
                'Cache-Control': 'no-store'
            }
        });
    }

    if (
        pathname.startsWith('/api/') &&
        isMutation &&
        (fetchSite === 'cross-site' || (origin && !allowedRequestOrigin(origin, request.headers.get('host'), request.nextUrl.protocol, process.env.NEXTAUTH_URL)))
    ) {
        return NextResponse.json(
            {
                code: 403,
                data: null,
                msg: 'Cross-origin request blocked'
            },
            { status: 403 }
        );
    }

    if (matchesPath(pathname, INTERNAL_ADMIN_PATH)) {
        return new NextResponse(null, {
            status: 404,
            headers: {
                'Cache-Control': 'no-store',
                'X-Robots-Tag': 'noindex, nofollow, noarchive'
            }
        });
    }

    const isHiddenAdminPath = matchesPath(pathname, ADMIN_PATH);
    if (isHiddenAdminPath) {
        const isLoginPath = pathname === ADMIN_LOGIN_PATH;
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET
        });

        const currentUser =
            token?.id && Number.isSafeInteger(Number(token.id)) ? await prisma.user.findUnique({ where: { id: Number(token.id) }, select: { role: true, sessionVersion: true } }) : null;
        const validSession = currentUser && currentUser.sessionVersion === token?.sessionVersion && ['ADMIN', 'EDITOR'].includes(currentUser.role);
        if (!isLoginPath && !validSession) {
            const url = new URL(ADMIN_LOGIN_PATH, process.env.NEXTAUTH_URL || request.url);
            url.searchParams.set('callbackUrl', `${pathname}${request.nextUrl.search}`);
            return NextResponse.redirect(url);
        }

        const rewriteUrl = new URL(request.url);
        rewriteUrl.pathname = `${INTERNAL_ADMIN_PATH}${pathname.slice(ADMIN_PATH.length)}`;
        const response = NextResponse.rewrite(rewriteUrl);
        response.headers.set('Cache-Control', 'no-store');
        response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
        return response;
    }

    const isAuthApi = matchesPath(pathname, '/api/auth');
    const isPublicReadApi = request.method === 'GET' && publicReadApiPaths.some((path) => matchesPath(pathname, path));
    const isPublicMedia = ['GET', 'HEAD'].includes(request.method) && matchesPath(pathname, '/api/media');
    const isPublicView = request.method === 'POST' && matchesPath(pathname, '/api/article/view');
    const isPublicApi = isAuthApi || isPublicReadApi || isPublicMedia || isPublicView;
    const isProtectedApi = pathname.startsWith('/api/') && !isPublicApi;

    if (isProtectedApi) {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET
        });

        if (!token) {
            return NextResponse.json(
                {
                    code: 401,
                    data: null,
                    msg: 'Unauthorized'
                },
                { status: 401 }
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|cat.ico|img/|icon/|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)']
};
