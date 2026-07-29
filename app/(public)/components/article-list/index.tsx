import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { randomNumber } from '@/utils/utils';
import { getArticles } from '@/api-client/articles';
import LazyImage from '@/components/lazy-image';
import './index.scss';

interface Article {
    id: number;
    title: string;
    desc: string;
    time: string;
    icon: string;
    cover: string;
    view: number;
    star: number;
    tags: string[];
}

const ArticleList: React.FC = () => {
    const router = useRouter();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const pageRef = useRef(1); // 使用 ref 追踪当前页码
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef(true);

    const fetchArticles = useCallback(async (pageNum: number) => {
        try {
            if (pageNum === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const response = await getArticles({
                page: pageNum,
                pageSize: 6,
                status: 'published'
            });

            if (response.code === 200 && response.data.articles) {
                const newArticles = response.data.articles;

                if (pageNum === 1) {
                    setArticles(newArticles);
                } else {
                    setArticles((prev) => [...prev, ...newArticles]);
                }

                // 检查是否还有更多数据
                const { page: currentPage, totalPages } = response.data.pagination;
                setHasMore(currentPage < totalPages);
                pageRef.current = currentPage; // 更新 ref 中的页码
            }
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    // 初始加载
    useEffect(() => {
        fetchArticles(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // 只在组件挂载时执行一次

    // 无限滚动
    useEffect(() => {
        // 跳过初始挂载时的 observer 创建，避免重复请求
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (loading || !hasMore) return;

        // 清理旧的 observer
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        // 创建新的 observer
        observerRef.current = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                // 当触发元素进入视口，且不在加载中，且还有更多数据时
                if (target.isIntersecting && !loadingMore && hasMore) {
                    const nextPage = pageRef.current + 1;
                    fetchArticles(nextPage);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '100px' // 提前 100px 触发
            }
        );

        const currentRef = loadMoreRef.current;
        if (currentRef) {
            observerRef.current.observe(currentRef);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [hasMore, loadingMore, loading, fetchArticles]);

    const handleArticleClick = (id: number) => {
        router.push(`/articles?id=${id}`);
    };

    if (loading) {
        return (
            <div className="article-list-container">
                <div className="articles-flex">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="articles-flex-items skeleton">
                            <div className="skeleton-icon"></div>
                            <div className="skeleton-title"></div>
                            <div className="skeleton-cover"></div>
                            <div className="skeleton-desc"></div>
                            <div className="skeleton-msgs"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const renderArticles = (): JSX.Element[] => {
        return articles.map((item) => (
            <div className="articles-flex-items" key={item.id}>
                <LazyImage className="title-icon" src={`/icon/${item.icon}.webp`} alt="" />
                <h1 className="title">{item.title}</h1>
                <LazyImage className="cover" src={`/img/bg/${randomNumber(1, 14, 0)}.webp`} alt="" onClick={() => handleArticleClick(item.id)} />
                <div className="desc">{item.desc}</div>
                <div className="msgs">
                    <div className="time msgs-item-wrap">
                        <LazyImage className="msgs-item-icon" src="/icon/clock.webp" alt="Time" />
                        <span>{item.time}</span>
                    </div>
                    <div className="views msgs-item-wrap">
                        <LazyImage className="msgs-item-icon" src="/icon/search.webp" alt="View" />
                        <span>{item.view}</span>
                    </div>
                    <div className="stars msgs-item-wrap">
                        <LazyImage className="msgs-item-icon" src="/icon/love.webp" alt="Love" />
                        <span>{item.star}</span>
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <div className="article-list-container">
            <div className="articles-flex">{renderArticles()}</div>

            {/* 加载更多触发器 */}
            <div ref={loadMoreRef} className="load-more-trigger">
                {loadingMore && (
                    <div className="loading-more">
                        <div className="spinner"></div>
                        <span>加载中...</span>
                    </div>
                )}
                {!hasMore && articles.length > 0 && <div className="no-more">没有更多文章了</div>}
            </div>
        </div>
    );
};

export default ArticleList;
