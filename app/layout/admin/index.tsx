import React, { useState } from 'react';

import Menu from '@/layout/components/menu';

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
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
                <div className="admin-main-layout">{children}</div>
            </main>
        </div>
    );
};

export default Layout;
