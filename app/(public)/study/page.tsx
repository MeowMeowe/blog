'use client';

import React from 'react';
import './index.scss';

const ToolsBox: React.FC = () => {
    const tracks = [
        {
            title: '前端工程主线',
            icon: '/icon/Vue.webp',
            description: '围绕内容站、复杂后台和长期维护，继续整理 Vue、Nuxt、React、TypeScript 与工程化实践。',
            tags: ['Vue 3', 'Nuxt 3', 'React', 'TypeScript', 'Vite']
        },
        {
            title: '跨端与浏览器',
            icon: '/icon/Taro.webp',
            description: '把 H5、小程序、Hybrid、浏览器扩展放在同一条能力线上，关注平台差异和调试边界。',
            tags: ['Taro', 'uni-app', '小程序', 'Chrome Extension']
        },
        {
            title: '服务与自动化',
            icon: '/icon/Server.webp',
            description: '从页面需求延伸到任务队列、数据聚合、爬虫与交付脚本，但保留基础设施能力边界。',
            tags: ['Node.js', 'Python', 'Puppeteer', 'Docker']
        }
    ];

    return (
        <main className="content-page study-page">
            <section className="content-page-hero">
                <span className="content-page-eyebrow">LEARNING MAP</span>
                <h1>不是收集技术名词，先把解决过的问题连起来。</h1>
                <p>这页按真实使用深度整理学习方向：工作中反复使用的放在主线，做过完整项目的记录过程，只了解的内容明确标注边界。</p>
                <div className="content-page-pills">
                    <span>前端工程</span>
                    <span>跨端开发</span>
                    <span>浏览器自动化</span>
                    <span>服务端延伸</span>
                </div>
            </section>

            <section className="content-section">
                <div className="content-section-heading">
                    <h2>当前能力地图</h2>
                    <p>按实际投入和交付场景分类，不使用“精通全栈”一类很难验证的描述。</p>
                </div>
                <div className="content-card-grid">
                    {tracks.map((track) => (
                        <article className="content-card" key={track.title}>
                            <div className="content-card-icon">
                                <img src={track.icon} alt="" />
                            </div>
                            <h3>{track.title}</h3>
                            <p>{track.description}</p>
                            <div className="content-tags">
                                {track.tags.map((tag) => (
                                    <span key={tag}>{tag}</span>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="content-section">
                <div className="content-section-heading">
                    <h2>接下来继续补的内容</h2>
                    <p>优先补能落到当前博客和真实交付流程里的能力。</p>
                </div>
                <ul className="content-list">
                    <li>
                        <strong>测试与回归</strong>
                        <span>为文章权限、HTML 净化、公开与草稿隔离补自动化测试，再进入 CI。</span>
                    </li>
                    <li>
                        <strong>上线链路</strong>
                        <span>继续学习容器部署、反向代理、Secret、备份恢复和可观测性，但与运维职责分开描述。</span>
                    </li>
                    <li>
                        <strong>框架深度</strong>
                        <span>通过当前 Next.js 项目补 React 全栈框架经验，同时保持 Nuxt 内容站经验为主要参照。</span>
                    </li>
                </ul>
            </section>
        </main>
    );
};
export default ToolsBox;
