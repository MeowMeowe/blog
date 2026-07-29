import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { localStorageUtil } from '@/utils/storage';
import './index.scss';

const AdminContainer: React.FC = () => {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        localStorageUtil.remove('access_token');
        router.push('/smk-admin');
    };

    const menuItems = [
        { name: '仪表盘', icon: '📊', path: '/admin/dashboard' },
        { name: '文章管理', icon: '📝', path: '/admin/articles' },
        { name: '评论管理', icon: '💬', path: '/admin/comments' },
        { name: '用户管理', icon: '👥', path: '/admin/users' },
        { name: '系统设置', icon: '⚙️', path: '/admin/settings' }
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
