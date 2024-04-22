import { throttle } from '@/utils/utils';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import LazyImage from '../lazy-image';
import RouterSchemle from '@/router';
import { randomNumber } from '@/utils/utils';
import './index.scss';

interface NavItem {
    key: string;
    title: string;
    path: string;
    navShow: boolean;
}

const Nav: React.FC = () => {
    const [navClass, setNavClass] = useState<string>(''); //nav className
    const [menuFold, setMenuFold] = useState<boolean>(false); //menu折叠

    const [isTopShow, setIsTopShow] = useState<boolean>(false); //目标
    const [isHeartShow, setIsHeartShow] = useState<boolean>(false); //中箭的心
    const [isArrowShow, setIsArrowShow] = useState<boolean>(false); //箭
    const [clickToTop, setClickToTop] = useState<boolean>(false); //toTop触发点击
    const imgNumRef = useRef<string>(randomNumber(1, 6, 0)); //背景

    // 全局点击隐藏menu
    const handleDomClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.className !== 'menu-icon' && target.className !== 'menu-links-open') {
            setMenuFold(false);
        }
    };

    const handleClickMenu = () => {
        setMenuFold((prev) => !prev);
    };

    // 监听滚动
    const listenScroll = () => {
        if (window.scrollY === 0) {
            clickToTop && setIsHeartShow(false);
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
    };

    const scrollToTop = () => {
        setClickToTop(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsArrowShow(true);
    };

    useEffect(() => {
        const menuShow = window.innerWidth < 580;
        const throttledListenScroll = throttle(listenScroll, 100);
        document.addEventListener('scroll', throttledListenScroll);
        menuShow && document.addEventListener('click', handleDomClick);
        return () => {
            document.removeEventListener('scroll', throttledListenScroll);
            document.removeEventListener('click', handleDomClick);
        };
    }, [clickToTop]);

    const renderLinks = () => {
        return RouterSchemle.map((item: NavItem) => {
            return item.navShow ? (
                <Link key={item.key} to={item.path}>
                    {item.title}
                </Link>
            ) : null;
        });
    };

    return (
        <>
            {/* 头部 */}
            <header>
                <nav className={`nav-wrap ${navClass}`}>
                    <div className="logo">
                        <img className="logo-img" src="/img/icon/cat.webp" alt="logo" />
                        <p>MeowGod`s Blog </p>
                    </div>
                    <div className="menu">
                        <img className="menu-icon" onClick={handleClickMenu} src={menuFold ? '/img/icon/down-arrow.webp' : '/img/icon/menu.webp'} alt="fold-menu" />
                        <div className={menuFold ? 'menu-links-open' : 'menu-links'}>{renderLinks()}</div>
                    </div>
                    <div className="links">{renderLinks()}</div>
                </nav>
            </header>
            <div className="exterior">
                {/* 全局背景 */}
                <div className="bg">
                    <img className="bg-img" src={`/img/bg/${imgNumRef.current}.webp`} alt="bg" />
                </div>
                {/* 滚动 */}
                <div className="scroll-bar">
                    <div className={`top-icon-wrap top-icon-${isTopShow}`} onClick={scrollToTop}>
                        <LazyImage className="top-icon" src="/img/icon/cupid.webp" alt="go-top" />
                    </div>
                    <LazyImage className={`heart-${isHeartShow ? '' : 'arrow-'}icon heart-icon-${isTopShow}`} src={`/img/icon/${isHeartShow ? 'target' : 'cupid-1'}.webp`} alt="heart" />
                    {isArrowShow && <LazyImage className={`arrow-icon arrow-icon-${isArrowShow}`} src="/img/icon/cupid-2.webp" style={{ top: window.innerHeight - 136 + 'px' }} alt="arrow" />}
                </div>
            </div>
        </>
    );
};

export default Nav;
