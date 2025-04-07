import React from 'react';
import './index.scss';

const Introduce: React.FC = () => {
    const stats = [
        {
            name: '文章总数',
            value: '0',
            icon: '/img/stats/article.webp'
        },
        {
            name: '评论总数',
            value: '0',
            icon: '/img/stats/comment.webp'
        },
        {
            name: '访问量',
            value: '0',
            icon: '/img/stats/views.webp'
        },
        {
            name: '点赞数',
            value: '0',
            icon: '/img/stats/likes.webp'
        }
    ];

    return (
        <div className="introduce">
            <div className="introduce-header">
                <div className="introduce-title">
                    <img src="/img/stats/overview.webp" alt="overview" className="introduce-title-icon" />
                    <h2>网站概况</h2>
                </div>
            </div>
            <div className="introduce-body">
                <div className="introduce-content">
                    <p>欢迎来到 MeowGod&apos;s Blog，这里是一个分享技术、记录生活的个人博客。</p>
                    <p>本站使用 React + TypeScript + Node.js 开发，采用响应式设计，支持多端访问。</p>
                </div>
                <div className="introduce-stats">
                    <div className="introduce-stats-grid">
                        {stats.map((stat, index) => (
                            <div key={index} className="introduce-stats-item">
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
