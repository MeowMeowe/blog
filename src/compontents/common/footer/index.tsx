import React from 'react';
import './index.scss';

export default function Footer() {
    return (
        <div className="footer">
            <img className="footer-logo" src="./static/img/icon/cat.webp" alt="logo" />
            <p className="">人生中最艰难的是选择</p>
            <p>Powered by React + Express · Produce by MeowGod </p>
            <p>&copy; 2022 MeowGod · 豫ICP备2022003917号</p>
        </div>
    );
}
