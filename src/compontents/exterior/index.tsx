import { randomNumber } from '@/utils/utils';
import React, { useState, useEffect, useRef } from 'react';
import LazyImage from '../lazy-image';
import './index.scss';

interface ExteriorProps {
    showScroll?: boolean;
}

const Exterior: React.FC<ExteriorProps> = ({ showScroll = true }) => {
    const [isTopShow, setIsTopShow] = useState<boolean>(false);
    const [isHeartShow, setIsHeartShow] = useState<boolean>(false);
    const [isArrowShow, setIsArrowShow] = useState<boolean>(false);
    const [clickToTop, setClickToTop] = useState<boolean>(false);
    const imgNumRef = useRef<string>(randomNumber(1, 6, 0));

    const handleScroll = () => {
        if (window.scrollY === 0) {
            if (clickToTop) {
                setIsHeartShow(false);
            }
            setIsTopShow(false);
            setIsArrowShow(false);
            setClickToTop(false);
        }
        if (window.scrollY >= window.innerHeight - 66) {
            setIsTopShow(true);
            setIsHeartShow(true);
        }
    };

    const scrollToTop = () => {
        setClickToTop(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsArrowShow(true);
    };

    useEffect(() => {
        document.addEventListener('scroll', handleScroll);
        return () => document.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="exterior">
            {/* 全局背景 */}
            <div className="bg">
                <img className="bg-img" src={`/img/bg/${imgNumRef.current}.webp`} alt="bg" />
            </div>
            {/* 滚动 */}
            {showScroll && (
                <div className="scroll-bar">
                    <div className={`top-icon-wrap top-icon-${isTopShow}`} onClick={scrollToTop}>
                        <LazyImage className="top-icon" src="/img/icon/cupid.webp" alt="go-top" />
                    </div>
                    <LazyImage
                        className={`${
                            isTopShow ? 'heart-icon' : 'heart-arrow-icon'
                        } heart-icon-${isHeartShow}`}
                        src={`/img/icon/${isHeartShow ? 'target' : 'cupid-1'}.webp`}
                        alt="heart"
                    />
                    {isArrowShow && (
                        <LazyImage
                            className={`arrow-icon arrow-icon-${isArrowShow}`}
                            src="/img/icon/cupid-2.webp"
                            style={{ top: window.innerHeight - 136 + 'px' }}
                            alt="arrow"
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default Exterior;
