import Nav from '@/compontents/nav';
import Bg from '@/compontents/bg';
import ScrollBar from '@/compontents/scroll-bar';
import Footer from '@/compontents/footer';
import Container from '@/layout/container';

export const renderLayout = () => {
    const path: string = location.pathname;
    if (/admin/.test(path)) {
        return (
            <>
                <Bg />
                <Container />
            </>
        );
    } else {
        return (
            <>
                <Bg />
                <Nav />
                <ScrollBar />
                <Container />
                <Footer />
            </>
        );
    }
};
