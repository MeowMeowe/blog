import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/admin-auth';
import { successResponse, unauthorizedResponse } from '@/lib/api-response';

export async function GET() {
    const user = await getAdminUser();
    if (!user) return unauthorizedResponse();

    const [total, published, drafts, archived, tags, techStacks, totalViews, recent] = await Promise.all([
        prisma.article.count({ where: { deletedAt: null } }),
        prisma.article.count({ where: { status: 'PUBLISHED', deletedAt: null } }),
        prisma.article.count({ where: { status: 'DRAFT', deletedAt: null } }),
        prisma.article.count({ where: { status: 'ARCHIVED', deletedAt: null } }),
        prisma.tag.count(),
        prisma.techStack.count(),
        prisma.article.aggregate({ where: { deletedAt: null }, _sum: { viewCount: true } }),
        prisma.article.findMany({
            where: { deletedAt: null },
            take: 6,
            orderBy: { updatedAt: 'desc' },
            select: {
                id: true,
                title: true,
                status: true,
                viewCount: true,
                updatedAt: true
            }
        })
    ]);

    return successResponse({
        counts: {
            total,
            published,
            drafts,
            archived,
            tags,
            techStacks,
            views: totalViews._sum.viewCount || 0
        },
        recent
    });
}
