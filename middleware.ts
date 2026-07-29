import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// 需要认证的路径
const protectedPaths = ['/admin'];

// 公开的 API 路径（不需要认证）
const publicApiPaths = ['/api/articles', '/api/article/detail', '/api/tags'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 检查是否是受保护的路径
    const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));
    const isProtectedApi = pathname.startsWith('/api/') && !publicApiPaths.some((path) => pathname.startsWith(path));

    if (isProtectedPath || isProtectedApi) {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET
        });

        // 如果没有 token，重定向到登录页
        if (!token) {
            if (isProtectedApi) {
                return NextResponse.json(
                    {
                        code: 401,
                        data: null,
                        msg: 'Unauthorized'
                    },
                    { status: 401 }
                );
            }

            const url = new URL('/admin/login', request.url);
            url.searchParams.set('callbackUrl', encodeURI(pathname));
            return NextResponse.redirect(url);
        }

        // 检查管理员权限
        if ((isProtectedApi && pathname.includes('/create')) || pathname.includes('/delete')) {
            if (token.role !== 'ADMIN' && token.role !== 'EDITOR') {
                return NextResponse.json(
                    {
                        code: 403,
                        data: null,
                        msg: 'Forbidden'
                    },
                    { status: 403 }
                );
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|public).*)'
    ]
};
