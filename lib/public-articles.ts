import { Prisma } from '@prisma/client';
import { cache } from 'react';
import prisma from '@/lib/prisma';
import { sanitizeArticleHtml } from '@/lib/sanitize';
import { resourceImage } from '@/lib/resource-image';
import { articleDate } from '@/lib/article-date';

const relations = {
    tags: { select: { tag: { select: { id: true, name: true, slug: true, icon: true } } } },
    techStack: { select: { tech: { select: { name: true, icon: true, link: true } } } }
} satisfies Prisma.ArticleSelect;

export async function listPublicArticles({ page = 1, pageSize = 12, search, tag }: { page?: number; pageSize?: number; search?: string; tag?: string } = {}) {
    const where: Prisma.ArticleWhereInput = {
        status: 'PUBLISHED',
        deletedAt: null,
        ...(search ? { OR: [{ title: { contains: search } }, { description: { contains: search } }] } : {}),
        ...(tag ? { tags: { some: { tag: { slug: tag } } } } : {})
    };
    const [total, rows] = await prisma.$transaction([
        prisma.article.count({ where }),
        prisma.article.findMany({
            where,
            take: pageSize,
            skip: (page - 1) * pageSize,
            orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
            select: { id: true, title: true, description: true, coverImage: true, publishedAt: true, createdAt: true, viewCount: true, starCount: true, ...relations }
        })
    ]);
    return {
        articles: rows.map((article) => ({
            id: article.id,
            title: article.title,
            desc: article.description || '',
            time: articleDate(article.publishedAt || article.createdAt),
            icon: resourceImage(article.tags[0]?.tag.icon),
            cover: resourceImage(article.coverImage || article.tags[0]?.tag.icon),
            view: article.viewCount,
            star: article.starCount,
            tags: article.tags.map(({ tag }) => tag.name),
            techStack: article.techStack.map(({ tech }) => tech)
        })),
        pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) }
    };
}

export const getPublicArticle = cache(async (id: number) => {
    if (!Number.isSafeInteger(id) || id <= 0) return null;
    const article = await prisma.article.findFirst({
        where: { id, status: 'PUBLISHED', deletedAt: null },
        include: { tags: { include: { tag: true } }, techStack: { include: { tech: true } }, links: true }
    });
    return article ? { ...article, content: sanitizeArticleHtml(article.content) } : null;
});
