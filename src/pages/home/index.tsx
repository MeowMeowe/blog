import React from 'react';
import FirstSight from "@/compontents/home/top-screen"
import Article from "@/compontents/home/articles"
import './index.scss';

export default function Home() {
  

    return (
        <div className="home">
          <FirstSight/>
          <Article/>
          {/* <FirstSight/>
          <FirstSight/> */}
        </div>
    );
}
