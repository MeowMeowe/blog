import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/admin-auth';
import { successResponse, unauthorizedResponse, notFoundResponse } from '@/lib/api-response';
import { articleIdFrom, handleApiError } from '@/lib/http';

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!(await getAdminUser(['ADMIN']))) return unauthorizedResponse('需要管理员登录');
        const id = articleIdFrom((await params).id);
        const result = await prisma.article.updateMany({
            where: { id, deletedAt: { not: null } },
            data: { deletedAt: null, status: 'DRAFT', version: { increment: 1 } }
        });
        if (!result.count) return notFoundResponse('回收站中未找到文章');
        return successResponse({ id }, '已恢复为草稿，请检查后重新发布');
    } catch (error) {
        return handleApiError(error);
    }
}
