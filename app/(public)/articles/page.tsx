import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { listPublicArticles } from '@/lib/public-articles';
import ArticleCards from '../components/article-list/cards';
import '../components/article-list/index.scss';
import './index.scss';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: '文章', description: '前端开发、工程实践和个人技术记录。', alternates: { canonical: '/articles' } };
export default async function ArticlesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
    const params = await searchParams;
    if (typeof params.id === 'string' && /^[1-9]\d*$/.test(params.id)) redirect('/articles/' + params.id);
    const search = typeof params.search === 'string' ? params.search.trim().slice(0, 100) : '';
    const tag = typeof params.tag === 'string' ? params.tag.slice(0, 50) : '';
    const rawPage = typeof params.page === 'string' ? Number(params.page) : 1;
    const page = Number.isSafeInteger(rawPage) && rawPage > 0 ? Math.min(rawPage, 100000) : 1;
    const [result, tags] = await Promise.all([
        listPublicArticles({ page, search, tag }),
        prisma.tag.findMany({ where: { articles: { some: { article: { status: 'PUBLISHED', deletedAt: null } } } }, select: { name: true, slug: true }, orderBy: { name: 'asc' } })
    ]);
    const pageUrl = (number: number) => '/articles?' + new URLSearchParams({ ...(search ? { search } : {}), ...(tag ? { tag } : {}), page: String(number) });
    if (page > Math.max(1, result.pagination.totalPages)) redirect(pageUrl(Math.max(1, result.pagination.totalPages)));
    return (
        <section className="article-archive">
            <header className="article-list-heading">
                <div>
                    <span className="article-list-eyebrow">WRITING ARCHIVE</span>
                    <h1>文章与记录</h1>
                </div>
                <p>共 {result.pagination.total} 篇 · 留下实践过程，也保留当时的判断。</p>
            </header>
            <form key={`${search}:${tag}:${page}`} className="article-search" action="/articles">
                <input aria-label="搜索文章" name="search" defaultValue={search} placeholder="搜索标题或摘要…" maxLength={100} />
                <select aria-label="文章标签" name="tag" defaultValue={tag}>
                    <option value="">全部标签</option>
                    {tags.map((item) => (
                        <option key={item.slug} value={item.slug}>
                            {item.name}
                        </option>
                    ))}
                </select>
                <button type="submit">查找文章</button>
                <Link href="/articles">重置</Link>
            </form>
            {result.articles.length ? <ArticleCards articles={result.articles} /> : <div className="article-empty">没有找到相关内容，换个关键词试试。</div>}
            <nav className="article-pagination" aria-label="文章分页">
                {page > 1 && <Link href={pageUrl(page - 1)}>← 上一页</Link>}
                <span>
                    第 {page} / {Math.max(1, result.pagination.totalPages)} 页
                </span>
                {page < result.pagination.totalPages && <Link href={pageUrl(page + 1)}>下一页 →</Link>}
            </nav>
        </section>
    );
}
