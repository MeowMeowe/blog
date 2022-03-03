import React from 'react';
import './index.scss';

export default function Home() {
    const jumpToNextPage = () => {
        scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    };

    return (
        <div className="home">
            <div className="home-header">
                <h1 className="home-header-one-piece">静水深流.</h1>
                <p className="home-header-text-line" />
                <p className="home-header-sample-dec">
                    {`\/\*`}这里是MeowGod的个人主页{`\*\/`}
                </p>
                <span className="home-header-scroll-down-icon" onClick={jumpToNextPage}></span>
            </div>
            <div className="home-middle"></div>
        </div>
    );
}
