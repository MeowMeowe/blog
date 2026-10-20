'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './index.scss';

export default function AdminLoginPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (isSubmitting) return;
        setError('');
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        try {
            const result = await signIn('credentials', {
                email: formData.get('email'),
                password: formData.get('password'),
                redirect: false
            });

            if (!result?.ok) {
                setError('邮箱或密码不正确，请重试。');
                return;
            }

            const adminBasePath = window.location.pathname.replace(/\/login\/?$/, '');
            const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl');
            const destination = callbackUrl && (callbackUrl === adminBasePath || callbackUrl.startsWith(`${adminBasePath}/`)) ? callbackUrl : adminBasePath;
            router.replace(destination);
            router.refresh();
        } catch {
            setError('网络连接失败，请稍后重试。');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="admin-login">
            <section className="admin-login__card">
                <Link className="admin-login__brand" href="/" aria-label="返回博客首页">
                    <img src="/img/cat.png" alt="" />
                    <span>MeowGod</span>
                </Link>
                <div>
                    <p className="admin-login__eyebrow">ADMIN CONSOLE</p>
                    <h1>欢迎回来</h1>
                    <p className="admin-login__description">登录后管理文章与站点内容。</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <label>
                        邮箱
                        <input name="email" type="email" autoComplete="username" required />
                    </label>
                    <label>
                        密码
                        <input name="password" type="password" autoComplete="current-password" required />
                    </label>
                    {error && (
                        <p className="admin-login__error" role="alert">
                            {error}
                        </p>
                    )}
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? '登录中…' : '登录'}
                    </button>
                </form>
            </section>
        </main>
    );
}
