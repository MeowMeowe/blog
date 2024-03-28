import { throttle } from '@/utils/utils';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RouterSchemle from '@/router';
import './index.scss';

interface NavItem {
    key: string;
    title: string;
    path: string;
    navShow: boolean;
}

const Nav: React.FC = () => {
    const [navClass, setNavClass] = useState<string>('');
    const [menuFold, setMenuFold] = useState<boolean>(window.innerWidth < 500);
    const [clickMenu, setClickMenu] = useState<boolean>(false);

    const handleScroll = () => {
        if (window.scrollY >= 66) {
            setNavClass('fix-top');
        } else {
            setNavClass('');
        }
    };

    const handleDomClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.className !== 'fold-menu-icon' && target.className !== 'fold-menu-links-open') {
            setClickMenu(false);
        }
    };

    const handleResize = () => {
        setMenuFold(window.innerWidth < 550);
    };

    useEffect(() => {
        document.addEventListener('scroll', handleScroll);
        document.addEventListener('click', handleDomClick);
        window.addEventListener('resize', throttle(handleResize, 100));
        return () => {
            document.removeEventListener('scroll', handleScroll);
            document.removeEventListener('click', handleDomClick);
            window.removeEventListener('resize', throttle(handleResize, 100));
        };
    }, []);

    useEffect(() => {
        setClickMenu(false);
    }, [menuFold]);

    const handleClickMenu = () => {
        setClickMenu((prevClickMenu) => !prevClickMenu);
    };

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
        <header>
            <nav className={`nav-wrap ${navClass}`}>
                <div className="logo">
                    <img className="logo-img" src="/img/icon/cat.webp" alt="logo" />
                    <p>MeowGod`s Blog </p>
                </div>
                {menuFold ? (
                    <div className="fold-menu">
                        <img
                            className="fold-menu-icon"
                            onClick={handleClickMenu}
                            src={clickMenu ? '/img/icon/down-arrow.webp' : '/img/icon/menu.webp'}
                            alt="fold-menu"
                        />
                        <div className={clickMenu ? 'fold-menu-links-open' : 'fold-menu-links'}>
                            {renderLinks()}
                        </div>
                    </div>
                ) : (
                    <div className="links">{renderLinks()}</div>
                )}
            </nav>
        </header>
    );
};

export default Nav;
