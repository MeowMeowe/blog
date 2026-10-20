'use client';

import React from 'react';
import Link from 'next/link';
import './index.scss';

interface ProjectItem {
    title: string;
    label: string;
    description: string;
    icon: string;
    tags: string[];
    href?: string;
    linkLabel?: string;
}

const Game: React.FC = () => {
    const projectList: ProjectItem[] = [
        {
            title: 'MeowGod’s Blog',
            label: '正在维护',
            description: '使用 Next.js 16、React 19 和 MySQL 整理的个人内容站。当前重点是文章体系、本地安全边界和可验证的上线准备。',
            icon: '/icon/Nextjs.webp',
            tags: ['Next.js', 'React', 'Prisma', 'MySQL'],
            href: '/',
            linkLabel: '查看当前项目'
        },
        {
            title: '多语言内容站升级',
            label: '匿名项目复盘',
            description: '将 Vue 2 / Nuxt 2 内容站迁移到 Vue 3 / Nuxt 3，处理 9000+ 静态页面、动态路由、请求加密和中英文构建。',
            icon: '/icon/Nuxt.webp',
            tags: ['Nuxt 3', 'SSG', 'i18n', 'Migration'],
            href: '/articles?tag=nuxtjs',
            linkLabel: '阅读 Nuxt 实践'
        },
        {
            title: '批量 PDF 报告链路',
            label: '匿名项目复盘',
            description: '基于分页 HTML 模板和 Puppeteer 生成带图表、表格与分析内容的 PDF，并通过任务队列完成 3000+ 报告集中生成。',
            icon: '/icon/Server.webp',
            tags: ['Node.js', 'Puppeteer', 'Queue', 'PDF'],
            href: '/articles?search=PDF',
            linkLabel: '阅读报告生成实践'
        },
        {
            title: '浏览器自动化与数据清洗',
            label: '实践集合',
            description: '围绕公开数据采集、特殊网站扩展、AI 辅助清洗和 Python 数据聚合形成的一组工具型实践。',
            icon: '/icon/Tool.webp',
            tags: ['Extension', 'Python', 'Puppeteer', 'AI'],
            href: '/articles?tag=puppeteer',
            linkLabel: '阅读自动化实践'
        }
    ];

    return (
        <main className="content-page projects-page">
            <section className="content-page-hero">
                <span className="content-page-eyebrow">SELECTED WORK</span>
                <h1>项目不只列技术栈，也记录它为什么这样做。</h1>
                <p>受保密边界影响，工作项目只保留可公开的技术结构与个人职责；当前博客则持续保留完整代码和演进过程。</p>
                <div className="content-page-pills">
                    <span>内容工程</span>
                    <span>数据可视化</span>
                    <span>浏览器自动化</span>
                    <span>任务型服务</span>
                </div>
            </section>

            <section className="content-section">
                <div className="content-section-heading">
                    <h2>项目与实践</h2>
                    <p>公开项目可以直接进入，匿名案例则链接到对应的技术文章逐步展开。</p>
                </div>
                <div className="content-card-grid projects-grid">
                    {projectList.map((project, index) => (
                        <article className={`content-card project-card ${index === 0 ? 'content-card--wide project-card--featured' : ''}`} key={project.title}>
                            <div className="project-card-top">
                                <div className="content-card-icon">
                                    <img src={project.icon} alt="" />
                                </div>
                                <span className="project-card-label">{project.label}</span>
                            </div>
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            <div className="content-tags">
                                {project.tags.map((tag) => (
                                    <span key={tag}>{tag}</span>
                                ))}
                            </div>
                            {project.href && (
                                <Link className="project-card-link" href={project.href}>
                                    {project.linkLabel} <span aria-hidden="true">→</span>
                                </Link>
                            )}
                        </article>
                    ))}
                </div>
                <div className="content-callout">
                    <strong>公开边界</strong>
                    <span>不展示公司名称、业务数据、客户信息和内部架构细节，只总结能够独立说明的技术判断与个人工作。</span>
                </div>
            </section>
        </main>
    );
};

export default Game;
