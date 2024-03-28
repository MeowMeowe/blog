import Nav from '@/compontents/nav';
import Exterior from '@/compontents/exterior';
import Footer from '@/compontents/footer';
import Container from '@/layout/container';

export const renderLayout = () => {
    const path: string = location.pathname;
    if (/admin/.test(path)) {
        return (
            <>
                <Exterior showScroll={false} />
                <Container />
            </>
        );
    } else {
        return (
            <>
                <Exterior />
                <Nav />
                <Container />
                <Footer />
            </>
        );
    }
};
