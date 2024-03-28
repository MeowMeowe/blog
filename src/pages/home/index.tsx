import React from 'react';
import FirstSight from './compontents/top-screen'; // Adjust the path if necessary
import ArticleList from './compontents/article-list'; // Adjust the path if necessary
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
