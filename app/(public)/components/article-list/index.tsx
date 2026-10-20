'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getArticles } from '@/api-client/articles';
import ArticleCards, { ArticleCard } from './cards';
import './index.scss';

export default function ArticleList() {
    const [articles, setArticles] = useState<ArticleCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState('');
    const page = useRef(0);
    const inFlight = useRef(false);
    const alive = useRef(true);
    const trigger = useRef<HTMLDivElement>(null);
    const load = useCallback(async () => {
        if (inFlight.current) return;
        inFlight.current = true;
        setLoading(true);
        setError('');
        try {
            const result = await getArticles({ page: page.current + 1, pageSize: 9 });
            if (!alive.current) return;
            if (result.code !== 200 || !result.data?.articles) throw new Error('加载失败');
            setArticles((current) => Array.from(new Map([...current, ...result.data.articles].map((item) => [item.id, item])).values()));
            page.current = result.data.pagination.page;
            setHasMore(page.current < result.data.pagination.totalPages);
        } catch {
            if (alive.current) setError('文章暂时没有加载成功，请点击重试。');
        } finally {
            inFlight.current = false;
            if (alive.current) setLoading(false);
        }
    }, []);
    useEffect(() => {
        alive.current = true;
        void load();
        return () => {
            alive.current = false;
        };
    }, [load]);
    useEffect(() => {
        if (loading || error || !hasMore || !trigger.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) void load();
            },
            { rootMargin: '120px' }
        );
        observer.observe(trigger.current);
        return () => observer.disconnect();
    }, [loading, error, hasMore, load]);
    return (
        <div className="article-list-container">
            <div className="article-list-heading">
                <div>
                    <span className="article-list-eyebrow">LATEST WRITING</span>
                    <h2>最近写下的内容</h2>
                </div>
                <p>技术实践、项目复盘，以及一些保留当时判断的旧记录。</p>
            </div>
            <ArticleCards articles={articles} />
            <div ref={trigger} className="load-more-trigger" aria-live="polite">
                {error ? (
                    <div>
                        <p>{error}</p>
                        <button className="article-load-button" onClick={() => void load()}>
                            重试加载
                        </button>
                    </div>
                ) : loading ? (
                    <span className="loading-more">正在加载文章…</span>
                ) : hasMore ? (
                    <button className="article-load-button" onClick={() => void load()}>
                        加载更多
                    </button>
                ) : (
                    <span className="no-more">{articles.length ? '已经读到这里的最后一篇了' : '还没有发布的文章'}</span>
                )}
            </div>
        </div>
    );
}
