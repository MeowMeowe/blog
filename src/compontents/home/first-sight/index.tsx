import React from 'react';
import './index.scss';

export default function FirstSight() {

  const jumpToNextPage = () => {
    scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="top-screen" >
      <h1 className="top-screen-title">静水深流.</h1>
      <p className="top-screen-line" />
      <p className="top-screen-dec">这里是MeowGod的个人主页</p>
      <div className='top-screen-guide'>
        <div className="top-screen-guide-scroll-down" >
          <span className="icon" onClick={jumpToNextPage}></span>
          <p className='text'>开始阅读</p>
        </div>
        <p className="github"></p>
      </div>
    </div>
  );
}
