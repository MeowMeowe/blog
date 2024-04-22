import React from 'react';
import { useNavigate } from 'react-router-dom';
import { randomNumber } from '@/utils/utils';
import articles from './index.json';
import LazyImage from '@/compontents/lazy-image';
import './index.scss';

interface ILinks {
    icon: string;
    link: string;
}

interface IArticles {
    id: number;
    title: string;
    desc: string;
    time: string;
    icon: string;
    cover: string;
    link: ILinks[];
    techStack: ILinks[];
    view: number;
    star: number;
}

const ArticleList: React.FC = () => {
    const navigate = useNavigate();
    const article: IArticles[] = articles;

    const handleLink = (link: string | number, isOut: boolean): void => {
        if (isOut) {
            window.location.href = String(link);
        } else {
            navigate(`/articles?id=${link}`);
        }
    };

    const renderLinks = (links: ILinks[], className: string): JSX.Element[] => {
        return links.map((item, index) => (
            <div className={`${className}-link`} key={index} onClick={() => handleLink(item.link, true)}>
                <LazyImage className={`${className}-icon`} src={`/img/icon/${item.icon}.webp`} alt="" />
            </div>
        ));
    };

    const renderArticles = (): JSX.Element[] => {
        return article.map((item) => (
            <div className="articles-flex-items" key={item.id}>
                <LazyImage className="title-icon" src={`/img/icon/${item.icon}.webp`} alt="" />
                <h1 className="title">{item.title}</h1>
                <LazyImage className="cover" src={`/img/bg/${randomNumber(1, 6, 0)}.webp`} alt="" onClick={() => handleLink(item.id, false)} />
                <div className="desc">{item.desc}</div>
                {/* <div className="tech-Stack">{renderLinks(item.techStack, 'tech-Stack')}</div> */}
                <div className="msgs">
                    <div className="time msgs-item-wrap">
                        <LazyImage className="msgs-item-icon" src="/img/icon/clock.webp" alt="Time" />
                        <span>{item.time}</span>
                    </div>
                    <div className="views msgs-item-wrap">
                        <LazyImage className="msgs-item-icon" src="/img/icon/search.webp" alt="View" />
                        <span>{item.view}</span>
                    </div>
                    <div className="stars msgs-item-wrap">
                        <LazyImage className="msgs-item-icon" src="/img/icon/love.webp" alt="Love" />
                        <span>{item.star}</span>
                    </div>
                </div>
            </div>
        ));
    };

    return <div className="articles-flex">{renderArticles()}</div>;
};

export default ArticleList;
