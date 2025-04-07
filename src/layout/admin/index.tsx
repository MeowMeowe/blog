import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Menu from '@/layout/components/menu';

const Layout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    return (
        <div className="admin-container">
            <Menu />
            <main className="main-content">
                <header className="top-bar">
                    <button className="toggle-sidebar" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? '☰' : '☰'}
                    </button>
                    <div className="user-info">
                        <img src="/img/cat.png" alt="avatar" className="avatar" />
                        <span className="username">管理员</span>
                    </div>
                </header>
                <div className="admin-main-layout">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
