import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/admin-auth';
import { successResponse, unauthorizedResponse } from '@/lib/api-response';
import { articleIdFrom, handleApiError } from '@/lib/http';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!(await getAdminUser())) return unauthorizedResponse('请重新登录');
        const articleId = articleIdFrom((await params).id);
        const revisions = await prisma.articleRevision.findMany({
            where: { articleId },
            take: 100,
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            select: { id: true, title: true, createdAt: true }
        });
        return successResponse(revisions);
    } catch (error) {
        return handleApiError(error);
    }
}
