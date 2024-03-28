import React from 'react';
import { useLocation } from 'react-router-dom';
import Nav from '@/compontents/nav';
import Exterior from '@/compontents/exterior';
import Footer from '@/compontents/footer';
import Container from '@/layout/container';

const Layout: React.FC = () => {
    const location = useLocation();
    const path: string = location.pathname;

    return (
        <>
            {/admin/.test(path) ? (
                <>
                    <Exterior showScroll={false} />
                    <Container />
                </>
            ) : (
                <>
                    <Exterior />
                    <Nav />
                    <Container />
                    <Footer />
                </>
            )}
        </>
    );
};

export default Layout;
