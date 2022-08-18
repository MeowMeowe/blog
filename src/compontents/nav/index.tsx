import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.scss';

export default function Nav() {
    const [navClass, setNavClass] = useState('');

    const handleScroll = () => {
        // console.log(scrollY)
        if (scrollY >= 66) {
            setNavClass('fix-top');
        } else {
            setNavClass('');
        }
    };

    useEffect(() => {
        document.addEventListener('scroll', handleScroll);
    }, []);
    return (
        <>
            <nav className={`nav-wrap ${navClass}`}>
                <div className="logo">
                    <img className="logo-img" src="./img/icon/cat.webp" alt="logo" />
                    <p>MeowGod`s Blog </p>
                </div>
                <div className="links">
                    <Link to="/">首页</Link>
                    <Link to="/exclusive">Miao</Link>
                    <Link to="/tools-box">工具箱</Link>
                    <Link to="/about">关于</Link>
                </div>
            </nav>
        </>
    );
}
