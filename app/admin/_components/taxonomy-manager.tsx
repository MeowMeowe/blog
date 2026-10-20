'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { EmptyState, PageHeading } from './admin-ui';
import { adminRequest, errorMessage } from './admin-client';
import { useAdminUser } from './admin-shell';

type Tag = { id: number; name: string; slug: string; color: string | null; icon: string | null; description: string | null };
type Tech = { id: number; name: string; icon: string | null; link: string | null; description: string | null; _count?: { articles: number } };
type Mode = 'tags' | 'tech';

export default function TaxonomyManager() {
    const [mode, setMode] = useState<Mode>('tags');
    const [tags, setTags] = useState<Tag[]>([]);
    const [tech, setTech] = useState<Tech[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [loading, setLoading] = useState(true);

    const { role } = useAdminUser();
    const canEdit = role === 'ADMIN';
    const [busy, setBusy] = useState(false);
    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [tagResult, techResult] = await Promise.all([adminRequest<Tag[]>('/api/tags'), adminRequest<Tech[]>('/api/admin/tech-stack')]);
            setTags(tagResult);
            setTech(techResult);
        } catch (reason) {
            setError(errorMessage(reason));
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        void load();
    }, [load]);

    async function save(event: FormEvent<HTMLFormElement>, type: Mode) {
        event.preventDefault();
        if (!canEdit || busy) return;
        const form = event.currentTarget;
        const data = Object.fromEntries(new FormData(form));
        const payload =
            type === 'tags'
                ? { name: data.name, slug: data.slug, color: data.color || null, icon: data.icon || null, description: data.description || null }
                : { name: data.name, icon: data.icon || null, link: data.link || null, description: data.description || null };
        const endpoint = type === 'tags' ? (editingId ? `/api/admin/tags/${editingId}` : '/api/tags') : `/api/admin/tech-stack${editingId ? '/' + editingId : ''}`;
        setBusy(true);
        setError('');
        setNotice('');
        try {
            await adminRequest(endpoint, { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            setEditingId(null);
            form.reset();
            setNotice('分类已保存');
            await load();
        } catch (reason) {
            setError(errorMessage(reason));
        } finally {
            setBusy(false);
        }
    }
    const saveTag = (event: FormEvent<HTMLFormElement>) => save(event, 'tags');
    const saveTech = (event: FormEvent<HTMLFormElement>) => save(event, 'tech');
    async function remove(type: Mode, id: number, name: string) {
        if (!canEdit || busy || !window.confirm(`确认删除“${name}”？正在被文章使用的分类不会被删除。`)) return;
        setBusy(true);
        setError('');
        setNotice('');
        try {
            await adminRequest(type === 'tags' ? `/api/admin/tags/${id}` : `/api/admin/tech-stack/${id}`, { method: 'DELETE' });
            if (editingId === id) setEditingId(null);
            setNotice('分类已删除');
            await load();
        } catch (reason) {
            setError(errorMessage(reason));
        } finally {
            setBusy(false);
        }
    }

    const editingTag = mode === 'tags' ? tags.find((item) => item.id === editingId) : null;
    const editingTech = mode === 'tech' ? tech.find((item) => item.id === editingId) : null;

    return (
        <>
            <PageHeading eyebrow="TAXONOMY" title="内容分类" description="维护文章标签与技术栈，已被文章使用的项目不会被误删。" />
            {(error || notice) && <div className={`admin-alert ${error ? 'admin-alert--error' : 'admin-alert--success'}`}>{error || notice}</div>}
            {error && (
                <button className="admin-button" onClick={() => void load()}>
                    重新加载
                </button>
            )}
            {!canEdit && <p className="admin-alert">编辑账号可以查看分类；分类维护由管理员操作。</p>}
            <fieldset className="admin-editor-fields" disabled={busy}>
                <div className="admin-segmented">
                    <button
                        className={mode === 'tags' ? 'is-active' : ''}
                        onClick={() => {
                            setMode('tags');
                            setEditingId(null);
                        }}
                    >
                        标签
                    </button>
                    <button
                        className={mode === 'tech' ? 'is-active' : ''}
                        onClick={() => {
                            setMode('tech');
                            setEditingId(null);
                        }}
                    >
                        技术栈
                    </button>
                </div>
                <div className="admin-split">
                    <section className="admin-panel">
                        <div className="admin-panel__heading">
                            <div>
                                <h2>{mode === 'tags' ? '标签列表' : '技术栈列表'}</h2>
                                <p>{mode === 'tags' ? `${tags.length} 个标签` : `${tech.length} 项技术`}</p>
                            </div>
                        </div>
                        {loading ? (
                            <div className="admin-loading">正在加载分类…</div>
                        ) : mode === 'tags' ? (
                            tags.length ? (
                                <div className="admin-taxonomy-list">
                                    {tags.map((tag) => (
                                        <article key={tag.id}>
                                            <i style={{ background: tag.color || '#36c9a3' }} />
                                            <div>
                                                <strong>{tag.name}</strong>
                                                <span>/{tag.slug}</span>
                                            </div>
                                            <button disabled={!canEdit} onClick={() => setEditingId(tag.id)}>
                                                编辑
                                            </button>
                                            <button disabled={!canEdit} className="is-danger" onClick={() => void remove('tags', tag.id, tag.name)}>
                                                删除
                                            </button>
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState title="还没有标签" description="在右侧创建第一个标签。" />
                            )
                        ) : tech.length ? (
                            <div className="admin-taxonomy-list">
                                {tech.map((item) => (
                                    <article key={item.id}>
                                        <i className="is-tech">{item.icon ? '◆' : '◇'}</i>
                                        <div>
                                            <strong>{item.name}</strong>
                                            <span>{item._count?.articles || 0} 篇文章</span>
                                        </div>
                                        <button disabled={!canEdit} onClick={() => setEditingId(item.id)}>
                                            编辑
                                        </button>
                                        <button disabled={!canEdit} className="is-danger" onClick={() => void remove('tech', item.id, item.name)}>
                                            删除
                                        </button>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <EmptyState title="还没有技术栈" description="在右侧创建第一个技术项目。" />
                        )}
                    </section>
                    {canEdit && (
                        <section className="admin-panel">
                            <h2>
                                {editingId ? '编辑' : '新建'}
                                {mode === 'tags' ? '标签' : '技术栈'}
                            </h2>
                            {mode === 'tags' ? (
                                <form className="admin-form-grid" key={editingTag?.id || 'new-tag'} onSubmit={saveTag}>
                                    <label className="admin-field">
                                        <span>名称</span>
                                        <input name="name" required maxLength={50} defaultValue={editingTag?.name} />
                                    </label>
                                    <label className="admin-field">
                                        <span>Slug</span>
                                        <input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" defaultValue={editingTag?.slug} />
                                    </label>
                                    <label className="admin-field">
                                        <span>颜色</span>
                                        <input name="color" type="color" defaultValue={editingTag?.color || '#36c9a3'} />
                                    </label>
                                    <label className="admin-field">
                                        <span>图标名</span>
                                        <input name="icon" maxLength={50} defaultValue={editingTag?.icon || ''} placeholder="Vue" />
                                    </label>
                                    <label className="admin-field admin-field--wide">
                                        <span>说明</span>
                                        <textarea name="description" rows={4} defaultValue={editingTag?.description || ''} />
                                    </label>
                                    <FormActions editing={Boolean(editingId)} cancel={() => setEditingId(null)} />
                                </form>
                            ) : (
                                <form className="admin-form-grid" key={editingTech?.id || 'new-tech'} onSubmit={saveTech}>
                                    <label className="admin-field">
                                        <span>名称</span>
                                        <input name="name" required maxLength={50} defaultValue={editingTech?.name} />
                                    </label>
                                    <label className="admin-field">
                                        <span>图标名</span>
                                        <input name="icon" maxLength={50} defaultValue={editingTech?.icon || ''} placeholder="Nextjs" />
                                    </label>
                                    <label className="admin-field admin-field--wide">
                                        <span>官网链接</span>
                                        <input name="link" type="url" defaultValue={editingTech?.link || ''} />
                                    </label>
                                    <label className="admin-field admin-field--wide">
                                        <span>说明</span>
                                        <textarea name="description" rows={4} defaultValue={editingTech?.description || ''} />
                                    </label>
                                    <FormActions editing={Boolean(editingId)} cancel={() => setEditingId(null)} />
                                </form>
                            )}
                        </section>
                    )}
                </div>
            </fieldset>
        </>
    );
}

function FormActions({ editing, cancel }: { editing: boolean; cancel: () => void }) {
    return (
        <div className="admin-form-actions admin-field--wide">
            {editing && (
                <button type="button" className="admin-button" onClick={cancel}>
                    取消
                </button>
            )}
            <button className="admin-button admin-button--primary">{editing ? '保存修改' : '立即创建'}</button>
        </div>
    );
}
