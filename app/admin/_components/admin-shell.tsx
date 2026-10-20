'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const navigation = [
    { path: '', label: '仪表盘', icon: '⌂' },
    { path: '/articles', label: '文章管理', icon: '▤' },
    { path: '/tags', label: '内容分类', icon: '◇' },
    { path: '/settings', label: '账号设置', icon: '⚙' }
];

const AdminUserContext = createContext<{ name: string; email: string; role: string }>({ name: '', email: '', role: '' });
export const useAdminUser = () => useContext(AdminUserContext);

export default function AdminShell({ children, user }: { children: React.ReactNode; user: { name: string; email: string; role: string } }) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const sidebarRef = useRef<HTMLElement>(null);
    const adminBasePath = `/${pathname.split('/').filter(Boolean)[0] || 'backstage'}`;

    useEffect(() => {
        if (!open) return;
        const previous = document.activeElement as HTMLElement | null;
        const overflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        sidebarRef.current?.querySelector<HTMLButtonElement>('.admin-sidebar-close')?.focus();
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false);
            if (event.key !== 'Tab') return;
            const items = [...(sidebarRef.current?.querySelectorAll<HTMLElement>('a[href],button') || [])];
            const first = items[0],
                last = items[items.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
            }
        };
        const onResize = () => {
            if (window.innerWidth > 920) setOpen(false);
        };
        document.addEventListener('keydown', onKey);
        window.addEventListener('resize', onResize);
        return () => {
            document.body.style.overflow = overflow;
            document.removeEventListener('keydown', onKey);
            window.removeEventListener('resize', onResize);
            previous?.focus();
        };
    }, [open]);

    return (
        <AdminUserContext.Provider value={user}>
            <div className="admin-console">
                <aside ref={sidebarRef} id="admin-navigation" className={`admin-sidebar ${open ? 'is-open' : ''}`}>
                    <button className="admin-sidebar-close" aria-label="关闭导航" onClick={() => setOpen(false)}>
                        ×
                    </button>
                    <div className="admin-brand">
                        <img src="/img/cat.png" alt="" />
                        <div>
                            <strong>MeowGod</strong>
                            <span>CONTENT STUDIO</span>
                        </div>
                    </div>
                    <nav aria-label="后台导航">
                        {navigation.map((item) => {
                            const href = `${adminBasePath}${item.path}`;
                            const active = item.path ? pathname.startsWith(href) : pathname === adminBasePath || pathname === `${adminBasePath}/`;
                            return (
                                <Link key={item.label} aria-current={active ? 'page' : undefined} className={active ? 'is-active' : ''} href={href} onClick={() => setOpen(false)}>
                                    <span aria-hidden="true">{item.icon}</span>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="admin-sidebar__footer">
                        <Link href="/" target="_blank">
                            查看博客 ↗
                        </Link>
                        <button onClick={() => void signOut({ callbackUrl: `${adminBasePath}/login` })}>退出登录</button>
                    </div>
                </aside>
                {open && <button className="admin-sidebar-mask" tabIndex={-1} aria-label="关闭导航遮罩" onClick={() => setOpen(false)} />}
                <section className="admin-workspace" inert={open || undefined}>
                    <header className="admin-topbar">
                        <button className="admin-menu-trigger" onClick={() => setOpen(true)} aria-label="打开导航" aria-expanded={open} aria-controls="admin-navigation">
                            ☰
                        </button>
                        <div className="admin-user">
                            <span>{user.role === 'ADMIN' ? '管理员' : '编辑'}</span>
                            <div>
                                <strong>{user.name}</strong>
                                <small>{user.email}</small>
                            </div>
                        </div>
                    </header>
                    <main className="admin-main">{children}</main>
                </section>
            </div>
        </AdminUserContext.Provider>
    );
}
