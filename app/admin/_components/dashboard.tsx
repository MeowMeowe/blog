'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { EmptyState, PageHeading, StatusBadge } from './admin-ui';
import { adminRequest, errorMessage } from './admin-client';

type DashboardData = {
    counts: {
        total: number;
        published: number;
        drafts: number;
        archived: number;
        tags: number;
        techStacks: number;
        views: number;
    };
    recent: Array<{ id: number; title: string; status: string; viewCount: number; updatedAt: string }>;
};

export default function Dashboard() {
    const pathname = usePathname();
    const base = `/${pathname.split('/').filter(Boolean)[0] || 'backstage'}`;
    const [data, setData] = useState<DashboardData | null>(null);
    const [error, setError] = useState('');

    const [loading, setLoading] = useState(true);
    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            setData(await adminRequest<DashboardData>('/api/admin/dashboard'));
        } catch (reason) {
            setError(errorMessage(reason));
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        void load();
    }, [load]);

    return (
        <>
            <PageHeading
                eyebrow="OVERVIEW"
                title="内容仪表盘"
                description="快速查看文章状态、阅读数据与最近编辑记录。"
                actions={
                    <Link className="admin-button admin-button--primary" href={`${base}/articles/new`}>
                        ＋ 新建文章
                    </Link>
                }
            />
            {error && (
                <div role="alert" className="admin-alert admin-alert--error">
                    {error}{' '}
                    <button className="admin-button" disabled={loading} onClick={() => void load()}>
                        重新加载
                    </button>
                </div>
            )}
            <section className="admin-metric-grid">
                {[
                    ['文章总数', data?.counts.total, '全部内容'],
                    ['已发布', data?.counts.published, '公开可见'],
                    ['草稿', data?.counts.drafts, '等待完善'],
                    ['总阅读', data?.counts.views, '累计浏览'],
                    ['标签', data?.counts.tags, '内容分类'],
                    ['技术栈', data?.counts.techStacks, '文章关联']
                ].map(([label, value, note]) => (
                    <article className="admin-metric-card" key={String(label)}>
                        <span>{label}</span>
                        <strong>{data ? Number(value).toLocaleString('zh-CN') : '—'}</strong>
                        <small>{note}</small>
                    </article>
                ))}
            </section>
            <section className="admin-panel">
                <div className="admin-panel__heading">
                    <div>
                        <h2>最近编辑</h2>
                        <p>按最后更新时间排列</p>
                    </div>
                    <Link href={`${base}/articles`}>查看全部 →</Link>
                </div>
                <div className="admin-recent-list">
                    {data?.recent.map((article) => (
                        <Link href={`${base}/articles/${article.id}`} key={article.id}>
                            <div>
                                <strong>{article.title}</strong>
                                <span>{new Date(article.updatedAt).toLocaleString('zh-CN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                            </div>
                            <span>{article.viewCount.toLocaleString('zh-CN')} 阅读</span>
                            <StatusBadge status={article.status} />
                        </Link>
                    ))}
                    {!data && !error && <div className="admin-loading">正在读取内容数据…</div>}
                    {data && !data.recent.length && <EmptyState title="还没有文章" description="点击新建文章，开始第一篇记录。" />}
                </div>
            </section>
        </>
    );
}
