import prisma from '@/lib/prisma';
import { successResponse, notFoundResponse } from '@/lib/api-response';
import { articleIdFrom, handleApiError } from '@/lib/http';
import { consumeRateLimit, getClientIdentifier } from '@/lib/rate-limit';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = articleIdFrom((await params).id);
        const exists = await prisma.article.findFirst({ where: { id, status: 'PUBLISHED', deletedAt: null }, select: { id: true } });
        if (!exists) return notFoundResponse('文章不存在');
        const limit = consumeRateLimit(`article-view:${id}:${getClientIdentifier(request.headers)}`, 1, 10 * 60 * 1000);
        if (limit.allowed) {
            // Reading is not editing: preserve the content modification timestamp, including MySQL ON UPDATE.
            await prisma.$executeRaw`UPDATE articles SET view_count = view_count + 1, updated_at = updated_at WHERE id = ${id} AND status = 'published' AND deleted_at IS NULL`;
        }
        return successResponse({ counted: limit.allowed });
    } catch (error) {
        return handleApiError(error);
    }
}
