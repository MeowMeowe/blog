import { randomNumber } from '@/utils/utils';
import { useNavigate } from 'react-router-dom';
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
    cover: string;
    link: ILinks[];
    techStack: ILinks[];
    view: number;
    star: number;
}

export default function ArticleList() {
    const navigate = useNavigate();
    const article: IArticles[] = [
        {
            id: 1,
            title: 'ExcelJs简单应用',
            desc: 'string',
            time: '2022-8-22',
            icon: 'JS',
            cover: 'JS',
            link: [
                {
                    icon: 'JS',
                    link: 'string'
                }
            ],
            techStack: [
                {
                    icon: 'JS',
                    link: 'string'
                }
            ],
            view: 500,
            star: 100
        },
        {
            id: 2,
            title: '个人服务器搭建',
            desc: 'string',
            time: '2022-8-22',
            icon: 'Nodejs',
            cover: 'Nodejs',
            link: [
                {
                    icon: 'Nodejs',
                    link: 'string'
                }
            ],
            techStack: [
                {
                    icon: 'Nodejs',
                    link: 'string'
                }
            ],
            view: 600,
            star: 100
        },
        {
            id: 3,
            title: 'GithubAction简单应用',
            desc: 'string',
            time: '2022-8-22',
            icon: 'React',
            cover: 'React',
            link: [
                {
                    icon: 'React',
                    link: 'string'
                }
            ],
            techStack: [
                {
                    icon: 'React',
                    link: 'string'
                }
            ],
            view: 700,
            star: 100
        },
        {
            id: 4,
            title: 'BiuBiuBiu~~',
            desc: 'string',
            time: '2022-8-22',
            icon: 'sass',
            cover: 'sass',
            link: [
                {
                    icon: 'sass',
                    link: 'string'
                }
            ],
            techStack: [
                {
                    icon: 'sass',
                    link: 'string'
                }
            ],
            view: 800,
            star: 100
        }
    ];

    const handleLink = (link: string | number, isOut: boolean) => {
        console.log(11111);
        if (isOut) {
            location.href = link.toLocaleString();
        } else {
            navigate(`/articles?id=${link}`);
            return;
        }
    };

    const renderLinks = (links: ILinks[], className: string) => {
        return links.map((item) => {
            return (
                <div
                    className={`${className}-link`}
                    key={item.link}
                    onClick={() => handleLink(item.link, true)}
                >
                    <img
                        className={`${className}-icon`}
                        src={`./img/icon/${item.icon}.webp`}
                        alt=""
                    />
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
                            <img
                                className="title-icon"
                                src={`./img/icon/${item.icon}.webp`}
                                alt=""
                            />

                            <h1 className="title">{item.title}</h1>
                            <img
                                className="cover"
                                src={`./img/bg/${randomNumber(1, 6, 0)}.webp`}
                                alt=""
                                onClick={() => handleLink(item.id, false)}
                            />
                            <div className="desc">
                                简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍简短的介绍
                            </div>
                            <div className="links">
                                <div className="links-title">外站入口：</div>
                                {renderLinks(item.techStack, 'links')}
                            </div>
                            <div className="tech-Stack">
                                <div className="tech-Stack-title">涉及技术栈：</div>
                                {renderLinks(item.techStack, 'tech-Stack')}
                            </div>
                            <div className="msgs">
                                <div className="time msgs-item-wrap">
                                    <img
                                        className="msgs-item-icon"
                                        src="./img/icon/clock.webp"
                                        alt="Time"
                                    />
                                    <span>{item.time}</span>
                                </div>
                                <div className="views msgs-item-wrap">
                                    <img
                                        className="msgs-item-icon"
                                        src="./img/icon/search.webp"
                                        alt="View"
                                    />
                                    <span>{item.view}</span>
                                </div>
                                <div className="stars msgs-item-wrap">
                                    <img
                                        className="msgs-item-icon"
                                        src="./img/icon/love.webp"
                                        alt="Love"
                                    />
                                    <span>{item.star}</span>
                                </div>
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
