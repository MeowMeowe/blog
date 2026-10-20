import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/admin-auth';
import { successResponse, unauthorizedResponse } from '@/lib/api-response';
import { articleIdFrom, handleApiError, readJson, RequestError } from '@/lib/http';
import { articleFormData, articleRelations, restoreSnapshot, snapshotArticle, validateRelations } from '@/lib/article-management';

export async function POST(request: Request, { params }: { params: Promise<{ id: string; revisionId: string }> }) {
    try {
        const user = await getAdminUser();
        if (!user) return unauthorizedResponse('请重新登录');
        const route = await params;
        const id = articleIdFrom(route.id);
        const revisionId = articleIdFrom(route.revisionId);
        const { expectedVersion } = await readJson(request, z.object({ expectedVersion: z.number().int().nonnegative() }).strict());
        const article = await prisma.$transaction(async (tx) => {
            await tx.$queryRaw`SELECT id FROM articles WHERE id = ${id} FOR UPDATE`;
            const current = await tx.article.findFirst({ where: { id, deletedAt: null }, include: articleRelations });
            if (!current) throw new RequestError('文章不存在或已移入回收站', 404);
            if (current.version !== expectedVersion) throw new RequestError('文章已经更新，请重新加载后再恢复', 409);
            const revision = await tx.articleRevision.findFirst({ where: { id: revisionId, articleId: id } });
            if (!revision) throw new RequestError('历史版本不存在', 404);
            const { tagIds = [], techStackIds = [], links = [], publishedAt, ...data } = restoreSnapshot(revision.snapshot);
            await validateRelations(tx, tagIds, techStackIds);
            await snapshotArticle(tx, current, user.id);
            return tx.article.update({
                where: { id },
                include: articleRelations,
                data: {
                    ...data,
                    status: 'DRAFT',
                    publishedAt: publishedAt ? new Date(publishedAt) : null,
                    version: { increment: 1 },
                    tags: { deleteMany: {}, create: tagIds.map((tagId) => ({ tagId })) },
                    techStack: { deleteMany: {}, create: techStackIds.map((techId) => ({ techId })) },
                    links: { deleteMany: {}, create: links.map(({ type, ...link }) => ({ ...link, linkType: type })) }
                }
            });
        });
        return successResponse(articleFormData(article), '历史版本已恢复为草稿，恢复前内容也已保留');
    } catch (error) {
        return handleApiError(error);
    }
}
