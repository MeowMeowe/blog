import React from 'react';
import Nav from '../compontents/common/nav';
import Bg from '../compontents/common/bg';
import ScrollBar from '../compontents/common/scroll-bar';
import Footer from '../compontents/common/footer';

export const renderCompontentsByPath = () => {
    const path: string = location.pathname;
    if (/exclusive|tools-box/.test(path) || path == '/') {
        return (
            <>
                <Bg />
                <Nav />
                <ScrollBar />
                <Footer />
            </>
        );
    } else if (/admin/.test(path)) {
        return <Bg />;
    }
};
