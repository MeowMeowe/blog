import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/admin-auth';
import { successResponse, unauthorizedResponse } from '@/lib/api-response';
import { updateArticleSchema } from '@/lib/validation';
import { sanitizeArticleHtml } from '@/lib/sanitize';
import { articleIdFrom, handleApiError, readJson, RequestError } from '@/lib/http';
import { articleFormData, articleRelations, snapshotArticle, validateRelations } from '@/lib/article-management';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getAdminUser();
        if (!user) return unauthorizedResponse('请重新登录');
        const id = articleIdFrom((await params).id);
        const data = await readJson(request, updateArticleSchema);
        if (data.expectedVersion === undefined) throw new RequestError('请重新加载文章后再保存', 409);
        const article = await prisma.$transaction(async (tx) => {
            await tx.$queryRaw`SELECT id FROM articles WHERE id = ${id} FOR UPDATE`;
            const current = await tx.article.findFirst({ where: { id, deletedAt: null }, include: articleRelations });
            if (!current) throw new RequestError('文章不存在或已被移入回收站', 404);
            if (current.version !== data.expectedVersion) throw new RequestError('文章已在其他页面更新，草稿已保留，请重新加载后合并', 409);
            await validateRelations(tx, data.tagIds, data.techStackIds);
            await snapshotArticle(tx, current, user.id);
            const { tagIds, techStackIds, links, publishedAt } = data;
            const fields = { title: data.title, description: data.description, coverImage: data.coverImage, status: data.status };
            return tx.article.update({
                where: { id },
                data: {
                    ...fields,
                    content: data.content === undefined ? undefined : sanitizeArticleHtml(data.content),
                    publishedAt: publishedAt
                        ? new Date(publishedAt)
                        : (data.status || current.status) === 'PUBLISHED'
                          ? current.publishedAt || new Date()
                          : publishedAt === null
                            ? null
                            : current.publishedAt,
                    version: { increment: 1 },
                    tags: tagIds === undefined ? undefined : { deleteMany: {}, create: tagIds.map((tagId) => ({ tagId })) },
                    techStack: techStackIds === undefined ? undefined : { deleteMany: {}, create: techStackIds.map((techId) => ({ techId })) },
                    links: links === undefined ? undefined : { deleteMany: {}, create: links.map(({ type, ...link }) => ({ ...link, linkType: type })) }
                },
                include: articleRelations
            });
        });
        return successResponse(articleFormData(article), '文章已保存');
    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getAdminUser(['ADMIN']);
        if (!user) return unauthorizedResponse('需要管理员登录');
        const id = articleIdFrom((await params).id);
        await prisma.$transaction(async (tx) => {
            await tx.$queryRaw`SELECT id FROM articles WHERE id = ${id} FOR UPDATE`;
            const article = await tx.article.findFirst({ where: { id, deletedAt: null }, include: articleRelations });
            if (!article) throw new RequestError('文章不存在或已经删除', 404);
            await snapshotArticle(tx, article, user.id);
            await tx.article.update({ where: { id }, data: { deletedAt: new Date(), version: { increment: 1 } } });
        });
        return successResponse(null, '已移入回收站，可恢复为草稿');
    } catch (error) {
        return handleApiError(error);
    }
}
