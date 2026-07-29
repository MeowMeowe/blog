'use client';

import React from 'react';
import FirstSight from './components/top-screen';
import ArticleList from './components/article-list';
import Introduce from './components/introduce';
import './index.scss';

const Home: React.FC = () => {
    return (
        <div className="home">
            <FirstSight />
            <div className="container-wrap">
                <Introduce />
                <ArticleList />
            </div>
        </div>
    );
};

export default Home;
