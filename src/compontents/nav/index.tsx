import { throttle } from '@/utils/utils';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.scss';

export default function Nav() {
    const [navClass, setNavClass] = useState('');
    const [menuFold, setMenuFold] = useState(window.innerWidth < 500);
    const [clickMenu, setClickMenu] = useState(false);

    const handleScroll = () => {
        if (scrollY >= 66) {
            setNavClass('fix-top');
        } else {
            setNavClass('');
        }
    };
    const hanbleDomClick = (e: any) => {
        if (
            e.target.className !== 'fold-menu-icon' &&
            e.target.className !== 'fold-menu-links-open'
        ) {
            setClickMenu(false);
        }
    };

    const handleResize = () => {
        setMenuFold(window.innerWidth < 500);
    };

    useEffect(() => {
        document.addEventListener('scroll', handleScroll);
        document.addEventListener('click', hanbleDomClick);
        window.onresize = throttle(handleResize, 100);
        return () => {
            document.removeEventListener('scroll', handleScroll);
            document.removeEventListener('click', hanbleDomClick);
            window.onresize = null;
        };
    }, []);

    const handleClickMenu = () => {
        setClickMenu((clickMenu) => !clickMenu);
    };

    const renderLinks = () => {
        return (
            <>
                <Link to="/">首页</Link>
                <Link to="/exclusive">Miao</Link>
                <Link to="/tools-box">工具箱</Link>
                <Link to="/about">关于</Link>
            </>
        );
    };

    return (
        <>
            <nav className={`nav-wrap ${navClass}`}>
                <div className="logo">
                    <img className="logo-img" src="./img/icon/cat.webp" alt="logo" />
                    <p>MeowGod`s Blog </p>
                </div>
                {menuFold ? (
                    <div className="fold-menu">
                        <img
                            onClick={handleClickMenu}
                            className="fold-menu-icon"
                            src={clickMenu ? './img/icon/down-arrow.webp' : './img/icon/menu.webp'}
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
        </>
    );
}
