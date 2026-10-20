import { throttle } from '@/utils/utils';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItems } from '@/utils/navItems';
import LazyImage from '../../../components/lazy-image';
import { randomNumber } from '@/utils/utils';
import './index.scss';

interface NavItem {
    key: string;
    title: string;
    path: string;
    // navShow: boolean;
}

const Nav: React.FC = () => {
    const pathname = usePathname();
    const [navClass, setNavClass] = useState<string>(''); //nav className
    const [menuFold, setMenuFold] = useState<boolean>(false); //menu折叠
    const [isTopShow, setIsTopShow] = useState<boolean>(false); //目标
    const [isHeartShow, setIsHeartShow] = useState<boolean>(false); //中箭的心
    const [isArrowShow, setIsArrowShow] = useState<boolean>(false); //箭
    const [clickToTop, setClickToTop] = useState<boolean>(false); //toTop触发点击
    const [backgroundNumber, setBackgroundNumber] = useState(1);

    useEffect(() => {
        setBackgroundNumber(Number(randomNumber(1, 14, 0)));
    }, []);

    useEffect(() => {
        setMenuFold(false);
    }, [pathname]);

    // 全局点击隐藏menu
    const handleDomClick = useCallback((e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.menu')) {
            setMenuFold(false);
        }
    }, []);

    const handleClickMenu = () => {
        setMenuFold((prev) => !prev);
    };

    // 监听滚动
    const listenScroll = useCallback(() => {
        if (window.scrollY === 0) {
            if (clickToTop) setIsHeartShow(false);
            setIsTopShow(false);
            setIsArrowShow(false);
            setClickToTop(false);
        }
        if (window.scrollY >= window.innerHeight - 66) {
            setIsTopShow(true);
            setIsHeartShow(true);
        }

        if (window.scrollY >= 66) {
            setNavClass('fix-top');
        } else if (window.scrollY == 0) {
            setNavClass('');
        }
    }, [clickToTop]);

    const scrollToTop = () => {
        setClickToTop(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsArrowShow(true);
    };

    useEffect(() => {
        const throttledListenScroll = throttle(listenScroll, 100);
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMenuFold(false);
                document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus();
            }
        };
        document.addEventListener('scroll', throttledListenScroll);
        document.addEventListener('click', handleDomClick);
        document.addEventListener('keydown', closeOnEscape);
        return () => {
            document.removeEventListener('scroll', throttledListenScroll);
            document.removeEventListener('click', handleDomClick);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [handleDomClick, listenScroll]);

    const renderLinks = () => {
        return NavItems.map((item: NavItem) => {
            return (
                <Link key={item.key} href={item.path} aria-current={pathname === item.path ? 'page' : undefined} onClick={() => setMenuFold(false)}>
                    {item.title}
                </Link>
            );
        });
    };

    return (
        <>
            {/* 头部 */}
            <header>
                <nav className={`nav-wrap ${navClass}`}>
                    <Link className="logo" href="/" aria-label="返回博客首页">
                        <img className="logo-img" src="/icon/cat.webp" alt="logo" />
                        <p>MeowGod`s Blog </p>
                    </Link>
                    <div className="menu">
                        <button
                            type="button"
                            className="menu-toggle"
                            aria-label={menuFold ? '收起导航' : '展开导航'}
                            aria-expanded={menuFold}
                            aria-controls="mobile-navigation"
                            onClick={handleClickMenu}
                        >
                            <img className="menu-icon" src={menuFold ? '/icon/down-arrow.webp' : '/icon/menu.webp'} alt="" />
                        </button>
                        <div id="mobile-navigation" className={menuFold ? 'menu-links-open' : 'menu-links'}>
                            {renderLinks()}
                        </div>
                    </div>
                    <div className="links">{renderLinks()}</div>
                </nav>
            </header>
            <div className="exterior">
                {/* 全局背景 */}
                <div className="bg">
                    <LazyImage className="bg-img" src={`/img/bg/${backgroundNumber}.webp`} alt="bg" noLoading />
                </div>
                {/* 滚动 */}
                <div className="scroll-bar">
                    <button type="button" aria-label="回到顶部" className={`top-icon-wrap top-icon-${isTopShow}`} onClick={scrollToTop}>
                        <LazyImage className="top-icon" src="/icon/cupid.webp" alt="go-top" />
                    </button>
                    <LazyImage className={`heart-${isHeartShow ? '' : 'arrow-'}icon heart-icon-${isTopShow}`} src={`/icon/${isHeartShow ? 'target' : 'cupid-1'}.webp`} alt="heart" />
                    {isArrowShow && <LazyImage className={`arrow-icon arrow-icon-${isArrowShow}`} src="/icon/cupid-2.webp" style={{ top: window.innerHeight - 136 + 'px' }} alt="arrow" />}
                </div>
            </div>
        </>
    );
};

export default Nav;
