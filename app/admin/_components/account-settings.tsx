'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { PageHeading } from './admin-ui';
import { adminRequest, errorMessage } from './admin-client';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Profile = {
    email: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    role: string;
    lastLoginAt: string | null;
};

export default function AccountSettings() {
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');

    const [busy, setBusy] = useState(false);
    const load = useCallback(async () => {
        setError('');
        try {
            setProfile(await adminRequest<Profile>('/api/admin/profile'));
        } catch (reason) {
            setError(errorMessage(reason));
        }
    }, []);
    useEffect(() => {
        void load();
    }, [load]);

    async function updateProfile(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (busy) return;
        const data = Object.fromEntries(new FormData(event.currentTarget));
        setBusy(true);
        setError('');
        setNotice('');
        try {
            const result = await adminRequest<Profile>('/api/admin/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ displayName: data.displayName, avatarUrl: data.avatarUrl || null })
            });
            setProfile((current) => (current ? { ...current, ...result } : current));
            setNotice('账号资料已保存');
            router.refresh();
        } catch (reason) {
            setError(errorMessage(reason));
        } finally {
            setBusy(false);
        }
    }

    async function updatePassword(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (busy) return;
        const form = event.currentTarget;
        const data = Object.fromEntries(new FormData(form));
        if (data.newPassword !== data.confirmPassword) return setError('两次输入的新密码不一致');
        setBusy(true);
        setError('');
        setNotice('');
        try {
            await adminRequest('/api/admin/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword: data.currentPassword, newPassword: data.newPassword })
            });
            form.reset();
            setNotice('密码已修改，旧登录均已失效，正在返回登录页。');
            const base = '/' + window.location.pathname.split('/').filter(Boolean)[0];
            await signOut({ callbackUrl: base + '/login' });
        } catch (reason) {
            setError(errorMessage(reason));
        } finally {
            setBusy(false);
        }
    }

    return (
        <>
            <PageHeading eyebrow="SETTINGS" title="账号与安全" description="维护后台展示资料、登录密码并查看当前运行边界。" />
            {(error || notice) && <div className={`admin-alert ${error ? 'admin-alert--error' : 'admin-alert--success'}`}>{error || notice}</div>}
            <fieldset className="admin-editor-fields" disabled={busy}>
                <div className="admin-settings-grid">
                    <section className="admin-panel">
                        <h2>账号资料</h2>
                        {profile ? (
                            <form className="admin-form-grid" onSubmit={updateProfile}>
                                <label className="admin-field">
                                    <span>登录邮箱</span>
                                    <input value={profile.email} disabled />
                                </label>
                                <label className="admin-field">
                                    <span>用户名</span>
                                    <input value={profile.username} disabled />
                                </label>
                                <label className="admin-field">
                                    <span>显示名称</span>
                                    <input name="displayName" required defaultValue={profile.displayName || profile.username} />
                                </label>
                                <label className="admin-field">
                                    <span>角色</span>
                                    <input value={profile.role === 'ADMIN' ? '管理员' : '编辑'} disabled />
                                </label>
                                <label className="admin-field admin-field--wide">
                                    <span>头像地址</span>
                                    <input name="avatarUrl" defaultValue={profile.avatarUrl} placeholder="/img/cat.png" />
                                </label>
                                <div className="admin-form-actions admin-field--wide">
                                    <button className="admin-button admin-button--primary">保存资料</button>
                                </div>
                            </form>
                        ) : (
                            <div className="admin-loading">
                                {error ? (
                                    <button className="admin-button" onClick={() => void load()}>
                                        重新加载资料
                                    </button>
                                ) : (
                                    '正在加载账号…'
                                )}
                            </div>
                        )}
                    </section>
                    <section className="admin-panel">
                        <h2>修改密码</h2>
                        <form className="admin-form-grid" onSubmit={updatePassword}>
                            <label className="admin-field admin-field--wide">
                                <span>当前密码</span>
                                <input name="currentPassword" type="password" autoComplete="current-password" required />
                            </label>
                            <label className="admin-field admin-field--wide">
                                <span>新密码</span>
                                <input name="newPassword" type="password" minLength={12} autoComplete="new-password" required />
                            </label>
                            <label className="admin-field admin-field--wide">
                                <span>确认新密码</span>
                                <input name="confirmPassword" type="password" minLength={12} autoComplete="new-password" required />
                            </label>
                            <div className="admin-form-actions admin-field--wide">
                                <button className="admin-button admin-button--primary">更新密码</button>
                            </div>
                        </form>
                    </section>
                    <section className="admin-panel admin-security-card">
                        <h2>当前安全边界</h2>
                        <ul>
                            <li>
                                <span>后台入口</span>
                                <strong>隐藏路径 + 登录校验</strong>
                            </li>
                            <li>
                                <span>会话时间</span>
                                <strong>12 小时，改密即撤销</strong>
                            </li>
                            <li>
                                <span>写请求</span>
                                <strong>角色 + 同源校验</strong>
                            </li>
                            <li>
                                <span>文章内容</span>
                                <strong>写入与读取双重净化</strong>
                            </li>
                            <li>
                                <span>多实例限流</span>
                                <strong>上线后接入 Redis</strong>
                            </li>
                        </ul>
                    </section>
                </div>
            </fieldset>
            {profile?.role === 'ADMIN' && (
                <section className="admin-panel">
                    <h2>内容备份</h2>
                    <p>导出文章、标签、技术栈和历史版本，不包含账号密码。完整数据库及媒体备份请使用本地备份脚本。</p>
                    <a className="admin-button" href="/api/admin/export" download>
                        导出内容 JSON
                    </a>
                </section>
            )}
        </>
    );
}
