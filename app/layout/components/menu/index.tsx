import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import './index.scss';

const AdminContainer: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const isSidebarOpen = true;
    const adminBasePath = `/${pathname.split('/').filter(Boolean)[0] || 'backstage'}`;

    const handleLogout = async () => {
        await signOut({ callbackUrl: `${adminBasePath}/login` });
    };

    const menuItems = [
        { name: '仪表盘', icon: '📊', path: `${adminBasePath}/dashboard` },
        { name: '文章管理', icon: '📝', path: `${adminBasePath}/articles` },
        { name: '评论管理', icon: '💬', path: `${adminBasePath}/comments` },
        { name: '用户管理', icon: '👥', path: `${adminBasePath}/users` },
        { name: '系统设置', icon: '⚙️', path: `${adminBasePath}/settings` }
    ];

    return (
        <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <img src="/img/cat.png" alt="logo" className="logo" />
                <h2>管理后台</h2>
            </div>
            <nav className="sidebar-nav">
                {menuItems.map((item, index) => (
                    <a
                        key={index}
                        href={item.path}
                        className="nav-item"
                        onClick={(e) => {
                            e.preventDefault();
                            router.push(item.path);
                        }}
                    >
                        <span className="icon">{item.icon}</span>
                        {isSidebarOpen && <span className="text">{item.name}</span>}
                    </a>
                ))}
            </nav>
            <div className="sidebar-footer">
                <button className="logout-btn" onClick={handleLogout}>
                    <span className="icon">🚪</span>
                    {isSidebarOpen && <span className="text">退出登录</span>}
                </button>
            </div>
        </aside>
    );
};

export default AdminContainer;
