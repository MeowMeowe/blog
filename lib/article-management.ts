import { Prisma } from '@prisma/client';
import { RequestError } from './http';
import { sanitizeArticleHtml } from './sanitize';
import { createArticleSchema } from './validation';
import { resourceImage } from './resource-image';

export const articleRelations = { tags: true, techStack: true, links: true } satisfies Prisma.ArticleInclude;
type StoredArticle = Prisma.ArticleGetPayload<{ include: typeof articleRelations }>;

export function articleFormData(article: StoredArticle) {
    const cover = article.coverImage || '';
    return {
        id: article.id,
        title: article.title,
        description: article.description || '',
        content: article.content,
        coverImage: cover ? resourceImage(cover) : '',
        status: article.status,
        publishedAt: article.publishedAt?.toISOString() || null,
        updatedAt: article.updatedAt.toISOString(),
        version: article.version,
        deletedAt: article.deletedAt?.toISOString() || null,
        tagIds: article.tags.map((item) => item.tagId),
        techStackIds: article.techStack.map((item) => item.techId),
        links: article.links.map((item) => ({ title: item.title || '', url: item.url, icon: item.icon || '', type: item.linkType }))
    };
}

export async function snapshotArticle(tx: Prisma.TransactionClient, article: StoredArticle, editorId: number) {
    const form = articleFormData(article);
    const { title, description, content, coverImage, status, publishedAt, tagIds, techStackIds, links } = form;
    const snapshot = { title, description, content, coverImage: coverImage || null, status, publishedAt, tagIds, techStackIds, links };
    await tx.articleRevision.create({ data: { articleId: article.id, editorId, title: article.title, snapshot: snapshot as Prisma.InputJsonValue } });
}

export async function validateRelations(tx: Prisma.TransactionClient, tagIds?: number[], techIds?: number[]) {
    if (tagIds && (await tx.tag.count({ where: { id: { in: tagIds } } })) !== tagIds.length) throw new RequestError('所选标签已被删除，请重新选择');
    if (techIds && (await tx.techStack.count({ where: { id: { in: techIds } } })) !== techIds.length) throw new RequestError('所选技术栈已被删除，请重新选择');
}

export function restoreSnapshot(value: Prisma.JsonValue) {
    const parsed = createArticleSchema.safeParse(value);
    if (!parsed.success) throw new RequestError('历史版本内容格式不完整，无法恢复');
    return { ...parsed.data, content: sanitizeArticleHtml(parsed.data.content) };
}
