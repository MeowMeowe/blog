import React from 'react';
import './index.scss';

type ILinks = {
    icon: string;
    link: string;
};
interface IArticles {
    id: number;
    title: string;
    desc: string;
    time: string;
    icon: string;
    img: string;
    link: ILinks[];
    techStack: ILinks[];
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
            link: [
                {
                    icon: 'string',
                    link: 'string'
                }
            ],
            techStack: [
                {
                    icon: 'string',
                    link: 'string'
                }
            ],
            view: 500
        },
        {
            id: 1,
            title: 'hahahaahhah',
            desc: 'string',
            time: 'string',
            icon: 'string',
            img: 'string',
            link: [
                {
                    icon: 'string',
                    link: 'string'
                }
            ],
            techStack: [
                {
                    icon: 'string',
                    link: 'string'
                }
            ],
            view: 600
        },
        {
            id: 1,
            title: 'hahahaahhah',
            desc: 'string',
            time: 'string',
            icon: 'string',
            img: 'string',
            link: [
                {
                    icon: 'string',
                    link: 'string'
                }
            ],
            techStack: [
                {
                    icon: 'string',
                    link: 'string'
                }
            ],
            view: 700
        },
        {
            id: 1,
            title: 'hahahaahhah',
            desc: 'string',
            time: 'string',
            icon: 'string',
            img: 'string',
            link: [
                {
                    icon: 'string',
                    link: 'string'
                }
            ],
            techStack: [
                {
                    icon: 'string',
                    link: 'string'
                }
            ],
            view: 800
        }
    ];

    const handleLink = (link: string) => {
        location.href = link;
    };

    const renderLinks = (links: ILinks[], className: string) => {
        return links.map((item) => {
            return (
                <div
                    className={`${className}-link`}
                    key={item.link}
                    onClick={() => handleLink(item.link)}
                >
                    <img className={`${className}-icon`} src="./img/icon/HTML5.webp" alt="" />
                </div>
            );
        });
    };

    const renderArticles = () => {
        return (
            <div className="articles-flex">
                {article.map((item) => {
                    return (
                        <div className="articles-flex-items" key={item.id}>
                            <img className="title-icon" src="./img/icon/HTML5.webp" alt="" />
                            <h1 className="title">{item.title}</h1>
                            <img className="cover" src="./img/bg/1.webp" alt="" />
                            <div className="desc">
                                <p>简短的介绍</p>
                            </div>
                            <div className="links">
                                <div className="links-title">入口：</div>
                                {renderLinks(item.techStack, 'links')}
                            </div>
                            <div className="tech-Stack">
                                <div className="tech-Stack-title">技术栈：</div>
                                {renderLinks(item.techStack, 'tech-Stack')}
                            </div>
                        </div>
                    );
                })}
                <p className="articles-flex-control"></p>
                <p className="articles-flex-control"></p>
                <p className="articles-flex-control"></p>
            </div>
        );
    };
    return (
        <div className="article-list">
            <div className="article-list-content">{renderArticles()}</div>
        </div>
    );
}
