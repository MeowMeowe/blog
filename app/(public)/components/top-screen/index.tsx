import React from 'react';
import './index.scss';

const FirstSight: React.FC = () => {
    const jumpToNextPage = () => {
        window.scrollTo({
            top: window.innerHeight - 66,
            behavior: 'smooth'
        });
    };

    return (
        <div className="top-screen">
            <h1 className="top-screen-title">MEOW MEOW.</h1>
            <p className="top-screen-line" />
            <p className="top-screen-dec">这里是MeowGod的个人主页</p>
            <div className="top-screen-guide">
                <button type="button" className="top-screen-guide-scroll-down" onClick={jumpToNextPage}>
                    <span className="icon icon__1"></span>
                    <span className="icon icon__2"></span>
                    <span className="text">开始阅读</span>
                </button>
                <p className="github"></p>
            </div>
        </div>
    );
};

export default FirstSight;
