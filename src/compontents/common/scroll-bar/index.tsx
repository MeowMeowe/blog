import React, { useState, useEffect } from 'react';
import './index.scss';

export default function Solid() {
    const [width, setWidth] = useState(0);
    const [isTopShow, setIsTopShow] = useState('');
    const [isHeartShow, setIsHeartShow] = useState('');
    const [isArrorShow, setIsArrorShow] = useState('');
    useEffect(() => {
        document.addEventListener('scroll', function () {
            if (scrollY == 0) {
                setWidth(0);
                setIsTopShow('hide');
                setIsHeartShow('hide');
                setIsArrorShow('');
            } else {
                setWidth(((scrollY + window.innerHeight) / document.body.scrollHeight) * 100);
            }
            if (scrollY >= window.innerHeight) {
                setIsTopShow('show');
                setIsHeartShow('show');
            }
        });
    });

    const scrollToTop = () => {
        scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        setIsArrorShow('show');
    };

    return (
        <div className="scroll-bar">
            {/* <i className="bar" style={{ width: `${width}%` }}></i> */}
            <div className={`top-icon-wrap top-icon-${isTopShow}`} onClick={scrollToTop}>
                <img className="top-icon" src="./static/img/icon/cupid.webp" alt="go-top" />
            </div>
            <img
                className={`${
                    isTopShow == 'show' ? 'heart-icon' : 'heart-arrow-icon'
                } heart-icon-${isHeartShow}`}
                src={`./static/img/icon/${isTopShow == 'show' ? 'target' : 'cupid-1'}.webp`}
                alt="heart"
            />
            <img className={`arror-icon arror-icon-${isArrorShow}`} src="./static/img/icon/cupid-2.webp" style={{top:window.innerHeight-136 + "px"}} alt="arror" />
        </div>
    );
}
