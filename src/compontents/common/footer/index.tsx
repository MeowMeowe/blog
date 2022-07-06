import React from 'react';
import './index.scss';

export default function Footer() {
    return (
        <div className="footer" style={{ height: window.innerHeight / 3.5 + 'px' }}>
            <img className="footer-logo" src="./static/img/icon/cat.webp" alt="logo" />
            <p className="">hshssh</p>
            <p>Powered by React + Express · Produce by MeowGod </p>
            <p>&copy; 2022 MeowGod · 豫ICP备2022003917号</p>
        </div>
    );
}
