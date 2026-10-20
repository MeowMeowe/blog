'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageHeading } from './admin-ui';
import { adminRequest, errorMessage } from './admin-client';
import { useAdminUser } from './admin-shell';
import MediaPicker from './media-picker';

type Tag = { id: number; name: string; color: string | null };
type Tech = { id: number; name: string; icon: string | null };
type ArticleForm = {
    title: string;
    description: string;
    content: string;
    coverImage: string;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    publishedAt: string;
    tagIds: number[];
    techStackIds: number[];
    links: Array<{ title: string; url: string; icon: string; type: 'GITHUB' | 'DEMO' | 'DOCS' | 'OTHER' }>;
};

const emptyForm: ArticleForm = {
    title: '',
    description: '',
    content: '<h2>从这里开始</h2>\n<p>写下正文内容。</p>',
    coverImage: '',
    status: 'DRAFT',
    publishedAt: '',
    tagIds: [],
    techStackIds: [],
    links: []
};

function toLocalDateTimeValue(value: string | null) {
    if (!value) return '';
    const date = new Date(value);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
}

export default function ArticleEditor({ articleId }: { articleId?: number }) {
    const router = useRouter();
    const pathname = usePathname();
    const base = `/${pathname.split('/').filter(Boolean)[0] || 'backstage'}`;
    const [form, setForm] = useState<ArticleForm>(emptyForm);
    const [tags, setTags] = useState<Tag[]>([]);
    const [techStacks, setTechStacks] = useState<Tech[]>([]);
    const [mode, setMode] = useState<'edit' | 'preview'>('edit');
    const [loading, setLoading] = useState(Boolean(articleId));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const { email } = useAdminUser();
    const draftKey = `blog-draft:${email}:${articleId || 'new'}`;
    const [ready, setReady] = useState(false);
    const [version, setVersion] = useState(0);
    const [baseline, setBaseline] = useState(JSON.stringify(emptyForm));
    const [draft, setDraft] = useState<{ form: ArticleForm; savedAt: string } | null>(null);
    const [draftTime, setDraftTime] = useState('');
    const [mediaTarget, setMediaTarget] = useState<'cover' | 'body' | null>(null);
    const [revisions, setRevisions] = useState<Array<{ id: number; title: string; createdAt: string }>>([]);
    const [revisionError, setRevisionError] = useState('');
    const [notice, setNotice] = useState('');
    const [loadKey, setLoadKey] = useState(0);
    const dirty = ready && JSON.stringify(form) !== baseline;
    const leaving = useRef(false);

    const loadRevisions = useCallback(async () => {
        if (!articleId) return;
        try {
            setRevisions(await adminRequest('/api/admin/articles/' + articleId + '/revisions'));
            setRevisionError('');
        } catch (reason) {
            setRevisionError(errorMessage(reason));
        }
    }, [articleId]);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setReady(false);
        setError('');
        Promise.all([
            adminRequest<Tag[]>('/api/tags'),
            adminRequest<Tech[]>('/api/admin/tech-stack'),
            articleId ? adminRequest<ArticleForm & { version: number }>(`/api/admin/articles/${articleId}`) : Promise.resolve(null)
        ])
            .then(([tagResult, techResult, article]) => {
                if (cancelled) return;
                setTags(tagResult);
                setTechStacks(techResult);
                const loaded = article
                    ? {
                          title: article.title,
                          description: article.description,
                          content: article.content,
                          coverImage: article.coverImage,
                          status: article.status,
                          publishedAt: toLocalDateTimeValue(article.publishedAt),
                          tagIds: article.tagIds,
                          techStackIds: article.techStackIds,
                          links: article.links
                      }
                    : emptyForm;
                setForm(loaded);
                setBaseline(JSON.stringify(loaded));
                setVersion(article?.version || 0);
                setDraft(null);
                try {
                    const local = JSON.parse(localStorage.getItem(draftKey) || 'null');
                    if (
                        local?.form &&
                        ['title', 'description', 'content', 'coverImage', 'status', 'publishedAt'].every((key) => typeof local.form[key] === 'string') &&
                        ['tagIds', 'techStackIds', 'links'].every((key) => Array.isArray(local.form[key])) &&
                        JSON.stringify(local.form) !== JSON.stringify(loaded)
                    )
                        setDraft(local);
                } catch {
                    setNotice('浏览器草稿不可用，保存前请保留一份正文副本。');
                }
                setReady(true);
            })
            .catch((reason) => {
                if (!cancelled) setError(errorMessage(reason));
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        void loadRevisions();
        return () => {
            cancelled = true;
        };
    }, [articleId, draftKey, loadKey, loadRevisions]);

    useEffect(() => {
        if (!dirty || draft || leaving.current) return;
        const savedAt = new Date().toISOString();
        try {
            localStorage.setItem(draftKey, JSON.stringify({ form, savedAt }));
            setDraftTime(savedAt);
        } catch {
            setNotice('本地草稿空间不足，请及时保存到服务器。');
        }
    }, [form, dirty, draft, draftKey]);

    useEffect(() => {
        function beforeUnload(event: BeforeUnloadEvent) {
            if (dirty && !leaving.current) {
                event.preventDefault();
                event.returnValue = '';
            }
        }
        function beforeLink(event: MouseEvent) {
            const link = (event.target as Element).closest?.('a[href]');
            if (
                dirty &&
                !leaving.current &&
                link &&
                link.getAttribute('target') !== '_blank' &&
                !link.getAttribute('href')?.startsWith('#') &&
                !window.confirm('修改尚未保存到服务器，确定离开？本地草稿会保留。')
            ) {
                event.preventDefault();
                event.stopPropagation();
            }
        }
        window.addEventListener('beforeunload', beforeUnload);
        document.addEventListener('click', beforeLink, true);
        return () => {
            window.removeEventListener('beforeunload', beforeUnload);
            document.removeEventListener('click', beforeLink, true);
        };
    }, [dirty]);

    async function restoreRevision(revisionId: number) {
        if (!articleId || saving || !window.confirm('恢复此历史版本为草稿？当前服务器版本也会留存；请先保存需要保留的本地修改。')) return;
        setSaving(true);
        setError('');
        try {
            await adminRequest(`/api/admin/articles/${articleId}/revisions/${revisionId}/restore`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ expectedVersion: version })
            });
            setNotice('历史版本已恢复为草稿，检查后可重新发布。');
            setLoadKey((key) => key + 1);
        } catch (reason) {
            setError(errorMessage(reason));
        } finally {
            setSaving(false);
        }
    }

    const wordCount = useMemo(() => form.content.replace(/<[^>]*>/g, '').replace(/\s/g, '').length, [form.content]);

    function toggleId(field: 'tagIds' | 'techStackIds', id: number) {
        setForm((current) => ({
            ...current,
            [field]: current[field].includes(id) ? current[field].filter((item) => item !== id) : [...current[field], id]
        }));
    }

    function updateLink(index: number, field: 'title' | 'url' | 'icon' | 'type', value: string) {
        setForm((current) => ({
            ...current,
            links: current.links.map((link, linkIndex) => (linkIndex === index ? { ...link, [field]: value } : link))
        }));
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        if (!ready || saving || draft) return;
        setSaving(true);
        setError('');
        try {
            await adminRequest(articleId ? `/api/articles/${articleId}` : '/api/articles/create', {
                method: articleId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    ...(articleId ? { expectedVersion: version } : {}),
                    description: form.description || null,
                    coverImage: form.coverImage || null,
                    publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null
                })
            });
            leaving.current = true;
            try {
                localStorage.removeItem(draftKey);
            } catch {
                /* Saving on the server succeeded. */
            }
            router.push(`${base}/articles`);
            router.refresh();
        } catch (reason) {
            setError(errorMessage(reason));
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="admin-loading admin-loading--page">正在打开文章…</div>;

    if (!ready)
        return (
            <section className="admin-panel">
                <p role="alert">{error || '文章加载失败，暂时无法编辑。'}</p>
                <button className="admin-button" onClick={() => setLoadKey((key) => key + 1)}>
                    重新加载
                </button>
            </section>
        );

    return (
        <>
            <PageHeading
                eyebrow={articleId ? 'EDIT ARTICLE' : 'NEW ARTICLE'}
                title={articleId ? '编辑文章' : '新建文章'}
                description={`HTML 内容编辑与即时预览 · 当前约 ${wordCount} 字`}
                actions={
                    <Link className="admin-button" href={`${base}/articles`}>
                        返回列表
                    </Link>
                }
            />
            {error && <div className="admin-alert admin-alert--error">{error}</div>}
            {notice && (
                <div className="admin-alert" role="status">
                    {notice}
                </div>
            )}
            {draft && (
                <div className="admin-alert">
                    <p>发现 {new Date(draft.savedAt).toLocaleString('zh-CN')} 的本地草稿。恢复后请与服务器内容核对。</p>
                    <button
                        type="button"
                        className="admin-button"
                        onClick={() => {
                            setForm(draft.form);
                            setDraft(null);
                        }}
                    >
                        恢复本地草稿
                    </button>
                    <button
                        type="button"
                        className="admin-button"
                        onClick={() => {
                            try {
                                localStorage.removeItem(draftKey);
                            } catch {}
                            setDraft(null);
                        }}
                    >
                        放弃本地草稿
                    </button>
                </div>
            )}
            {draftTime && (
                <p className="admin-draft-status" role="status">
                    本地草稿已保存 · {new Date(draftTime).toLocaleTimeString('zh-CN')} · {dirty ? '尚未保存到服务器' : '已同步'}
                </p>
            )}
            {mediaTarget && (
                <MediaPicker
                    onClose={() => setMediaTarget(null)}
                    onSelect={(url) => {
                        setForm((current) =>
                            mediaTarget === 'cover'
                                ? { ...current, coverImage: url }
                                : { ...current, content: current.content + `\n<figure><img src="${url}" alt="请填写图片说明" loading="lazy"><figcaption>图片说明</figcaption></figure>\n` }
                        );
                        setMediaTarget(null);
                    }}
                />
            )}
            <form className="admin-editor" onSubmit={handleSubmit}>
                <fieldset className="admin-editor-fields" disabled={saving || Boolean(draft)}>
                    <div className="admin-editor__main">
                        <section className="admin-panel admin-form-grid">
                            <label className="admin-field admin-field--wide">
                                <span>文章标题</span>
                                <input value={form.title} maxLength={255} required onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="输入清楚、具体的文章标题" />
                            </label>
                            <label className="admin-field admin-field--wide">
                                <span>文章摘要</span>
                                <textarea
                                    rows={3}
                                    value={form.description}
                                    maxLength={2000}
                                    onChange={(event) => setForm({ ...form, description: event.target.value })}
                                    placeholder="用于文章列表和搜索结果"
                                />
                            </label>
                            <div className="admin-field admin-field--wide">
                                <span>
                                    <label htmlFor="article-cover">封面地址</label>{' '}
                                    <button className="admin-button" type="button" onClick={() => setMediaTarget('cover')}>
                                        从媒体库选择
                                    </button>
                                </span>
                                <input
                                    id="article-cover"
                                    value={form.coverImage}
                                    onChange={(event) => setForm({ ...form, coverImage: event.target.value })}
                                    placeholder="/img/bg/1.webp 或 https://..."
                                />
                            </div>
                        </section>
                        <section className="admin-panel admin-content-editor">
                            <div className="admin-editor-tabs">
                                <button type="button" onClick={() => setMediaTarget('body')}>
                                    插入图片
                                </button>
                                <button type="button" className={mode === 'edit' ? 'is-active' : ''} onClick={() => setMode('edit')}>
                                    HTML 编辑
                                </button>
                                <button type="button" className={mode === 'preview' ? 'is-active' : ''} onClick={() => setMode('preview')}>
                                    内容预览
                                </button>
                            </div>
                            {mode === 'edit' ? (
                                <textarea
                                    className="admin-code-editor"
                                    aria-label="HTML 正文"
                                    value={form.content}
                                    required
                                    spellCheck={false}
                                    onChange={(event) => setForm({ ...form, content: event.target.value })}
                                />
                            ) : (
                                <iframe
                                    className="admin-article-preview"
                                    title="文章内容预览"
                                    // Keep scripts, forms and navigation sandboxed, while allowing
                                    // same-origin media to pass the site's CORP response policy.
                                    sandbox="allow-same-origin"
                                    srcDoc={`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; img-src https: http: data:; style-src \'unsafe-inline\'; base-uri \'none\'; form-action \'none\'"><style>body{margin:0;padding:28px;color:#26303c;font:16px/1.8 system-ui,sans-serif}img{max-width:100%;height:auto}pre{overflow:auto;padding:16px;border-radius:10px;background:#18212f;color:#eef4ff}blockquote{margin:20px 0;padding:4px 18px;border-left:4px solid #36c9a3;background:#f4faf8}table{width:100%;border-collapse:collapse}th,td{padding:8px;border:1px solid #dde4e8;text-align:left}a{color:#167d66}</style></head><body>${form.content}</body></html>`}
                                />
                            )}
                        </section>
                        <section className="admin-panel">
                            <div className="admin-panel__heading">
                                <div>
                                    <h2>文章外链</h2>
                                    <p>演示、源码或补充文档，最多 20 条</p>
                                </div>
                                <button
                                    className="admin-button"
                                    type="button"
                                    disabled={form.links.length >= 20}
                                    onClick={() =>
                                        setForm((current) => ({
                                            ...current,
                                            links: [...current.links, { title: '', url: '', icon: '', type: 'OTHER' }]
                                        }))
                                    }
                                >
                                    ＋ 添加链接
                                </button>
                            </div>
                            {form.links.length ? (
                                <div className="admin-link-editor">
                                    {form.links.map((link, index) => (
                                        <div key={index}>
                                            <input
                                                aria-label={`链接 ${index + 1} 名称`}
                                                value={link.title}
                                                onChange={(event) => updateLink(index, 'title', event.target.value)}
                                                placeholder="链接名称"
                                            />
                                            <input
                                                aria-label={`链接 ${index + 1} 地址`}
                                                value={link.url}
                                                onChange={(event) => updateLink(index, 'url', event.target.value)}
                                                placeholder="https://..."
                                                required
                                            />
                                            <select aria-label={`链接 ${index + 1} 类型`} value={link.type} onChange={(event) => updateLink(index, 'type', event.target.value)}>
                                                <option value="OTHER">其他</option>
                                                <option value="GITHUB">源码</option>
                                                <option value="DEMO">演示</option>
                                                <option value="DOCS">文档</option>
                                            </select>
                                            <button
                                                type="button"
                                                aria-label="删除链接"
                                                onClick={() => setForm((current) => ({ ...current, links: current.links.filter((_, linkIndex) => linkIndex !== index) }))}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="admin-inline-empty">这篇文章没有附加链接。</p>
                            )}
                        </section>
                    </div>
                    <aside className="admin-editor__aside">
                        <section className="admin-panel">
                            <h2>发布设置</h2>
                            <label className="admin-field">
                                <span>文章状态</span>
                                <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ArticleForm['status'] })}>
                                    <option value="DRAFT">保存为草稿</option>
                                    <option value="PUBLISHED">立即发布</option>
                                    <option value="ARCHIVED">归档文章</option>
                                </select>
                            </label>
                            <label className="admin-field">
                                <span>发布时间</span>
                                <input
                                    type="datetime-local"
                                    value={form.publishedAt}
                                    onInput={(event) => {
                                        const publishedAt = event.currentTarget.value;
                                        setForm((current) => ({ ...current, publishedAt }));
                                    }}
                                    onChange={(event) => setForm((current) => ({ ...current, publishedAt: event.target.value }))}
                                />
                            </label>
                            <button className="admin-button admin-button--primary admin-button--block" disabled={saving}>
                                {saving ? '保存中…' : articleId ? '保存修改' : '创建文章'}
                            </button>
                        </section>
                        <section className="admin-panel">
                            <h2>标签</h2>
                            <div className="admin-check-list">
                                {tags.map((tag) => (
                                    <label key={tag.id}>
                                        <input type="checkbox" checked={form.tagIds.includes(tag.id)} onChange={() => toggleId('tagIds', tag.id)} />
                                        <span style={{ '--tag-color': tag.color || '#36c9a3' } as React.CSSProperties}>{tag.name}</span>
                                    </label>
                                ))}
                            </div>
                        </section>
                        <section className="admin-panel">
                            <h2>技术栈</h2>
                            <div className="admin-check-list">
                                {techStacks.map((tech) => (
                                    <label key={tech.id}>
                                        <input type="checkbox" checked={form.techStackIds.includes(tech.id)} onChange={() => toggleId('techStackIds', tech.id)} />
                                        <span>{tech.name}</span>
                                    </label>
                                ))}
                            </div>
                        </section>
                    </aside>
                </fieldset>
            </form>
            {articleId && (
                <section className="admin-panel admin-revisions">
                    <h2>历史版本</h2>
                    <p>每次修改前自动保留快照；恢复后为草稿。最多显示最近 100 个版本。</p>
                    {revisionError && (
                        <p role="alert">
                            {revisionError}{' '}
                            <button className="admin-button" onClick={() => void loadRevisions()}>
                                重试
                            </button>
                        </p>
                    )}
                    {revisions.length ? (
                        <ul>
                            {revisions.map((item) => (
                                <li key={item.id}>
                                    <span>
                                        {item.title} · {new Date(item.createdAt).toLocaleString('zh-CN')}
                                    </span>
                                    <button className="admin-button" disabled={saving} onClick={() => void restoreRevision(item.id)}>
                                        恢复此版本
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>还没有历史版本。</p>
                    )}
                </section>
            )}
        </>
    );
}
