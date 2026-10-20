'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import LazyImage from '@/components/lazy-image';
import { resourceImage } from '@/lib/resource-image';

export type ArticleCard = { id: number; title: string; desc: string; time: string; icon: string; cover: string; view: number; star: number; tags: string[] };

export default function ArticleCards({ articles }: { articles: ArticleCard[] }) {
    const [count, setCount] = useState(3);
    useEffect(() => {
        const wide = window.matchMedia('(min-width: 1340px)');
        const narrow = window.matchMedia('(max-width: 680px)');
        const update = () => setCount(narrow.matches ? 1 : wide.matches ? 3 : 2);
        update();
        wide.addEventListener('change', update);
        narrow.addEventListener('change', update);
        return () => {
            wide.removeEventListener('change', update);
            narrow.removeEventListener('change', update);
        };
    }, []);
    // Keep each existing card in its column when more pages are appended.
    const columns = Array.from({ length: count }, (_, column) => articles.filter((_, index) => index % count === column));
    return (
        <div className="articles-grid articles-grid--stable" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
            {columns.map((items, column) => (
                <div className="article-column" key={column}>
                    {items.map((item) => (
                        <article className="article-card" key={item.id}>
                            <Link className="article-card-cover" href={`/articles/${item.id}`} aria-label={`阅读：${item.title}`}>
                                <LazyImage src={resourceImage(item.cover)} alt={item.title} />
                                <time className="article-card-date" dateTime={item.time}>
                                    {item.time}
                                </time>
                            </Link>
                            <div className="article-card-body">
                                <div className="article-card-kicker">
                                    <LazyImage className="article-card-icon" src={resourceImage(item.icon)} alt="" />
                                    <span>{item.tags[0] || '技术记录'}</span>
                                </div>
                                <h2 className="article-card-title">
                                    <Link href={`/articles/${item.id}`}>{item.title}</Link>
                                </h2>
                                <p className="article-card-desc">{item.desc}</p>
                                <div className="article-card-tags" aria-label="文章标签">
                                    {item.tags.slice(0, 3).map((tag) => (
                                        <span key={tag}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="article-card-footer">
                                <span className="article-card-stat">{item.view} 次阅读</span>
                                <Link href={`/articles/${item.id}`}>阅读全文 →</Link>
                            </div>
                        </article>
                    ))}
                </div>
            ))}
        </div>
    );
}
