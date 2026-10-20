import type { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';
import { siteUrl } from '@/lib/site';
export const dynamic = 'force-dynamic';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const origin = siteUrl();
    const articles = await prisma.article.findMany({ where: { status: 'PUBLISHED', deletedAt: null }, select: { id: true, updatedAt: true }, orderBy: { id: 'asc' } });
    return [
        ...['/', '/articles', '/about', '/projects', '/study'].map((path) => ({ url: new URL(path, origin).href })),
        ...articles.map((article) => ({ url: new URL('/articles/' + article.id, origin).href, lastModified: article.updatedAt }))
    ];
}
