import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublicArticle } from '@/lib/public-articles';
import { resourceImage } from '@/lib/resource-image';
import { publicLink, siteUrl } from '@/lib/site';
import ViewCounter from './view-counter';
import { articleDate } from '@/lib/article-date';
import '../index.scss';

export const dynamic = 'force-dynamic';
function numericId(raw: string) {
    return /^[1-9]\d*$/.test(raw) && Number.isSafeInteger(Number(raw)) ? Number(raw) : 0;
}
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const article = await getPublicArticle(numericId((await params).id));
    if (!article) return { title: '文章不存在', robots: { index: false } };
    return {
        title: article.title,
        description: article.description?.slice(0, 180),
        alternates: { canonical: `/articles/${article.id}` },
        openGraph: {
            type: 'article',
            title: article.title,
            description: article.description?.slice(0, 180),
            url: `/articles/${article.id}`,
            images: [resourceImage(article.coverImage)],
            publishedTime: (article.publishedAt || article.createdAt).toISOString(),
            modifiedTime: article.updatedAt.toISOString()
        }
    };
}
export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const article = await getPublicArticle(numericId((await params).id));
    if (!article) notFound();
    const published = article.publishedAt || article.createdAt;
    const date = articleDate(published);
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title,
        description: article.description,
        datePublished: published.toISOString(),
        dateModified: article.updatedAt.toISOString(),
        author: { '@type': 'Person', name: 'MeowGod' },
        url: new URL(`/articles/${article.id}`, siteUrl()).href
    };
    return (
        <div className="articles">
            <article className="article-content">
                <header className="article-header">
                    <Link className="article-back" href="/articles">
                        ← 全部文章
                    </Link>
                    <h1>{article.title}</h1>
                    <div className="article-meta">
                        <span>MeowGod</span>
                        <time dateTime={published.toISOString()}>发布于 {date}</time>
                        {articleDate(article.updatedAt) > date && <time dateTime={article.updatedAt.toISOString()}>更新于 {articleDate(article.updatedAt)}</time>}
                        <span>{article.viewCount} 次阅读</span>
                    </div>
                    <div className="article-tags">
                        {article.tags.map(({ tag }) => (
                            <Link key={tag.id} className="tag" href={`/articles?tag=${encodeURIComponent(tag.slug)}`}>
                                {tag.name}
                            </Link>
                        ))}
                    </div>
                </header>
                <div className="article-body" dangerouslySetInnerHTML={{ __html: article.content }} />
                {(article.techStack.length > 0 || article.links.length > 0) && (
                    <footer className="article-resources">
                        {article.techStack.length > 0 && (
                            <section>
                                <h2>相关技术</h2>
                                <div className="article-resource-links">
                                    {article.techStack.map(({ tech }) =>
                                        publicLink(tech.link) ? (
                                            <a key={tech.id} href={publicLink(tech.link)!} target="_blank" rel="noopener noreferrer">
                                                {tech.name} ↗
                                            </a>
                                        ) : (
                                            <span key={tech.id}>{tech.name}</span>
                                        )
                                    )}
                                </div>
                            </section>
                        )}
                        {article.links.length > 0 && (
                            <section>
                                <h2>补充链接</h2>
                                <ul>
                                    {article.links.map(
                                        (link) =>
                                            publicLink(link.url) && (
                                                <li key={link.id}>
                                                    <a href={publicLink(link.url)!} target="_blank" rel="noopener noreferrer">
                                                        {link.title || link.url} ↗
                                                    </a>
                                                </li>
                                            )
                                    )}
                                </ul>
                            </section>
                        )}
                    </footer>
                )}
                <ViewCounter id={article.id} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
            </article>
        </div>
    );
}
