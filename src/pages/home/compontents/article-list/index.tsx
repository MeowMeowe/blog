import React from 'react';
import './index.scss';

interface IArticles {
    id: number;
    title: string;
    desc: string;
    time: string;
    icon: string;
    img: string;
    link: {
        icon: string;
        link: string;
    }[];
    techStack: {
        icon: string;
        link: string;
    };
    view: number;
}

export default function ArticleList() {
    const article: IArticles[] = [
        {
            id: 1,
            title: 'hahahaahhah',
            desc: 'string',
            time: 'string',
            icon: 'string',
            img: 'string',
            link: [],
            techStack: {
                icon: 'string',
                link: 'string'
            },
            view: 99999
        }
    ];

    const renderArticles = () => {
        return article.map((item) => {
            return <div className="article-list-items" key={item.id}></div>;
        });
    };
    return (
        <div className="article-list">
            <div className="article-list-content">{renderArticles()}</div>
        </div>
    );
}
