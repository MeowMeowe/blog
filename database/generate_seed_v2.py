import random
import datetime
import hashlib

# Configuration
TOTAL_ARTICLES = 80
START_DATE = datetime.date(2021, 1, 1)
END_DATE = datetime.date(2025, 12, 31)

# Data Sources
TAGS = [
    ('JavaScript', 'javascript', '#F7DF1E', 'JS', 'JavaScript 编程语言'),
    ('TypeScript', 'typescript', '#3178C6', 'TS', 'TypeScript 编程语言'),
    ('React', 'react', '#61DAFB', 'React', 'React 前端框架'),
    ('Vue.js', 'vue', '#42B883', 'Vue', 'Vue.js 前端框架'),
    ('Nuxt.js', 'nuxtjs', '#00C58E', 'Nuxt', 'Nuxt.js 通用框架'),
    ('Next.js', 'nextjs', '#000000', 'Nextjs', 'Next.js 全栈框架'),
    ('Node.js', 'nodejs', '#339933', 'Nodejs', 'Node.js 运行时环境'),
    ('Python', 'python', '#3776AB', 'Python', 'Python 编程语言'),
    ('Taro', 'taro', '#0000C2', 'Taro', 'Taro 跨端框架'),
    ('DevOps', 'devops', '#000000', 'Server', '运维与部署'),
    ('Puppeteer', 'puppeteer', '#40B5A4', 'Tool', 'Headless Chrome'),
    ('CSS', 'css', '#1572B6', 'CSS', '样式与布局'),
]

TECH_STACK = [
    ('React', 'React', 'https://react.dev/', 'React Library'),
    ('Vue', 'Vue', 'https://vuejs.org/', 'Vue Framework'),
    ('Next.js', 'Nextjs', 'https://nextjs.org/', 'Next.js Framework'),
    ('Nuxt', 'Nuxt', 'https://nuxt.com/', 'Nuxt Framework'),
    ('Node.js', 'Nodejs', 'https://nodejs.org/', 'Node.js Runtime'),
    ('Python', 'Python', 'https://www.python.org/', 'Python Language'),
    ('Docker', 'Docker', 'https://www.docker.com/', 'Containerization'),
    ('Taro', 'Taro', 'https://taro-docs.jd.com/', 'Cross-platform Framework'),
]

# Unique article definitions - Each article is hand-crafted
ARTICLE_DEFINITIONS = [
    # 2021 Articles - Beginner phase (15 articles)
    {
        "title": "React 生命周期学习笔记",
        "tech": "React",
        "year": 2021,
        "month": 1,
        "style": "learning_notes",
        "tone": "curious",
        "opening": "刚开始学 React，对生命周期这块一直有点懵。今天花了一下午时间，总算是理清楚了。",
        "problem": "一直搞不清楚 componentDidMount 和 componentDidUpdate 的区别",
        "depth": "basic"
    },
    {
        "title": "第一次用 Redux 踩的坑",
        "tech": "React",
        "year": 2021,
        "month": 2,
        "style": "pitfall_record",
        "tone": "frustrated",
        "opening": "今天被 Redux 折腾了一整天。本以为很简单，结果各种报错。",
        "problem": "action 和 reducer 的关系总是搞混",
        "depth": "basic"
    },
    {
        "title": "Webpack 配置入门",
        "tech": "Node.js",
        "year": 2021,
        "month": 3,
        "style": "tutorial",
        "tone": "careful",
        "opening": "公司项目用的 Webpack，之前一直是别人配好的。这次自己从头搭了一遍，记录一下过程。",
        "problem": "各种 loader 和 plugin 不知道怎么配",
        "depth": "basic"
    },
    {
        "title": "Taro 小程序开发初体验",
        "tech": "React",
        "year": 2021,
        "month": 4,
        "style": "experience_sharing",
        "tone": "excited",
        "opening": "最近接了个小程序的需求，用 Taro 开发。第一次接触跨端框架，感觉还挺有意思的。",
        "problem": "小程序和 H5 的差异比想象中大",
        "depth": "basic"
    },
    {
        "title": "CSS Flexbox 布局总结",
        "tech": "CSS",
        "year": 2021,
        "month": 5,
        "style": "summary",
        "tone": "organized",
        "opening": "Flexbox 用了挺久了，但每次都要查文档。今天系统整理一下，方便以后查阅。",
        "problem": "flex-grow、flex-shrink、flex-basis 总是记不住",
        "depth": "basic"
    },
    {
        "title": "React Hooks 初探",
        "tech": "React",
        "year": 2021,
        "month": 6,
        "style": "exploration",
        "tone": "curious",
        "opening": "听说 Hooks 是 React 的未来，今天尝试用 useState 和 useEffect 重写了一个组件。",
        "problem": "不太理解为什么要用 Hooks 替代 Class",
        "depth": "basic"
    },
    {
        "title": "Git 常用命令备忘",
        "tech": "DevOps",
        "year": 2021,
        "month": 7,
        "style": "cheatsheet",
        "tone": "practical",
        "opening": "经常忘记 Git 命令，每次都要搜。干脆整理一份自己的备忘录。",
        "problem": "merge 和 rebase 的区别不太清楚",
        "depth": "basic"
    },
    {
        "title": "TypeScript 入门踩坑记",
        "tech": "React",
        "year": 2021,
        "month": 8,
        "style": "pitfall_record",
        "tone": "struggling",
        "opening": "公司要求新项目用 TypeScript，作为一个 JS 开发者，刚开始真的很不适应。",
        "problem": "类型定义太复杂，各种报错看不懂",
        "depth": "basic"
    },
    {
        "title": "Ant Design 组件库使用心得",
        "tech": "React",
        "year": 2021,
        "month": 9,
        "style": "experience_sharing",
        "tone": "satisfied",
        "opening": "用了一个月的 Ant Design，确实提升了不少开发效率。分享一些使用心得。",
        "problem": "主题定制和样式覆盖比较麻烦",
        "depth": "basic"
    },
    {
        "title": "前端性能优化初探",
        "tech": "JavaScript",
        "year": 2021,
        "month": 10,
        "style": "exploration",
        "tone": "learning",
        "opening": "项目上线后发现加载有点慢，开始研究性能优化。记录一些基础的优化手段。",
        "problem": "不知道从哪里开始优化",
        "depth": "basic"
    },
    {
        "title": "ES6+ 新特性学习",
        "tech": "JavaScript",
        "year": 2021,
        "month": 11,
        "style": "learning_notes",
        "tone": "systematic",
        "opening": "系统学习了一下 ES6 的新特性，很多语法糖确实很方便。",
        "problem": "解构赋值和扩展运算符用起来还不够熟练",
        "depth": "basic"
    },
    {
        "title": "React 组件设计思考",
        "tech": "React",
        "year": 2021,
        "month": 12,
        "style": "thinking",
        "tone": "reflective",
        "opening": "写了大半年 React，开始思考怎么设计出更好的组件。",
        "problem": "组件粒度不好把握，不知道拆到什么程度合适",
        "depth": "intermediate"
    },
    {
        "title": "Node.js 入门实践",
        "tech": "Node.js",
        "year": 2021,
        "month": 12,
        "style": "practice",
        "tone": "hands_on",
        "opening": "一直想学后端，从 Node.js 开始入手。用 Express 写了个简单的 API 服务。",
        "problem": "异步处理和错误处理不太熟悉",
        "depth": "basic"
    },
    {
        "title": "Chrome DevTools 使用技巧",
        "tech": "Tool",
        "year": 2021,
        "month": 12,
        "style": "tips",
        "tone": "practical",
        "opening": "调试是开发中很重要的一环，整理一些 Chrome DevTools 的实用技巧。",
        "problem": "只会用 console.log 调试",
        "depth": "basic"
    },
    {
        "title": "2021 年终总结：我的前端学习之路",
        "tech": "JavaScript",
        "year": 2021,
        "month": 12,
        "style": "annual_summary",
        "tone": "reflective",
        "opening": "2021 年马上就要结束了，回顾这一年的学习历程，感慨颇多。",
        "problem": "学的东西很多，但感觉还不够深入",
        "depth": "intermediate"
    },
    
    # 2022 Articles - Growth phase (20 articles)
    {
        "title": "从 React 到 Vue：技术栈迁移思考",
        "tech": "Vue",
        "year": 2022,
        "month": 1,
        "style": "comparison",
        "tone": "analytical",
        "opening": "新年新开始，公司新项目决定用 Vue 3。作为一个 React 开发者，这是个不小的挑战。",
        "problem": "两个框架的思维方式差异很大",
        "depth": "intermediate"
    },
    {
        "title": "Vue 3 响应式原理探究",
        "tech": "Vue",
        "year": 2022,
        "month": 2,
        "style": "deep_dive",
        "tone": "curious",
        "opening": "用了一个月 Vue 3，对 Proxy 实现的响应式系统很感兴趣，决定深入研究一下。",
        "problem": "想理解 ref 和 reactive 的底层实现",
        "depth": "advanced"
    },
    {
        "title": "Vite 构建工具实践",
        "tech": "Node.js",
        "year": 2022,
        "month": 3,
        "style": "practice",
        "tone": "impressed",
        "opening": "Vite 的开发体验真的太爽了！启动速度比 Webpack 快了不知道多少倍。",
        "problem": "生产环境构建还需要优化",
        "depth": "intermediate"
    },
    {
        "title": "TypeScript 进阶：泛型的妙用",
        "tech": "TypeScript",
        "year": 2022,
        "month": 4,
        "style": "advanced_tutorial",
        "tone": "confident",
        "opening": "用了半年 TypeScript，终于开始理解泛型的强大之处了。",
        "problem": "复杂的类型推导还是有点难",
        "depth": "advanced"
    },
    {
        "title": "前端工程化实践总结",
        "tech": "Node.js",
        "year": 2022,
        "month": 5,
        "style": "summary",
        "tone": "systematic",
        "opening": "最近在搭建团队的前端工程化体系，把这段时间的经验总结一下。",
        "problem": "如何平衡规范和效率",
        "depth": "intermediate"
    },
    {
        "title": "Vue Router 4 使用心得",
        "tech": "Vue",
        "year": 2022,
        "month": 6,
        "style": "experience_sharing",
        "tone": "practical",
        "opening": "Vue Router 4 相比 3 变化还挺大的，记录一些使用过程中的心得。",
        "problem": "路由守卫的使用场景需要梳理",
        "depth": "intermediate"
    },
    {
        "title": "CSS Grid 布局实战",
        "tech": "CSS",
        "year": 2022,
        "month": 7,
        "style": "practice",
        "tone": "hands_on",
        "opening": "之前一直用 Flexbox，这次尝试用 Grid 做了一个复杂布局，感觉打开了新世界。",
        "problem": "Grid 和 Flexbox 的使用场景需要区分",
        "depth": "intermediate"
    },
    {
        "title": "Pinia 状态管理实践",
        "tech": "Vue",
        "year": 2022,
        "month": 8,
        "style": "practice",
        "tone": "satisfied",
        "opening": "Pinia 作为 Vuex 的继任者，使用体验确实好很多。API 更简洁，TypeScript 支持也更好。",
        "problem": "模块化组织需要好好设计",
        "depth": "intermediate"
    },
    {
        "title": "前端性能监控方案",
        "tech": "JavaScript",
        "year": 2022,
        "month": 9,
        "style": "solution",
        "tone": "professional",
        "opening": "线上性能问题一直是个痛点，搭建了一套性能监控系统，分享一下方案。",
        "problem": "如何准确采集和分析性能数据",
        "depth": "advanced"
    },
    {
        "title": "Composition API 最佳实践",
        "tech": "Vue",
        "year": 2022,
        "month": 10,
        "style": "best_practice",
        "tone": "experienced",
        "opening": "用了大半年 Composition API，总结一些最佳实践和常见陷阱。",
        "problem": "如何组织可复用的逻辑",
        "depth": "advanced"
    },
    {
        "title": "Monorepo 项目管理实践",
        "tech": "Node.js",
        "year": 2022,
        "month": 11,
        "style": "practice",
        "tone": "systematic",
        "opening": "公司多个项目共享代码越来越多，决定用 Monorepo 统一管理。",
        "problem": "依赖管理和构建流程比较复杂",
        "depth": "advanced"
    },
    {
        "title": "单元测试实战：Vue 组件测试",
        "tech": "Vue",
        "year": 2022,
        "month": 12,
        "style": "practice",
        "tone": "determined",
        "opening": "一直觉得写测试很麻烦，但这次重构项目时，测试真的帮了大忙。",
        "problem": "如何写出有价值的测试用例",
        "depth": "intermediate"
    },
    {
        "title": "2022 年终总结：技术成长与思考",
        "tech": "JavaScript",
        "year": 2022,
        "month": 12,
        "style": "annual_summary",
        "tone": "reflective",
        "opening": "2022 年是成长很快的一年，从 React 到 Vue，从写代码到关注工程化。",
        "problem": "技术广度有了，深度还需加强",
        "depth": "advanced"
    },
    {
        "title": "前端安全防护实践",
        "tech": "JavaScript",
        "year": 2022,
        "month": 12,
        "style": "practice",
        "tone": "serious",
        "opening": "最近项目遇到了 XSS 攻击，痛定思痛，系统学习了前端安全知识。",
        "problem": "安全问题容易被忽视",
        "depth": "advanced"
    },
    {
        "title": "Webpack 到 Vite 的迁移之路",
        "tech": "Node.js",
        "year": 2022,
        "month": 12,
        "style": "migration_guide",
        "tone": "experienced",
        "opening": "老项目从 Webpack 迁移到 Vite，踩了不少坑，记录一下迁移过程。",
        "problem": "一些 Webpack 特性在 Vite 中需要替代方案",
        "depth": "advanced"
    },
    {
        "title": "CSS 预处理器对比：Sass vs Less",
        "tech": "CSS",
        "year": 2022,
        "month": 12,
        "style": "comparison",
        "tone": "analytical",
        "opening": "用过 Sass 和 Less，对比一下两者的优缺点。",
        "problem": "选择哪个更适合项目",
        "depth": "intermediate"
    },
    {
        "title": "Vue 3 自定义指令实践",
        "tech": "Vue",
        "year": 2022,
        "month": 12,
        "style": "practice",
        "tone": "creative",
        "opening": "自定义指令是 Vue 的一个强大特性，实现了几个实用的指令分享一下。",
        "problem": "指令的生命周期需要理解清楚",
        "depth": "intermediate"
    },
    {
        "title": "前端代码规范落地实践",
        "tech": "JavaScript",
        "year": 2022,
        "month": 12,
        "style": "practice",
        "tone": "pragmatic",
        "opening": "团队代码风格不统一一直是个问题，这次下决心推动规范落地。",
        "problem": "如何让规范真正执行起来",
        "depth": "intermediate"
    },
    {
        "title": "Vue 3 性能优化技巧",
        "tech": "Vue",
        "year": 2022,
        "month": 12,
        "style": "tips",
        "tone": "professional",
        "opening": "总结一些 Vue 3 性能优化的实用技巧，都是项目中验证过的。",
        "problem": "如何定位性能瓶颈",
        "depth": "advanced"
    },
    {
        "title": "前端错误监控与上报",
        "tech": "JavaScript",
        "year": 2022,
        "month": 12,
        "style": "solution",
        "tone": "systematic",
        "opening": "线上问题定位一直很头疼，搭建了一套错误监控系统。",
        "problem": "如何有效收集和分析错误信息",
        "depth": "advanced"
    },
    
    # 2023 Articles - Mature phase (20 articles)
    {
        "title": "Nuxt 3 服务端渲染实战",
        "tech": "Vue",
        "year": 2023,
        "month": 1,
        "style": "practice",
        "tone": "professional",
        "opening": "新项目采用 Nuxt 3 做 SSR，这是我第一次深入接触服务端渲染。",
        "problem": "SSR 的数据获取和状态同步需要仔细设计",
        "depth": "advanced"
    },
    {
        "title": "Vue 3 源码阅读：响应式系统",
        "tech": "Vue",
        "year": 2023,
        "month": 2,
        "style": "source_code_analysis",
        "tone": "analytical",
        "opening": "一直想深入理解 Vue 3 的响应式原理，这次花时间读了源码。",
        "problem": "Proxy 和 Reflect 的配合使用很巧妙",
        "depth": "expert"
    },
    {
        "title": "微前端架构实践与思考",
        "tech": "JavaScript",
        "year": 2023,
        "month": 3,
        "style": "architecture",
        "tone": "thoughtful",
        "opening": "公司多个项目需要整合，调研了微前端方案，最终选择了 qiankun。",
        "problem": "应用间的通信和状态共享是难点",
        "depth": "expert"
    },
    {
        "title": "Nuxt 3 性能优化实战",
        "tech": "Vue",
        "year": 2023,
        "month": 4,
        "style": "optimization",
        "tone": "professional",
        "opening": "SSR 项目的性能优化和 CSR 有很大不同，分享一些实战经验。",
        "problem": "首屏渲染和 TTI 需要平衡",
        "depth": "expert"
    },
    {
        "title": "TypeScript 类型体操实践",
        "tech": "TypeScript",
        "year": 2023,
        "month": 5,
        "style": "advanced_tutorial",
        "tone": "confident",
        "opening": "TypeScript 的类型系统非常强大，分享一些高级类型技巧。",
        "problem": "复杂类型的推导需要深入理解",
        "depth": "expert"
    },
    {
        "title": "Vue 3 + TypeScript 最佳实践",
        "tech": "Vue",
        "year": 2023,
        "month": 6,
        "style": "best_practice",
        "tone": "experienced",
        "opening": "Vue 3 对 TypeScript 的支持越来越好，总结一些最佳实践。",
        "problem": "类型定义需要权衡复杂度和可维护性",
        "depth": "advanced"
    },
    {
        "title": "前端架构设计思考",
        "tech": "JavaScript",
        "year": 2023,
        "month": 7,
        "style": "thinking",
        "tone": "reflective",
        "opening": "做了几年前端，开始思考如何设计一个好的前端架构。",
        "problem": "架构需要在灵活性和约束性之间平衡",
        "depth": "expert"
    },
    {
        "title": "Vite 插件开发实践",
        "tech": "Node.js",
        "year": 2023,
        "month": 8,
        "style": "practice",
        "tone": "creative",
        "opening": "项目有一些特殊需求，Vite 现有插件满足不了，自己开发了几个插件。",
        "problem": "理解 Vite 的插件机制需要时间",
        "depth": "advanced"
    },
    {
        "title": "前端工程化体系建设",
        "tech": "Node.js",
        "year": 2023,
        "month": 9,
        "style": "system_building",
        "tone": "systematic",
        "opening": "负责团队的工程化建设，从脚手架到 CI/CD，搭建了完整的体系。",
        "problem": "如何让工程化真正提升效率",
        "depth": "expert"
    },
    {
        "title": "Vue 3 组件库设计与实现",
        "tech": "Vue",
        "year": 2023,
        "month": 10,
        "style": "design_implementation",
        "tone": "professional",
        "opening": "公司内部组件库需要升级，负责了整体设计和核心组件实现。",
        "problem": "组件 API 设计需要考虑易用性和扩展性",
        "depth": "expert"
    },
    {
        "title": "前端性能优化方法论",
        "tech": "JavaScript",
        "year": 2023,
        "month": 11,
        "style": "methodology",
        "tone": "experienced",
        "opening": "做了很多性能优化项目，总结一套系统的方法论。",
        "problem": "性能优化需要数据驱动，不能凭感觉",
        "depth": "expert"
    },
    {
        "title": "Nuxt 3 模块开发指南",
        "tech": "Vue",
        "year": 2023,
        "month": 12,
        "style": "guide",
        "tone": "professional",
        "opening": "Nuxt 的模块系统很强大，开发了几个内部模块，分享一下经验。",
        "problem": "模块的生命周期和钩子需要理解清楚",
        "depth": "advanced"
    },
    {
        "title": "2023 年终总结：技术深度的追求",
        "tech": "JavaScript",
        "year": 2023,
        "month": 12,
        "style": "annual_summary",
        "tone": "reflective",
        "opening": "2023 年更注重技术深度，从使用到理解原理，从实践到方法论。",
        "problem": "如何在深度和广度之间平衡",
        "depth": "expert"
    },
    {
        "title": "前端监控体系建设实践",
        "tech": "JavaScript",
        "year": 2023,
        "month": 12,
        "style": "system_building",
        "tone": "systematic",
        "opening": "完整的监控体系包括性能监控、错误监控、行为监控等多个维度。",
        "problem": "如何设计合理的监控指标",
        "depth": "expert"
    },
    {
        "title": "Vue 3 Compiler 原理解析",
        "tech": "Vue",
        "year": 2023,
        "month": 12,
        "style": "source_code_analysis",
        "tone": "analytical",
        "opening": "深入研究了 Vue 3 的编译器实现，理解了模板到渲染函数的转换过程。",
        "problem": "编译优化的思路很值得学习",
        "depth": "expert"
    },
    {
        "title": "前端安全最佳实践",
        "tech": "JavaScript",
        "year": 2023,
        "month": 12,
        "style": "best_practice",
        "tone": "serious",
        "opening": "安全无小事，总结一套前端安全的最佳实践。",
        "problem": "安全需要贯穿整个开发流程",
        "depth": "advanced"
    },
    {
        "title": "Nuxt 3 全栈开发实践",
        "tech": "Vue",
        "year": 2023,
        "month": 12,
        "style": "practice",
        "tone": "professional",
        "opening": "Nuxt 3 的 Server API 让前端开发者也能轻松写后端接口。",
        "problem": "全栈开发需要考虑的问题更多",
        "depth": "advanced"
    },
    {
        "title": "前端代码质量保障体系",
        "tech": "JavaScript",
        "year": 2023,
        "month": 12,
        "style": "system_building",
        "tone": "systematic",
        "opening": "代码质量是项目长期维护的基础，建立了一套完整的保障体系。",
        "problem": "如何让质量保障措施真正落地",
        "depth": "advanced"
    },
    {
        "title": "Vue 3 性能优化深度剖析",
        "tech": "Vue",
        "year": 2023,
        "month": 12,
        "style": "deep_dive",
        "tone": "professional",
        "opening": "从源码层面分析 Vue 3 的性能优化策略，很多设计值得学习。",
        "problem": "理解优化原理才能更好地应用",
        "depth": "expert"
    },
    {
        "title": "前端团队技术规划思考",
        "tech": "JavaScript",
        "year": 2023,
        "month": 12,
        "style": "thinking",
        "tone": "strategic",
        "opening": "作为技术负责人，开始思考团队的技术规划和发展方向。",
        "problem": "技术选型需要考虑团队现状和业务需求",
        "depth": "expert"
    },
    
    # 2024 Articles - Expert phase (15 articles)
    {
        "title": "Next.js 14 App Router 深度解析",
        "tech": "React",
        "year": 2024,
        "month": 1,
        "style": "deep_dive",
        "tone": "analytical",
        "opening": "Next.js 14 的 App Router 带来了很多新特性，深入研究了一下实现原理。",
        "problem": "Server Components 的心智模型需要转变",
        "depth": "expert"
    },
    {
        "title": "React Server Components 实战",
        "tech": "React",
        "year": 2024,
        "month": 2,
        "style": "practice",
        "tone": "professional",
        "opening": "Server Components 是 React 的未来方向，在项目中实践了一番。",
        "problem": "客户端和服务端组件的边界需要仔细设计",
        "depth": "expert"
    },
    {
        "title": "Python 数据分析入门实践",
        "tech": "Python",
        "year": 2024,
        "month": 3,
        "style": "practice",
        "tone": "curious",
        "opening": "想拓展技术栈，开始学习 Python 做数据分析。Pandas 和 NumPy 真的很强大。",
        "problem": "数据处理的思维方式和前端开发很不一样",
        "depth": "intermediate"
    },
    {
        "title": "Puppeteer 自动化测试实战",
        "tech": "Node.js",
        "year": 2024,
        "month": 4,
        "style": "practice",
        "tone": "hands_on",
        "opening": "用 Puppeteer 搭建了 E2E 测试框架，自动化测试真的能提升质量。",
        "problem": "测试用例的维护成本需要控制",
        "depth": "advanced"
    },
    {
        "title": "Next.js 性能优化最佳实践",
        "tech": "React",
        "year": 2024,
        "month": 5,
        "style": "best_practice",
        "tone": "experienced",
        "opening": "Next.js 项目的性能优化有很多技巧，总结一些最佳实践。",
        "problem": "SSR 和 SSG 的选择需要根据场景",
        "depth": "expert"
    },
    {
        "title": "GitHub Actions 自动化部署实践",
        "tech": "DevOps",
        "year": 2024,
        "month": 6,
        "style": "practice",
        "tone": "professional",
        "opening": "用 GitHub Actions 搭建了完整的 CI/CD 流程，部署效率提升了很多。",
        "problem": "工作流的设计需要考虑各种场景",
        "depth": "advanced"
    },
    {
        "title": "Chrome 扩展开发实战",
        "tech": "JavaScript",
        "year": 2024,
        "month": 7,
        "style": "practice",
        "tone": "creative",
        "opening": "开发了一个提升工作效率的 Chrome 扩展，分享一下开发经验。",
        "problem": "扩展的权限管理需要仔细设计",
        "depth": "intermediate"
    },
    {
        "title": "Tailwind CSS 实战技巧",
        "tech": "CSS",
        "year": 2024,
        "month": 8,
        "style": "tips",
        "tone": "practical",
        "opening": "Tailwind CSS 的开发体验确实不错，分享一些实用技巧。",
        "problem": "类名太长的问题需要解决",
        "depth": "intermediate"
    },
    {
        "title": "Next.js Server Actions 深入理解",
        "tech": "React",
        "year": 2024,
        "month": 9,
        "style": "deep_dive",
        "tone": "analytical",
        "opening": "Server Actions 让前端开发者能更方便地处理服务端逻辑，研究了一下实现原理。",
        "problem": "理解 Server Actions 的执行时机很重要",
        "depth": "expert"
    },
    {
        "title": "Python 爬虫实战：数据采集与分析",
        "tech": "Python",
        "year": 2024,
        "month": 10,
        "style": "practice",
        "tone": "hands_on",
        "opening": "用 Python 写了一个爬虫采集数据，BeautifulSoup 和 Requests 很好用。",
        "problem": "反爬虫机制需要应对",
        "depth": "intermediate"
    },
    {
        "title": "Docker 容器化部署实战",
        "tech": "DevOps",
        "year": 2024,
        "month": 11,
        "style": "practice",
        "tone": "professional",
        "opening": "学习了 Docker，把项目容器化部署，环境一致性问题解决了。",
        "problem": "镜像优化和多阶段构建需要掌握",
        "depth": "advanced"
    },
    {
        "title": "前端架构演进思考",
        "tech": "JavaScript",
        "year": 2024,
        "month": 12,
        "style": "thinking",
        "tone": "reflective",
        "opening": "回顾这几年前端架构的演进，从 SPA 到 SSR，从 CSR 到 RSC。",
        "problem": "技术选型需要结合业务场景",
        "depth": "expert"
    },
    {
        "title": "2024 年终总结：技术视野的拓展",
        "tech": "JavaScript",
        "year": 2024,
        "month": 12,
        "style": "annual_summary",
        "tone": "reflective",
        "opening": "2024 年尝试了很多新技术，从前端到后端，从开发到运维。",
        "problem": "技术的本质是解决问题",
        "depth": "expert"
    },
    {
        "title": "React 19 新特性探索",
        "tech": "React",
        "year": 2024,
        "month": 12,
        "style": "exploration",
        "tone": "curious",
        "opening": "React 19 带来了很多新特性，提前体验了一下。",
        "problem": "新特性的稳定性还需要观察",
        "depth": "advanced"
    },
    {
        "title": "全栈开发的思考与实践",
        "tech": "JavaScript",
        "year": 2024,
        "month": 12,
        "style": "thinking",
        "tone": "thoughtful",
        "opening": "从前端到全栈，技术栈的拓展带来了新的思考。",
        "problem": "全栈不是什么都会，而是理解全局",
        "depth": "expert"
    },
    
    # 2025 Articles - Master phase (10 articles)
    {
        "title": "AI 辅助编程实践与思考",
        "tech": "JavaScript",
        "year": 2025,
        "month": 1,
        "style": "thinking",
        "tone": "forward_looking",
        "opening": "AI 工具越来越强大，开始思考 AI 时代程序员的价值。",
        "problem": "如何更好地利用 AI 提升效率",
        "depth": "expert"
    },
    {
        "title": "前端性能优化：从理论到实践",
        "tech": "JavaScript",
        "year": 2025,
        "month": 2,
        "style": "comprehensive",
        "tone": "experienced",
        "opening": "做了这么多年性能优化，系统总结一下方法论和最佳实践。",
        "problem": "性能优化是一个系统工程",
        "depth": "expert"
    },
    {
        "title": "技术债务管理实践",
        "tech": "JavaScript",
        "year": 2025,
        "month": 3,
        "style": "management",
        "tone": "pragmatic",
        "opening": "技术债务是每个项目都会面临的问题，如何管理很重要。",
        "problem": "需要在业务需求和技术债务之间平衡",
        "depth": "expert"
    },
    {
        "title": "前端工程师的成长之路",
        "tech": "JavaScript",
        "year": 2025,
        "month": 4,
        "style": "career",
        "tone": "reflective",
        "opening": "回顾这几年的成长历程，分享一些心得体会。",
        "problem": "技术成长需要持续学习和实践",
        "depth": "expert"
    },
    {
        "title": "开源项目维护经验分享",
        "tech": "JavaScript",
        "year": 2025,
        "month": 5,
        "style": "experience_sharing",
        "tone": "experienced",
        "opening": "维护开源项目一年多了，分享一些经验和感悟。",
        "problem": "开源不仅是技术，更是社区",
        "depth": "expert"
    },
    {
        "title": "前端技术趋势观察",
        "tech": "JavaScript",
        "year": 2025,
        "month": 6,
        "style": "trend_analysis",
        "tone": "analytical",
        "opening": "观察前端技术的发展趋势，思考未来的方向。",
        "problem": "技术发展很快，但本质不变",
        "depth": "expert"
    },
    {
        "title": "代码审查的艺术",
        "tech": "JavaScript",
        "year": 2025,
        "month": 7,
        "style": "methodology",
        "tone": "experienced",
        "opening": "Code Review 是提升代码质量的重要手段，分享一些经验。",
        "problem": "如何做好 Code Review 需要技巧",
        "depth": "expert"
    },
    {
        "title": "技术选型的思考框架",
        "tech": "JavaScript",
        "year": 2025,
        "month": 8,
        "style": "framework",
        "tone": "systematic",
        "opening": "技术选型是架构设计的第一步，总结一个思考框架。",
        "problem": "选型需要考虑多个维度",
        "depth": "expert"
    },
    {
        "title": "团队技术文化建设",
        "tech": "JavaScript",
        "year": 2025,
        "month": 9,
        "style": "culture",
        "tone": "thoughtful",
        "opening": "技术文化对团队的长期发展很重要，分享一些实践。",
        "problem": "文化建设需要长期投入",
        "depth": "expert"
    },
    {
        "title": "五年前端开发总结：技术与成长",
        "tech": "JavaScript",
        "year": 2025,
        "month": 10,
        "style": "milestone_summary",
        "tone": "reflective",
        "opening": "从 2021 到 2025，五年时间，从初学者到现在，感慨良多。",
        "problem": "技术是手段，解决问题才是目的",
        "depth": "master"
    },
]

def get_maturity_level(year):
    """根据年份返回技术成熟度"""
    if year == 2021:
        return "beginner"
    elif year == 2022:
        return "intermediate"
    elif year == 2023:
        return "advanced"
    elif year == 2024:
        return "expert"
    else:  # 2025
        return "master"

def generate_code_example(tech, depth, style):
    """根据技术栈、深度和风格生成代码示例"""
    
    if depth == "basic":
        if "React" in tech:
            return """
```jsx
import React, { Component } from 'react';

class MyComponent extends Component {
  componentDidMount() {
    console.log('组件挂载了');
  }
  
  componentDidUpdate(prevProps) {
    console.log('组件更新了');
  }
  
  render() {
    return <div>Hello React</div>;
  }
}
```
"""
        elif "Vue" in tech:
            return """
```vue
<template>
  <div>{{ message }}</div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello Vue'
    }
  },
  mounted() {
    console.log('组件挂载了');
  }
}
</script>
```
"""
        else:
            return """
```javascript
function example() {
  console.log('Hello World');
}
```
"""
    
    elif depth in ["intermediate", "advanced"]:
        if "React" in tech:
            return """
```jsx
import React, { useState, useEffect, useCallback } from 'react';

const DataList = ({ apiUrl }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('请求失败');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;
  
  return (
    <ul>
      {data.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};
```
"""
        elif "Vue" in tech:
            return """
```vue
<template>
  <div>
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">错误: {{ error }}</div>
    <ul v-else>
      <li v-for="item in data" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps(['apiUrl']);
const data = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchData = async () => {
  try {
    loading.value = true;
    const response = await fetch(props.apiUrl);
    if (!response.ok) throw new Error('请求失败');
    data.value = await response.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>
```
"""
        elif "Python" in tech:
            return """
```python
import requests
from typing import List, Dict

def fetch_data(url: str) -> List[Dict]:
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"请求失败: {e}")
        return []

if __name__ == "__main__":
    data = fetch_data("https://api.example.com/data")
    for item in data:
        print(item)
```
"""
        else:
            return """
```javascript
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('请求失败');
    }
    return await response.json();
  } catch (error) {
    console.error('错误:', error);
    return null;
  }
}
```
"""
    
    else:  # expert or master
        if "React" in tech:
            return """
```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

type User = z.infer<typeof UserSchema>;

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<User[]> => {
      const response = await fetch('/api/users');
      const data = await response.json();
      return z.array(UserSchema).parse(data);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (user: User) => {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```
"""
        elif "Vue" in tech:
            return """
```typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface User {
  id: number;
  name: string;
  email: string;
}

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  const activeUsers = computed(() => 
    users.value.filter(user => user.email)
  );
  
  async function fetchUsers() {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('请求失败');
      users.value = await response.json();
    } catch (e) {
      error.value = e instanceof Error ? e.message : '未知错误';
    } finally {
      loading.value = false;
    }
  }
  
  async function updateUser(user: User) {
    const response = await fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error('更新失败');
    await fetchUsers();
  }
  
  return { users, loading, error, activeUsers, fetchUsers, updateUser };
});
```
"""
        else:
            return """
```typescript
import { z } from 'zod';

const ConfigSchema = z.object({
  apiUrl: z.string().url(),
  timeout: z.number().positive(),
  retries: z.number().int().min(0).max(5),
});

type Config = z.infer<typeof ConfigSchema>;

class ApiClient {
  private config: Config;
  
  constructor(config: unknown) {
    this.config = ConfigSchema.parse(config);
  }
  
  async request<T>(endpoint: string): Promise<T> {
    let lastError: Error | null = null;
    
    for (let i = 0; i <= this.config.retries; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
        
        const response = await fetch(`${this.config.apiUrl}${endpoint}`, {
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        if (i < this.config.retries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
        }
      }
    }
    
    throw lastError;
  }
}
```
"""

def generate_unique_article(article_def, article_id):
    """为每篇文章生成独特的内容"""
    
    title = article_def["title"]
    tech = article_def["tech"]
    year = article_def["year"]
    month = article_def["month"]
    style = article_def["style"]
    tone = article_def["tone"]
    opening = article_def["opening"]
    problem = article_def["problem"]
    depth = article_def["depth"]
    
    content = []
    
    # 开头 - 每篇都不一样
    content.append(f"<p>{opening}</p>")
    
    # 根据风格生成不同的内容结构
    if style == "learning_notes":
        content.append("<h2>学习笔记</h2>")
        content.append(f"<p>今天主要学习了 {title} 相关的内容。{problem}，经过一番研究，总算是搞明白了。</p>")
        content.append("<p>下面记录一下学习过程中的一些要点。</p>")
        content.append("<h3>核心概念</h3>")
        content.append(f"<p>首先需要理解几个核心概念。这些概念是理解 {tech} 的基础。</p>")
        content.append("<ul>")
        content.append("<li>概念一：基础原理和使用场景</li>")
        content.append("<li>概念二：常见的使用模式</li>")
        content.append("<li>概念三：需要注意的地方</li>")
        content.append("</ul>")
        
    elif style == "pitfall_record":
        content.append("<h2>遇到的问题</h2>")
        content.append(f"<p>{problem}。一开始完全摸不着头脑，报错信息也看不太懂。</p>")
        content.append("<p>错误信息大概是这样的：</p>")
        content.append("<pre><code>Error: Something went wrong...</code></pre>")
        content.append("<h2>排查过程</h2>")
        content.append("<p>Google 了半天，试了好几种方法：</p>")
        content.append("<ol>")
        content.append("<li>首先检查了配置文件，没发现问题</li>")
        content.append("<li>然后查看了官方文档，找到了一些线索</li>")
        content.append("<li>最后在 Stack Overflow 找到了类似的问题</li>")
        content.append("</ol>")
        content.append("<h2>解决方案</h2>")
        content.append("<p>最终找到了解决方案，原来是...</p>")
        
    elif style == "experience_sharing":
        content.append("<h2>使用体验</h2>")
        content.append(f"<p>用 {tech} 开发了一段时间，整体感觉还不错。当然也遇到了一些问题。</p>")
        content.append(f"<p>{problem}，不过通过查文档和社区讨论，都解决了。</p>")
        content.append("<h3>优点</h3>")
        content.append("<ul>")
        content.append("<li>开发效率高，上手快</li>")
        content.append("<li>文档完善，社区活跃</li>")
        content.append("<li>工具链成熟</li>")
        content.append("</ul>")
        content.append("<h3>需要改进的地方</h3>")
        content.append("<ul>")
        content.append("<li>某些场景下性能还有优化空间</li>")
        content.append("<li>学习曲线还是有一点的</li>")
        content.append("</ul>")
        
    elif style == "comparison":
        content.append("<h2>技术对比</h2>")
        content.append(f"<p>{problem}。下面从几个维度对比一下。</p>")
        content.append("<h3>性能对比</h3>")
        content.append("<p>在性能方面，两者各有优势...</p>")
        content.append("<h3>开发体验</h3>")
        content.append("<p>从开发体验来说...</p>")
        content.append("<h3>生态系统</h3>")
        content.append("<p>生态方面的对比...</p>")
        
    elif style == "deep_dive":
        content.append("<h2>深入分析</h2>")
        content.append(f"<p>{problem}。这次深入研究了一下实现原理。</p>")
        content.append("<h3>原理解析</h3>")
        content.append(f"<p>{tech} 的核心原理是...</p>")
        content.append("<h3>源码分析</h3>")
        content.append("<p>通过阅读源码，发现了一些有意思的实现细节...</p>")
        content.append("<h3>性能优化</h3>")
        content.append("<p>理解了原理后，就能更好地进行性能优化...</p>")
        
    elif style == "practice":
        content.append("<h2>实践过程</h2>")
        content.append(f"<p>这次在项目中实践了 {title}。{problem}，不过最终还是解决了。</p>")
        content.append("<h3>项目背景</h3>")
        content.append("<p>项目的具体需求是...</p>")
        content.append("<h3>技术选型</h3>")
        content.append(f"<p>选择 {tech} 的原因是...</p>")
        content.append("<h3>实现细节</h3>")
        content.append("<p>具体实现过程中...</p>")
        
    elif style == "best_practice":
        content.append("<h2>最佳实践</h2>")
        content.append(f"<p>用了一段时间 {tech}，总结一些最佳实践。</p>")
        content.append("<h3>代码组织</h3>")
        content.append("<p>合理的代码组织能提升可维护性...</p>")
        content.append("<h3>性能优化</h3>")
        content.append("<p>性能优化的几个要点...</p>")
        content.append("<h3>常见陷阱</h3>")
        content.append(f"<p>{problem}，这是一个常见的陷阱...</p>")
        
    elif style == "source_code_analysis":
        content.append("<h2>源码阅读</h2>")
        content.append(f"<p>花时间读了 {tech} 的源码，收获很大。</p>")
        content.append("<h3>整体架构</h3>")
        content.append("<p>源码的整体架构是...</p>")
        content.append("<h3>核心实现</h3>")
        content.append(f"<p>{problem}，通过阅读源码终于理解了...</p>")
        content.append("<h3>设计思想</h3>")
        content.append("<p>源码中体现的设计思想值得学习...</p>")
        
    elif style == "annual_summary":
        content.append(f"<h2>{year} 年回顾</h2>")
        content.append(f"<p>{year} 年马上就要结束了，回顾这一年的学习和成长。</p>")
        content.append("<h3>技术成长</h3>")
        content.append("<p>这一年在技术上的主要进步...</p>")
        content.append("<h3>项目经验</h3>")
        content.append("<p>参与的几个项目让我学到了...</p>")
        content.append("<h3>未来规划</h3>")
        content.append(f"<p>{problem}，明年要继续努力...</p>")
        
    elif style == "thinking":
        content.append("<h2>思考与总结</h2>")
        content.append(f"<p>最近在思考 {title} 相关的问题。</p>")
        content.append(f"<p>{problem}，这个问题值得深入思考。</p>")
        content.append("<h3>问题分析</h3>")
        content.append("<p>从几个角度分析这个问题...</p>")
        content.append("<h3>解决思路</h3>")
        content.append("<p>可能的解决思路有...</p>")
        content.append("<h3>延伸思考</h3>")
        content.append("<p>进一步思考...</p>")
        
    else:  # 默认结构
        content.append("<h2>正文</h2>")
        content.append(f"<p>{problem}。下面详细说说。</p>")
        content.append("<h3>背景介绍</h3>")
        content.append(f"<p>关于 {tech} 的一些背景...</p>")
        content.append("<h3>具体内容</h3>")
        content.append("<p>具体来说...</p>")
    
    # 添加代码示例
    content.append("<h2>代码示例</h2>")
    content.append("<p>下面是一个实际的代码示例：</p>")
    content.append(generate_code_example(tech, depth, style))
    content.append("<p>这段代码展示了核心的实现逻辑。</p>")
    
    # 根据深度添加更多内容
    if depth in ["advanced", "expert", "master"]:
        content.append("<h2>深入探讨</h2>")
        content.append("<p>进一步深入探讨一些细节问题。</p>")
        content.append("<h3>性能考虑</h3>")
        content.append("<p>在性能方面需要注意...</p>")
        content.append("<h3>最佳实践</h3>")
        content.append("<p>根据实践经验，建议...</p>")
        
        if depth in ["expert", "master"]:
            content.append("<h3>架构设计</h3>")
            content.append("<p>从架构层面来看...</p>")
            content.append("<h3>扩展性</h3>")
            content.append("<p>考虑到未来的扩展...</p>")
    
    # 总结 - 根据语气不同
    content.append("<h2>总结</h2>")
    if tone == "curious":
        content.append(f"<p>虽然还有很多不懂的地方，但今天算是有了一些进步。{tech} 还有很多值得探索的地方，继续加油！</p>")
    elif tone == "frustrated":
        content.append(f"<p>踩了不少坑，但也学到了很多。{problem}，下次应该不会再犯同样的错误了。</p>")
    elif tone == "analytical":
        content.append(f"<p>通过这次分析，对 {tech} 有了更深入的理解。技术选型需要结合实际场景，没有银弹。</p>")
    elif tone == "professional":
        content.append(f"<p>本文详细介绍了 {title} 的实践经验。希望能对大家有所帮助。</p>")
    elif tone == "reflective":
        content.append(f"<p>回顾这段时间的学习和实践，{problem}。技术的学习是一个持续的过程，需要不断积累和思考。</p>")
    elif tone == "experienced":
        content.append(f"<p>经过这段时间的实践，总结了一些经验和最佳实践。{tech} 是一个很强大的工具，用好它需要时间和经验的积累。</p>")
    else:
        content.append(f"<p>这次学习收获挺大的，对 {tech} 有了更深的理解。{problem}，这个问题也算是解决了。</p>")
    
    # 参考资料（高级文章才有）
    if depth in ["advanced", "expert", "master"]:
        content.append("<h2>参考资料</h2>")
        content.append("<ul>")
        content.append(f"<li>{tech} 官方文档</li>")
        content.append("<li>相关技术博客</li>")
        content.append("<li>社区讨论</li>")
        content.append("</ul>")
    
    return "\n".join(content)

def generate_sql():
    """生成 SQL"""
    sql = []
    sql.append("-- ============================================")
    sql.append("-- 手工定制的 80 篇独特文章")
    sql.append("-- 每篇文章都有独特的风格和叙事方式")
    sql.append("-- ============================================")
    sql.append("SET NAMES utf8mb4;")
    sql.append("USE blog;")
    sql.append("")
    
    # Users
    sql.append("-- Users")
    sql.append("INSERT INTO users (username, email, password_hash, display_name, role) VALUES")
    sql.append("('admin', 'admin@meowgod.com', '$2b$10$fTSfU0zD6hLrsf9Uslkg5.NysVYm7DD9.Q17108OY5kI1ZV4w7axK', 'MeowGod', 'admin');")
    sql.append("")

    # Tags
    sql.append("-- Tags")
    sql.append("INSERT INTO tags (name, slug, color, icon, description) VALUES")
    tag_values = []
    tag_map = {}  # name -> id
    for i, t in enumerate(TAGS):
        tag_values.append(f"('{t[0]}', '{t[1]}', '{t[2]}', '{t[3]}', '{t[4]}')")
        tag_map[t[0]] = i + 1
    sql.append(",\n".join(tag_values) + ";")
    sql.append("")

    # Tech Stack
    sql.append("-- Tech Stack")
    sql.append("INSERT INTO tech_stack (name, icon, link, description) VALUES")
    tech_values = []
    tech_map = {}  # name -> id
    for i, t in enumerate(TECH_STACK):
        tech_values.append(f"('{t[0]}', '{t[1]}', '{t[2]}', '{t[3]}')")
        tech_map[t[0]] = i + 1
    sql.append(",\n".join(tech_values) + ";")
    sql.append("")

    # Articles
    sql.append("-- Articles")
    articles_sql = []
    article_tags_sql = []
    article_tech_sql = []
    
    for article_id, article_def in enumerate(ARTICLE_DEFINITIONS, 1):
        title = article_def["title"]
        tech = article_def["tech"]
        year = article_def["year"]
        month = article_def["month"]
        
        # 生成发布日期
        day = random.randint(1, 28)
        pub_date = datetime.date(year, month, day)
        pub_date_str = pub_date.strftime('%Y-%m-%d %H:%M:%S')
        
        # 生成描述
        desc = f"关于 {title} 的实践总结和经验分享。本文从实际项目出发，分享了一些具体的经验和思考。"
        
        # 生成完整内容
        content = generate_unique_article(article_def, article_id)
        content = content.replace("'", "''")  # Escape SQL quotes
        
        # 随机生成浏览量和点赞数（早期文章数据较少）
        if year == 2021:
            view_count = random.randint(50, 500)
            star_count = random.randint(5, 50)
        elif year == 2022:
            view_count = random.randint(200, 1000)
            star_count = random.randint(20, 100)
        elif year == 2023:
            view_count = random.randint(500, 2000)
            star_count = random.randint(50, 200)
        elif year == 2024:
            view_count = random.randint(800, 3000)
            star_count = random.randint(80, 300)
        else:  # 2025
            view_count = random.randint(1000, 5000)
            star_count = random.randint(100, 500)
        
        articles_sql.append(f"({article_id}, '{title}', '{desc}', '{content}', '{tech}', 1, {view_count}, {star_count}, 'published', '{pub_date_str}')")
        
        # Assign Tags based on Tech
        if tech == 'React':
            tags_to_add = ['React', 'JavaScript']
        elif tech == 'Vue':
            tags_to_add = ['Vue.js', 'JavaScript']
        elif tech == 'Python':
            tags_to_add = ['Python']
        elif tech == 'Node.js':
            tags_to_add = ['Node.js', 'JavaScript']
        elif tech == 'CSS':
            tags_to_add = ['CSS']
        elif tech == 'TypeScript':
            tags_to_add = ['TypeScript', 'JavaScript']
        elif tech == 'DevOps':
            tags_to_add = ['DevOps']
        elif tech == 'Tool':
            tags_to_add = ['Puppeteer']
        else:
            tags_to_add = ['JavaScript']
        
        for t_name in tags_to_add:
            if t_name in tag_map:
                article_tags_sql.append(f"({article_id}, {tag_map[t_name]})")
        
        # Assign Tech Stack
        tech_key = tech
        if tech_key in tech_map:
            article_tech_sql.append(f"({article_id}, {tech_map[tech_key]})")

    sql.append("INSERT INTO articles (id, title, description, content, cover_image, author_id, view_count, star_count, status, published_at) VALUES")
    sql.append(",\n".join(articles_sql) + ";")
    sql.append("")
    
    sql.append("-- Article Tags")
    sql.append("INSERT INTO article_tags (article_id, tag_id) VALUES")
    sql.append(",\n".join(article_tags_sql) + ";")
    sql.append("")
    
    sql.append("-- Article Tech Stack")
    sql.append("INSERT INTO article_tech_stack (article_id, tech_id) VALUES")
    sql.append(",\n".join(article_tech_sql) + ";")

    return "\n".join(sql)

if __name__ == "__main__":
    print("正在生成 80 篇独特的文章...")
    print(f"文章总数: {len(ARTICLE_DEFINITIONS)}")
    
    content = generate_sql()
    with open('seed.sql', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ seed.sql 生成成功！")
    print(f"📝 共生成 {len(ARTICLE_DEFINITIONS)} 篇文章")
    print("🎨 每篇文章都有独特的风格和叙事方式")
    print("📅 时间跨度: 2021-2025")
