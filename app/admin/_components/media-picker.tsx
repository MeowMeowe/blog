'use client';

import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { adminRequest, errorMessage } from './admin-client';
import { useAdminUser } from './admin-shell';

type MediaFile = { name: string; url: string; size: number; createdAt: string };

function localImageUrl(url: string) {
    try {
        const parsed = new URL(url, window.location.origin);
        return parsed.origin === window.location.origin ? parsed.pathname : null;
    } catch {
        return null;
    }
}

export default function MediaPicker({ onSelect, onClose }: { onSelect: (url: string) => void; onClose: () => void }) {
    const { role } = useAdminUser();
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const panelRef = useRef<HTMLElement>(null);
    const closeRef = useRef(onClose);
    useEffect(() => {
        closeRef.current = onClose;
    }, [onClose]);
    useEffect(() => {
        const previousFocus = document.activeElement as HTMLElement | null;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        panelRef.current?.focus();
        function onKey(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                closeRef.current();
            }
            if (event.key !== 'Tab') return;
            const controls = [...(panelRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), [tabindex="0"]') || [])];
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (!first) {
                event.preventDefault();
                return;
            }
            if (event.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === panelRef.current)) {
                event.preventDefault();
                first.focus();
            }
        }
        document.addEventListener('keydown', onKey, true);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', onKey, true);
            previousFocus?.focus();
        };
    }, []);
    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const result = await adminRequest<{ files: MediaFile[] }>('/api/admin/media');
            setFiles(result.files || []);
        } catch (reason) {
            setError(errorMessage(reason));
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        void load();
    }, [load]);

    async function upload(event: ChangeEvent<HTMLInputElement>) {
        const file = event.currentTarget.files?.[0];
        event.currentTarget.value = '';
        if (!file) return;
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type) || file.size > 5 * 1024 * 1024) {
            setError('请选择 5 MB 以内的 JPEG、PNG、WebP 或 GIF 图片。');
            return;
        }
        setUploading(true);
        setError('');
        try {
            const form = new FormData();
            form.append('file', file);
            const result = await adminRequest<MediaFile | { file: MediaFile }>('/api/admin/media', { method: 'POST', body: form });
            const uploaded = 'file' in result ? result.file : result;
            if (!localImageUrl(uploaded.url)) throw new Error('服务器返回了异常的图片地址，请重试。');
            await load();
        } catch (reason) {
            setError(errorMessage(reason));
        } finally {
            setUploading(false);
        }
    }

    return (
        <div
            className="admin-media-backdrop"
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section ref={panelRef} tabIndex={-1} role="dialog" aria-modal="true" className="admin-media-picker" aria-label="媒体库">
                <div className="admin-panel__heading">
                    <div>
                        <h3>媒体库</h3>
                        <p>选择图片后将填入文章。支持 JPEG、PNG、WebP、GIF，最大 5 MB。</p>
                    </div>
                    <button type="button" className="admin-button" onClick={onClose}>
                        关闭
                    </button>
                </div>
                {['ADMIN', 'EDITOR'].includes(role) && (
                    <label className="admin-button admin-upload-button">
                        {uploading ? '正在上传…' : '上传图片'}
                        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={uploading} onChange={(event) => void upload(event)} />
                    </label>
                )}
                {error && (
                    <div className="admin-alert admin-alert--error" role="alert">
                        {error}{' '}
                        <button type="button" onClick={() => void load()}>
                            重试加载
                        </button>
                    </div>
                )}
                {loading ? (
                    <p className="admin-loading">正在加载图片…</p>
                ) : files.length ? (
                    <div className="admin-media-grid">
                        {files.map((file) => {
                            const url = localImageUrl(file.url);
                            return url ? (
                                <button type="button" key={file.url} onClick={() => onSelect(url)} title={`${file.name} · ${Math.ceil(file.size / 1024)} KB`}>
                                    <img src={url} alt={file.name} />
                                    <span>{file.name}</span>
                                </button>
                            ) : null;
                        })}
                    </div>
                ) : !error ? (
                    <p className="admin-inline-empty">还没有上传图片。</p>
                ) : null}
            </section>
        </div>
    );
}
