import React from 'react';
import Nav from '../compontents/nav';
import Bg from '../compontents/bg';
import ScrollBar from '../compontents/scroll-bar';
import Footer from '../compontents/footer';

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
