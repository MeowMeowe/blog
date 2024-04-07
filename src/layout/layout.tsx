import React from 'react';
import { useLocation } from 'react-router-dom';
import Nav from '@/compontents/nav';
import Footer from '@/compontents/footer';
import Container from '@/layout/container';

const Layout: React.FC = () => {
    const location = useLocation();
    const path: string = location.pathname;

    return (
        <>
            {/admin/.test(path) ? (
                <Container />
            ) : (
                <>
                    <Nav />
                    <Container />
                    <Footer />
                </>
            )}
        </>
    );
};

export default Layout;
