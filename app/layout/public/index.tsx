import React, { Suspense } from 'react';

import Nav from '../components/nav';
import Footer from '../components/footer';
import Loading from '@/components/loading';
import './index.scss';

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <>
            <Nav />
            <div className="public-main-layout">
                <Suspense fallback={<Loading />}>{children}</Suspense>
            </div>
            <Footer />
        </>
    );
};

export default Layout;
