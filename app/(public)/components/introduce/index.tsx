import React, { useEffect, useState } from 'react';
import { getArticles } from '@/api-client/articles';
import './index.scss';

const Introduce: React.FC = () => {
    const [articleCount, setArticleCount] = useState<number | null>(null);

    useEffect(() => {
        getArticles({ page: 1, pageSize: 1 })
            .then((response) => setArticleCount(response.data.pagination.total))
            .catch(() => setArticleCount(null));
    }, []);

    const stats = [
        {
            name: '篇文章',
            value: articleCount === null ? '—' : String(articleCount),
            icon: '/img/stats/article.webp'
        },
        {
            name: '时间线',
            value: '21–26',
            icon: '/icon/clock.webp'
        },
        {
            name: '主力方向',
            value: 'Vue',
            icon: '/icon/Vue.webp'
        },
        {
            name: '能力延伸',
            value: 'Node',
            icon: '/icon/Nodejs.webp'
        }
    ];

    return (
        <div className="introduce">
            <div className="introduce-header">
                <div className="introduce-title">
                    <img src="/img/stats/overview.webp" alt="overview" className="introduce-title-icon" />
                    <div>
                        <span>ABOUT THIS BLOG</span>
                        <h2>写真实做过的事</h2>
                    </div>
                </div>
            </div>
            <div className="introduce-body">
                <div className="introduce-content">
                    <p>这里记录前端项目、跨端实践和逐渐延伸到 Node、Python 的工作边界。</p>
                    <p>旧文章保留当时的判断，新文章尽量把取舍和踩坑写完整。</p>
                </div>
                <div className="introduce-stats">
                    <div className="introduce-stats-grid">
                        {stats.map((stat) => (
                            <div key={stat.name} className="introduce-stats-item">
                                <img src={stat.icon} alt={stat.name} />
                                <div className="stat-info">
                                    <span className="stat-value">{stat.value}</span>
                                    <span className="stat-name">{stat.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Introduce;
