import Nav from '@/compontents/nav';
import ScrollBar from '@/compontents/scroll-bar';
import Footer from '@/compontents/footer';
import Container from '@/layout/container';

export default function Layout() {
    const path: string = location.pathname;
    if (/admin/.test(path)) {
        return <Container />;
    } else {
        return (
            <>
                <Nav />
                <ScrollBar />
                <Container />
                <Footer />
            </>
        );
    }
}
