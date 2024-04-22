import React from 'react';
import FirstSight from './compontents/top-screen';
import ArticleList from './compontents/article-list';
import Introduce from './compontents/introduce';
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
