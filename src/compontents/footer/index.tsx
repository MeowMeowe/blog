import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { LoadJs } from '../../static/js/utils';
import './index.scss';

export default function Footer() {
    useEffect(() => {
        LoadJs('//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js');
    });
    return (
        <div className="footer" style={{ height: window.innerHeight / 3.5 + 'px' }}>
            <img className="footer-logo" src="./static/img/icon/cat.webp" alt="logo" />
            <p className="">hshssh</p>
            <p>Powered by React + Express · Produce by MeowGod </p>
            <p>&copy; 2022 MeowGod · 豫ICP备2022003917号</p>
        </div>
    );
}
