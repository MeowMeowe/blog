'use client';
import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { EmptyState, PageHeading, StatusBadge } from './admin-ui';
import { adminRequest, errorMessage } from './admin-client';
import { useAdminUser } from './admin-shell';

type Article = { id: number; title: string; description: string | null; status: string; viewCount: number; updatedAt: string; deletedAt: string | null; tags: Array<{ id: number; name: string }> };
type Result = { articles: Article[]; pagination: { total: number; totalPages: number } };

export default function ArticleManager() {
    const base = '/' + usePathname().split('/').filter(Boolean)[0];
    const { role } = useAdminUser();
    const [result, setResult] = useState<Result>({ articles: [], pagination: { total: 0, totalPages: 0 } });
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [filter, setFilter] = useState({ search: '', status: '' });
    const [deleted, setDeleted] = useState(false);
    const [page, setPage] = useState(1);
    const [refresh, setRefresh] = useState(0);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError('');
        const query = new URLSearchParams({ page: String(page), pageSize: '15', deleted: String(deleted), ...filter });
        adminRequest<Result>(`/api/admin/articles?${query}`, { signal: controller.signal })
            .then((data) => {
                if (controller.signal.aborted) return;
                if (page > Math.max(1, data.pagination.totalPages)) {
                    setPage(Math.max(1, data.pagination.totalPages));
                    return;
                }
                setResult(data);
            })
            .catch((reason) => {
                if (!controller.signal.aborted) setError(errorMessage(reason));
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });
        return () => controller.abort();
    }, [page, deleted, filter, refresh]);
    function handleSearch(event: FormEvent) {
        event.preventDefault();
        setPage(1);
        setFilter({ search, status });
    }
    async function mutate(article: Article) {
        if (busy !== null || !window.confirm(deleted ? `将《${article.title}》恢复为草稿？` : `将《${article.title}》移入回收站？之后可以恢复。`)) return;
        setBusy(article.id);
        setError('');
        setNotice('');
        try {
            await adminRequest(deleted ? `/api/admin/articles/${article.id}/restore` : `/api/articles/${article.id}`, { method: deleted ? 'POST' : 'DELETE' });
            setNotice(deleted ? '已恢复为草稿，请检查后发布。' : '已移入回收站。');
            setRefresh((n) => n + 1);
        } catch (reason) {
            setError(errorMessage(reason));
        } finally {
            setBusy(null);
        }
    }
    return (
        <>
            <PageHeading
                eyebrow="CONTENT"
                title="文章管理"
                description="草稿、发布与归档；删除内容可从回收站恢复。"
                actions={
                    <Link className="admin-button admin-button--primary" href={`${base}/articles/new`}>
                        ＋ 新建文章
                    </Link>
                }
            />
            {(error || notice) && (
                <div role="status" className={`admin-alert ${error ? 'admin-alert--error' : 'admin-alert--success'}`}>
                    {error || notice}
                    {error && (
                        <button className="admin-button" onClick={() => setRefresh((n) => n + 1)}>
                            重试
                        </button>
                    )}
                </div>
            )}
            {role === 'ADMIN' && (
                <div className="admin-segmented">
                    {[false, true].map((value) => (
                        <button
                            key={String(value)}
                            className={deleted === value ? 'is-active' : ''}
                            onClick={() => {
                                setDeleted(value);
                                setPage(1);
                                setNotice('');
                            }}
                        >
                            {value ? '回收站' : '全部文章'}
                        </button>
                    ))}
                </div>
            )}
            <section className="admin-panel">
                <form className="admin-filterbar" onSubmit={handleSearch}>
                    <input aria-label="搜索文章" maxLength={100} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索标题或摘要" />
                    <select aria-label="文章状态" value={status} onChange={(event) => setStatus(event.target.value)}>
                        <option value="">全部状态</option>
                        <option value="PUBLISHED">已发布</option>
                        <option value="DRAFT">草稿</option>
                        <option value="ARCHIVED">已归档</option>
                    </select>
                    <button className="admin-button" type="submit">
                        筛选
                    </button>
                    <button
                        className="admin-button"
                        type="button"
                        onClick={() => {
                            setSearch('');
                            setStatus('');
                            setFilter({ search: '', status: '' });
                            setPage(1);
                        }}
                    >
                        重置
                    </button>
                </form>
                {loading ? (
                    <div className="admin-loading">正在加载文章…</div>
                ) : error ? null : !result.articles.length ? (
                    <EmptyState title={deleted ? '回收站是空的' : '没有找到文章'} description="可以调整筛选条件。" />
                ) : (
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>文章</th>
                                    <th>状态</th>
                                    <th>阅读</th>
                                    <th>{deleted ? '删除时间' : '最后更新'}</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.articles.map((article) => (
                                    <tr key={article.id}>
                                        <td>
                                            <div className="admin-article-cell">
                                                <strong>{article.title}</strong>
                                                <span>{article.description || '暂无摘要'}</span>
                                                <div>
                                                    {article.tags.map((tag) => (
                                                        <i key={tag.id}>{tag.name}</i>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <StatusBadge status={article.status} />
                                        </td>
                                        <td>{article.viewCount}</td>
                                        <td>{new Date((deleted ? article.deletedAt : article.updatedAt) || article.updatedAt).toLocaleDateString('zh-CN')}</td>
                                        <td>
                                            <div className="admin-row-actions">
                                                {!deleted && (
                                                    <>
                                                        <Link href={`${base}/articles/${article.id}`}>编辑</Link>
                                                        {article.status === 'PUBLISHED' && (
                                                            <Link href={`/articles/${article.id}`} target="_blank">
                                                                查看
                                                            </Link>
                                                        )}
                                                    </>
                                                )}
                                                {role === 'ADMIN' && (
                                                    <button disabled={busy !== null} className={deleted ? '' : 'is-danger'} onClick={() => void mutate(article)}>
                                                        {busy === article.id ? '处理中…' : deleted ? '恢复' : '删除'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <nav className="admin-pagination" aria-label="文章分页">
                    <span>
                        共 {result.pagination.total} 篇 · 第 {page} / {Math.max(1, result.pagination.totalPages)} 页
                    </span>
                    <button className="admin-button" disabled={loading || page <= 1} onClick={() => setPage((n) => n - 1)}>
                        上一页
                    </button>
                    <button className="admin-button" disabled={loading || page >= result.pagination.totalPages} onClick={() => setPage((n) => n + 1)}>
                        下一页
                    </button>
                </nav>
            </section>
        </>
    );
}
