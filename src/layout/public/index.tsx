import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Nav from '../components/nav';
import Footer from '../components/footer';
import Loading from '@/compontents/loading';
import './index.scss';

const Layout: React.FC = () => {
    return (
        <>
            <Nav />
            <div className="public-main-layout">
                <Suspense fallback={<Loading />}>
                    <Outlet />
                </Suspense>
            </div>
            <Footer />
        </>
    );
};

export default Layout;
