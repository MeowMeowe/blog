import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/admin-auth';
import { successResponse, unauthorizedResponse } from '@/lib/api-response';
import { createArticleSchema } from '@/lib/validation';
import { sanitizeArticleHtml } from '@/lib/sanitize';
import { handleApiError, readJson } from '@/lib/http';
import { articleFormData, articleRelations, validateRelations } from '@/lib/article-management';

export async function POST(request: Request) {
    try {
        const user = await getAdminUser();
        if (!user) return unauthorizedResponse('请重新登录');
        const { tagIds, techStackIds, links, publishedAt, ...data } = await readJson(request, createArticleSchema);
        const article = await prisma.$transaction(async (tx) => {
            await validateRelations(tx, tagIds, techStackIds);
            return tx.article.create({
                data: {
                    ...data,
                    content: sanitizeArticleHtml(data.content),
                    authorId: user.id,
                    publishedAt: publishedAt ? new Date(publishedAt) : data.status === 'PUBLISHED' ? new Date() : null,
                    tags: { create: (tagIds || []).map((tagId) => ({ tagId })) },
                    techStack: { create: (techStackIds || []).map((techId) => ({ techId })) },
                    links: { create: (links || []).map(({ type, ...link }) => ({ ...link, linkType: type })) }
                },
                include: articleRelations
            });
        });
        return successResponse(articleFormData(article), '文章已创建');
    } catch (error) {
        return handleApiError(error);
    }
}
