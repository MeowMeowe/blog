import React, { useState, useEffect } from 'react';
import './index.scss';

export default function Solid() {
    // const [width, setWidth] = useState(0);
    const [isTopShow, setIsTopShow] = useState('');
    const [isHeartShow, setIsHeartShow] = useState('');
    const [isArrorShow, setIsArrorShow] = useState('');
    const [clickToTop, setClickToTop] = useState(false);

    const handleScroll = () => {
        // console.log(clickToTop);
        if (scrollY == 0) {
            // setWidth(0);
            if (clickToTop) {
                setIsHeartShow('hide');
            }
            setIsTopShow('hide');
            setIsArrorShow('');
            setClickToTop(() => false);
        }
        if (scrollY >= window.innerHeight - 66) {
            setIsTopShow('show');
            setIsHeartShow('show');
        }
    };

    const scrollToTop = () => {
        setClickToTop(() => true);
        scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        setIsArrorShow('show');
        // setClickToTop(false);
    };

    useEffect(() => {
        document.addEventListener('scroll', handleScroll);
        return () => document.removeEventListener('scroll', handleScroll);
    });

    return (
        <div className="scroll-bar">
            {/* <i className="bar" style={{ width: `${width}%` }}></i> */}
            <div className={`top-icon-wrap top-icon-${isTopShow}`} onClick={scrollToTop}>
                <img className="top-icon" src="./img/icon/cupid.webp" alt="go-top" />
            </div>
            <img
                className={`${
                    isTopShow == 'show' ? 'heart-icon' : 'heart-arrow-icon'
                } heart-icon-${isHeartShow}`}
                src={`./img/icon/${isHeartShow == 'show' ? 'target' : 'cupid-1'}.webp`}
                alt="heart"
            />
            <img
                className={`arror-icon arror-icon-${isArrorShow}`}
                src="./img/icon/cupid-2.webp"
                style={{ top: window.innerHeight - 136 + 'px' }}
                alt="arror"
            />
        </div>
    );
}
