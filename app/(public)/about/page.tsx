'use client';

import React from 'react';
import './index.scss';

const About: React.FC = () => {
    return (
        <main className="content-page about-page">
            <section className="content-page-hero">
                <span className="content-page-eyebrow">ABOUT THE AUTHOR</span>
                <h1>以前端为主，也愿意把一条业务链路继续往后走。</h1>
                <p>工作中使用 Vue / Nuxt 更多，也有 React / Taro 项目经验。职责后来逐渐延伸到浏览器自动化、Node 服务和 Python 数据聚合，但不会把接触过写成精通。</p>
                <div className="content-page-pills">
                    <span>5 年开发经历</span>
                    <span>Vue / Nuxt 为主</span>
                    <span>React / Taro 实践</span>
                    <span>Node / Python 延伸</span>
                </div>
            </section>

            <section className="content-section">
                <div className="content-section-heading">
                    <h2>经历时间线</h2>
                    <p>只保留与技术成长有关的阶段，不放过多公司和个人信息。</p>
                </div>
                <div className="content-timeline">
                    <article className="content-timeline-item">
                        <time>2021–2022</time>
                        <div>
                            <h3>React、Taro 与跨端业务</h3>
                            <p>参与 H5、微信小程序和 App 内嵌 Hybrid 页面，使用 TypeScript，并接触 Sentry、Rollup 组件库与微前端分享。</p>
                        </div>
                    </article>
                    <article className="content-timeline-item">
                        <time>2022–2026</time>
                        <div>
                            <h3>Vue / Nuxt 成为主力技术栈</h3>
                            <p>覆盖多语言内容站、小程序和复杂 SaaS 后台，主导 Nuxt 2 到 Nuxt 3 升级，并参与大量静态页面构建。</p>
                        </div>
                    </article>
                    <article className="content-timeline-item">
                        <time>职责延伸</time>
                        <div>
                            <h3>从页面走向任务、数据和交付</h3>
                            <p>继续处理 Puppeteer、浏览器扩展、AI 数据清洗、Python 聚合层、PDF 报告服务和 GitHub Actions 部署衔接。</p>
                        </div>
                    </article>
                    <article className="content-timeline-item">
                        <time>现在</time>
                        <div>
                            <h3>整理真实经验，补齐上线能力</h3>
                            <p>通过这个博客重新整理文章、框架升级与安全边界，后续继续加入测试、CI/CD、服务器和监控。</p>
                        </div>
                    </article>
                </div>
            </section>

            <section className="content-section">
                <div className="content-section-heading">
                    <h2>我怎样描述能力边界</h2>
                    <p>熟悉程度、真实项目和只了解的内容分开写，方便以后继续校正。</p>
                </div>
                <div className="content-card-grid">
                    <article className="content-card">
                        <div className="content-card-icon">
                            <img src="/icon/Vue.webp" alt="" />
                        </div>
                        <h3>使用更多</h3>
                        <p>Vue、Nuxt、TypeScript、Vite、小程序，以及面向业务的后台与内容站开发。</p>
                    </article>
                    <article className="content-card">
                        <div className="content-card-icon">
                            <img src="/icon/React.webp" alt="" />
                        </div>
                        <h3>有项目经验</h3>
                        <p>React、Taro、Hybrid、Puppeteer、Chrome 扩展、Node 服务和 Python 数据处理。</p>
                    </article>
                    <article className="content-card">
                        <div className="content-card-icon">
                            <img src="/icon/Tool.webp" alt="" />
                        </div>
                        <h3>仍在补齐</h3>
                        <p>生产容器运维、完整监控体系、严格源码阅读和团队级技术规划，暂不包装成熟练能力。</p>
                    </article>
                </div>
            </section>
        </main>
    );
};

export default About;
