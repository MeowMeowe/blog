import prisma from '@/lib/prisma';
import { siteUrl } from '@/lib/site';
export const dynamic = 'force-dynamic';
const xml = (value: string) => value.replace(/[<>&"']/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char]!);
export async function GET() {
    const origin = siteUrl().href;
    const articles = await prisma.article.findMany({
        where: { status: 'PUBLISHED', deletedAt: null },
        take: 30,
        orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
        select: { id: true, title: true, description: true, publishedAt: true, createdAt: true }
    });
    const items = articles
        .map((article) => {
            const url = xml(new URL('/articles/' + article.id, origin).href);
            return `<item><title>${xml(article.title)}</title><link>${url}</link><guid>${url}</guid><description>${xml(article.description || '')}</description><pubDate>${(article.publishedAt || article.createdAt).toUTCString()}</pubDate></item>`;
        })
        .join('');
    return new Response(
        `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>MeowGod 的技术记录</title><link>${xml(origin)}</link><description>前端开发、工程实践与个人记录</description><language>zh-CN</language>${items}</channel></rss>`,
        { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'no-cache' } }
    );
}
