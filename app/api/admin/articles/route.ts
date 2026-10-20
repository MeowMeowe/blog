import { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/admin-auth';
import { successResponse, unauthorizedResponse, forbiddenResponse } from '@/lib/api-response';
import { articleQuerySchema } from '@/lib/validation';
import { handleApiError, RequestError } from '@/lib/http';

export async function GET(request: NextRequest) {
    try {
        const user = await getAdminUser();
        if (!user) return unauthorizedResponse('请重新登录');
        const parsed = articleQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
        if (!parsed.success) throw new RequestError('分页或搜索参数不正确');
        const { page, pageSize, search } = parsed.data;
        const status = request.nextUrl.searchParams.get('status');
        const deleted = request.nextUrl.searchParams.get('deleted') === 'true';
        if (deleted && user.role !== 'ADMIN') return forbiddenResponse('只有管理员可查看回收站');
        if (status && !['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) throw new RequestError('状态不正确');
        const where: Prisma.ArticleWhereInput = {
            deletedAt: deleted ? { not: null } : null,
            ...(status ? { status: status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' } : {}),
            ...(search ? { OR: [{ title: { contains: search } }, { description: { contains: search } }] } : {})
        };
        const [total, articles] = await prisma.$transaction([
            prisma.article.count({ where }),
            prisma.article.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
                select: {
                    id: true,
                    title: true,
                    description: true,
                    status: true,
                    viewCount: true,
                    starCount: true,
                    updatedAt: true,
                    publishedAt: true,
                    deletedAt: true,
                    version: true,
                    tags: { select: { tag: { select: { id: true, name: true, color: true } } } },
                    author: { select: { displayName: true, username: true } }
                }
            })
        ]);
        return successResponse({
            articles: articles.map((article) => ({ ...article, author: article.author?.displayName || article.author?.username || '未设置', tags: article.tags.map(({ tag }) => tag) })),
            pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) }
        });
    } catch (error) {
        return handleApiError(error);
    }
}
