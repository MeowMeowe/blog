import React from 'react';
import FirstSight from './compontents/top-screen';
import ArticleList from './compontents/article-list';
import './index.scss';

const Home: React.FC = () => {
    return (
        <div className="home">
            <FirstSight />
            <ArticleList />
        </div>
    );
};

export default Home;
