import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/admin-auth';
import { successResponse, unauthorizedResponse, notFoundResponse } from '@/lib/api-response';
import { articleIdFrom, handleApiError } from '@/lib/http';
import { articleFormData, articleRelations } from '@/lib/article-management';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!(await getAdminUser())) return unauthorizedResponse('请重新登录');
        const id = articleIdFrom((await params).id);
        const article = await prisma.article.findFirst({ where: { id, deletedAt: null }, include: articleRelations });
        if (!article) return notFoundResponse('文章不存在或已移入回收站');
        return successResponse(articleFormData(article));
    } catch (error) {
        return handleApiError(error);
    }
}
