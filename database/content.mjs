function escapeHtml(value) {
    return String(value).split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;').split("'").join('&#039;');
}

function renderSections(sections) {
    return sections
        .map((section, index) => {
            const paragraphs = (section.paragraphs || []).map((paragraph) => `<p>${paragraph}</p>`).join('\n');
            const list = section.items?.length ? `<ul>${section.items.map((item) => `<li>${item}</li>`).join('')}</ul>` : '';
            const steps = section.steps?.length ? `<ol class="article-steps">${section.steps.map((item) => `<li>${item}</li>`).join('')}</ol>` : '';
            const quote = section.quote ? `<blockquote>${section.quote}</blockquote>` : '';
            const note = section.note ? `<aside class="article-note"><strong>补充说明</strong><p>${section.note}</p></aside>` : '';
            const code = section.code ? `<pre><code>${escapeHtml(section.code)}</code></pre>` : '';
            const flow = section.flow?.length
                ? `<div class="article-flow" role="list">${section.flow
                      .map((item, flowIndex) => `<div class="article-flow__step" role="listitem"><span>${flowIndex + 1}</span><strong>${item.title}</strong><p>${item.detail}</p></div>`)
                      .join('')}</div>`
                : '';
            const table = section.table
                ? `<div class="article-table-wrap"><table><thead><tr>${section.table.headers.map((header) => `<th>${header}</th>`).join('')}</tr></thead><tbody>${section.table.rows
                      .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
                      .join('')}</tbody></table></div>`
                : '';
            return `<section><h2 id="section-${index + 1}">${section.heading}</h2>\n${paragraphs}\n${quote}\n${list}\n${steps}\n${flow}\n${table}\n${note}\n${code}</section>`;
        })
        .join('\n');
}

function renderArticle({ intro, sections, closing, closingHeading = '写在最后', showToc = true }) {
    const tocLabel = closingHeading === '写在最后' ? '这篇记录什么' : '目录';
    const toc = showToc
        ? `<nav class="article-toc" aria-label="文章目录"><strong>${tocLabel}</strong><ol>${sections
              .map((section, index) => `<li><a href="#section-${index + 1}">${section.heading}</a></li>`)
              .join('')}</ol></nav>`
        : '';
    const ending = closingHeading ? `<h2>${closingHeading}</h2>\n` : '';
    return `<p class="article-lead">${intro}</p>\n${toc}\n${renderSections(sections)}\n<section>${ending}<p>${closing}</p></section>`;
}

export const tags = [
    { name: 'JavaScript', slug: 'javascript', color: '#F7DF1E', icon: 'JS', description: 'JavaScript 编程语言' },
    { name: 'TypeScript', slug: 'typescript', color: '#3178C6', icon: 'TS', description: 'TypeScript 编程语言' },
    { name: 'React', slug: 'react', color: '#61DAFB', icon: 'React', description: 'React 前端框架' },
    { name: 'Vue.js', slug: 'vue', color: '#42B883', icon: 'Vue', description: 'Vue.js 前端框架' },
    { name: 'Nuxt.js', slug: 'nuxtjs', color: '#00C58E', icon: 'Nuxt', description: 'Nuxt.js 通用框架' },
    { name: 'Next.js', slug: 'nextjs', color: '#000000', icon: 'Nextjs', description: 'Next.js 全栈框架' },
    { name: 'Node.js', slug: 'nodejs', color: '#339933', icon: 'Nodejs', description: 'Node.js 运行时环境' },
    { name: 'Python', slug: 'python', color: '#3776AB', icon: 'Python', description: 'Python 编程语言' },
    { name: 'Taro', slug: 'taro', color: '#0000C2', icon: 'Taro', description: 'Taro 跨端框架' },
    { name: 'DevOps', slug: 'devops', color: '#000000', icon: 'Server', description: '工程化、交付与部署' },
    { name: 'Puppeteer', slug: 'puppeteer', color: '#40B5A4', icon: 'Tool', description: 'Headless Chrome 自动化' },
    { name: 'CSS', slug: 'css', color: '#1572B6', icon: 'CSS', description: '样式与布局' }
];

export const techStack = [
    { name: 'React', icon: 'React', link: 'https://react.dev/', description: 'React Library' },
    { name: 'Vue', icon: 'Vue', link: 'https://vuejs.org/', description: 'Vue Framework' },
    { name: 'Next.js', icon: 'Nextjs', link: 'https://nextjs.org/', description: 'Next.js Framework' },
    { name: 'Nuxt', icon: 'Nuxt', link: 'https://nuxt.com/', description: 'Nuxt Framework' },
    { name: 'Node.js', icon: 'Nodejs', link: 'https://nodejs.org/', description: 'Node.js Runtime' },
    { name: 'Python', icon: 'Python', link: 'https://www.python.org/', description: 'Python Language' },
    { name: 'Docker', icon: 'Docker', link: 'https://www.docker.com/', description: 'Containerization' },
    { name: 'Taro', icon: 'Taro', link: 'https://taro-docs.jd.com/', description: 'Cross-platform Framework' }
];

const articleDrafts = [
    {
        id: 1,
        title: 'Taro 双端开发笔记：H5 好了，小程序呢？',
        description: '刚开始用 React + Taro 做业务，记一下页面返回、输入框和路由参数这些容易漏测的小问题。',
        icon: 'React',
        createdAt: '2021-08-18 19:23:00',
        updatedAt: '2021-08-18 22:16:00',
        publishedAt: '2021-08-18 22:16:00',
        tags: ['React', 'TypeScript', 'Taro'],
        tech: ['React', 'Taro'],
        content: renderArticle({
            intro: '工作一个多月了，最近写得最多的是 React 和 Taro。页面要给 H5 和微信小程序用，有些还会放进 App 里。刚开始我习惯先在浏览器里调好，觉得另一端应该差不多，结果小程序一跑，返回刷新、输入框、跳转参数都得再看一遍。先记下几件小事，免得下次又漏掉。',
            closingHeading: '下次提测前再翻一遍',
            sections: [
                {
                    heading: '同一个页面，两边到底差在哪',
                    paragraphs: [
                        '页面结构、接口类型、表单校验和大部分业务状态确实可以复用，这部分体验很好。尤其是已经熟悉 React 以后，写 <code>View</code>、<code>Text</code> 和普通组件的心智负担不大。',
                        '问题主要集中在宿主能力：登录信息从哪里来、跳转由谁控制、分享入口是否存在、页面重新显示时要不要刷新，以及静态资源最终放在哪里。同一个“返回”动作，在 H5 里可能是 history，在小程序里是页面栈，在 App WebView 里又可能要通知原生关闭容器。',
                        '目前最容易写乱的是跳转。一个按钮到底是打开小程序页面、换 H5 路由，还是让 App 打开原生页面，光看按钮本身看不出来。我准备先把这些调用放到单独的文件里，不着急做很完整的封装，能少复制几段判断就行。'
                    ]
                },
                {
                    heading: '开发时放在旁边的一张对照表',
                    paragraphs: ['下面这些差异，写页面前知道就不难，写完才发现就得回头找哪些地方受影响。先列在这里，不包含还没做过的其他小程序平台。'],
                    table: {
                        headers: ['内容', 'H5', '微信小程序', '我现在的处理'],
                        rows: [
                            ['页面结构', 'DOM 与浏览器布局', '小程序组件树', '尽量只用 Taro 基础组件'],
                            ['登录态', 'Cookie、URL 或接口', 'Storage、登录流程', '统一成 getSession()'],
                            ['导航', 'history / location', 'navigateTo / redirectTo', '封装 openPage()'],
                            ['生命周期', '首次加载、路由切换', 'onShow / onHide 更明显', '数据刷新依赖页面显示时机'],
                            ['样式', '浏览器兼容与键盘', 'rpx、组件默认样式', '公共样式之外保留端级覆盖'],
                            ['调试', 'Chrome DevTools', '微信开发者工具与真机', '至少做一次双端回归']
                        ]
                    },
                    note: 'Taro 官方文档也明确提供了 <code>process.env.TARO_ENV</code> 和 <code>Taro.getEnv()</code> 来处理无法抹平的差异。环境判断可以用，但最好集中管理，不要散落在每个页面。'
                },
                {
                    heading: '跳转先单独放一个函数',
                    paragraphs: [
                        '现在的封装还比较简单，核心目的不是做一个“万能跨端 SDK”，而是让页面里不要出现太多平台细节。比如业务只表达“打开详情页”，适配层再决定使用 Taro 路由还是浏览器地址。',
                        '这里暂时保留编译时环境判断，因为不同端的无效代码可以在构建时去掉。需要注意的是，环境变量要直接写成 <code>process.env.TARO_ENV</code>，不能先对 process.env 做解构。'
                    ],
                    code: `import Taro from '@tarojs/taro'

type PageTarget = {
  path: string
  query?: Record<string, string>
}

export function openPage({ path, query = {} }: PageTarget) {
  const search = Object.keys(query)
    .map((key) => \`\${encodeURIComponent(key)}=\${encodeURIComponent(query[key])}\`)
    .join('&')
  const url = search ? \`\${path}?\${search}\` : path

  if (process.env.TARO_ENV === 'weapp') {
    return Taro.navigateTo({ url })
  }

  window.location.assign(url)
}

export function isWeapp() {
  return process.env.TARO_ENV === 'weapp'
}`
                },
                {
                    heading: '返回以后，列表还是旧的',
                    paragraphs: [
                        '第一个问题是页面显示时机。H5 页面第一次挂载后通常不会反复触发同一种生命周期，但小程序从下一级页面返回时会再次触发 onShow。如果请求只写在首次挂载里，返回后数据可能还是旧的；如果所有请求都放在 onShow，又会产生重复请求。',
                        '第二个问题是滚动和输入框。H5 里软键盘弹起后，视口高度和滚动位置会变化；小程序里的 ScrollView 又有自己的滚动容器。只在开发者工具里看起来正常还不够，真机上的键盘、长列表和底部按钮必须单独测。',
                        '第三个问题是资源路径。H5 可以按网页资源理解，小程序还要考虑包体积和分包。图片随手塞进主包的做法，在页面少时没有感觉，项目继续增长后会很难处理。',
                        '拿列表进详情再返回这个操作来说，详情里如果只是查看，列表原样保留其实挺好；如果在详情里修改了状态，返回后就该刷新。我现在倾向于先按业务区分这两种情况，而不是看到 onShow 就把所有接口都调一遍。否则列表会重新加载，滚动位置也可能跟着跳，用户找刚才那一项反而更费劲。',
                        '还有个测试时容易忽略的地方：别每次都从首页点进去。复制链接打开 H5、从分享卡片进入小程序，拿到的参数可能跟站内跳转不一样。带中文、空格、& 的标题尤其值得试一下。上面拼 query 的代码做编码，就是为了避免参数在这些地方被拆开；目标页面拿到参数以后也还要检查必填值，不能默认它一定有。'
                    ],
                    items: [
                        '页面恢复后数据是否需要重新请求。',
                        '接口失败时 Loading 是否一定会关闭。',
                        '长列表、键盘弹起和底部安全区是否正常。',
                        '分享进入、扫码进入和普通点击进入的参数是否一致。',
                        '真机与开发者工具表现是否一致。'
                    ]
                },
                {
                    heading: '别一报错就同时改两边',
                    paragraphs: [
                        '如果两边都拿不到数据，我会先看接口和入参；如果只有一边不对，再看生命周期或者组件差异。这个顺序看着很普通，但比一边改样式一边改请求靠谱。还有，模拟器里点一下输入框不算测过键盘，真机必须补一轮。'
                    ],
                    steps: [
                        '先确认问题属于业务数据、组件状态，还是某一个宿主环境。',
                        '在 H5 和小程序分别打印入口参数、当前路由和登录态来源。',
                        '把平台判断移动到适配层，用相同输入单独验证返回结果。',
                        '开发者工具通过后再上真机，重点检查键盘、滚动、返回和弱网。',
                        '最后重新跑另一端，避免修复某一端时破坏公共逻辑。'
                    ]
                },
                {
                    heading: '这层封装先做到这里',
                    paragraphs: [
                        '目前项目里的适配层只是收口常用能力，还没有形成非常稳定的设计。哪些逻辑应该成为公共方法，哪些应该留在业务页面，我还在边做边调整。抽象得太早会让简单需求变复杂，完全不抽又会快速复制代码。',
                        '另外，Taro 组件在不同端最终对应的实现并不一样。看到类型一致、API 名称一致，不能直接推导出表现也完全一致。后面准备把常见能力做成一张兼容表，至少让下一次遇到相同问题时不用重新猜。'
                    ],
                    note: '这篇只记录目前真实做过的 H5 与微信小程序场景。其他小程序平台和 React Native 还没有实际项目经验，先不展开。'
                }
            ],
            closing: '暂时记这些。页面样式对了以后，还得拿手机走一遍“进入—操作—返回—再进入”，尤其别漏掉分享入口。App 里那套登录信息怎么拿，我还得单独捋一下，跟普通浏览器确实不一样。'
        })
    },
    {
        id: 2,
        title: 'App 里的 H5，先等登录信息再发请求',
        description: '首屏 401、Bridge 回调和返回按钮放在一起记。普通浏览器能跑通，还不能说明 WebView 里没问题。',
        icon: 'smartphone',
        createdAt: '2021-09-26 16:48:00',
        updatedAt: '2021-09-26 23:07:00',
        publishedAt: '2021-09-26 22:42:00',
        tags: ['JavaScript', 'React'],
        tech: ['React'],
        content: renderArticle({
            intro: '接着上次的多端笔记，这篇只说 App 里的 H5。做这部分时不能完全照搬普通网页的登录流程：页面归前端写，登录信息却要从客户端拿，中间还隔着一个 Bridge。假如首屏接口已经发出去，Token 才回来，页面就会先吃一个 401。后面即使拿到了登录信息，前面那次请求也不会自己重来。',
            closingHeading: false,
            sections: [
                {
                    heading: '先别急着重试接口',
                    paragraphs: [
                        '原来的逻辑在 React 页面挂载后立刻读取本地 Token 并请求接口。普通 H5 登录后已经有缓存，所以没问题；App WebView 里的 Token 由客户端通过 Bridge 传入，注入时间会受到 WebView 创建、页面加载和客户端逻辑影响。',
                        '这类现象很容易被误判成接口偶发失败。刷新后能用，也不能说明接口修好了：刷新可能只是让本地已经有了上次拿到的 Token。排查时我会把页面启动、Bridge 可调用、登录信息返回、业务请求发出这几个时间分别记下来，只记阶段和时间，不打印 Token。',
                        '如果日志显示业务请求排在登录信息前面，就先改初始化顺序。用 setTimeout 等半秒看起来省事，但半秒够不够，取决于设备和客户端当时在干什么。我更愿意让请求等一个明确结果，超时以后展示重新加载，至少不用让用户一直盯着转圈。'
                    ]
                },
                {
                    heading: 'H5 和客户端先约好这几个步骤',
                    paragraphs: ['把时序写出来以后，前端和客户端讨论起来会清楚很多。目前约定的初始化顺序如下：'],
                    steps: [
                        'WebView 开始加载受信任的 H5 地址，客户端准备注入 Bridge。',
                        'H5 注册 Bridge Ready 监听和超时保护，不立即请求用户接口。',
                        'Bridge 可用后，H5 主动调用 getSession 获取 Token、用户标识和 App 版本。',
                        '前端校验返回结构，把登录态写入请求层，而不是直接暴露给所有组件。',
                        '初始化状态切换为 ready，React 页面再开始加载业务数据。',
                        '普通浏览器访问时走 Web 端登录态；等待超时则进入可恢复的错误状态。'
                    ],
                    note: '这里的“准备完成”必须由一次明确回调或 Promise 表示，不能用固定等待 300ms、500ms 来猜。不同手机、冷启动和 App 版本都会让固定延时失效。'
                },
                {
                    heading: '把回调包成 Promise',
                    paragraphs: [
                        '项目里的 Bridge 调用原本散落在不同页面：有的直接访问 window 上的对象，有的监听 ready 事件，还有的在浏览器环境里直接报错。我先做了一个很薄的调用层，统一处理“能力不存在、调用超时、原生返回格式不一致”这三类问题。',
                        '下面只演示“Bridge 已经注入以后怎么调用”，不包含等待 Bridge Ready 的实现。各家客户端注入的方法名和回调格式不一样，不能直接复制进项目就期待能通。另外，最后的 as T 只是类型声明，getSession 拿到结果后还得检查 token 是否真的是字符串。',
                        '这里还有两种容易漏掉的失败：原生一直不回调，以及调用函数本身同步抛错。前者要靠超时结束等待，后者要 catch。Promise 虽然只会确定一次结果，但注册在全局的回调和事件监听仍然要按具体 Bridge 协议清理；包上一层 Promise 不会自动替我们清理它们。'
                    ],
                    code: `type BridgeResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string }

type NativeBridge = {
  callHandler(
    name: string,
    payload: unknown,
    callback: (result: unknown) => void
  ): void
}

declare global {
  interface Window {
    WebViewJavascriptBridge?: NativeBridge
  }
}

export function callNative<T>(
  name: string,
  payload: unknown = {},
  timeout = 5000
): Promise<BridgeResult<T>> {
  return new Promise((resolve) => {
    const bridge = window.WebViewJavascriptBridge

    if (!bridge) {
      resolve({ ok: false, message: '当前环境不支持该能力' })
      return
    }

    const timer = window.setTimeout(() => {
      resolve({ ok: false, message: '客户端响应超时' })
    }, timeout)

    try {
      bridge.callHandler(name, payload, (result) => {
        window.clearTimeout(timer)
        resolve({ ok: true, data: result as T })
      })
    } catch {
      window.clearTimeout(timer)
      resolve({ ok: false, message: '客户端调用失败' })
    }
  })
}`
                },
                {
                    heading: '联调前，我会先填这张表',
                    paragraphs: [
                        '方法名只是示意，关键是把传什么、返回什么、失败后怎么办写出来。比如 share 的“取消”通常不该弹失败提示，closePage 也未必有回调。不能因为前端封装喜欢统一，就假装客户端已经支持同一套格式。'
                    ],
                    table: {
                        headers: ['能力', 'H5 传入', '客户端返回', '失败时怎么做'],
                        rows: [
                            ['getSession', '空对象', 'token、userId、appVersion', '提示重新登录或退出页面'],
                            ['openPage', 'path、params', '是否成功', '降级为 H5 路由'],
                            ['closePage', '可选结果', '无', '浏览器环境执行 history.back'],
                            ['setTitle', 'title', '是否成功', '保留网页 title'],
                            ['share', '标题、描述、链接', '取消或成功', '隐藏 App 专属入口']
                        ]
                    },
                    items: [
                        '所有方法都返回统一的成功或失败结构。',
                        '客户端版本不支持时返回明确错误，不要静默不回调。',
                        'H5 传入的数据先校验，不能把任意 URL 直接交给客户端打开。',
                        '敏感能力只允许受信任域名中的页面调用。'
                    ]
                },
                {
                    heading: '点返回，是退路由还是关 WebView？',
                    paragraphs: [
                        '一个页面里可能同时存在三层历史：App 原生页面栈、当前 WebView 容器，以及 H5 自己的前端路由。产品说“点击返回”时，需要先确认到底要退哪一层。',
                        '目前的规则是：H5 内部确实有上一条业务路由时先退 H5；作为 App 入口打开、没有可退路由时通知客户端关闭 WebView；普通浏览器访问则使用 history。登录失效等特殊场景不按历史返回，而是走约定的登录或关闭流程。',
                        '不能只看 <code>history.length</code>。新打开的 WebView 里也可能存在非业务历史，盲目 back 会出现空白页或者回到中间跳转页。需要结合客户端给的进入方式、H5 自己有没有发生过路由跳转来决定。',
                        '我会把“App 直接打开详情”和“App 打开列表，再点进详情”分开测。页面长得一样，返回行为应该不一样。再加上登录页用了 push 还是 replace，整个返回栈又会变，所以这块不能只测页面上的那个箭头，还要按一下 Android 的返回键。'
                    ]
                },
                {
                    heading: '没回调的时候，也得让页面能退出',
                    paragraphs: [
                        'JSBridge 能调用原生能力，权限比普通网页大，所以不能只考虑“能不能调用成功”。哪怕目前只是公司 App 内的页面，也应该限制 WebView 可加载域名、避免任意外链继续持有 Bridge，并对方法参数做校验。',
                        '前端这边能做的是减少暴露面：不在 URL 中携带 Token，不把完整用户数据挂到 window，不记录敏感字段；打开外链前校验协议和域名；页面销毁后不再处理过期回调。客户端侧的域名白名单和能力权限仍然需要一起配合。'
                    ],
                    table: {
                        headers: ['异常场景', '页面表现', '记录信息'],
                        rows: [
                            ['Bridge 未注入', '展示浏览器降级或环境提示', 'UA、入口、App 版本'],
                            ['方法不存在', '提示升级 App', '方法名、当前版本'],
                            ['调用超时', '允许重试，结束 Loading', '耗时、页面路由'],
                            ['Token 无效', '统一进入登录流程', '接口状态，不记录 Token'],
                            ['重复回调', '只接受第一次结果', '调用 ID 与方法名']
                        ]
                    },
                    note: '我目前只是负责 H5 侧的封装和联调，并不是在设计完整的原生 WebView 安全架构。域名校验、Bridge 注入范围等能力需要客户端同学共同完成。'
                }
            ],
            closing:
                '目前我先把登录初始化和返回行为弄清楚。其他原生能力还是用到一个联调一个。遇到只在 App 里出现的问题，先拿真机把操作顺序和日志留全，再拉客户端一起看；只给一张“页面报错了”的截图，双方都不好查。'
        })
    },
    {
        id: 3,
        title: '给旧页面补类型，才看到自己写了多少 any',
        description: '从一个没有字段提示的接口返回值开始，整理请求泛型、unknown，以及几处暂时改不动的 any。',
        icon: 'TS',
        createdAt: '2021-10-17 14:36:00',
        updatedAt: '2021-10-17 21:28:00',
        publishedAt: '2021-10-17 21:12:00',
        tags: ['TypeScript'],
        tech: ['React'],
        content: renderArticle({
            intro: '写 any 的时候一般都想的是先把需求做完，过两天再补。问题是过两天有新的需求，旧的也就留在那里了。最近回头看页面里的接口类型，发现有些文件虽然叫 .tsx，写起来跟 JavaScript 没太大区别：字段没有提示，传错参数也不报错，最后还是去翻接口文档。',
            closingHeading: '先改经常要碰的地方',
            sections: [
                {
                    heading: '从接口返回值开始找',
                    paragraphs: [
                        '以前觉得 any 只是少写一个类型，不会影响其他代码。实际情况是，只要接口层返回 any，后面所有属性访问都会被默认放行。字段拼错、把字符串当数字、对可能为空的数据直接调用方法，编辑器都不会再提醒。',
                        '更麻烦的是这种影响会继续传给组件。父组件把 any 传给列表，列表再把 any 传给行组件，最后整个调用链看上去都没有报错，但 TypeScript 在这一段实际上已经停止工作。',
                        '我在项目里搜了一遍，any 主要不是出现在简单变量上，而是集中在数据入口和公共封装。这也说明问题不能靠给每个局部变量手工补类型解决。'
                    ],
                    items: [
                        '后端响应没有稳定结构，前端直接把 data 标成 any。',
                        '公共请求方法只返回一个宽泛对象，业务层失去推导。',
                        '复杂表格和动态表单为了赶进度，把行数据全部声明成 any。',
                        '旧 JavaScript 模块迁移时只解决编译错误，没有补领域类型。',
                        '第三方库没有现成声明，为了继续开发直接断言成 any。'
                    ]
                },
                {
                    heading: 'catch 里的 error 怎么也开始报错了',
                    paragraphs: [
                        '最近看到 TypeScript 4.4 把 strict 模式下 catch 变量默认改成 unknown，才比较直观地理解两者的区别：any 是“先相信我，别检查了”，unknown 是“我现在不知道，使用前必须确认”。',
                        '接口原始响应、JSON.parse 的结果、Bridge 回调和 catch 到的错误，本来就属于外部输入。把它们写成 unknown 更符合事实，因为静态类型并不能证明运行时数据一定按接口文档返回。'
                    ],
                    table: {
                        headers: ['类型', '能接收什么', '能否直接访问属性', '适合场景'],
                        rows: [
                            ['any', '任意值', '可以，编译器不再检查', '明确知道风险的临时兼容'],
                            ['unknown', '任意值', '不可以，需要先缩小类型', '接口原始值、异常、外部消息'],
                            ['具体类型', '满足类型约束的值', '可以，并有完整提示', '进入业务逻辑后的数据']
                        ]
                    },
                    note: '对应的选项叫 useUnknownInCatchVariables，可以查 <a href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-4.html" target="_blank" rel="noopener noreferrer">TypeScript 4.4 更新说明</a>。它被 strict 包含，不是所有项目升级后都会无条件开启。'
                },
                {
                    heading: 'request 后面这个尖括号能解决多少问题',
                    paragraphs: [
                        '这次没有尝试一次清空整个项目的 any，而是先改公共请求方法。调用接口时由业务侧传入数据类型，请求层统一返回 <code>ApiResult&lt;T&gt;</code>。这样列表页面至少能知道 data 是什么，字段改名也能沿着引用找到。',
                        '但这里容易产生一个误会：写了 <code>request&lt;Course[]&gt;</code>，接口就一定会返回课程数组吗？不会。这个泛型只负责调用处的类型提示，response.json() 返回的实际内容并没有被检查。下面先把这两件事分开，别因为编辑器不报错就跳过数据校验。'
                    ],
                    code: `type ApiResult<T> = {
  code: number
  message: string
  data: T
}

type Course = {
  id: number
  title: string
  status: 'draft' | 'online'
}

async function request<T>(url: string): Promise<ApiResult<T>> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(\`Request failed: \${response.status}\`)
  }

  return response.json()
}

const result = await request<Course[]>('/api/courses')
const first = result.data[0]
if (first) console.log(first.title) // 数组也可能为空`
                },
                {
                    heading: '接口真返回了 null，类型救不了',
                    paragraphs: [
                        '只写 interface 并不会校验接口数据。<code>response.json() as User</code> 只是告诉编译器“把它当成 User”，如果后端返回了 null，运行时照样报错。对于登录信息、路由参数这类关键数据，我开始补最小的运行时判断。',
                        '目前没有引入额外校验库，先写简单的类型守卫。它不一定覆盖所有业务规则，但至少能确保后续代码依赖的字段真实存在。'
                    ],
                    code: `type User = {
  id: string
  name: string
}

function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const user = value as Record<string, unknown>
  return typeof user.id === 'string' && typeof user.name === 'string'
}

function readUser(value: unknown): User | null {
  return isUser(value) ? value : null
}`
                },
                {
                    heading: '一页一页改，比一次开满规则现实',
                    paragraphs: ['any 已经很多的项目不适合一上来就追求清零，否则很可能为了通过编译写出更多断言。我准备按影响范围处理：'],
                    steps: [
                        '新接口必须声明请求参数和响应数据，不再从入口制造新的 any。',
                        '公共函数不能返回 any；暂时无法确定的数据先返回 unknown。',
                        '组件 Props 和公共状态优先补齐，让跨模块调用重新获得提示。',
                        '修改旧模块时顺手收紧相关类型，不为了数字好看一次改完所有文件。',
                        '确实需要 any 时写清原因和影响范围，避免它继续向外传递。'
                    ],
                    note: 'TypeScript 只能检查声明与代码是否一致，不能替代运行时校验。接口、Storage、URL 和 Bridge 返回的数据，仍然需要在边界上判断。'
                },
                {
                    heading: '有些 any 暂时还得留着',
                    paragraphs: [
                        '第三方库缺少类型、动态表单字段非常开放、旧模块短期不会再修改，这些位置仍然可能保留 any。我不想为了形式上的“零 any”堆很多不可靠的 as 断言，那只是把问题换一种写法隐藏起来。',
                        '比如一个表格展示课程数据，我至少可以把行对象写成 Course，让点击事件知道拿到的是哪一行。至于表格库内部复杂的泛型参数，如果暂时没弄懂，就把兼容放在那个调用点旁边。不要为了省这一个地方的事，让整张表、详情页、编辑表单都继续接收 any。',
                        '我也不打算给每个能推导出来的变量再补一次注解。const loading = false 已经很清楚，真正值得花时间的是接口里的可空字段、组件传参，以及状态到底能取哪几个值。这些地方补好以后，改需求时确实少翻几次文件。'
                    ],
                    code: `type LoadState =
  | { status: 'loading' }
  | { status: 'success'; data: Course[] }
  | { status: 'error'; message: string }

function getCount(state: LoadState) {
  if (state.status !== 'success') return 0
  return state.data.length
}`,
                    note: '这是拿加载状态做的小练习，不是说所有页面都要改成联合类型。只有几个状态之间容易互相矛盾时，这么写才比较划算。'
                }
            ],
            closing:
                '先从最近正在改的接口和组件 Props 开始。碰到实在说不清的类型，我会多看一眼它实际传的是什么，不急着补 as。项目里剩下的 any 还不少，这篇也不算整改完成记录，算是提醒自己别再把“以后补”当成已经补了。'
        })
    },
    {
        id: 4,
        title: 'React 项目接入 Sentry 的几处配置',
        description: '一次基础错误采集的接入笔记，主要记环境、Release 和 Source Map。性能监控还没做。',
        icon: 'search',
        createdAt: '2021-11-21 13:54:00',
        updatedAt: '2021-11-21 22:03:00',
        publishedAt: '2021-11-21 21:47:00',
        tags: ['JavaScript', 'DevOps'],
        tech: ['React'],
        content: renderArticle({
            intro: '最近给 React 项目接了 Sentry，主要用来收前端异常。初始化代码没几行，反而是几个配置名容易记混：DSN、上传用的 Token、environment、release，看文档时都懂，放进构建脚本又得翻一遍。把它们各自干什么记一下，后面换项目接入也能少查一点。',
            closingHeading: false,
            sections: [
                {
                    heading: '先在测试环境收到一条错误',
                    paragraphs: [
                        'Sentry 的初始化并不复杂，DSN 也不是需要藏在服务端的密码，它用来告诉 SDK 把事件发到哪个项目。真正需要保密的是上传 Source Map 使用的 Auth Token，那个不能打进前端产物。',
                        '项目里没有在本地开发环境开启上报，否则每次故意制造错误、热更新失败都会进入后台。测试和生产使用同一个项目时，也必须通过 environment 区分。'
                    ],
                    code: `import * as Sentry from '@sentry/react'

const environment = process.env.REACT_APP_ENV || 'development'
const release = process.env.REACT_APP_RELEASE

if (environment !== 'development') {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment,
    release,
    sampleRate: 1
  })
}`,
                    note: '这次只接错误采集，没有把性能追踪和链路监控一起打开。第一次接入先把异常定位流程跑通，避免一次加入太多无法判断价值的配置。'
                },
                {
                    heading: '怎么确认收到的是刚才那次测试',
                    paragraphs: [
                        '只看后台出现一个 Issue 不能证明配置完全正确。我在测试页面放了一个临时按钮，点击后抛出带固定文本的错误，然后分别检查测试环境、生产构建和不同路由。',
                        '验证时还要看事件里是否有页面 URL、浏览器信息、环境和 Release。错误能上报但这些字段为空，后面定位时仍然要靠猜。临时测试入口验证完必须删除，不能把制造错误的按钮带到正式页面。'
                    ],
                    steps: [
                        '在测试环境主动抛出带唯一标识的 Error。',
                        '确认后台收到的 environment 与当前环境一致。',
                        '确认 release 与本次构建使用同一个版本号。',
                        '检查压缩堆栈能否通过 Source Map 还原到源码。',
                        '补充必要上下文，再测试一次未处理的 Promise 异常。',
                        '删除临时测试代码，记录接入和发布步骤。'
                    ]
                },
                {
                    heading: '后台只有压缩后的一行代码',
                    paragraphs: [
                        '生产代码压缩后，错误位置可能只剩某个 js 文件第一行的列号。Source Map 能把它映射回原始 TypeScript/React 文件，但前提是“浏览器上报事件使用的 Release”和“构建时上传 Source Map 使用的 Release”完全一致。',
                        '我先按 Release 关联的方式理解这件事：浏览器上报的版本号和上传文件的版本号要一致，文件路径也得能匹配上。版本对了仍然还原不出来，就继续核对事件里的脚本 URL、上传路径和部署路径，而不是反复上传同一份 map。',
                        '还有个顺序问题：最好先完成上传，再放出这个版本的页面。验证时要重新触发一条错误，别一直盯着上传之前收到的旧事件看。测试构建和正式构建也不能混用，源码看着一样，压缩后的文件未必一样。',
                        'Source Map 上传成功后不需要跟随静态资源公开部署。上传 Token 只放在构建环境里，不能写进仓库或以 REACT_APP_ 前缀暴露到客户端。'
                    ],
                    table: {
                        headers: ['配置', 'SDK 初始化', '构建/上传阶段', '作用'],
                        rows: [
                            ['DSN', '需要', '不需要', '确定事件发送项目'],
                            ['environment', '需要', '可作为部署信息', '区分测试与生产'],
                            ['release', '需要', '必须保持一致', '关联事件与源码'],
                            ['Auth Token', '禁止放入前端', '需要', '授权上传 Source Map'],
                            ['Source Map', '不打进运行逻辑', '构建后上传', '还原压缩堆栈']
                        ]
                    }
                },
                {
                    heading: '只加几个排查时真会用的字段',
                    paragraphs: [
                        '默认错误能告诉我浏览器和页面地址，但业务问题通常还需要知道当前路由、功能模块和登录状态。项目里补充了匿名用户标识、应用版本和少量标签，方便判断错误是不是集中在某个入口。',
                        '这里没有上传姓名、手机号、Token、完整请求参数等敏感内容。接口错误也只记录状态码、接口标识和必要字段。监控平台是排错工具，不应该顺手变成另一个用户数据仓库。'
                    ],
                    code: `Sentry.setUser({
  id: user.id // 使用内部匿名标识，不上传手机号和 Token
})

Sentry.setTags({
  page: 'course-detail',
  container: isApp ? 'app-webview' : 'browser'
})

Sentry.setContext('request', {
  api: 'get-course-detail',
  status: response.status
})`
                },
                {
                    heading: '这些错误要不要都提醒',
                    paragraphs: [
                        '后台很快出现一些并不属于业务代码的问题：浏览器插件注入脚本、用户主动取消请求、网络切换和已经知道的兼容错误。如果每一条都发群通知，几天后大家就不会再认真看。',
                        '我暂时没有做复杂告警配置。先看是不是新版本才有、是否影响登录和表单提交，再看次数。过滤也不急着一次写很多，尤其不能把所有网络失败都忽略：接口真的出问题时，它们恰好是有用的线索。'
                    ],
                    table: {
                        headers: ['事件类型', '当前处理', '原因'],
                        rows: [
                            ['主流程未捕获异常', '保留并关注', '直接影响用户完成任务'],
                            ['新版本集中出现', '优先排查', '可能是本次发布引入'],
                            ['请求主动取消', '过滤或降低优先级', '通常不是代码异常'],
                            ['浏览器插件脚本', '按来源过滤', '不属于项目代码'],
                            ['重复相同错误', '聚合观察次数', '避免重复告警']
                        ]
                    }
                },
                {
                    heading: '暂时只接错误采集',
                    paragraphs: [
                        '这次主要做 SDK 接入和基础配置。我会用一个普通 JS 异常、一个 Promise 异常分别验证，并在打包后的页面上确认堆栈能不能用。没有做压测，也没有一套覆盖所有错误的测试，这部分先如实记在这里。',
                        '性能指标、前后端链路追踪、业务成功率、统一告警值班和完整监控大盘都没有做。我对 Sentry 的使用也还停留在基础阶段，所以这篇只叫接入记录，不把它写成监控体系建设。'
                    ],
                    note: '后面如果错误量继续增加，需要再讨论采样、告警阈值、负责人和问题关闭规则。工具接入完成，不代表监控工作自动运转起来。'
                }
            ],
            closing:
                '以后发版要顺手确认一下 release 有没有更新、map 有没有上传。接入这一次不难，容易忘的是后面的构建变了，相关配置也得跟着检查。至于性能追踪那些选项，等真有排查需求再研究，先不为了配置齐全全部打开。'
        })
    },
    {
        id: 5,
        title: '接触内部 React 组件库的一些笔记',
        description: '从业务里抽一个按钮出来，要去掉什么依赖？顺便记下 Rollup、类型声明和打包验证。',
        icon: 'React',
        createdAt: '2021-12-12 15:11:00',
        updatedAt: '2021-12-12 22:34:00',
        publishedAt: '2021-12-12 22:08:00',
        tags: ['React', 'TypeScript'],
        tech: ['React'],
        content: renderArticle({
            intro: '公司有一套 React + Rollup 的内部组件库，最近用的时候顺便看了一些实现。以前在业务里抽组件，默认它和页面在同一个项目，样式、请求、状态都能顺手拿。放到独立的包里以后，这些“顺手”反而要挨个检查。下面拿操作按钮做个简化例子，再记一点我刚弄明白的打包配置。',
            closingHeading: '打包以后再装一次',
            sections: [
                {
                    heading: '这个按钮为什么离不开原来的页面',
                    paragraphs: [
                        '假设页面里有一个提交按钮，它会读取登录信息、判断权限、调用固定接口，再弹“报名成功”。在这个页面里很方便，换到别的项目就很奇怪：只想用一个按钮，却得先提供整套登录和报名逻辑。',
                        '最后只保留稳定的交互和视觉：加载中、防重复点击、禁用状态、尺寸和点击事件。登录、权限和请求继续留在业务层，由页面决定什么时候 disabled、点击后执行什么。',
                        '这样一来，按钮本身不知道“报名”是什么。使用方要写的代码多一点，但想改请求、换提示文案时，不需要为了一个页面去发布整个组件库。'
                    ]
                },
                {
                    heading: '搬过去之前看这几处',
                    paragraphs: ['我把这次改动前后关注的内容列了一下。页面组件更关心当前需求是否完成，组件库还要考虑未知使用方和未来版本。'],
                    table: {
                        headers: ['关注点', '业务页面里的组件', '组件库里的组件'],
                        rows: [
                            ['数据来源', '可以读取当前页面状态', '通过 Props 和回调传入'],
                            ['样式', '允许依赖页面上下文', '避免选择器泄漏，提供有限扩展'],
                            ['文案', '可以直接写业务提示', '默认通用，也允许调用方传入'],
                            ['类型', '满足当前调用即可', '需要导出完整 Props 类型'],
                            ['错误处理', '页面知道怎么提示', '不吞错误，交给调用方决定'],
                            ['升级', '跟随当前项目发布', '要考虑多个项目和旧版本']
                        ]
                    }
                },
                {
                    heading: '要不要再加一个布尔参数',
                    paragraphs: [
                        '加载、禁用、二次确认、成功后自动关闭……每个需求看起来都只是多一个参数，放在一起却会出现很多组合。尤其是“自动 Loading”，究竟由按钮等待 Promise，还是由页面控制状态，要先选一种，否则两边可能互相覆盖。',
                        '下面这个例子就完全交给页面控制 status。它不会自己捕获业务请求，也不会自动弹消息。children 放按钮内容，onClick 只是通知调用方；页面负责在请求开始和结束时更新状态。这个版本功能少，但是读起来比较直接。'
                    ],
                    code: `export type ActionButtonProps = {
  children: React.ReactNode
  status?: 'idle' | 'loading' | 'disabled'
  size?: 'small' | 'middle' | 'large'
  onClick?: () => void | Promise<void>
}

export function ActionButton({
  children,
  status = 'idle',
  size = 'middle',
  onClick
}: ActionButtonProps) {
  const disabled = status !== 'idle'

  return (
    <button
      type="button"
      className={\`action-button action-button--\${size}\`}
      disabled={disabled}
      onClick={onClick}
    >
      {status === 'loading' ? '处理中…' : children}
    </button>
  )
}`
                },
                {
                    heading: 'React 为什么要放在 external 里',
                    paragraphs: [
                        '组件写完以后还要让不同项目正确安装。内部库使用 Rollup 输出构建产物，我这次主要理解了入口、模块格式、TypeScript 声明和 external。',
                        'React 不能被每个组件库再打包一份，否则使用项目可能出现体积重复，甚至因为存在两份 React 导致 Hook 异常。所以 React 放在 peerDependencies，并在 Rollup 中标记 external，由最终应用提供。',
                        '库同时输出 ES Module 和 CommonJS，是为了兼容不同项目的构建方式。是否真的需要所有格式要看内部项目情况，但 package.json 的 main、module 和 types 必须指向实际存在的文件。'
                    ],
                    code: `import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/index.ts',
  output: [
    { file: 'dist/index.js', format: 'cjs', sourcemap: true },
    { file: 'dist/index.esm.js', format: 'esm', sourcemap: true }
  ],
  external: ['react', 'react-dom'],
  plugins: [
    peerDepsExternal(),
    typescript({ useTsconfigDeclarationDir: true })
  ]
}`
                },
                {
                    heading: 'JS 能导入，样式不一定跟得进来',
                    paragraphs: [
                        '组件库入口通常会统一导出组件，使用方写 <code>import { Button } from ...</code>。最终没有使用的组件能否从应用产物中删除，还取决于库是不是保留 ES Module、代码有没有副作用，以及使用项目的构建器是否正确做 tree shaking。',
                        '样式尤其容易带来副作用。组件内部直接导入一份全局 CSS 时，即使 JavaScript 组件没有使用，构建器也可能为了保留样式而无法完全删除模块。这部分我还没有彻底解决，只先确认现有项目的引入方式和产物大小没有异常。',
                        '反过来也会有“组件出来了，样式没了”的情况。示例站可能在入口手动引了样式，实际安装包的项目却没有。检查时要从用户的 import 开始看，别因为库里的 Demo 正常就只怀疑业务项目。',
                        '类型文件也类似。源码里的 Props 写全了，不代表 npm 包里一定带着 .d.ts。构建完我会直接打开 dist，再看 package.json 里的 types 指到哪里。如果输出路径没对上，别人安装以后一样得不到类型提示。'
                    ],
                    note: '我参与的是现有内部组件库的使用和局部补充，没有从零搭建整套发布体系，也没有负责设计系统。Rollup 配置是在现有方案上理解和调整。'
                },
                {
                    heading: '给下一个使用者留个最小例子',
                    paragraphs: [
                        '组件在本地 Demo 里能运行，不代表其他人知道怎么用。至少要写清 Props、默认值、常见组合和不支持的场景。只有类型没有示例时，使用方还是需要打开源码猜设计意图。',
                        '验证打包时，我会优先试本地打出来的包。link 很方便，不过它看到的文件和真正发布出去的文件可能不一样。下面这几步先留作检查项，尤其别漏掉“安装后不读源码也能用起来”这一条。'
                    ],
                    steps: [
                        '在组件库 Demo 中验证默认状态、禁用和 Loading。',
                        '执行构建，检查 JS、样式和 .d.ts 是否生成。',
                        '在消费项目中安装本地构建包，而不是只看源码。',
                        '分别测试直接导入和入口导入，观察构建是否报错。',
                        '记录变更内容和兼容性，再发布内部版本。'
                    ]
                }
            ],
            closing: '目前还只是接触和补一些公共组件，离自己搭一整套库还早。下次再抽组件，我准备先找第二个真实用法试一下：如果只能靠不断加参数才能接进去，就先别急着往公共库放。'
        })
    },
    {
        id: 6,
        title: '2021 年终总结（提纲）：从学校到第一份前端工作',
        description: '2021 年 12 月 31 日留下的待写提纲：只整理真实时间线和问题，感受与选择留给自己补充。',
        icon: 'coffee',
        createdAt: '2021-12-31 20:37:00',
        updatedAt: '2021-12-31 23:18:00',
        publishedAt: '2021-12-31 23:18:00',
        tags: ['JavaScript'],
        tech: [],
        content: renderArticle({
            intro: '今天是 2021 年最后一天。本来想完整写一次年终总结，但很多感受还没有整理清楚，硬写很容易变成几句正确但不属于自己的话。先把今年确定发生过的节点和想回答的问题列下来，等以后愿意认真写时，再把方括号里的内容补齐。',
            sections: [
                {
                    heading: '今年可以确定的时间线',
                    table: {
                        headers: ['时间', '发生的事情', '可以继续补充'],
                        rows: [
                            ['2021 年 7 月', '开始第一份正式工作', '入职第一周最不适应的事情'],
                            ['2021 年 8 月', '使用 React、Taro、TypeScript 做 H5 和小程序', '第一个独立完成的页面'],
                            ['2021 年 9 月', '接触 App 内嵌 H5 和 JSBridge 联调', '印象最深的一次问题排查'],
                            ['2021 年 10 月', '开始注意项目中的 any 和类型边界', '一次类型真正避免问题的经历'],
                            ['2021 年 11 月', '参与 Sentry 基础接入', '第一次看到线上错误时的感受'],
                            ['2021 年 12 月', '接触 React + Rollup 内部组件库', '对公共组件理解发生的变化']
                        ]
                    },
                    note: '这里先只写事实，不把后来的经验塞回 2021 年。具体项目名、公司内部信息和个人联系方式不写进公开文章。'
                },
                {
                    heading: '第一部分：从学生变成开发者',
                    paragraphs: ['这一部分需要补的不是简历，而是身份变化。准备从下面几个问题开始写：'],
                    items: [
                        '为什么毕业后选择前端，而不是通信工程相关方向？',
                        '从毕业到 2021 年 7 月入职，中间经历了什么？',
                        '第一周最怕做错的事情是什么？',
                        '第一次提交代码、联调和上线分别是什么感受？',
                        '学校里的学习方式，哪些到了工作里不再适用？'
                    ]
                },
                {
                    heading: '第二部分：这一年真正用过的技术',
                    paragraphs: ['不按技术名词罗列，准备各选一个真实场景来写。'],
                    table: {
                        headers: ['主题', '准备写的场景', '避免写成什么'],
                        rows: [
                            ['React', '第一次把页面拆成组件', 'React 知识点大全'],
                            ['Taro', '同一需求运行在 H5 和小程序', '“一套代码完美跨端”'],
                            ['TypeScript', 'any 从接口层扩散', '假装已经完全类型安全'],
                            ['Hybrid', 'Token 注入晚于首屏请求', '没有参与的原生实现'],
                            ['Sentry', '从用户反馈到可定位错误', '完整监控体系'],
                            ['组件库', '参与使用和补充组件', '从零主导设计系统']
                        ]
                    }
                },
                {
                    heading: '第三部分：工作方式发生了什么变化',
                    items: [
                        '现在怎么理解“需求做完”和“需求可以上线”的区别？',
                        '联调时最容易遗漏的信息是什么？',
                        '哪一次返工让我开始重视代码规范或公共封装？',
                        '遇到不会的问题时，搜索、看文档和问同事的顺序是什么？',
                        '代码被指出问题时，当时是什么反应？后来有没有改变？'
                    ],
                    quote: '待补：不要写“沟通很重要”这种结论，要写一次具体沟通为什么失败或为什么有效。'
                },
                {
                    heading: '第四部分：给 2022 留下的问题',
                    items: [
                        '想独立负责什么规模的模块？为什么？',
                        '工程化、构建和部署里最想弄懂哪一部分？',
                        'React、TypeScript 还欠缺哪些基础？',
                        '目前最浪费时间的开发习惯是什么？',
                        '工作之外还想保留什么，而不是只写技术目标？'
                    ],
                    note: '最后一项必须由自己补。没有真实答案之前宁愿空着，不用“保持学习、继续努力”代替。'
                }
            ],
            closing: '这篇目前就是提纲，不把它伪装成已经写完的年终总结。2021 年确定发生的是：从学校离开，开始第一份工作，第一次面对真实用户、真实环境和多人协作。至于这一年到底意味着什么，留给自己补。'
        })
    },
    {
        id: 7,
        title: 'Webpack 换 Vite：几个旧依赖没那么好搬',
        description: '启动快了，但默认导出、动态 require 和环境变量还得逐个处理。记录这次迁移里比较绕的地方。',
        icon: 'Vite',
        createdAt: '2022-08-28 14:17:00',
        updatedAt: '2022-08-28 23:26:00',
        publishedAt: '2022-08-28 22:51:00',
        tags: ['JavaScript', 'DevOps'],
        tech: ['Node.js'],
        content: renderArticle({
            intro: '项目大了以后，最烦的是刚想改个小地方，先等开发服务启动。换 Vite 的直接原因就是这个，没想顺便把整个项目翻新。启动速度确实舒服了不少，不过有几个老依赖不太配合：有的提示没有 default，有的到了 build 才报错。最后在 CommonJS 和 ESM 上花的时间，比写 Vite 配置多。',
            closingHeading: '还要看打包出来的页面',
            sections: [
                {
                    heading: '先保留一份能用的旧构建',
                    paragraphs: [
                        '小项目里等待几秒没有太大感觉，项目规模上来以后，开发服务重启、依赖重新编译和热更新开始频繁打断工作。更现实的问题是，现有 Webpack 配置很难判断每一项是否还需要，升级一个依赖经常牵出另一段兼容。',
                        '这次迁移的目标不是追新版本，而是缩短日常反馈时间，并把构建约定重新整理清楚。旧构建仍然保留在分支上，先让 Vite 覆盖开发、测试和生产构建，再决定是否正式切换。',
                        'Vite 3 刚在 7 月发布，默认开发端口改成 5173，而且它本身以 ESM 发布。新工具更主动地使用浏览器原生 ESM，也因此把旧项目里被 Webpack 打包过程隐藏的问题直接暴露出来。'
                    ]
                },
                {
                    heading: '旧配置里这些东西得有去处',
                    paragraphs: ['我先把 Webpack 现有能力逐项列出来。看起来麻烦，但比迁移到一半才发现某个环境依赖特殊插件要省时间。'],
                    table: {
                        headers: ['Webpack 中的能力', 'Vite 对应处理', '需要额外验证'],
                        rows: [
                            ['入口与 HTML 模板', '根目录 index.html', '环境注入和公共路径'],
                            ['路径 alias', 'resolve.alias', 'TS paths 是否一致'],
                            ['process.env', 'import.meta.env', '变量前缀和构建环境'],
                            ['文件 loader', '静态资源规则或插件', 'SVG、字体、内联资源'],
                            ['动态 require', 'import.meta.glob / 显式 import', '匹配范围和懒加载'],
                            ['开发代理', 'server.proxy', 'Cookie、路径重写'],
                            ['生产拆包', 'Rollup output', 'chunk、缓存和资源地址']
                        ]
                    },
                    note: '这次没有在迁移构建器的同时升级框架和重写业务。变量越少，出现问题时越容易判断是 Vite 配置还是业务改动。'
                },
                {
                    heading: '页面开了，接口地址却没了',
                    paragraphs: [
                        'Webpack 项目里大量使用 <code>process.env.REACT_APP_*</code>。迁到 Vite 后，客户端变量通过 <code>import.meta.env</code> 读取，并且默认只暴露特定前缀。页面可以正常启动，但接口地址为空，表现出来像请求模块坏了。',
                        '我没有在全局把 process.env 模拟出来继续兼容，因为那会让新旧两种写法长期共存。先建立一层 env 配置，把变量读取集中起来，再逐个替换使用方。这样也能在启动时检查必要变量是否缺失。'
                    ],
                    code: `type AppEnv = {
  apiBaseUrl: string
  appMode: 'development' | 'test' | 'production'
}

function readEnv(): AppEnv {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const appMode = import.meta.env.VITE_APP_MODE

  if (!apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL is required')
  }

  return {
    apiBaseUrl,
    appMode: appMode || 'development'
  }
}

export const appEnv = readEnv()`
                },
                {
                    heading: '同一个包，dev 能用，build 报错',
                    paragraphs: [
                        'Vite 开发阶段按 ESM 提供源码，并使用 esbuild 预构建 CommonJS、UMD 依赖。大部分包可以自动处理，但项目里有些旧包动态修改 exports，或者文档示例仍然使用 require，转换后会出现“没有默认导出”“命名导出不存在”。',
                        '我最开始看到报错就把依赖加进 optimizeDeps.include，有些确实能解决，有些只是把问题推到生产构建。开发阶段的依赖预构建和生产阶段的 Rollup 不是完全相同的路径，所以必须同时跑 build。',
                        '另一个坑是前端源码误用了 Node 内置模块。Webpack 旧配置可能通过 polyfill 让它勉强工作，Vite 不会自动替浏览器补齐所有 Node API。与其继续加兼容包，更应该把这段 Node 逻辑移出浏览器模块。',
                        '排查导出问题时，我会直接打开这个包的 package.json，看 main、module 分别指到哪个文件，再看那个文件到底怎么 export。只照着报错把 import X 改成 import * as X，可能只是把错误从构建阶段移到了调用阶段：原来以为拿到一个函数，实际拿到的是带 default 属性的对象。',
                        '如果包有适合当前项目的新版，可以单独升级再验证；如果升级牵扯很大，就先做最小复现，把它脱离业务页面跑起来。别同时改导入方式、升级包、改打包选项，到最后虽然好了，却不知道是哪一步起作用。'
                    ],
                    table: {
                        headers: ['现象', '先检查什么', '最后的处理方向'],
                        rows: [
                            ['default export 不存在', '包的 main/module/exports', '调整导入或升级依赖'],
                            ['require is not defined', '源码是否仍使用动态 require', '改为静态 import 或 glob'],
                            ['process / Buffer 不存在', '是否把 Node 代码带进浏览器', '拆分边界，必要时显式 polyfill'],
                            ['开发正常、build 失败', 'CJS 转换和动态导入', '以生产构建结果为准'],
                            ['依赖每次重新预构建', '锁文件和 Vite 缓存', '固定版本并检查依赖发现入口']
                        ]
                    }
                },
                {
                    heading: '一个动态资源导入的改法',
                    paragraphs: [
                        '旧代码会用 require 拼接图片或页面模块路径。Webpack 能通过上下文推断打包范围，原样放到 Vite 中无法工作。对于确定目录下的文件，改成 <code>import.meta.glob</code> 后，构建器能明确知道候选模块。',
                        'glob 也不是越宽越好。如果直接扫描整个 src，会让不相关模块进入依赖图。路径和文件后缀应该尽量具体，并且处理找不到 key 的情况。'
                    ],
                    code: `const icons = import.meta.glob(
  '/src/assets/status/*.svg',
  { eager: true, import: 'default' }
)

export function getStatusIcon(name: string) {
  const path = \`/src/assets/status/\${name}.svg\`
  const icon = icons[path]

  if (typeof icon !== 'string') {
    return icons['/src/assets/status/default.svg'] as string
  }

  return icon
}`
                },
                {
                    heading: 'preview 里再点一次懒加载页面',
                    paragraphs: ['Vite 启动变快很直观，但迁移完成的标准不能只是首页打开。最后按开发反馈和生产产物两条路径分别检查：'],
                    steps: [
                        '启动开发服务，逐个打开主要路由并验证 HMR。',
                        '检查测试、预发、生产三套环境变量和代理行为。',
                        '执行生产构建，确认没有仅在 Rollup 阶段出现的兼容错误。',
                        '使用 preview 或静态服务器打开产物，检查资源公共路径。',
                        '验证动态导入、懒加载、刷新子路由和浏览器兼容范围。',
                        '对比构建前后主要 chunk，确认没有意外打入整套依赖。'
                    ]
                },
                {
                    heading: '目前用下来',
                    paragraphs: [
                        '日常启动和修改反馈确实轻了很多，等待不再那么明显。配置也更短，但“配置短”不等于没有复杂度，复杂度更多转移到了 ESM 规则、插件边界和依赖是否规范发布。',
                        'Webpack 并不是突然变差了，它仍然能解决项目问题；只是这次项目规模、历史配置和开发反馈时间已经到了值得迁移的程度。Vite 解决了明确痛点，同时要求我们处理以前被兼容层盖住的模块问题。'
                    ],
                    note: '这篇记录的是一次真实迁移中的问题，不是 Webpack 和 Vite 的完整性能对比，也没有自己开发 Vite 插件。'
                }
            ],
            closing:
                '暂时没有精确到秒的前后对照，日常等待少了是能感觉到的。接下来还要在测试环境多跑几轮，尤其是很少打开的页面和动态资源。迁移中查过的 <a href="https://v3.vite.dev/guide/migration" target="_blank" rel="noopener noreferrer">Vite 3 迁移说明</a>也留在这里，碰到端口和模块格式变化时可以对照。'
        })
    },
    {
        id: 8,
        title: '最近开始多写 Vue 3，记几个还不习惯的地方',
        description: '换了项目以后，从 ref 的 .value 到 watch 怎么用，很多旧习惯都要重新对一下。',
        icon: 'Vue',
        createdAt: '2022-09-25 15:42:00',
        updatedAt: '2022-09-25 22:49:00',
        publishedAt: '2022-09-25 22:31:00',
        tags: ['Vue.js', 'TypeScript'],
        tech: ['Vue'],
        content: renderArticle({
            intro: '换了工作环境，最近写 Vue 的时间比 React 多了。不是把原来的 React 项目迁到 Vue，而是新项目本来就用这套。模板语法不难，比较不习惯的是有些地方写 .value，有些地方又不用；还有 watch，刚开始很想拿它去对应 useEffect，写多了发现不太对。',
            closingHeading: false,
            sections: [
                {
                    heading: '先找个熟悉的入口，但别一行一行翻译',
                    paragraphs: [
                        '刚开始最容易做的事，是把 React 的写法逐行翻译成 Vue。这样能让页面快速跑起来，但也会错过 Vue 模板、computed 和响应式系统本身提供的能力。',
                        '下面的映射只是帮助找到入口，不表示两边完全等价。尤其是 watch 和 useEffect，触发方式、依赖收集和清理逻辑都有差异，不能只看名字相似。'
                    ],
                    table: {
                        headers: ['React 中常用概念', 'Vue 3 中先对应到', '需要注意'],
                        rows: [
                            ['useState', 'ref / reactive', '读取和解包规则不同'],
                            ['派生状态', 'computed', '优先计算，不手工同步两份状态'],
                            ['useEffect', 'watch / watchEffect / 生命周期', '明确监听来源和清理'],
                            ['自定义 Hook', 'composable', '仍要设计输入输出与作用域'],
                            ['Props + callback', 'props + emits', '事件需要声明'],
                            ['Context / 全局状态', 'provide/inject 或 Pinia', '不要所有状态都全局化']
                        ]
                    }
                },
                {
                    heading: '解构出来的值怎么不跟着变了',
                    paragraphs: [
                        '模板里常用的顶层 ref 会自动解包，用起来很自然；回到 TypeScript 代码中又需要访问 .value。另一个要注意的是 reactive 对象：把其中的字符串、数字属性直接解构到局部变量，后面改原对象不会让这个变量跟着变。这里说的是属性连接断了，不是所有嵌套对象一解构就失去响应式。',
                        '目前我的习惯是，简单值和需要整体替换的值使用 ref；一组关系明确的表单状态可以用 reactive，但向外暴露或解构前用 toRefs。规则不一定适合所有项目，至少要让同一模块保持一致。'
                    ],
                    code: `import { reactive, toRefs } from 'vue'

type Filters = {
  keyword: string
  status: 'all' | 'online' | 'offline'
}

export function useFilters() {
  const filters = reactive<Filters>({
    keyword: '',
    status: 'all'
  })

  function reset() {
    filters.keyword = ''
    filters.status = 'all'
  }

  return {
    ...toRefs(filters),
    reset
  }
}`
                },
                {
                    heading: '一个筛选功能可以挨着写了',
                    paragraphs: [
                        '复杂页面通常同时有筛选、分页、请求、表格选择和弹窗。Composition API 可以把属于同一功能的状态、计算和方法放在一起，不用在 data、computed、methods 之间来回找。',
                        '不过 <code>script setup</code> 里所有代码都堆在一起也会变成另一种混乱。我现在按功能块排列，只有逻辑有明确输入输出、会在其他页面复用，或者已经大到影响阅读时，才抽成 composable。',
                        '为了名字统一而把三行代码都抽成 useXxx，最后查一个变量要跳很多文件，也不一定比留在组件里清楚。'
                    ]
                },
                {
                    heading: '点一次重置，为什么发了好几次请求',
                    paragraphs: [
                        '比如给关键词、分类、页码分别加 watch，三个回调都能发请求，那么一次 reset 改了几个字段，就可能触发几条请求。Vue 对更新有调度和合并，但不会替业务判断这几个不同的回调其实只需要一个最终结果。',
                        '有查询按钮的表单，我现在直接在 submit 里设置页码并请求；有重置按钮，就在 reset 里恢复初值再请求。需要实时搜索时再单独处理防抖。这样看按钮事件就能知道会发生什么，不用沿着好几个 watch 找。',
                        '还有一个跟框架无关的问题：先搜 A 再搜 B，A 的请求慢一点返回，会不会把 B 的结果盖掉？仅仅减少请求次数解决不了这个问题。可以取消旧请求，或者给每次查询一个递增编号，只有最新编号允许更新列表和 loading。这个我准备在公共列表逻辑里统一处理。'
                    ],
                    table: {
                        headers: ['场景', '当前选择', '原因'],
                        rows: [
                            ['模板展示派生值', 'computed', '避免维护重复状态'],
                            ['点击查询按钮', '显式 submit 方法', '流程清楚，可控制分页'],
                            ['路由参数变化', 'watch 指定来源', '变化来自组件外部'],
                            ['多个筛选项联动', '统一更新函数', '避免多个 watch 互相触发'],
                            ['组件卸载清理', 'onUnmounted', '生命周期语义更明确']
                        ]
                    }
                },
                {
                    heading: '能启动不等于类型检查通过',
                    paragraphs: [
                        'Vite 使用 esbuild 转译 TypeScript，开发服务器为了速度不会完成全部类型检查。这意味着浏览器能打开不代表类型一定通过，CI 或提交前仍然要单独执行 vue-tsc。',
                        '编辑器这边需要正确配置 Vue 3 的语言支持。模板里的 Props、事件和 ref 类型能否提示，直接影响使用体验。路径 alias 也要同时配置在 Vite 和 tsconfig 中，否则运行正常但编辑器报找不到模块。'
                    ],
                    code: `{
  "scripts": {
    "dev": "vite",
    "typecheck": "vue-tsc --noEmit",
    "build": "npm run typecheck && vite build"
  }
}`
                },
                {
                    heading: '旧组件先不全改',
                    paragraphs: [
                        'Vue 3 仍然支持 Options API。现有组件运行稳定、逻辑简单时，没有必要为了写法统一立即重构。新模块使用 script setup，旧模块在真正修改且结构已经影响维护时再整理。',
                        '我也不会把所有共享状态都放进 Pinia。只在单个页面树中使用的筛选条件、弹窗状态留在组件或 composable；跨路由、需要长期保留的状态才考虑进入 Store。'
                    ],
                    note: '这篇只是从 React 项目切到 Vue 3 后一个月的使用记录，不是 React → Vue 的技术迁移，也不是框架性能对比。技术栈变化来自项目和团队环境。'
                },
                {
                    heading: '还想再试的几件事',
                    steps: [
                        '把一个复杂筛选页面的 watch 链改成显式动作。',
                        '为公共 composable 补清楚输入、返回值和清理逻辑。',
                        '在构建流程中固定执行 vue-tsc，而不是只依赖编辑器。',
                        '整理组件 Props、emits 和 v-model 的团队写法。',
                        '继续熟悉 Nuxt 项目结构，区分 Vue 应用和 Nuxt 约定。'
                    ]
                }
            ],
            closing:
                '目前写普通页面已经比较顺了，复杂表格和状态联动还得边写边调整。感觉换框架最花时间的并不是记 API，而是发现以前顺手的写法在这里不一定合适。Nuxt 那边还有不少约定要看，等实际用到再记。'
        })
    },
    {
        id: 9,
        title: 'Nuxt 2 静态生成笔记：先把这 9000 多条路由弄清楚',
        description: 'PC、移动端和中英文页面一起生成，先看路由从哪来、哪些数据重复请求，再考虑构建速度。',
        icon: 'Nuxt',
        createdAt: '2022-10-23 14:08:00',
        updatedAt: '2022-10-23 23:12:00',
        publishedAt: '2022-10-23 22:46:00',
        tags: ['Nuxt.js', 'Vue.js'],
        tech: ['Nuxt'],
        content: renderArticle({
            intro: '最近在看 Nuxt 2 站点的静态生成。页面模板没有那么多，最后生成的地址却有 9000 多条：详情、分类、分页，再分 PC、移动端和中英文。执行 generate 以后要等挺久，我先没碰并发配置，想把它到底在生成什么看明白，不然连少了几页都不知道。',
            closingHeading: '先留几个待查的问题',
            sections: [
                {
                    heading: '模板只有一份，地址却有很多',
                    paragraphs: [
                        '文件系统路由只负责页面模板，真正的大头是动态详情。构建开始前需要从接口拿到可公开的数据列表，再按语言、端和内容类型组织成路由。Nuxt 2.13 以后还有链接爬取，但没被链接发现、也不在清单里的地址仍然会漏；我不能只靠首页能点到哪些页面来判断路由是否完整。',
                        '站点并不是简单把 9000 除以四。PC 和移动端有共享内容，也有不同模板；中文和英文的数据覆盖并不完全一致；部分列表页还会按分类和分页产生额外路由。所以第一步不是调并发，而是把路由分类和数量做成可核对的清单。'
                    ],
                    table: {
                        headers: ['路由类型', '数据来源', '生成前重点检查'],
                        rows: [
                            ['首页与固定栏目', '文件路由、公共配置', '多语言入口是否完整'],
                            ['院校详情', '院校公开数据列表', '唯一标识、语言和发布状态'],
                            ['内容详情', '内容接口', 'slug、上下线时间、空正文'],
                            ['分类列表', '分类与分页数据', '页码范围和空分类'],
                            ['移动端页面', '共享数据、独立模板', '是否与 PC 路由重复'],
                            ['英文页面', '英文数据集合', '缺失翻译时是否应该生成']
                        ]
                    }
                },
                {
                    heading: '这里为什么生成 HTML',
                    paragraphs: [
                        '这些页面主要是公开内容，更新频率没有用户后台那么高，但搜索收录和首屏访问很重要。构建时生成完整 HTML，可以直接放到静态服务/CDN，不要求每次访问都运行 Node 服务和请求内容接口。',
                        '代价也很明确：内容更新不会立刻自动出现在静态文件里，需要重新生成和发布；路由越多，构建越慢；构建时的数据源如果不稳定，所有页面的交付都会被影响。',
                        '所以 SSG 不是“没有服务端问题”，而是把一部分运行时复杂度移动到发布之前。对当前站点这个交换是合理的，但构建流程必须变得可观察。'
                    ]
                },
                {
                    heading: 'routes 里可以先异步拿数据',
                    paragraphs: [
                        'Nuxt 2 可以让 routes 返回 Promise。先请求详情列表，再组织成 route 数组。<a href="https://v2.nuxt.com/docs/configuration-glossary/configuration-generate/" target="_blank" rel="noopener noreferrer">generate 配置文档</a>还支持把 payload 跟路由一起传入页面，这样生成详情页时不必再为同一条数据请求一次。',
                        '目前项目的数据结构更复杂，下面只保留一个简化例子。真实代码还需要处理中英文、分页请求和异常数据，不能把接口原始数组直接 map 完就交给生成器。'
                    ],
                    code: `export default {
  target: 'static',
  generate: {
    async routes() {
      const schools = await fetchPublicSchools()

      return schools
        .filter(school => school.id && school.isPublished)
        .map(school => ({
          route: \`/school/\${school.id}\`,
          payload: school
        }))
    }
  }
}

// pages/school/_id.vue
export default {
  async asyncData({ params, payload, error }) {
    const school = payload || await fetchSchool(params.id)
    if (!school) error({ statusCode: 404 })
    return { school }
  }
}`
                },
                {
                    heading: '公共字典为什么每一页都在请求',
                    paragraphs: [
                        '一个详情页多请求一次公共字典，在本地打开时几乎没有感觉；生成 9000 个页面，就可能变成 9000 次重复请求。组件里隐藏的请求最难发现，因为从页面入口看不出它为什么反复访问同一个接口。',
                        '一条数据缺少标题，普通 SPA 可能只影响一个用户打开那一页；静态生成时，如果模板直接读取深层属性，错误可能让整个构建在已经运行很久后退出。失败越晚，重新跑一次的成本越高。',
                        '我现在先不急着调 concurrency。并发提高会同时增加内存和接口压力，如果页面内部有重复工作，只是让重复工作更快地一起发生。'
                    ],
                    table: {
                        headers: ['单页里看起来很小的问题', '9000+ 页面下的结果'],
                        rows: [
                            ['重复请求一次公共配置', '接口被重复调用数千次'],
                            ['一条数据字段为空', '构建后半程可能整体失败'],
                            ['路由没有去重', '重复渲染并覆盖同一产物'],
                            ['组件访问 window', '生成阶段直接报错'],
                            ['日志只写 Error', '无法知道失败的是哪条路由'],
                            ['模板复制一份', '四个站点修改容易不一致']
                        ]
                    }
                },
                {
                    heading: '有问题的数据单独记下来',
                    paragraphs: [
                        '理想情况是数据源永远符合约定，但实际接口可能出现空 ID、重复 slug、未发布内容或某种语言缺失。与其等模板渲染时随机报错，我先在生成路由前过滤并记录原因。',
                        '过滤不能静默进行。最终需要知道输入多少条、生成多少条、跳过多少条，以及跳过的是哪些数据。否则构建成功也不能证明页面完整。'
                    ],
                    code: `function normalizeRoutes(items) {
  const routes = new Map()
  const rejected = []

  for (const item of items) {
    if (!item.id || !item.locale) {
      rejected.push({ id: item.id, reason: 'missing id or locale' })
      continue
    }

    const route = \`/\${item.locale}/school/\${item.id}\`
    if (routes.has(route)) {
      rejected.push({ id: item.id, reason: 'duplicate route' })
      continue
    }

    routes.set(route, { route, payload: item })
  }

  return {
    routes: [...routes.values()],
    rejected
  }
}`
                },
                {
                    heading: '比起一长串日志，我更想看到这些数',
                    paragraphs: ['当前最重要的不是一口气把构建变快，而是下次失败时能回答“失败在哪里”。先记录这些信息：'],
                    steps: [
                        '路由准备开始与结束时间，以及接口分页数量。',
                        '按站点、语言和页面类型统计生成路由数。',
                        '输出重复、字段缺失和未发布数据的过滤清单。',
                        '页面生成失败时记录完整路由和数据标识，不记录敏感数据。',
                        '构建完成后统计 dist 中 HTML 数量，并与计划路由数对比。',
                        '保留本次输入摘要，方便和上一次成功构建比较。'
                    ],
                    note: '静态生成和逐请求 SSR 不是一回事。我这里部署的是生成好的文件，线上请求不经过 Nuxt 服务端渲染；但生成 HTML 时仍然在 Node 环境执行页面代码。'
                },
                {
                    heading: '抽查页面不能只看文件存在',
                    paragraphs: [
                        '公共数据应该怎样缓存、多少并发不会压垮接口、PC 与移动端哪些数据可以共享、部分失败能否重试，这些都还没有结论。后面需要先测量每个阶段的耗时和请求次数，再决定优化位置。',
                        '抽查时我会先关掉 JavaScript，看标题和主要内容有没有直接出现在 HTML 里；再恢复脚本，检查页面接管以后是否报错、数据有没有突然换成另一份。一个地址存在 index.html，不代表里面真的有这条详情。',
                        '英文页还要单独抽几条，尤其是中文有内容、英文缺字段的情况。缺翻译时显示中文、隐藏模块还是不生成这页，要有明确约定，不能让模板自己碰运气。标题、描述和 canonical 也跟着核对，不能所有详情都带着首页的那一套。',
                        '最后用静态服务器打开 dist，直接输入一个深层地址并刷新。开发环境有 Nuxt 帮忙处理路由，静态目录能否直达还取决于输出结构和服务器规则。这一步跟在首页点链接进去，不完全是一回事。'
                    ]
                }
            ],
            closing: '公共配置到底请求了多少次、哪些页面耗时最长、两种语言能共享多少数据，这几个问题还得继续量。先把路由清单和失败地址留下，至少下一次 generate 出问题时，不用从一屏滚动日志里重新找。'
        })
    },
    {
        id: 10,
        title: '原生小程序和 uni-app 来回写的几处区别',
        description: '主要记生命周期、平台 API 和调试。都跑在微信里，有些问题不会因为用了 Vue 就消失。',
        icon: 'smartphone',
        createdAt: '2022-11-20 14:36:00',
        updatedAt: '2022-11-20 22:18:00',
        publishedAt: '2022-11-20 21:52:00',
        tags: ['Vue.js', 'JavaScript'],
        tech: ['Vue'],
        content: renderArticle({
            intro: '最近小程序这边两种写法都有接触，原生的要写 Page、Component，uni-app 这边继续用 Vue 3。来回切换，最容易写混的是页面什么时候重新显示，以及数据应该在哪一层更新。暂时不做完整的框架对比，就记几个实际开发会碰到的区别。',
            closingHeading: false,
            sections: [
                {
                    heading: '原生查平台问题比较直接，uni-app 写业务比较顺手',
                    paragraphs: [
                        '原生项目里，WXML、WXSS、Page 和 Component 都直接对应微信小程序的概念。看文档、查报错和用开发者工具定位时，中间没有额外的编译映射。遇到登录、授权、分享、原生组件这些平台能力，调用路径也比较直。',
                        'uni-app 项目则可以继续使用 Vue 3、组合式 API 和已经熟悉的目录组织。表单、列表、请求状态这些业务代码更容易抽成 composable 或组件，对已经在写 Vue 的团队很友好。它也保留了发布到其他端的可能性，不过当前项目并没有因为用了跨端框架，就自动获得一个已经验证过的多端产品。',
                        '所以我现在不会单独用“代码量少”判断。需要同时看目标平台、平台能力占比、团队经验、调试成本和后续维护。'
                    ],
                    table: {
                        headers: ['项目情况', '原生小程序', 'uni-app + Vue 3', '我目前的判断'],
                        rows: [
                            ['只做微信，且深度使用平台能力', '调用和排查路径更直接', '仍需要回到微信 API 与组件', '优先考虑原生'],
                            ['团队已有较多 Vue 经验', '需要适应一套模板和状态写法', '组件与逻辑组织更熟悉', 'uni-app 上手更快'],
                            ['普通列表、表单和详情页较多', '能做，但公共逻辑要自己组织', '适合抽组件和 composable', 'uni-app 复用更明显'],
                            ['出现编译或端上差异', '源码与产物更接近', '要判断是业务、框架还是平台问题', '原生调试链更短'],
                            ['以后可能增加其他端', '需要另做适配', '有统一代码入口', '先验证需求，不能只看可能']
                        ]
                    }
                },
                {
                    heading: 'onMounted 和 onShow 别当成一回事',
                    paragraphs: [
                        '我一开始最容易混淆的是生命周期。Vue 组件有 onMounted、onUnmounted，uni-app 页面还会经历 onLoad、onShow、onHide 等页面生命周期。它们解决的不是同一件事。',
                        '例如详情页第一次打开时，可以在 onLoad 根据路由参数准备页面；用户跳到选择页再返回时，页面实例通常还在，此时会再次触发 onShow，但不一定重新触发 onLoad。如果把所有接口都放进 onShow，来回切换页面就会重复请求；如果所有刷新都只放在 onLoad，返回页面后又可能看不到刚刚修改的数据。',
                        '现在我会把“初始化一次”和“每次回到前台都要校验”分开写，并让刷新条件显式一些。'
                    ],
                    code: `import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'

const detail = ref()
let needRefresh = false

onLoad(async (query) => {
  // 页面实例创建时处理参数和首屏数据
  detail.value = await fetchDetail(String(query.id))
})

onShow(async () => {
  // 从编辑页返回时才刷新，不把首屏请求无条件执行两次
  if (!needRefresh) return
  detail.value = await fetchDetail(detail.value.id)
  needRefresh = false
})

function markDetailChanged() {
  needRefresh = true
}`,
                    note: '这段代码只表达生命周期分工。真实项目还要处理页面卸载、请求竞态和空参数，不能直接靠一个模块级变量覆盖所有页面实例。'
                },
                {
                    heading: 'wx 和 uni 要不要再包一层',
                    paragraphs: [
                        '业务组件里到处直接调用 wx 或 uni，前期看起来最快，后面却很难看出一个页面依赖了多少平台行为。登录、存储、路由和文件选择等能力，我更倾向先包一层很薄的适配器。它不是为了假装所有平台完全一样，而是让业务代码明确知道自己需要哪些能力。',
                        '适配层不能做成一个什么都装的 utils。平台存在差异时，应该在接口和命名上暴露差异，而不是吞掉错误、返回一个模糊的 any。'
                    ],
                    code: `type LoginResult = {
  code: string
}

export interface MiniProgramPlatform {
  login(): Promise<LoginResult>
  navigateTo(url: string): Promise<void>
  getStorage<T>(key: string): T | undefined
}

export const uniPlatform: MiniProgramPlatform = {
  login: () => uni.login(),
  navigateTo: async url => { await uni.navigateTo({ url }) },
  getStorage: key => {
    const value = uni.getStorageSync(key)
    // 本例约定空字符串表示没有值，0 和 false 需要保留。
    return value === '' ? undefined : value
  }
}

// 页面只依赖 MiniProgramPlatform；
// 分享、订阅消息等微信专属能力仍保留明确的微信实现。`
                },
                {
                    heading: '条件编译太多时，就拆开写',
                    paragraphs: [
                        'uni-app 可以通过条件编译处理端差异，这很方便，但如果同一页面里散落大量平台判断，最终读到的是几套交叉在一起的实现。公共的请求、数据转换和展示组件可以复用；授权、支付、分享以及特殊原生组件，更适合留在平台目录或独立组件里。',
                        '目前我们主要面对微信小程序，所以我不会为了一个还没确定的目标端，提前设计很重的抽象。只有已经出现的共同点才下沉，平台专属逻辑保持可见。'
                    ],
                    table: {
                        headers: ['内容', '适合优先复用', '需要保留平台意识'],
                        rows: [
                            ['接口类型与数据转换', '是', '处理各端网络错误差异'],
                            ['普通表单、列表、空状态', '是', '检查组件属性和样式支持'],
                            ['登录与授权', '只复用业务状态', '平台流程和返回字段不同'],
                            ['分享、订阅消息', '较少', '属于明显的平台能力'],
                            ['文件、地图、富文本等组件', '视情况', '真机表现和原生组件限制'],
                            ['页面跳转与返回刷新', '可封装基础动作', '仍受页面栈和生命周期影响']
                        ]
                    }
                },
                {
                    heading: '源码之外，还要看编译结果',
                    paragraphs: [
                        '项目变大后，无论原生还是 uni-app，都要面对主包内容、分包边界、重复资源和首屏依赖。uni-app 的编译产物还多了一层观察对象：源码里只 import 了一次的东西，最终是否进入多个分包，不能完全靠直觉判断。',
                        '我现在会在开发过程中定期看微信开发者工具的代码依赖分析，而不是等上传时才看到包太大。公共组件也不是越公共越好，把低频页面依赖的大组件放进主包，反而会让所有用户在启动时付出成本。',
                        '这部分目前只形成了检查习惯，还没有完整的优化结论。等后面真正处理一次包体积问题，再单独记录数据和拆分过程。'
                    ]
                },
                {
                    heading: '真机上不对时，从哪一层查',
                    paragraphs: [
                        'uni-app 页面出问题时，只盯着 Vue 源码不够。我会先判断它属于业务状态、编译结果还是微信运行环境，再决定看哪一层。比如点击没有反应，可能是事件写法、遮挡层、组件差异，也可能是真机权限；如果一开始就认定是框架 bug，通常会绕很远。',
                        '开发者工具适合看编译结果、网络、页面栈和基础性能，但涉及授权弹窗、相机、定位、文件和部分原生组件时，真机仍然是必须的。模拟器里正常只能算第一轮通过。'
                    ],
                    steps: [
                        '先在 Vue 源码中确认输入、状态变化和事件是否发生。',
                        '打开编译后的小程序代码，确认属性、事件和条件编译结果。',
                        '在微信开发者工具检查网络、Storage、页面栈和控制台。',
                        '使用至少一台真机走完整流程，特别检查授权与原生组件。',
                        '回归从其他页面返回、冷启动和弱网等不同进入方式。',
                        '记录问题属于业务层、框架层还是平台层，避免下次重复猜。'
                    ]
                },
                {
                    heading: '如果下次开新项目，我会先问',
                    items: [
                        '最终确定要发布哪些端，而不是“以后可能会有”。',
                        '核心路径依赖多少微信专属 API、原生组件和授权流程。',
                        '团队更熟悉 Vue，还是更熟悉小程序原生模型。',
                        '现有组件和请求逻辑中，真正可以跨端复用的比例有多少。',
                        '调试、真机测试和平台升级由谁长期负责。',
                        '主包与分包如何组织，首屏必须加载哪些能力。',
                        '如果跨端行为不一致，产品是否接受差异化实现。'
                    ]
                }
            ],
            closing:
                '我现在两种都能接受。普通列表和表单用 Vue 写着顺手；碰到微信专属能力，还是会打开微信的文档和开发者工具查。眼下也没打算为了统一写法重做已有项目，先把每个项目里的常用流程和封装摸熟再说。'
        })
    },
    {
        id: 11,
        title: '2022 年终总结（提纲）：换环境以后重新适应技术栈',
        description: '2022 年 12 月 31 日留下的回顾提纲：工作变化、Vue/Nuxt 项目、静态站点与两类微信小程序。',
        icon: 'coffee',
        createdAt: '2022-12-31 19:42:00',
        updatedAt: '2022-12-31 23:06:00',
        publishedAt: '2022-12-31 23:06:00',
        tags: ['JavaScript'],
        tech: [],
        content: renderArticle({
            intro: '今天是 2022 年最后一天。今年最明显的变化是 7 月换了工作环境，接触的项目从 React/Taro 为主，变成 Vue、Nuxt、原生小程序和 uni-app。很多感受现在还说不准确，先按时间线留下事实和待回答的问题，不用后来的结论替今年的自己总结。',
            sections: [
                {
                    heading: '今年可以确定的时间线',
                    table: {
                        headers: ['时间', '发生的事情', '准备补充的细节'],
                        rows: [
                            ['2022 年上半年', '继续维护 React、Taro、TypeScript 项目', '离开原环境前真正学会了什么'],
                            ['2022 年 7 月', '进入新的工作环境', '为什么变化，以及最初的职责'],
                            ['2022 年 8 月', '处理 Webpack 到 Vite 的构建迁移', 'CJS、ESM 和旧依赖里最难定位的问题'],
                            ['2022 年 9 月', '开始集中使用 Vue 3、Vite', '从 React 项目切换时哪些经验仍然有效'],
                            ['2022 年 10 月', '接触包含 9000+ 路由的 Nuxt 2 静态站点', '第一次完整跑 generate 的记录'],
                            ['2022 年 11 月', '同时接触原生与 uni-app 微信小程序', '一次最能说明两者边界的问题'],
                            ['2022 年 12 月', '继续熟悉 PC、移动端与中英文内容站点', '多套页面之间如何协作和复用']
                        ]
                    },
                    note: '公开文章不写公司名称、具体业务数据、内部接口和同事信息。这里的“参与”和“接触”也不改写成“从零主导”。'
                },
                {
                    heading: '第一部分：为什么换环境',
                    paragraphs: ['这一部分不能只写“寻求成长”。准备从具体选择和变化开始补：'],
                    items: [
                        '当时决定变化的直接原因是什么？',
                        '进入新环境前，最担心的是业务、技术栈还是协作方式？',
                        '入职第一个月实际负责了哪些事情？',
                        '从教育业务的一类产品切到另一类产品，理解需求的方式有什么变化？',
                        '有没有哪个原本以为重要的判断，后来发现并不重要？'
                    ]
                },
                {
                    heading: '第二部分：技术栈变了，工作方法有没有留下来',
                    table: {
                        headers: ['变化', '可以迁移的经验', '需要重新学习'],
                        rows: [
                            ['React → Vue 3', '组件拆分、状态边界、TypeScript', '响应式细节、模板和 Composition API'],
                            ['Taro → 原生/uni-app', '跨端问题意识、接口封装', '微信页面栈、生命周期和平台组件'],
                            ['Webpack → Vite', '构建入口、环境变量、代理', 'ESM、依赖预构建和 Rollup 产物'],
                            ['普通前端页面 → Nuxt SSG', '页面与接口协作', '动态路由、生成阶段和静态部署'],
                            ['单一页面 → PC/移动/中英文站点', '公共组件与数据类型', 'SEO、模板差异和内容完整性']
                        ]
                    },
                    quote: '待补：不要写成 React 和 Vue 的优劣比较，技术栈变化主要来自公司项目和职责变化。'
                },
                {
                    heading: '第三部分：第一次意识到规模会改变问题',
                    paragraphs: [
                        '9000 多个静态页面是今年最适合展开的一条线。单页里一次多余请求、一条空数据或一个只能在浏览器运行的组件，放进完整构建后都会被重复很多次。',
                        '这部分以后要补的是当时看到的现象，而不是直接写已经完成的优化结果。到 2022 年底，我还在理解路由来源、生成流程和数据边界，没有完成后面的 Nuxt 3 升级。'
                    ],
                    items: [
                        '第一次完整生成用了多久，中途做了哪些记录？',
                        '哪类失败最难定位：接口、路由、数据还是页面渲染？',
                        'PC、移动端、中英文页面有哪些真实差异？',
                        '当时提出了哪些优化猜想，哪些还没有验证？',
                        '如果重新接手一次，第一天会先画哪张流程图？'
                    ]
                },
                {
                    heading: '第四部分：给 2023 留下的问题',
                    steps: [
                        '把 Nuxt 2 项目的请求、插件和生成流程继续梳理清楚。',
                        '确认 Vue 3 / Nuxt 3 升级是否可行，以及兼容范围。',
                        '让大量静态页面的数量、失败和耗时更容易观察。',
                        '继续补小程序原生机制，不只停留在框架 API。',
                        '选择一个模块完整负责需求、实现、联调和发布复盘。',
                        '补上工作之外的目标，由自己填写，不用技术目标代替。'
                    ],
                    note: '最后一项仍然留空。它需要真实答案，不适合由一篇技术博客自动补齐。'
                }
            ],
            closing:
                '这篇先保持提纲状态。2022 年可以确定的是：工作环境和主要技术栈都发生了变化，我开始接触更大规模的静态站点，也同时面对多端页面和两类小程序实现。至于这次变化到底带来了什么，等我能用具体事情回答上面的问题后再补。'
        })
    },
    {
        id: 12,
        title: 'Nuxt 2 升 Nuxt 3：$axios 换掉以后，加密请求对不上了',
        description: '请求层迁移里最费时间的一段：body、query、序列化和错误处理，都得跟旧插件重新对齐。',
        icon: 'Nuxt',
        createdAt: '2023-02-19 13:48:00',
        updatedAt: '2023-02-19 23:21:00',
        publishedAt: '2023-02-19 22:43:00',
        tags: ['Nuxt.js', 'Vue.js', 'TypeScript'],
        tech: ['Nuxt', 'Vue'],
        content: renderArticle({
            intro: 'Nuxt 2 升 Nuxt 3 还在改，请求层这块值得单独记一篇。旧项目一直用 $axios，页面只管传参数，插件里再统一加密。换成 $fetch 后，一般的 GET 好处理，加密接口就没那么顺了。同一个对象在控制台看着没区别，到了后端却未必是同一份输入。',
            closingHeading: '这部分先迁到能对照为止',
            sections: [
                {
                    heading: '先打开旧 axios 插件，别急着全局替换',
                    paragraphs: [
                        '旧项目通过 @nuxtjs/axios 注入 $axios，页面、store、插件和 asyncData 都在使用。除了 baseURL，拦截器还会按请求方法处理参数、读取 Token、给部分接口加密，再把后端的业务状态码转换成页面熟悉的结果。',
                        '如果只搜索 this.$axios 并机械替换成 $fetch，页面可能能编译，行为却已经变了。比如 Axios 的 data 到 Fetch 里变成 body，params 更接近 query；以前用 $get、$post 拿到的就是响应数据，而错误对象和状态码的读取位置也不同。',
                        '我先把旧插件职责列成表，再决定 Nuxt 3 里放到哪里。这个步骤看起来没有写新代码，但它直接决定后面是不是会漏掉只有生成阶段才出现的逻辑。'
                    ],
                    table: {
                        headers: ['旧 $axios 行为', 'Nuxt 3 中的去向', '迁移时要验证'],
                        rows: [
                            ['baseURL 与超时', '$fetch.create 默认项', '开发、测试和生产环境'],
                            ['请求 Token', '插件内读取 Cookie', '浏览器、生成阶段是否一致'],
                            ['GET 参数', 'query', '数组、空值和编码结果'],
                            ['POST 参数加密', 'onRequest 处理 body', '序列化顺序与 Content-Type'],
                            ['响应解密/拆包', 'onResponse', '空响应和非加密接口'],
                            ['业务错误统一转换', 'onResponse / onResponseError', 'HTTP 错误与业务错误分开'],
                            ['页面首屏数据', 'useFetch / useAsyncData', '是否进入 Nuxt payload'],
                            ['按钮触发请求', '自定义 $api', '不能误用 useFetch 生命周期']
                        ]
                    }
                },
                {
                    heading: '页面取数和点按钮发请求，分开处理',
                    paragraphs: [
                        'Nuxt 3 提供的 $fetch 很适合普通网络请求；useFetch 是基于 useAsyncData 和 $fetch 的封装，会处理服务端渲染/生成与客户端 Hydration 之间的数据传递；useAsyncData 则适合包住不只是请求的异步逻辑。名字都带 fetch，很容易在迁移时混用。',
                        '页面首屏需要的数据，即使 setup 顶层只写了一次 $fetch，也可能在生成 HTML 和客户端接管时分别执行。useFetch 或 useAsyncData 可以把生成阶段拿到的数据交给客户端复用。点击保存按钮就不用绕这套流程，直接调用自定义 $api 更清楚。',
                        '我暂时没有做一个“万能 useRequest”同时包住三种场景。首屏数据和用户动作的生命周期不同，强行统一只会增加参数。'
                    ],
                    table: {
                        headers: ['场景', '目前采用', '原因'],
                        rows: [
                            ['页面首屏详情', 'useAsyncData + $api', '自定义 key，复用统一加密请求'],
                            ['简单公开 GET', 'useFetch', '直接获得 data、pending、error'],
                            ['提交表单/删除', '$api', '由事件明确触发'],
                            ['多个接口聚合', 'useAsyncData', '异步逻辑不只是一个 URL'],
                            ['纯客户端低优先级数据', 'lazy / server: false', '不阻塞静态首屏']
                        ]
                    }
                },
                {
                    heading: '先保留一个统一的 $api 入口',
                    paragraphs: [
                        '我们没有让页面直接依赖全局 $fetch，而是在 Nuxt 插件里创建一份业务 API 实例。这样 baseURL、鉴权、加密和错误结构仍然只有一个入口，页面可以按模块逐步从 this.$axios 迁移到 useNuxtApp().$api。',
                        '下面是缩减后的结构。真实的加密内容和接口规则不能公开，所以只保留职责边界。重点是读取 Nuxt 运行时配置和 Cookie，不在插件顶层直接访问 localStorage，也不把整个 useNuxtApp 塞进工具文件。'
                    ],
                    code: `// plugins/api.ts
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('token')

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    timeout: 15_000,

    onRequest({ options }) {
      const headers = new Headers(options.headers)
      if (token.value) headers.set('Authorization', token.value)

      if (shouldEncrypt(options.method, options.body)) {
        options.body = encryptRequestBody(options.body)
        headers.set('Content-Type', 'application/json')
      }

      options.headers = headers
    },

    onResponse({ response }) {
      response._data = normalizeResponse(response._data)
    },

    onResponseError({ response }) {
      throw toApiError(response.status, response._data)
    }
  })

  return { provide: { api } }
})`,
                    note: '代码里的 encryptRequestBody、normalizeResponse 和错误类型都是业务边界，不应依赖 Vue 组件。加密不等于安全认证，敏感接口仍需要 HTTPS、服务端鉴权、防重放和权限校验。'
                },
                {
                    heading: '对参数对象不够，要对序列化后的内容',
                    paragraphs: [
                        '这次最花时间的坑不是加密函数本身，而是加密前的数据发生了细小变化。旧 Axios 拦截器拿到的可能是普通对象，也可能已经经过 transformRequest；换成 ofetch 后，body 的序列化时机和 Header 处理不同。如果后端签名依赖原始字符串、字段顺序、时间戳或空值规则，哪怕控制台打印出来的对象一样，最终密文也可能不一样。',
                        'GET 也不能忽略。数组参数使用重复 key 还是逗号连接、undefined 是否被移除、中文和空格如何编码，都可能影响签名。最后我们没有靠肉眼对对象，而是选择几类固定请求，分别记录加密前字符串、关键 Header 和服务端解析结果，对照新旧版本。',
                        '测试时最好用自己造的固定样本：一个空字符串、一个 null、一个数组，再带一点中文和空格。先把时间戳等变化项固定在测试用例里，对照两边加密前的字节内容；真实请求的时间戳仍然正常生成。带随机量的密文不一定每次都一样，所以不能只拿两段密文做相等比较。',
                        '还有一个容易走偏的修法：发现字段顺序不同，就临时给新请求排序。这样可能把新协议改得更整齐，却跟旧后端约定离得更远。迁移阶段先复用旧序列化规则，确实要调整协议时，再和后端一起改。下面的 stableStringify 只是旧规则的占位名称，不表示所有接口都应该排序。',
                        '调试日志只在本地开启，而且不会输出 Token、完整密文或用户数据。否则为了排查加密问题，反而把敏感信息留在浏览器控制台和构建日志里。'
                    ],
                    code: `type SignInput = {
  method: 'GET' | 'POST'
  path: string
  timestamp: string
  payload: string
}

function createSignInput(
  method: SignInput['method'],
  path: string,
  data: unknown
): SignInput {
  return {
    method,
    path,
    timestamp: createTimestamp(),
    // 新旧请求层必须共用同一套稳定序列化规则
    payload: stableStringify(removeUndefined(data))
  }
}

// 测试时比较 SignInput，不在日志里打印 Token 或用户原始数据。`
                },
                {
                    heading: '浏览器能请求，还得跑一次 generate',
                    paragraphs: [
                        '项目是静态生成站点，但 Nuxt 代码仍然会经历构建时的 Node 环境和浏览器环境。一个插件在客户端跳转时正常，不代表 generate 时也正常。最典型的问题是在公共文件顶层读取 window、localStorage，或者默认 Cookie 一定存在。',
                        '公开页面生成时通常没有登录态，接口必须允许不带用户 Token；如果某段内容只能登录后获取，就不应该在静态生成阶段强行请求。环境差异需要在产品和数据层说清楚，不能用 process.client 把报错隐藏掉。'
                    ],
                    table: {
                        headers: ['验证环境', '重点检查', '常见误判'],
                        rows: [
                            ['本地客户端跳转', '事件请求、Token 更新、错误提示', '只验证了浏览器'],
                            ['直接刷新页面', '首屏数据与 Hydration', '重复请求被当成正常'],
                            ['静态生成', '无 window、无登录态、接口稳定性', '把生成失败当成页面语法错误'],
                            ['生成后的静态文件', '资源地址、路由直达、payload', 'dev 正常就认为产物正常'],
                            ['旧版与新版并行', '请求明文、Header、响应结构', '只比较页面长得一样']
                        ]
                    }
                },
                {
                    heading: '先迁一个有代表性的页面',
                    paragraphs: [
                        '我把迁移拆成“基础请求层—一个代表页面—同类型页面—长尾组件”几步。代表页面故意选择了同时包含公开 GET、加密 POST、错误提示和静态生成的页面，先把最复杂的路径跑通。',
                        '页面迁移时尽量不顺手重做样式和交互。Vue 2 到 Vue 3 还有 v-model、事件声明、生命周期等变化，如果请求、组件和视觉同时改变，回归时很难判断差异来自哪里。'
                    ],
                    steps: [
                        '冻结一组可脱敏的新旧请求样本，明确当前行为。',
                        '完成 runtimeConfig、Cookie 和 $api 插件的最小实现。',
                        '迁移一个覆盖 GET、POST、错误与生成阶段的代表页面。',
                        '对比新旧请求输入、响应数据和最终静态 HTML。',
                        '按接口模块迁移调用方，删除已经没有使用方的兼容代码。',
                        '每一批都执行 dev、generate 和静态产物直达回归。'
                    ]
                },
                {
                    heading: '动态路由留到下一步',
                    paragraphs: [
                        'Nuxt 3 的目录、自动导入、状态管理和 Vue 3 组件写法也需要调整，但它们不是本文的重点。动态路由在 Nuxt 3 里怎样准备、9000 多个页面怎样控制构建时间，也还没有在这一步解决。',
                        '现在的目标只是让请求行为在新框架里可解释、可对比。等请求层稳定后，再把动态路由生成从配置里拆出来，并单独记录大规模静态构建的优化。'
                    ],
                    note: '旧的 @nuxtjs/axios 模块没有直接搬过来，不等于 Nuxt 3 禁止使用 Axios。这次选择 $fetch 是项目迁移方案，已有 Axios 封装也可以按实际依赖继续评估。'
                }
            ],
            closing: '请求这块先保持跟旧版一致，不顺便重设计协议。几个固定样本、一个代表页面、一次完整静态生成，比只看页面没报错更能让我放心。接下来再处理动态路由，那一大串地址也得找地方生成。'
        })
    },
    {
        id: 13,
        title: 'Nuxt 3 的动态路由，我用脚本提前生成一份清单',
        description: '9000 多个地址不想继续塞进配置文件。先生成 JSON，再交给 Nitro，出错时比较好查。',
        icon: 'Nuxt',
        createdAt: '2023-04-16 13:26:00',
        updatedAt: '2023-04-16 23:08:00',
        publishedAt: '2023-04-16 22:34:00',
        tags: ['Nuxt.js', 'Node.js'],
        tech: ['Nuxt', 'Node.js'],
        content: renderArticle({
            intro: '上次把请求层理了一遍，这次继续迁静态生成。Nuxt 2 里那段 generate.routes 可以异步拿列表，升级以后不能原样照搬。我最后选了个比较直白的做法：写一个 Node 脚本，把要生成的地址先存成 JSON，Nuxt 启动时只读它。文件多了一份，但至少可以在等构建之前打开看一眼。',
            closingHeading: false,
            sections: [
                {
                    heading: '[id].vue 不会自动知道所有 id',
                    paragraphs: [
                        'pages/school/[id].vue 只告诉 Nuxt 这类 URL 可以由哪个组件处理，并不会凭空知道线上有哪些 id。开发时手动访问一个地址没问题，静态发布却必须在构建前拿到完整列表，否则那些没有被入口链接爬到的详情页不会出现在产物里。',
                        '当前站点还有 PC、移动端、中英文等不同入口。某些内容四端都有，某些只有中文，列表页又会产生分类和分页。这里的核心不是动态路由文件怎么命名，而是怎样从多个数据源得到一份无重复、可复现的预渲染输入。'
                    ],
                    table: {
                        headers: ['概念', '负责什么', '这次迁移的变化'],
                        rows: [
                            ['文件路由', '匹配 /school/:id 的页面模板', '_id.vue 改为 [id].vue'],
                            ['客户端路由', '用户打开后在页面间跳转', 'NuxtLink / navigateTo'],
                            ['链接爬取', '从已渲染页面继续发现链接', '只能发现页面真正输出的链接'],
                            ['预渲染清单', '声明必须生成的 URL', '交给 Nitro prerender.routes'],
                            ['路由准备脚本', '从接口生成、校验和保存清单', '从配置中独立出来']
                        ]
                    }
                },
                {
                    heading: '为什么这次单独写脚本',
                    paragraphs: [
                        'Nuxt 2 的 generate.routes 可以返回 Promise，所以旧代码在配置里请求列表、拼接路径并直接返回。路由少时很方便，后来数据源和判断越来越多，配置文件开始承担分页拉取、语言过滤、去重和错误重试。一次失败只看到 generate 没拿到 routes，很难单独重放数据准备过程。',
                        'Nuxt 3 的迁移文档也提醒异步配置不再是推荐方向，可以用 Hook 处理异步行为。但对当前项目来说，即使用 Hook，复杂的数据聚合仍然与框架启动绑在一起。我更希望在 Nuxt 启动前就知道输入是否完整。',
                        '独立脚本的意义不是“Nuxt 3 做不到异步路由”，而是把两类失败分开：脚本失败说明路由数据没有准备好；脚本成功而预渲染失败，才去查具体页面和组件。'
                    ]
                },
                {
                    heading: '脚本里只留取数和整理地址',
                    paragraphs: [
                        '脚本按顺序完成拉取、规范化、展开、过滤、去重和写入。每一个阶段都返回普通数据，不 import 页面组件，也不依赖 Nuxt 运行时。这样可以单独执行，接口异常时也不用先等整个项目构建。',
                        '为了避免一次把接口拉得太重，列表数据仍然分页获取。每一页记录数量和耗时，失败时保留数据源名称和页码。某一端缺少翻译不一定是错误，但必须按明确规则过滤，不能在模板里遇到空字段后才决定。'
                    ],
                    code: `// scripts/prepare-prerender-routes.mjs
const sources = await Promise.all([
  fetchAllPages('/public/schools'),
  fetchAllPages('/public/articles'),
  fetchAllPages('/public/categories')
])

const candidates = [
  ...createSchoolRoutes(sources[0]),
  ...createArticleRoutes(sources[1]),
  ...createCategoryRoutes(sources[2])
]

const report = normalizeRoutes(candidates)

await writeRouteFile({
  generatedAt: new Date().toISOString(),
  routes: report.routes,
  rejected: report.rejected,
  counts: report.counts
})

if (report.rejected.some(item => item.level === 'error')) {
  process.exitCode = 1
}`,
                    note: '真实接口地址和数据字段已省略。脚本只读取可用于公开静态页的数据，不应该把用户态接口、Cookie 或内部密钥写进路由产物。'
                },
                {
                    heading: '少了几十页的时候，总得知道少在哪',
                    paragraphs: [
                        '最开始我只准备输出 routes 数组，后来发现构建成功也回答不了“今天为什么少了几十页”。现在的产物同时包含各类数量、被过滤项和生成时间，构建日志可以先打印摘要。',
                        '路由排序也固定下来。对象接口返回顺序变化时，最终清单仍然按类型、语言和标识排序，方便用 diff 比较两次构建。动态 URL 在写入前统一编码和规范化，避免尾斜杠、重复斜杠和同一内容的不同写法。'
                    ],
                    table: {
                        headers: ['产物字段', '用途', '异常时能回答'],
                        rows: [
                            ['routes', '提供给 Nitro 的最终 URL', '实际准备了哪些页面'],
                            ['counts.byType', '按详情、列表等分类计数', '哪一类数量变化'],
                            ['counts.byLocale', '中英文数量', '是否缺少某种语言'],
                            ['rejected', '记录空 ID、重复和未发布数据', '为什么没有生成'],
                            ['sourcePages', '每个接口抓取页数', '是否提前结束分页'],
                            ['generatedAt', '标记数据快照时间', '路由清单是否过期'],
                            ['checksum', '标识完整输入', '两次构建是否使用同一清单']
                        ]
                    }
                },
                {
                    heading: 'prepare:routes 跑完，再跑 generate',
                    paragraphs: [
                        '执行顺序变成 prepare:routes → nuxt generate。脚本成功后输出 JSON，nuxt.config 读取并把 routes 交给 nitro.prerender。这里不再访问远程接口，配置加载时看到的就是本次构建确定的输入。',
                        'crawlLinks 仍然可以开启，用来发现固定页面和页面里的普通链接，但它不能替代完整清单。分页很深、没有入口链接或只通过搜索到达的详情页，不能保证被爬虫遍历到。对必须交付的页面，我更愿意显式列出。'
                    ],
                    code: `// nuxt.config.ts
import routeManifest from './.generated/prerender-routes.json'

export default defineNuxtConfig({
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: routeManifest.routes,
      failOnError: true
    }
  }
})

// package.json（示意）
// "generate": "node scripts/prepare-prerender-routes.mjs && nuxt generate"`,
                    note: '.generated 目录中的清单是构建中间产物。是否提交仓库取决于发布流程；当前做法会在每次正式构建前重新生成，避免误用旧数据。'
                },
                {
                    heading: '空 id、缺翻译和重复路径分别处理',
                    paragraphs: [
                        '路由脚本会遇到空 id、重复 slug、未发布内容、只有中文的数据以及路径里带特殊字符的情况。以前页面模板可能用可选链勉强生成一个空页面，现在我希望这些数据在进入 Nuxt 前就有明确去向。',
                        '可预期的缺失，例如某条内容没有英文版本，可以作为 warning 并按规则跳过；会造成错误页面的空主键或冲突路径则作为 error，让脚本退出。自动补一个看似合理的 slug 最危险，因为构建会成功，但 URL 可能永远无法对应真实内容。'
                    ],
                    steps: [
                        '给每类数据定义必须字段、发布状态和语言规则。',
                        '将输入转换成统一的 { type, locale, path, sourceId }。',
                        '规范化斜杠、编码和大小写，不接受无法解释的路径。',
                        '按最终 path 去重，同时保留冲突的两个来源。',
                        '固定排序并统计各类型、各语言数量。',
                        '存在 error 时阻止构建；warning 写入报告并继续。',
                        '把最终清单校验值传给后续构建日志。'
                    ]
                },
                {
                    heading: '拿清单抽几条地址试一下',
                    paragraphs: [
                        '脚本拆开后，本地可以只运行路由准备并快速看报告，不用每次都等待 9000 多个页面渲染。抽样时我会覆盖固定页、四类详情入口、中文和英文、PC 与移动端、分页首尾，以及一条预期不存在的 URL。',
                        '这里还要防一个很不起眼的问题：上一次脚本成功生成了 JSON，这一次请求失败了，旧文件却还在。如果后续 generate 继续执行，构建可能成功，但用的是过期清单。所以两条命令要用成功条件串起来，取数失败直接退出；写文件时也可以先写临时文件，全部验证完再替换。',
                        '清单最好跟本次构建记录放在一起。以后排查“这条详情为什么没上线”，先查清单里有没有，再查输出里有没有，不必重新跑一遍远程接口猜当时返回了什么。'
                    ],
                    table: {
                        headers: ['检查项', '通过条件'],
                        rows: [
                            ['总量波动', '能由数据发布/下线解释'],
                            ['重复路径', '最终为 0，冲突来源有记录'],
                            ['随机抽样', '静态文件存在且正文正确'],
                            ['语言边界', '缺失翻译按规则跳过，不生成空页'],
                            ['直接访问', '不依赖客户端跳转也能打开'],
                            ['404 样本', '未知 id 不产生伪静态内容']
                        ]
                    }
                }
            ],
            closing: '现在要查路由就先跑脚本，要查模板再跑生成，两边不用绑着等。几千条地址的项目这么拆我觉得值得，小站点只有几十条的话，直接用框架提供的方式也没问题，没必要为了多一层目录照搬。'
        })
    },
    {
        id: 14,
        title: '9000+ 页面从约 40 分钟构建到 15 分钟，改了哪些地方',
        description: 'Nuxt 静态生成的一次优化记录：公共接口提取、组件整理、动静代码拆分，以及最后的并发调整。',
        icon: 'clock',
        createdAt: '2023-06-18 12:54:00',
        updatedAt: '2023-06-18 23:37:00',
        publishedAt: '2023-06-18 22:58:00',
        tags: ['Nuxt.js', 'DevOps'],
        tech: ['Nuxt', 'Node.js'],
        content: renderArticle({
            intro: '这次总算把静态构建时间压下来了，9000 多个页面，从约 40 分钟到了 15 分钟左右。不是换一个配置就突然变快，中间做了路由拆分、公共接口提取、组件整理和构建 Hook 相关的调整。这里按排查顺序记一下，具体接口和业务模板就不贴了。',
            closingHeading: '15 分钟也不算很短',
            sections: [
                {
                    heading: '先确认比的是同一批页面',
                    paragraphs: [
                        '构建时间会受机器负载、接口响应、数据数量和缓存影响。只拿某一次最快结果与某一次最慢结果比较没有意义。我先固定同一台构建机、同一份路由清单和相同环境变量，每轮开始前记录路由总数，并区分冷启动和连续构建。',
                        '总耗时也被拆成路由准备、Nuxt 编译、页面预渲染和产物检查。这个拆分很快排除了一个误区：前端 bundle 编译不是最大头，时间主要消耗在 9000 多次页面渲染及其触发的数据请求。'
                    ],
                    table: {
                        headers: ['基线信息', '为什么必须记录'],
                        rows: [
                            ['Git 提交与锁文件', '避免依赖或代码变化混进结果'],
                            ['路由清单校验值', '确保两轮生成的是同一批页面'],
                            ['路由总数及分类', '防止“少生成页面所以更快”'],
                            ['Node / Nuxt 版本', '排除运行时差异'],
                            ['构建机与并发配置', '结果可以复现'],
                            ['接口错误与重试次数', '识别网络抖动造成的假慢'],
                            ['HTML 与 payload 数量', '确认产物完整']
                        ]
                    }
                },
                {
                    heading: '到底在等编译，还是在等接口',
                    paragraphs: [
                        '只有一行“generate finished in 40m”时，所有猜测都像真的。我在路由准备脚本记录各数据源耗时，在请求层按接口类型计数，并通过预渲染 Hook 记录慢路由和失败路由。日志不输出完整 query、Token 或响应，只保留经过脱敏的路由类型、耗时与错误分类。',
                        '路由级日志不能每生成一页就打印很多行，否则 9000 多页本身会制造大量 I/O。我保留固定间隔的进度摘要，结束后再输出最慢的一小组路由和分类统计。'
                    ],
                    code: `const buildMetrics = {
  completed: 0,
  failed: 0,
  slowRoutes: [] as Array<{ route: string; duration: number }>
}

export default defineNuxtConfig({
  nitro: {
    hooks: {
      'prerender:generate'(route) {
        // 实际项目在请求入口记录开始时间，
        // 这里只展示聚合结果的结构。
        if (route.error) buildMetrics.failed += 1
        else buildMetrics.completed += 1
      },
      close() {
        console.table(buildMetrics.slowRoutes.slice(0, 20))
      }
    }
  }
})`,
                    note: '示例省略了计时上下文的传递。正式日志只保存路由模板或脱敏标识，避免把真实查询参数和页面数据带进 CI 日志。'
                },
                {
                    heading: '公共数据不要跟着每一页重拿',
                    paragraphs: [
                        '统计之后最明显的问题是公共字典、站点配置、导航等数据在很多页面里重复请求。单独打开一个详情页时，这些请求合理；放到 9000 多页的预渲染过程中，同一份低频变化的数据会被反复获取。',
                        '处理方式不是给所有请求无脑加永久缓存，而是在单次构建进程内，对真正与路由无关的数据做 Promise 级缓存。缓存 Promise 可以合并同一时刻的并发请求；请求失败时必须删除缓存，让后续重试有机会恢复。',
                        '详情数据的 key 必须包含语言、内容类型和 id。把不同页面误用同一个 useAsyncData key，速度可能变快，却会把 A 页数据写进 B 页 payload，这比慢更严重。'
                    ],
                    code: `const buildCache = new Map<string, Promise<unknown>>()

export function oncePerBuild<T>(
  key: string,
  loader: () => Promise<T>
): Promise<T> {
  const cached = buildCache.get(key)
  if (cached) return cached as Promise<T>

  const pending = loader().catch(error => {
    buildCache.delete(key)
    throw error
  })

  buildCache.set(key, pending)
  return pending
}

// 与具体路由无关，可以在本次构建内复用
const dictionary = await oncePerBuild(
  \`dictionary:\${locale}\`,
  () => api.getDictionary(locale)
)`,
                    table: {
                        headers: ['数据类型', '缓存策略', 'key 至少包含'],
                        rows: [
                            ['公共字典', '单次构建复用', '语言、版本'],
                            ['站点导航/公共配置', '单次构建复用', '站点、端、语言'],
                            ['详情正文', '只合并相同页面请求', '类型、id、语言'],
                            ['用户态数据', '不进入 SSG', '静态页面不应依赖登录态'],
                            ['易变或带副作用接口', '不缓存', '从生成流程移除或显式处理']
                        ]
                    }
                },
                {
                    heading: '有些请求藏在公共组件里',
                    paragraphs: [
                        '有些公共组件在 setup 中自己请求配置，页面入口看不到依赖。一个页面组合几个这样的组件，生成时就出现多组隐式请求，而且 PC、移动端和中英文模板还可能各写一份。',
                        '我把静态生成必需的数据尽量提升到页面或明确的 composable 中，再通过 props 传给展示组件。公共组件保留渲染职责，不再因为被引用就自动访问远程接口。这样不仅方便共享缓存，也能在页面级别看出生成一页需要哪些数据。',
                        '并不是所有组件都必须做成纯组件。重点是构建阶段的网络行为可见，特别是出现在 9000 多条路径上的组件。'
                    ],
                    table: {
                        headers: ['调整前', '调整后', '带来的变化'],
                        rows: [
                            ['Header 自己请求导航', '布局统一取得并下发', '同站点数据可复用'],
                            ['详情子组件再次请求正文', '页面取得后传 props', '消除同页重复请求'],
                            ['组件内部猜语言', '页面显式传 locale', '缓存 key 不再含糊'],
                            ['接口失败只显示空白', '页面阶段抛出带路由错误', '失败能定位'],
                            ['PC/移动端各自转换数据', '共享数据转换函数', '减少重复 CPU 工作']
                        ]
                    }
                },
                {
                    heading: '纯浏览器交互先从生成过程里分开',
                    paragraphs: [
                        '部分交互组件依赖 window、canvas 或体积较大的浏览器库。页面静态生成只需要输出占位结构和首屏文本，却在服务端渲染路径里加载、初始化甚至转换数据。',
                        '我先区分 SEO/首屏必须内容和 Hydration 后才需要的交互。纯浏览器能力放进 ClientOnly 或动态导入；图表如果首屏必须展示，则保留可在服务端生成的结构和数据，不用“全部客户端化”来换构建速度。',
                        '动静代码拆分后还要检查生成 HTML。页面构建变快但正文、标题或内部链接从 HTML 消失，会影响静态化最初要解决的收录和首屏问题。'
                    ],
                    note: 'ClientOnly 不是通用性能开关。公开正文、标题、结构化数据和重要链接仍应出现在静态 HTML 中。'
                },
                {
                    heading: '再试并发，不只看哪次最快',
                    paragraphs: [
                        '减少重复请求和无关工作以后，并发才有调节价值。并发太低，CPU 和接口能力没有利用；并发太高，内存峰值、接口排队和超时重试会一起增加。一次跑得最快的数字不一定适合持续构建。',
                        '我用几档配置重复运行，记录总耗时、峰值内存、接口错误和重试。最终选择的不是单轮最短值，而是多轮波动更小、不会明显增加失败的档位。接口侧有限流时，还需要间隔或请求队列控制节奏，不能把压力问题推给后端。'
                    ],
                    table: {
                        headers: ['现象', '通常说明', '处理方向'],
                        rows: [
                            ['提高并发后耗时不降', '瓶颈不在并发或已饱和', '先看 CPU、接口与重复工作'],
                            ['超时和 429 增多', '接口承压过高', '降低并发、增加间隔'],
                            ['内存持续增长', '页面状态或缓存无边界', '检查缓存 key 和对象生命周期'],
                            ['前半段快、后半段明显慢', '资源竞争或重试累积', '按阶段和路由类型统计'],
                            ['每轮结果波动很大', '外部接口或机器负载不稳', '重复测量，不取单次最好值']
                        ]
                    }
                },
                {
                    heading: '快了以后，抽查产物有没有少东西',
                    paragraphs: [
                        '完成这些调整后，9000 多个页面的构建从约 40 分钟降到了约 15 分钟。这个数字是项目里的整体结果，不是针对某一个 Nuxt 配置做的性能测试，也不能拆成“加缓存快多少、改并发快多少”简单相加。',
                        '我没有把升级 Nuxt 3 本身的收益单独算成这个数字，也没有用删除页面换时间。前后都核对相同的路由清单、HTML/payload 数量和错误报告，并抽样直接打开静态文件。'
                    ],
                    steps: [
                        '确认路由总数、分类数量与清单校验值一致。',
                        '检查生成的 HTML、payload 和必要静态资源数量。',
                        '抽样 PC、移动端、中文、英文及不同详情模板。',
                        '对比标题、正文、canonical、内部链接和结构化数据。',
                        '从静态服务器直接访问深层 URL，不依赖客户端跳转。',
                        '至少连续执行多轮，观察耗时波动和失败率。',
                        '保留慢路由、失败路由和接口重试摘要。'
                    ]
                },
                {
                    heading: '还有失败后重跑的时间',
                    paragraphs: [
                        '15 分钟仍然不是一个很短的反馈周期，但失败时已经能看到具体阶段、路由类型和脱敏后的错误。以前构建在后半段退出，只知道要再等一次；现在至少可以先判断是路由数据、某类页面还是外部接口。',
                        '后续还可以考虑按内容变化做增量生成，但那会改变发布和缓存模型，不适合只为了继续压缩数字就马上引入。当前先保证全量构建稳定、结果可核对。'
                    ]
                }
            ],
            closing:
                '至少现在改完内容不用再等那么久，失败时也能先找具体路由。不过全量重跑还是要十几分钟，后面新组件里再加请求，我会特别看一下它会被执行多少次。几行看着很轻的代码，乘上几千页就不一定了。'
        })
    },
    {
        id: 15,
        title: 'VXE-Table 用久了，麻烦的都是表格外面的事',
        description: '查询、重置、跨页勾选和导出，单独看都不复杂，放在同一个页面就容易互相影响。',
        icon: 'Vue',
        createdAt: '2023-08-20 14:12:00',
        updatedAt: '2023-08-20 23:24:00',
        publishedAt: '2023-08-20 22:39:00',
        tags: ['Vue.js', 'TypeScript'],
        tech: ['Vue'],
        content: renderArticle({
            intro: '后台需求里，表格可能是最容易低估工时的东西。“加个筛选”“记住勾选”“导出一下”，听起来都很小。等它们放在一起，就开始遇到问题：筛选后还停在第八页，翻页以后不知道到底勾了谁，导出的条件又跟页面不一样。最近用 Vue 3 和 VXE-Table 做这类页面，顺手整理一下这些地方。',
            closingHeading: '还没必要封装成万能表格',
            sections: [
                {
                    heading: '哪些状态该记住，哪些应该清掉',
                    paragraphs: [
                        '如果只看 UI，表格就是 filters + columns + rows；从交互看，至少还有查询状态、展示偏好、临时选择和权限能力。它们的生命周期完全不同，不应该全部塞进一个 reactive 对象。',
                        '查询条件需要能序列化、能发给接口，也可能要同步到 URL；列宽和显隐属于用户展示偏好，可以落本地；勾选项只对当前操作会话有效；权限由服务端和用户身份决定，不能因为本地记住了某一列就继续展示。'
                    ],
                    table: {
                        headers: ['状态类型', '例子', '建议来源', '刷新后是否保留'],
                        rows: [
                            ['查询状态', '筛选、分页、排序', '页面 query model / URL', '按产品需求'],
                            ['展示偏好', '列显隐、列宽、密度', '本地存储或用户配置', '通常保留'],
                            ['临时操作', '勾选行、展开行、编辑中单元格', '当前页面组件', '通常清空'],
                            ['权限能力', '可见字段、可执行按钮', '服务端权限结果', '重新确认'],
                            ['远程数据', 'rows、total、summary', '接口响应', '重新请求']
                        ]
                    }
                },
                {
                    heading: '点查询和翻页，别各拼一套参数',
                    paragraphs: [
                        '以前筛选表单维护一份值，表格分页器维护一份 page，排序事件又直接拼请求参数。点击查询、翻页和恢复 URL 走三套逻辑，很容易出现界面显示的条件与接口实际收到的不一致。',
                        '现在我先定义一个可序列化的 TableQuery。所有用户动作都先修改它，再由同一个 loadTable 生成接口参数。筛选条件变化时明确把页码重置为 1；切换分页和排序时不静默清掉用户已经选择的筛选项。',
                        '有“查询”按钮的表单，还得区分输入框里的草稿和已经生效的查询。用户改了关键词但没点查询，随后点导出，应该导出当前表格对应的结果，而不是偷偷带上新输入的词。只用一个 filters 对象时容易混过去，最好把 appliedQuery 单独留下。'
                    ],
                    code: `type SortOrder = 'asc' | 'desc' | null

type TableQuery = {
  keyword: string
  status: string[]
  page: number
  pageSize: number
  sortField?: string
  sortOrder: SortOrder
}

const query = reactive<TableQuery>({
  keyword: '',
  status: [],
  page: 1,
  pageSize: 20,
  sortOrder: null
})

async function submitFilters(filters: Partial<TableQuery>) {
  Object.assign(query, filters, { page: 1 })
  await loadTable(query)
}

async function changePage(page: number, pageSize: number) {
  Object.assign(query, { page, pageSize })
  await loadTable(query)
}`,
                    note: '不要用一个 deep watch 自动请求整个 query。输入框每敲一个字、恢复 URL 和批量赋值都可能触发请求；明确动作更容易控制防抖、取消和页码重置。'
                },
                {
                    heading: '刷新后保留筛选，URL 里放多少东西',
                    paragraphs: [
                        '有些列表需要把链接发给同事，刷新或返回后也希望保留筛选。这时 URL 很合适，但不能把所有表格状态都塞进去。列宽、勾选 ID、弹窗状态既不适合分享，也可能让地址长得不可控。',
                        '数组筛选、默认值和空字符串要有固定序列化规则。读取 URL 时先校验字段和允许的排序列，不把任意 query 直接透传给接口。这样 URL 是查询快照，不是绕过前端约束的后门。'
                    ],
                    table: {
                        headers: ['适合写入 URL', '不适合写入 URL'],
                        rows: [
                            ['关键词、分类、状态', '行勾选结果'],
                            ['页码、每页数量', '当前编辑中的值'],
                            ['允许的排序字段和方向', '用户字段权限'],
                            ['时间范围等可分享条件', '列宽、滚动位置、弹窗开关']
                        ]
                    }
                },
                {
                    heading: '记住的列配置，换个账号不能直接沿用',
                    paragraphs: [
                        '列配置通常来自三部分：页面定义的全部列、服务端允许当前用户查看的字段、用户自己保存的显隐和顺序。正确顺序应该先取权限交集，再应用偏好。否则用户本地曾经显示过的字段，在权限回收后仍可能通过列配置被重新打开。',
                        '操作列里的按钮同样不能只靠 v-if。前端权限负责减少误操作和隐藏入口，接口仍必须校验用户是否有权执行。批量导出尤其要重新检查字段和数据范围，不能把屏幕上隐藏一列等同于服务端不会返回它。'
                    ],
                    code: `function resolveColumns(
  allColumns: ColumnConfig[],
  allowedFields: Set<string>,
  preference: ColumnPreference[]
) {
  const permitted = allColumns.filter(column =>
    !column.field || allowedFields.has(column.field)
  )

  return applyPreference(permitted, preference)
    .filter(column => column.visible !== false)
}

// 顺序不能反过来：
// allColumns -> permission -> user preference -> render`,
                    note: '列级隐藏不是数据安全措施。接口响应、导出任务和详情接口都必须按服务端权限裁剪字段。'
                },
                {
                    heading: '“全选”是这一页，还是所有查询结果',
                    paragraphs: [
                        '批量操作一开始只处理当前页很简单，需求变成“跨页选择”后，表格实例里的 checkbox records 就不再是完整答案。翻页会替换 rows，当前页没有渲染的对象也不应该一直存成完整响应。',
                        '我改成只保存稳定的业务 ID，并区分两种语义：选择若干条，或者选择当前查询下的全部结果再排除少量 ID。后一种不能真的把所有行下载到浏览器，提交任务时要把查询快照和 excludedIds 一起交给后端。',
                        '筛选条件改变后必须提示并清空选择，或者明确让选择绑定到旧查询快照。悄悄把新查询结果加入旧选择，会让批量操作范围无法解释。'
                    ],
                    table: {
                        headers: ['选择模式', '前端保存', '提交给后端'],
                        rows: [
                            ['当前页选择', 'selectedIds', '明确 ID 列表'],
                            ['跨页选择若干条', '跨页 selectedIds', '明确 ID 列表'],
                            ['选择查询全部结果', 'querySnapshot + excludedIds', '查询条件与排除项'],
                            ['筛选条件改变', '清空或二次确认', '不自动沿用旧范围']
                        ]
                    }
                },
                {
                    heading: '几十行的分页，先不用虚拟滚动',
                    paragraphs: [
                        'VXE-Table 支持虚拟滚动，但它会改变 DOM 中实际存在的行。固定行高、展开行、自适应内容高度、复杂合并单元格和某些编辑交互之间可能有约束。开启前要先看当前表格是不是适合虚拟化。',
                        '服务端分页已经把单页控制在几十条时，虚拟滚动未必带来明显收益，反而增加滚动和固定列问题。真正一次展示很多行时，我会先减少单元格中的重组件和响应式计算，再用生产数据验证滚动、行高、Tooltip、固定列与键盘操作。',
                        'row key 必须稳定。不能用数组 index，因为排序、筛选和局部更新后，同一个 index 已经不是同一条业务数据。'
                    ],
                    table: {
                        headers: ['场景', '先采用的策略'],
                        rows: [
                            ['普通服务端分页', '控制 pageSize，先不开虚拟滚动'],
                            ['大量只读、固定行高数据', '验证虚拟滚动'],
                            ['展开行/动态行高较多', '评估功能兼容，可能继续分页'],
                            ['单元格组件很多', '先简化渲染与计算'],
                            ['固定列很多', '减少固定范围，检查横向滚动'],
                            ['频繁编辑', '优先保证焦点、校验和数据一致']
                        ]
                    }
                },
                {
                    heading: '导出跟当前表格用同一份查询',
                    paragraphs: [
                        '小数据量导出当前页，可以使用表格已有能力；一旦需求是“导出当前筛选下的全部结果”，就不应该让浏览器偷偷翻完所有页再拼文件。那会绕过统一权限、占用大量内存，也无法稳定处理长任务。',
                        '更合理的做法是提交一个导出任务：包含经过校验的查询快照、排序、允许导出的字段和时区/语言，服务端重新校验权限并生成文件。页面显示任务状态，完成后再提供有时效的下载地址。',
                        '屏幕展示和导出语义也不完全一样。单元格里显示“--”不代表原始值就是字符串 --；百分比、金额和时间需要明确单位、精度和时区。'
                    ],
                    steps: [
                        '固定当前查询、排序和字段快照。',
                        '前端只提交白名单字段，不传任意数据库列名。',
                        '服务端重新校验用户、数据范围和字段权限。',
                        '创建异步任务并返回任务 ID。',
                        '页面轮询或接收任务状态，不长时间占用一个请求。',
                        '文件地址设置有效期，并记录导出审计信息。'
                    ]
                },
                {
                    heading: '几张表相似，也不急着全塞进配置',
                    paragraphs: [
                        '做过几张表后很容易想封装一个 SuperTable，把筛选、权限、分页、导出、弹窗和接口都用几十个配置项包起来。短期页面代码很少，长期却没人知道一个布尔值会影响哪些流程。',
                        '我现在更愿意拆成小能力：useTableQuery 管查询，列解析函数处理权限与偏好，useRowSelection 管选择语义，基础表格统一 loading、空状态、分页事件和错误展示。页面继续拥有接口和业务操作。',
                        '特殊单元格保留 slot 或 renderer 出口。公共层如果不能让业务逃出来，最后只会不断增加开关。'
                    ],
                    table: {
                        headers: ['公共能力', '不应该负责'],
                        rows: [
                            ['查询模型与分页约定', '猜业务筛选含义'],
                            ['Loading、空态、错误态', '吞掉接口错误'],
                            ['列权限解析流程', '替代后端鉴权'],
                            ['选择 ID 与选择模式', '决定批量业务规则'],
                            ['格式化接口和公共单位', '把所有单元格写死'],
                            ['稳定的事件与插槽', '用几十个开关覆盖每个页面']
                        ]
                    }
                },
                {
                    heading: '我容易漏测的几步',
                    items: [
                        '默认进入、带 URL 条件直达、刷新和浏览器返回。',
                        '修改筛选后页码归一，快速切换时旧请求不会覆盖新结果。',
                        '排序字段白名单、空值顺序和后端结果一致。',
                        '权限减少后，列、详情入口和导出字段同时收敛。',
                        '跨页选择、条件变化、全选与排除项语义清楚。',
                        '空数据、接口失败、超时和无权限状态有不同反馈。',
                        '窄屏、固定列、横向滚动和长文本 Tooltip 可用。',
                        '导出内容与查询快照一致，时间、金额和百分比格式正确。'
                    ]
                }
            ],
            closing:
                '现在我宁可在页面里保留一点重复的业务代码，也不想把每张表的特殊流程都挤进公共配置。先抽查询、分页和空状态这些真的一样的部分就够了。全选和导出则最好在提需求时问清楚，否则写完以后很容易再来一轮。'
        })
    },
    {
        id: 16,
        title: 'ECharts 和 D3 在项目里分别怎么用',
        description: '常规图表、特殊布局，以及比选库更常碰到的尺寸、空值和销毁问题。',
        icon: 'Vue',
        createdAt: '2023-09-24 14:05:00',
        updatedAt: '2023-09-24 23:17:00',
        publishedAt: '2023-09-24 22:31:00',
        tags: ['Vue.js', 'JavaScript'],
        tech: ['Vue'],
        content: renderArticle({
            intro: '项目里 ECharts 和 D3 都有用到，但写普通业务图表时，我还是先看 ECharts 能不能满足。坐标轴、图例、提示框这些现成的东西没必要每次重写。D3 更多是碰到特殊布局或数据计算时再拿出来用。这里记一下两边怎么配合，也记几个跟选库没什么关系、却经常影响展示的问题。',
            closingHeading: false,
            sections: [
                {
                    heading: '大多数业务图表先用 ECharts',
                    paragraphs: [
                        '折线、柱状、散点、饼图和常见地图，ECharts 已经把坐标轴、图例、Tooltip、DataZoom、动画和事件组织在一套 option 里。对后台和报告类页面来说，能稳定交付、让同组同事快速修改，比自由控制每一个 SVG 节点更重要。',
                        '用 D3 从头写一张普通折线图，需要自己处理比例尺、坐标轴、Hover、图例、Resize 和空状态。技术上可以，业务收益却很小。因此只要需求能用 ECharts 的 series、dataset 和自定义 formatter 清楚表达，我不会为了“更灵活”改用 D3。'
                    ],
                    table: {
                        headers: ['需求', '优先选择', '原因'],
                        rows: [
                            ['趋势、对比、占比等标准图', 'ECharts', '交互与组件完整'],
                            ['多图联动、缩放、图例筛选', 'ECharts', '已有事件和状态模型'],
                            ['树、网络、非标准空间布局', '先评估 D3', '布局算法与几何控制更自由'],
                            ['特殊数据分箱、比例尺、路径计算', 'D3 模块', '可以只使用计算能力'],
                            ['报告中需要统一主题的成套图表', 'ECharts', '配置和维护成本更低'],
                            ['一次性炫技动画', '先确认业务价值', '两边都不应先于信息表达']
                        ]
                    }
                },
                {
                    heading: '也可以只用 D3 算数据，不让它画图',
                    paragraphs: [
                        'D3 是一组可以单独使用的模块。d3-scale 把数据范围映射到位置、大小和颜色；d3-array 做分组和统计；d3-hierarchy、d3-force 负责树和关系网络的布局；d3-shape 生成线、面积和弧线路径。只有 d3-selection 这类模块会直接操作 DOM。',
                        '这意味着项目可以只借用 D3 的数据计算，把结果交给 ECharts 或 Vue 渲染，不必一引入 D3 就把整张图都改成手写 SVG。对非标准布局，我会先问 ECharts 能否表达；如果真正缺的是布局算法，就只引入对应模块。'
                    ],
                    code: `import { extent, group } from 'd3-array'
import { scaleLinear } from 'd3-scale'

const grouped = group(rows, row => row.category)
const valueRange = extent(rows, row => row.value) as [number, number]
const radius = scaleLinear(valueRange, [6, 28])

const seriesData = Array.from(grouped, ([category, items]) => ({
  name: category,
  type: 'scatter',
  data: items.map(item => [
    item.x,
    item.y,
    radius(item.value),
    item.label
  ])
}))

chart.setOption({ series: seriesData })`,
                    note: '示例只演示分工：D3 负责分组和比例映射，ECharts 负责坐标、Tooltip、图例和渲染。实际 visualMap、symbolSize 与数据格式需要按图表再定义。'
                },
                {
                    heading: '别让 Vue 和 D3 同时改一组节点',
                    paragraphs: [
                        '如果选择 D3 selection 直接创建 SVG 节点，就让 Vue 只拥有外层容器，D3 管容器内部。不要一部分圆点由 v-for 渲染，另一部分又让 D3 join 修改同一组节点，两套更新机制会互相覆盖。',
                        'ECharts 也是同样的边界：Vue 负责数据和容器生命周期，ECharts 实例负责 canvas/SVG 内部。数据变化时调用 setOption，不要靠重新渲染一个带随机 key 的容器来更新图表。',
                        '这条边界还能避免事件泄漏。图表 click、ResizeObserver 和 D3 simulation 都必须在组件卸载时解除或停止。'
                    ],
                    table: {
                        headers: ['对象', '负责方', '更新方式', '卸载时'],
                        rows: [
                            ['外层容器', 'Vue', '模板与样式', '组件自然卸载'],
                            ['ECharts 内部节点', 'ECharts', 'setOption / dispatchAction', 'dispose'],
                            ['D3 SVG 内部节点', 'D3', 'data join 或统一重绘', '移除事件与节点'],
                            ['force simulation', 'D3', '更新 nodes/forces', 'simulation.stop'],
                            ['容器尺寸监听', 'ResizeObserver', 'chart.resize / 重算布局', 'disconnect']
                        ]
                    }
                },
                {
                    heading: '侧栏收起来了，图表怎么还是原来的宽度',
                    paragraphs: [
                        '只监听 window.resize 不够。SaaS 页面常有侧栏收缩、标签切换和面板拖拽，容器宽度变化时窗口本身未必变化。ResizeObserver 更接近实际容器，但回调也要做节流，隐藏容器宽高为 0 时不要反复 resize。',
                        '标签页切换或 v-if 会移除 DOM。旧 ECharts 实例如果不 dispose，事件和渲染资源仍可能留着；节点再次出现时还要重新 init。官方文档也特别提醒，容器被移除时应释放实例。'
                    ],
                    code: `const container = ref<HTMLDivElement>()
let chart: echarts.ECharts | undefined
let observer: ResizeObserver | undefined

onMounted(() => {
  if (!container.value) return

  chart = echarts.init(container.value)
  chart.setOption(createOption(props.data))

  observer = new ResizeObserver(entries => {
    const { width, height } = entries[0].contentRect
    if (width > 0 && height > 0) chart?.resize()
  })
  observer.observe(container.value)
})

watch(() => props.data, data => {
  chart?.setOption(createOption(data), { notMerge: false })
}, { deep: false })

onBeforeUnmount(() => {
  observer?.disconnect()
  chart?.dispose()
})`
                },
                {
                    heading: '0.12 到底显示 0.12%，还是 12%',
                    paragraphs: [
                        '最早封装图表时，我倾向给 ECharts option 包一层，把 title、legend、grid 都设成默认值。后来发现真正重复出错的是单位、空值、精度、时间和颜色语义。两个页面都叫增长率，一个接口返回 0.12，另一个返回 12，如果 formatter 各写一份，迟早会显示错。',
                        '现在公共层更关注指标定义和格式化，再提供少量主题、字体、Tooltip 和空状态约定。页面仍然能传入完整 series，特殊图不用为了进入公共组件而转换成奇怪的配置。'
                    ],
                    table: {
                        headers: ['需要统一', '要写清楚的问题'],
                        rows: [
                            ['指标值', '原始值、单位、倍率、精度'],
                            ['时间', '时间戳/字符串、时区、粒度'],
                            ['缺失值', '0、null、无权限、未采集的区别'],
                            ['颜色', '类别色、顺序色、正负语义'],
                            ['Tooltip', '字段名称、单位、排序、空值'],
                            ['空状态', '无数据、请求失败、无权限分别展示'],
                            ['导出图片', '背景、像素比、水印和标题来源']
                        ]
                    }
                },
                {
                    heading: '一张小图里放不下所有数据点',
                    paragraphs: [
                        '一条折线塞进非常多点，即使 Canvas 能画出来，用户也很难在有限像素里分辨。后台数据可视化首先要确定时间粒度、聚合方式和用户要回答的问题，再决定抽样、分箱或缩放。',
                        'ECharts 的 DataZoom 和渐进渲染能改善交互，D3 也能做分箱和聚合，但这些都不能替代数据口径。抽样后要保留极值还是趋势、多个系列是否用同一时间窗口，应该在数据转换层明确，而不是藏进 formatter。',
                        '对关系图同样如此。节点和边全部展示往往变成一团线，先按权限与业务范围过滤、提供搜索和分层展开，比调力导向参数更有效。'
                    ],
                    steps: [
                        '先写清图表要回答的业务问题和指标口径。',
                        '确认横纵轴、颜色、大小分别编码什么。',
                        '确定时间粒度、聚合与缺失值规则。',
                        '用接近真实上限的数据验证渲染和交互。',
                        '必要时使用抽样、分箱、聚合或分层展开。',
                        '检查 Tooltip、图例和导出是否仍能解释处理后的数据。',
                        '为无数据、无权限、失败和部分数据提供不同状态。'
                    ]
                },
                {
                    heading: '加图表前，我会先过一下',
                    items: [
                        '能用 ECharts 标准 series 清楚表达，就先用 ECharts。',
                        '缺的是数据计算或比例尺，只引入对应的 D3 模块。',
                        '缺的是特殊布局，再评估 d3-hierarchy、d3-force 等能力。',
                        '需要 D3 操作 SVG 时，划清 Vue 与 D3 的 DOM 所有权。',
                        '无论哪种实现，都统一指标语义、主题、Resize 和销毁。',
                        '图表效果与可理解性冲突时，优先让用户看懂数据。'
                    ]
                }
            ],
            closing:
                '图能画出来以后，我一般还会换一组全零、缺值和特别长的名称试试。演示数据太规整，很容易把问题藏住。再切一下标签页、收一下侧栏，确认尺寸恢复正常；这些小地方处理完，图表才算能放回业务页面里。'
        })
    },
    {
        id: 17,
        title: '用 GitHub Actions 触发测试和预发部署',
        description: '构建仍然放在已有部署服务器上，Actions 负责串流程。记录环境变量、执行顺序和失败处理。',
        icon: 'Server',
        createdAt: '2023-10-22 13:57:00',
        updatedAt: '2023-10-22 23:29:00',
        publishedAt: '2023-10-22 22:44:00',
        tags: ['DevOps', 'Node.js'],
        tech: ['Node.js'],
        content: renderArticle({
            intro: '个人项目里用过 GitHub Actions，最近也把它引进了工作项目的测试和预发部署。已有部署服务器还在用，构建和部署照旧在那边完成，没有全部搬去 GitHub 的机器。主要是把提交之后要做的检查、触发和看结果串起来，少一点手动来回操作。',
            closingHeading: '先把测试和预发用顺',
            sections: [
                {
                    heading: '原来怎么发，先照着走一遍',
                    paragraphs: [
                        '原流程大概是登录部署服务器、切到项目目录、拉指定分支、安装依赖、执行构建，再把产物放到 Web 服务读取的目录。每个人记住的命令略有差异，Node 版本、是否清依赖和失败后的处理也不完全一样。',
                        '我先没有写 YAML，而是把分支与环境、Node/pnpm 版本、构建命令、产物目录、服务检查和回退方式逐项确认。只有人工流程能重复，自动化才有稳定输入。'
                    ],
                    table: {
                        headers: ['要确认的事情', '测试环境', '预发环境'],
                        rows: [
                            ['触发方式', '开发分支更新后自动', '指定分支手动触发'],
                            ['环境变量', '测试接口与公开配置', '独立的预发配置'],
                            ['部署目录', '测试 release 目录', '预发 release 目录'],
                            ['并发策略', '新提交可以取消旧构建', '同一时刻只允许一次部署'],
                            ['发布确认', '基础检查通过后自动', '保留人工确认步骤'],
                            ['失败处理', '不切换 current', '保留上一个可用 release']
                        ]
                    },
                    note: '本文只记录测试和预发环境，没有把这套流程描述成已经覆盖生产。生产发布、服务器权限和网络策略仍需要后端、运维共同确定。'
                },
                {
                    heading: 'YAML 里留步骤，具体命令放脚本',
                    paragraphs: [
                        '部署命令如果全部展开在 workflow 中，本地脚本、测试流程和服务器操作很容易出现三套版本。最后我把服务器侧步骤收进一个受版本控制的部署脚本，Actions 只传环境和 commit SHA。',
                        '测试环境由开发分支 push 触发；预发保留 workflow_dispatch，选择明确的提交后执行。每个 job 都设置超时和并发组，避免两次部署同时写同一个目录。'
                    ],
                    code: `name: deploy-frontend

on:
  push:
    branches: [develop]
  workflow_dispatch:
    inputs:
      target:
        type: choice
        options: [test, staging]
        required: true

permissions:
  contents: read

concurrency:
  group: frontend-\${{ inputs.target || 'test' }}
  cancel-in-progress: \${{ github.event_name == 'push' }}

jobs:
  verify:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version-file: .nvmrc
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm build

  deploy:
    needs: verify
    runs-on: ubuntu-latest
    environment: \${{ inputs.target || 'test' }}
    timeout-minutes: 20
    steps:
      - name: Trigger deployment server
        run: ./scripts/trigger-deploy.sh "\${GITHUB_SHA}" "\${TARGET}"
        env:
          TARGET: \${{ inputs.target || 'test' }}
          DEPLOY_HOST: \${{ secrets.DEPLOY_HOST }}
          DEPLOY_TOKEN: \${{ secrets.DEPLOY_TOKEN }}`,
                    note: '示例省略了公司部署服务器的接入细节。实际脚本需要校验 target 和 SHA，不能把 workflow 输入直接拼进远程 Shell 命令。第三方 Action 也应固定可信版本或提交 SHA。'
                },
                {
                    heading: '为什么这里会构建两次',
                    paragraphs: [
                        '当前前端项目会在构建阶段注入不同环境的接口地址和公开配置，所以测试产物不能直接原样提升到预发。Actions 中的 build 主要验证当前提交能否干净安装和构建；部署服务器会在受控环境中按目标配置再次生成最终产物。',
                        '这不是最理想的“build once, deploy many”，但符合现有项目事实。如果未来把运行时配置从前端 bundle 中分离，可以让同一份经过校验的 artifact 在不同环境间流转。现在不能为了流程好看，假装两次构建等价。',
                        '缓存只用于依赖下载，不把构建产物当缓存。缓存丢失时流程必须仍能成功；锁文件变化后缓存 key 也必须变化。'
                    ],
                    table: {
                        headers: ['对象', '用途', '能否作为发布证据'],
                        rows: [
                            ['pnpm store cache', '减少依赖下载时间', '不能'],
                            ['verify job 的构建结果', '证明提交可安装、可构建', '只证明 CI 配置下通过'],
                            ['部署服务器的 release 目录', '目标环境最终产物', '可以，需关联 SHA'],
                            ['Workflow 日志', '记录步骤、时间与结果', '辅助证据'],
                            ['健康检查结果', '确认静态资源和入口可访问', '发布后验证']
                        ]
                    }
                },
                {
                    heading: '构建失败，别碰正在访问的目录',
                    paragraphs: [
                        '以前直接覆盖当前目录时，构建失败可能留下一半新文件；HTML 已更新但带 hash 的资源还没复制完，也可能出现短暂 404。服务器脚本改成每个提交建立独立 release 目录，在里面完成安装、构建和检查，全部通过后再切换 current 指向。',
                        '回退也不再是重新拉旧分支构建，而是把 current 指回上一个确认可用的 release。旧目录只保留有限数量，并在确认没有访问后清理。'
                    ],
                    code: `# 伪代码：部署服务器上的核心顺序
release_dir="/srv/frontend/releases/\${commit_sha}"

validate_sha "\${commit_sha}"
create_release "\${release_dir}"
checkout_exact_commit "\${commit_sha}" "\${release_dir}"
install_frozen_dependencies "\${release_dir}"
build_for_target "\${target}" "\${release_dir}"
verify_static_output "\${release_dir}/dist"

# 前面的任一步失败，都不会改变 current
switch_current_link "\${release_dir}/dist"
verify_deployed_entry "\${target}"
record_deployment "\${target}" "\${commit_sha}"
cleanup_old_releases`
                },
                {
                    heading: '前端环境变量不是保密的地方',
                    paragraphs: [
                        '公开接口地址、环境名称等非敏感配置可以作为环境变量；部署令牌、SSH 私钥之类必须进入 secrets。测试和预发使用不同的环境配置，job 只有引用对应 environment 后才能读取那一组值。',
                        '即使 GitHub 会遮罩 secret，也不能主动 echo、写入 artifact 或打包进前端代码。以 VITE_、NEXT_PUBLIC_ 等方式注入的变量最终会进入浏览器 bundle，它们只能保存公开配置，不能当服务端密钥。',
                        'GITHUB_TOKEN 权限也显式收窄。这个流程只需要读取仓库，不需要 issues、packages 等写权限。服务器侧令牌同样只允许触发指定项目和环境，不能获得一台机器的任意命令权限。'
                    ],
                    table: {
                        headers: ['配置', '放置位置', '注意事项'],
                        rows: [
                            ['公开 API Base URL', 'environment variable', '会进入前端产物'],
                            ['部署服务器地址', 'variable 或 secret', '视内部网络信息级别决定'],
                            ['部署令牌/SSH 私钥', 'environment secret', '最小权限、定期轮换'],
                            ['known_hosts', '受控配置', '不要关闭主机校验'],
                            ['Node / pnpm 版本', '仓库文件或 workflow', '确保本地与 CI 一致'],
                            ['业务私钥', '不进入前端部署流程', '由服务端管理']
                        ]
                    }
                },
                {
                    heading: '连续推两次代码，哪次最后上线',
                    paragraphs: [
                        '测试分支短时间连续 push 时，如果两个任务并行，先启动的旧提交可能最后才构建完，并覆盖较新的版本。测试环境可以用 concurrency 取消已经过期的流水线，节省等待时间。',
                        '预发更谨慎：同一环境不要并行切换版本。需要注意，GitHub 的 concurrency 不是保证按提交顺序逐个执行的任务队列，不能据此假设每次提交都会部署。最终要看实际完成的 SHA。',
                        '还有个容易误会的地方：Actions 取消了，不代表远端已经启动的构建也停了。如果触发接口只是提交任务就返回，远端仍然可能继续跑。因此部署服务器自己也需要控制同一环境的并发和版本切换，不能只靠 YAML 里的 cancel-in-progress。'
                    ],
                    steps: [
                        '触发时记录 branch、commit SHA、执行人和目标环境。',
                        'verify job 完成安装、Lint、类型检查与生产构建。',
                        '环境规则确认该分支或人工操作可以部署。',
                        '部署服务器只接受允许的项目、环境和完整 SHA。',
                        '在新 release 目录完成目标环境构建及产物检查。',
                        '原子切换 current，并请求入口与一项静态资源。',
                        '写入部署记录；失败时保留当前版本并给出阶段。',
                        '必要时将 current 指回上一 release，随后再调查。'
                    ]
                },
                {
                    heading: '构建报错了，Actions 也得显示失败',
                    paragraphs: [
                        'Lint 警告可以根据团队规则讨论，但依赖安装、类型检查、构建、产物检查和部署后健康检查不能为了“让流程变绿”随意忽略。continue-on-error 只适合确实不影响发布的辅助步骤，并且仍要在日志里可见。',
                        '部署脚本返回非零状态后，Workflow 必须失败。只在聊天群发一句“部署可能失败”但 Actions 显示成功，会让后续所有人误判环境版本。'
                    ],
                    table: {
                        headers: ['失败阶段', '是否切换版本', '下一步'],
                        rows: [
                            ['依赖安装/构建失败', '否', '修复提交后重跑'],
                            ['产物结构检查失败', '否', '检查构建配置'],
                            ['current 切换前健康检查失败', '否', '保留旧版本'],
                            ['切换后入口检查失败', '回退', '恢复上一 release'],
                            ['通知发送失败', '不回退', '标记辅助步骤失败'],
                            ['旧 release 清理失败', '不回退', '记录并人工清理']
                        ]
                    }
                },
                {
                    heading: '服务器这边还是要一起配合',
                    paragraphs: [
                        '我负责梳理前端检查、Workflow 和已有部署服务器的衔接，并与后端、运维确认目录、变量和权限。服务器安全、网络、生产策略和完整监控体系不是我单独完成的。',
                        '这篇把相关检查项也放在一起了，示例里的 release 目录和回退脚本需要按服务器现状调整，不能直接拿去覆盖现有部署。生产环境的发布策略还要另外讨论，这次先把测试和预发用起来。'
                    ],
                    note: '这是 2023 年 10 月的阶段记录。流程、Action 版本和 GitHub 功能会继续变化，真实项目应以锁文件、仓库设置和当时的官方文档为准。'
                }
            ],
            closing:
                '以后测试说“我这里还是旧的”，至少先有一个地方能查部署的是哪次提交、卡在哪一步。流程还不算复杂，先保证失败是真的失败，成功对应的是明确版本。通知和其他自动化慢慢补，不急着往一份 workflow 里塞完。'
        })
    },
    {
        id: 18,
        title: '用 Puppeteer 生成报告，先把 HTML 分页和图表等明白',
        description: '从报告模板到 PDF：什么时候可以打印，表格怎么跨页，字体和图表为什么需要单独等。',
        icon: 'Nodejs',
        createdAt: '2023-12-17 13:34:00',
        updatedAt: '2023-12-17 23:41:00',
        publishedAt: '2023-12-17 22:56:00',
        tags: ['Node.js', 'Puppeteer'],
        tech: ['Node.js'],
        content: renderArticle({
            intro: '报告服务用的是一个挺直接的办法：我先写好分页的 HTML 模板，Node 通过 Puppeteer 打开它，拿到数据、画完图表，再打印 PDF。模板里的表格、图表和分析文本都还是前端那套写法，调样式很方便。但浏览器里看着正常，打印出来未必正常，尤其是分页和“到底渲染完没有”这两件事。',
            closingHeading: '最后还是要打开 PDF 看',
            sections: [
                {
                    heading: '模板继续用 HTML 写',
                    paragraphs: [
                        '这类报告的内容本来就在 Web 页面中展示，前端已经有表格、图表、格式化和中英文样式。继续使用 HTML 可以复用这些能力，也方便用浏览器直接调试某一份报告。相比后端绘图库，复杂版式调整对前端更直观。',
                        '代价是服务端要运行完整 Chromium。字体、图片、网络、动画、页面尺寸和浏览器版本都会影响输出，浏览器崩溃也会成为任务失败的一种原因。它不是“免费获得 PDF”，而是把前端渲染能力带进后端任务系统。'
                    ],
                    table: {
                        headers: ['方案', '优势', '主要代价'],
                        rows: [
                            ['后端 PDF/绘图库', '输出过程可控、资源相对轻', '复杂图表和页面样式要重写'],
                            ['前端导出', '实现入口简单', '依赖用户浏览器，不适合批量任务'],
                            ['HTML + Puppeteer', '复用 Vue/图表/打印 CSS', '需要管理浏览器、队列和资源'],
                            ['先截图再拼 PDF', '视觉接近页面', '文本不可搜索、长页和清晰度麻烦']
                        ]
                    }
                },
                {
                    heading: '页面、Node 和任务队列怎么接起来',
                    paragraphs: [
                        '业务接口只负责创建任务，不会让一个 HTTP 请求等待浏览器把报告生成完。任务进入队列后，由报告 Worker 领取；模板根据短期任务标识加载数据，完成渲染后通知 Puppeteer；生成的 PDF 再经过校验、加密和对象存储上传，最后回写结果。',
                        '前端页面轮询任务状态，只关心排队、处理中、成功或失败，不直接连接某个容器。弹性容器可以增加或释放，任务状态仍然留在公共存储中。'
                    ],
                    flow: [
                        { title: '创建任务', detail: '保存报告参数与权限快照' },
                        { title: '进入队列', detail: '等待 Worker 领取任务' },
                        { title: '渲染模板', detail: '请求数据并生成图表、表格' },
                        { title: '打印 PDF', detail: 'Puppeteer 使用 print CSS' },
                        { title: '校验加密', detail: '检查文件后设置报告密码' },
                        { title: '上传存储', detail: '写入对象存储并限制访问' },
                        { title: '回写结果', detail: '任务成功或记录失败阶段' }
                    ]
                },
                {
                    heading: '模板从 query 拿标识，再请求报告数据',
                    paragraphs: [
                        '模板入口会从头部 query 读取任务标识，再请求对应的报告数据。URL 里只放短期、不可猜测且只能用于该任务的标识，不放姓名、用户数据、长期 Token 或完整报告参数。服务端仍会校验任务状态和 Worker 身份。',
                        '报告模板不是普通业务详情页。它只允许报告服务所在网络访问，禁用不需要的第三方脚本和用户交互；接口只返回生成当前报告所需的字段。任务完成或过期后，临时访问能力立即失效。',
                        '部分分析文本来自 AI 服务，但对模板来说它只是任务数据的一部分。缺失、超时或结构不符合约定时要显示明确状态，不能因为一段分析没返回就永远等在 Loading。'
                    ],
                    table: {
                        headers: ['URL / 请求中可以出现', '不应该出现'],
                        rows: [
                            ['短期 reportTaskId', '姓名、联系方式等原始个人数据'],
                            ['一次性或短时签名', '长期登录 Token'],
                            ['模板版本', '对象存储永久密钥'],
                            ['必要的语言/版式标识', '完整权限范围和内部接口地址']
                        ]
                    },
                    note: '“地址只有内部人知道”不是访问控制。模板接口、对象存储和最终下载都必须分别校验权限与有效期。'
                },
                {
                    heading: '接口结束了，图表可能还在动',
                    paragraphs: [
                        '最早只等待 page.goto 的 networkidle。后来出现过接口结束了、图表动画还没完成，或者字体请求安静了但某张图片 decode 尚未结束。网络空闲只能说明网络状态，不能代表业务页面可打印。',
                        '模板因此暴露一个明确的 ready 协议：所有必要接口结束、字体和图片准备好、图表 setOption 完成、分页测量结束后，才把状态改成 ready。任何一个必要模块失败都写入 errors；可选分析缺失则进入 warnings，由产品规则决定能否继续。',
                        'Puppeteer 同时监听页面 console、pageerror 和 requestfailed。等待 ready 有总超时，不能使用无限等待。'
                    ],
                    code: `// 报告模板
declare global {
  interface Window {
    __REPORT__: {
      status: 'loading' | 'ready' | 'failed'
      warnings: string[]
      errors: string[]
    }
  }
}

window.__REPORT__ = {
  status: 'loading',
  warnings: [],
  errors: []
}

async function prepareReport() {
  try {
    const data = await loadReportData()
    await renderTables(data)
    await renderCharts(data, { animation: false })
    await document.fonts.ready
    await waitForImages()
    await calculatePageBreaks()
    window.__REPORT__.status = 'ready'
  } catch (error) {
    window.__REPORT__.errors.push(toSafeMessage(error))
    window.__REPORT__.status = 'failed'
  }
}`,
                    note: 'ready 必须由业务模板定义，不能简单 setTimeout 5 秒。固定等待在数据少时浪费时间，数据多时又可能过早打印。'
                },
                {
                    heading: '给打印脚本一个明确的 ready',
                    paragraphs: [
                        'Worker 打开页面后先检查主文档 HTTP 状态，再等待 window.__REPORT__.status 改变。失败时抓取一张脱敏截图、页面错误摘要和任务阶段，成功后才调用 page.pdf。',
                        '打印使用 print media，并让 CSS 中的 @page 尺寸优先。背景图表需要 printBackground；页边距由模板统一控制，避免 Puppeteer 参数和 CSS 各加一次。finally 中无论成功失败都关闭 Page，浏览器则按任务数量或内存情况定期重启。'
                    ],
                    code: `async function generatePdf(job: ReportJob, browser: Browser) {
  const page = await browser.newPage()

  try {
    page.setDefaultNavigationTimeout(60_000)
    page.setDefaultTimeout(120_000)

    const response = await page.goto(createSignedTemplateUrl(job), {
      waitUntil: 'networkidle2'
    })
    if (!response?.ok()) throw new Error('template navigation failed')

    await page.waitForFunction(
      () => window.__REPORT__?.status !== 'loading',
      { timeout: 120_000 }
    )

    const state = await page.evaluate(() => window.__REPORT__)
    if (state.status !== 'ready') throw new ReportRenderError(state.errors)

    await page.emulateMediaType('print')
    return await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true
    })
  } finally {
    await page.close()
  }
}`,
                    note: '当前 Puppeteer 版本应以项目锁文件为准。page.pdf 负责打印，不负责业务 ready、队列幂等或 PDF 密码。'
                },
                {
                    heading: '标题在上一页，表格却跑到了下一页',
                    paragraphs: [
                        '报告包含表格和图表，浏览器自动分页很容易把标题留在上一页、把表格行截成两半，或者让图表底部被切掉。我负责的模板会显式组织 page 区块，固定纸张尺寸与可用内容区，再由数据量决定一个表格拆成几页。',
                        'CSS 的 break-inside: avoid 适合不希望拆开的模块，但如果元素本身高于一页，浏览器仍然无法解决。长表格要在数据层分页并重复表头，文本要设置最大行数或继续页规则，不能只靠一个 CSS 属性。',
                        '图表关闭动画并给固定尺寸。颜色使用 -webkit-print-color-adjust，字体随容器镜像部署，避免 3000 多份报告同时访问不稳定的外部 CDN。',
                        '模板调试时我会刻意放一条很长的名称，再放一段比正常情况长得多的分析文本。只用短标题和整齐的表格做样例，分页看起来永远没问题。英文还要另看，长单词换行后高度会变，同一套“每页放多少行”的规则不一定适用。',
                        '表格分页也不能只按条数切。固定高度的简单行可以按数量分，带换行、备注或合并单元格的行需要另算。先保证不会截断内容，再讨论每一页是否刚好铺满；空一点比把最后一行裁掉好。'
                    ],
                    table: {
                        headers: ['内容类型', '分页策略', '容易遗漏'],
                        rows: [
                            ['封面/目录', '固定独立页', '页码是否计入'],
                            ['短文本模块', '避免标题与正文分离', 'AI 文本长度不稳定'],
                            ['长表格', '数据切页、重复表头', '合并单元格和空行'],
                            ['ECharts 图表', '固定宽高、不跨页', '动画、字体与背景色'],
                            ['图片', '限制尺寸并等待 decode', '加载失败占位'],
                            ['页眉页脚', '统一安全区域', '不能覆盖正文']
                        ]
                    }
                },
                {
                    heading: '集中生成时，再把任务交给多个容器',
                    paragraphs: [
                        '集中生成时，我们配合后端和运维开启多台阿里云弹性容器。每个容器从同一任务源领取工作，但同一个任务不能因为超时重投就产生多个最终文件。',
                        '下面是整理队列逻辑时的一种状态拆法，不是可以直接照抄的队列表结构。任务被取走以后，要能判断是谁在处理、处理多久了；如果用租约来避免任务一直卡住，还要考虑续租和过期。重复执行难以完全避免，最终保存结果时得防止旧任务把新结果覆盖。',
                        '浏览器并发不等于 CPU 核数越多越好。单份报告包含多个图表，Chromium 会占用明显的 CPU 和内存。每个容器先使用保守并发，观察任务耗时、浏览器崩溃和内存峰值，再通过增加容器扩吞吐。'
                    ],
                    table: {
                        headers: ['任务状态', '含义', '允许的下一状态'],
                        rows: [
                            ['pending', '等待领取', 'running / cancelled'],
                            ['running', 'Worker 持有有效租约', 'rendered / retrying / failed'],
                            ['rendered', 'PDF 已生成并校验', 'encrypting / failed'],
                            ['encrypting', '设置密码与权限', 'uploading / failed'],
                            ['uploading', '写入对象存储', 'succeeded / failed'],
                            ['retrying', '可恢复失败，等待退避', 'pending / failed'],
                            ['succeeded', '结果已记录', '终态'],
                            ['failed', '超过次数或不可恢复', '人工确认后重置']
                        ]
                    }
                },
                {
                    heading: '有些失败，重跑还是会失败',
                    paragraphs: [
                        '网络瞬时失败、浏览器意外退出、对象存储超时可以有限重试，并使用退避避免所有容器同时再次加压。模板代码报错、数据字段缺失、页数超过上限通常不会因为立即重试而恢复，应该直接进入失败并保留原因。',
                        '每次重试都重新创建 Page；连续出现浏览器级错误时重启 Browser。重试次数按阶段记录，不能让生成成功但上传失败的任务从头再跑一遍昂贵的渲染。'
                    ],
                    table: {
                        headers: ['失败类型', '是否自动重试', '保留信息'],
                        rows: [
                            ['接口短暂超时/限流', '有限退避重试', '接口类别、状态码、次数'],
                            ['Chromium 崩溃', '重建浏览器后重试', '容器、浏览器版本、阶段'],
                            ['模板 JavaScript 错误', '通常不立即重试', '模板版本、脱敏堆栈'],
                            ['必要数据缺失', '否', '校验字段与数据版本'],
                            ['PDF 校验失败', '有限重试', '页数、大小、校验原因'],
                            ['上传超时', '只重试上传', '对象 key 与请求 ID'],
                            ['权限或签名失败', '否', '任务状态与鉴权原因']
                        ]
                    }
                },
                {
                    heading: 'PDF 出来以后再做加密和上传',
                    paragraphs: [
                        'Puppeteer 输出 Buffer 后先检查文件头、大小和页数是否在合理范围，再交给单独的 PDF 处理步骤设置打开密码或权限。密码不会写进任务日志，也不会与 PDF 放在同一个可公开访问的位置。',
                        '上传对象存储时使用不可猜测且不含用户信息的 key，Bucket 保持私有，下载通过业务接口鉴权后签发短期地址。任务数据库记录对象 key，不保存永久公开 URL。',
                        '临时 HTML、截图和未加密 PDF 都设置清理策略。失败排查需要留证据，但不能为了调试无限期保留用户报告内容。'
                    ],
                    steps: [
                        '校验输出确实是 PDF，文件大小和页数在合理范围。',
                        '使用独立步骤完成密码或权限设置。',
                        '再次打开加密后的文件，确认密码和页数正确。',
                        '上传私有对象存储，key 不包含姓名等个人信息。',
                        '回写 taskId、模板版本、对象 key 和校验值。',
                        '通过业务权限签发短期下载地址。',
                        '按保留周期清理临时文件、截图和失败产物。'
                    ]
                },
                {
                    heading: '文件数量对了，还要抽查内容',
                    paragraphs: [
                        '数量对上只是第一层。我们会按报告类型、数据量和页数分层抽样，检查封面、目录、长表格、图表、AI 文本、页眉页脚、加密和下载。还要统计成功、重试、失败和超时任务，确认没有一直停在 running 的孤儿任务。',
                        '同一个输入和模板版本重复生成时，PDF 二进制不一定完全相同，因此不能只比较文件 hash。更实用的是核对页数、关键文本、图表数量、任务数据版本和视觉抽样。'
                    ],
                    table: {
                        headers: ['验收维度', '检查方式'],
                        rows: [
                            ['任务完整性', '总数 = 成功 + 失败 + 取消，无长期 running'],
                            ['版式', '按页数和模板类型抽样渲染截图'],
                            ['内容', '核对关键字段、表格行数和分析状态'],
                            ['图表', '数量、标题、空数据和极值样本'],
                            ['文件', '可打开、页数合理、密码生效'],
                            ['权限', '无权用户无法获取下载地址'],
                            ['资源', '观察容器 CPU、内存、浏览器重启与吞吐']
                        ]
                    },
                    note: '3K+ 是这次集中生成的数量级，不代表单台容器一次并发 3000 个浏览器页面。实际吞吐来自任务队列和多台弹性容器分摊。'
                }
            ],
            closing:
                '模板这一段我负责得比较多，所以检查时也会直接翻最终 PDF，不只看任务成功了没有。长表格的最后一页、缺数据的图、很长的分析文本，是我会优先抽的几类。集中生成的调度还有不少细节，后面再把队列和容器这部分单独整理。'
        })
    },
    {
        id: 19,
        title: '2023 年终总结（提纲）：开始从页面走向工程和服务',
        description: '2023 年 12 月 31 日留下的回顾提纲：Nuxt 3 重构、9000+ 页面构建、SaaS 数据页面、CI/CD 与 PDF 报告服务。',
        icon: 'coffee',
        createdAt: '2023-12-31 19:18:00',
        updatedAt: '2023-12-31 23:32:00',
        publishedAt: '2023-12-31 23:32:00',
        tags: ['JavaScript'],
        tech: [],
        content: renderArticle({
            intro: '今天是 2023 年最后一天。今年做的事情比去年更分散：Nuxt 2 到 Nuxt 3、9000 多页静态构建、SaaS 表格和图表、测试预发流水线，以及 Node.js + Puppeteer 报告服务。很多项目还在继续，暂时不急着写一个“完成转型”的结论，先留下时间线和以后要回答的问题。',
            sections: [
                {
                    heading: '今年可以确定的时间线',
                    table: {
                        headers: ['时间', '主要事情', '后续准备补充'],
                        rows: [
                            ['2023 年 2 月', '推进 Vue 2/Nuxt 2 到 Vue 3/Nuxt 3 升级', '$axios 与加密请求兼容的真实排查过程'],
                            ['2023 年 4 月', '将 9000+ 动态路由准备拆成独立脚本', '为什么不继续写在 nuxt.config'],
                            ['2023 年 6 月', '全量静态构建约 40 分钟降到约 15 分钟', '哪次测量推翻了最初猜测'],
                            ['2023 年 8 月', '处理 VXE-Table 复杂数据表格', '最难的一次状态或权限问题'],
                            ['2023 年 9 月', '在数据页面使用 ECharts 与 D3', '一个真正需要 D3 的具体图表'],
                            ['2023 年 10 月', '把 GitHub Actions 接入测试和预发', '与后端、运维怎样划分职责'],
                            ['2023 年 12 月', '参与 3000+ PDF 报告集中生成', '模板、队列和弹性容器的协作过程']
                        ]
                    },
                    note: '公开文章只保留技术结构和数量级，不写公司名称、客户信息、真实接口、服务器地址和报告数据。'
                },
                {
                    heading: '第一部分：Nuxt 重构里我真正负责了什么',
                    paragraphs: ['这一部分不能只写“主导升级”，需要把范围和协作说清楚：'],
                    items: [
                        '为什么当时决定从 Nuxt 2 升到 Nuxt 3？',
                        '我负责的是方案、页面迁移、请求层、构建还是哪些组合？',
                        '$axios 改为 $fetch 时，哪一条历史行为最晚才被发现？',
                        'PC、移动端、中英文站点之间，哪些能复用，哪些不能？',
                        '哪些决策由自己完成，哪些需要后端或其他同事配合？',
                        '升级后有什么确定收益，又留下了哪些兼容成本？'
                    ],
                    quote: '待补：用具体模块和一次问题说明“主导”，不要把团队结果全部写成个人完成。'
                },
                {
                    heading: '第二部分：第一次把构建当成数据流水线',
                    paragraphs: [
                        '9000 多个静态页面是今年最完整的一条技术主线：先稳定路由输入，再测量页面渲染，最后减少公共请求和构建中的重复工作。这里适合写一次判断如何逐步改变。',
                        '最终数字可以保留约 40 分钟到 15 分钟，但还需要补当时使用的测量方法，以及一次没有效果或产生副作用的尝试。'
                    ],
                    table: {
                        headers: ['准备回答', '需要的真实材料', '避免写成'],
                        rows: [
                            ['为什么慢', '阶段日志、接口计数、慢路由', '“Nuxt 2 性能差”'],
                            ['为什么拆路由脚本', '输入来源与失败分类', '只改一项配置'],
                            ['怎样证明没有少页面', '路由数、产物数、抽样', '只展示总耗时'],
                            ['并发怎样确定', '多轮耗时与失败率', '给出万能参数'],
                            ['个人贡献是什么', '自己修改和推动的环节', '完整系统都由一人完成']
                        ]
                    }
                },
                {
                    heading: '第三部分：从页面组件走到数据边界',
                    paragraphs: [
                        'SaaS 表格和图表让我开始反复处理查询状态、字段权限、导出范围、指标单位和大数据量展示。这部分不准备写用了多少组件库，而是写一次“页面正常但数据语义不对”的经历。',
                        '需要回头找一个可以公开的例子：例如筛选与 URL 不一致、跨页选择范围模糊、百分比单位不同，或者 ECharts 图表没有正确释放。没有具体例子前先保留问题。'
                    ],
                    items: [
                        '哪种表格状态最容易被多个地方同时修改？',
                        '字段隐藏与服务端权限之间发生过什么误解？',
                        'ECharts 和 D3 为什么同时存在于项目中？',
                        '公共组件什么时候减少了重复，什么时候增加了开关？',
                        '今年对“组件复用”的理解与 2021 年有什么不同？'
                    ]
                },
                {
                    heading: '第四部分：第一次把前端能力延伸到任务服务',
                    paragraphs: [
                        'GitHub Actions 和 PDF 报告都超出了单个页面的边界。前者连接代码提交、检查、部署服务器和环境；后者连接模板、任务队列、Chromium、加密与对象存储。',
                        '我负责前端模板、部分 Node.js 报告服务与流程衔接，但服务器、弹性容器和业务权限由后端、运维共同完成。这里需要写清协作，而不是用“全栈”两个字跳过细节。'
                    ],
                    table: {
                        headers: ['主题', '自己参与的部分', '需要明确的协作边界'],
                        rows: [
                            ['GitHub Actions', '前端检查、Workflow、部署衔接', '服务器权限与生产策略'],
                            ['HTML 报告模板', '分页、表格、图表、ready 状态', '报告数据接口与产品规则'],
                            ['Node 报告服务', 'Puppeteer 生成、任务阶段', '队列与基础设施'],
                            ['PDF 加密/存储', '流程接入与结果校验', '密钥、权限和对象存储'],
                            ['弹性容器', '配合验证并发与资源', '由后端、运维负责运行环境']
                        ]
                    }
                },
                {
                    heading: '第五部分：今年形成的排查习惯',
                    items: [
                        '先固定输入和基线，再比较性能结果。',
                        '把一个长链路拆成阶段，每个阶段留下状态和错误。',
                        '浏览器、Node 和构建环境分别验证，不用 dev 正常代替产物正常。',
                        '发现公共封装时先列职责，不先做万能组件。',
                        '数字优化后重新核对结果完整性和权限范围。',
                        '公开复盘时区分自己完成、参与和仅了解的部分。'
                    ],
                    note: '待补：为每个习惯找到一次真实案例。如果只有结论没有事件，就继续留在提纲里。'
                },
                {
                    heading: '给 2024 留下的问题',
                    steps: [
                        '继续补 Node.js 和浏览器自动化的稳定性，而不只会调用 Puppeteer。',
                        '尝试把长期采集任务做成可恢复、可观察的队列。',
                        '了解 Python 在数据处理和聚合中的适用位置。',
                        '把测试、预发流程继续补齐，但不越过服务器和生产权限边界。',
                        '为重要数据页面补上更可靠的类型、错误状态和权限验证。',
                        '选择一篇今年的文章，补进真实失败过程而不只写最后方案。',
                        '补一个工作之外的目标，由自己填写。'
                    ]
                }
            ],
            closing:
                '这篇依然只是提纲。2023 年确定发生的变化，是工作范围从页面实现逐渐延伸到构建流程、部署衔接和浏览器任务服务，但这不等于已经掌握完整后端或运维体系。等以后补写时，希望每个结论旁边都有一个当时真正发生过的事件，而不是把简历内容重新排列一遍。'
        })
    },
    {
        id: 20,
        title: 'Puppeteer 采集脚本：中断之后，别从第一页重来',
        description: '个人脚本和工作里的采集任务用下来，记一下断点、重试、字段校验和浏览器回收。',
        icon: 'Tool',
        createdAt: '2024-03-24 13:41:00',
        updatedAt: '2024-03-24 23:26:00',
        publishedAt: '2024-03-24 22:37:00',
        tags: ['Puppeteer', 'Node.js'],
        tech: ['Node.js'],
        content: renderArticle({
            intro: '我自己和工作里都用过 Puppeteer 做采集。写第一版的时候，注意力一般在怎么选中元素、怎么拿到文字；能拿到以后，才开始想另外一些事：跑到一半断了怎么办，页面没内容算不算成功，同一条数据会不会写两遍。这篇主要记这些后续要补的地方。',
            closingHeading: '下次重启时能接着跑',
            sections: [
                {
                    heading: '先确认哪些页面可以处理',
                    paragraphs: [
                        '采集对象首先应该是业务确认可以访问和使用的公开数据，或者有明确授权的数据源。robots.txt、网站条款、接口规则、版权、个人信息和请求频率都要在任务启动前确认。技术上能打开一个页面，不代表可以无限抓取和保存。',
                        '遇到登录失效、验证码或明显的访问限制时，任务应该暂停并进入人工处理，不用自动化去规避。站点返回 429 或 Retry-After 时应降低频率并等待，而不是切换身份继续加压。',
                        '采集结果也做最小化：只保存业务需要的字段，原始页面和截图设置保留期限，日志不记录 Cookie、账号或完整个人信息。'
                    ],
                    table: {
                        headers: ['启动前检查', '需要明确'],
                        rows: [
                            ['数据来源', '公开、授权或内部可用范围'],
                            ['robots.txt / 条款', '允许的路径、用途和限制'],
                            ['访问频率', '并发、间隔、可采集时段'],
                            ['身份与权限', '使用哪类账号，是否允许自动化'],
                            ['数据字段', '只采业务需要的最小集合'],
                            ['保存周期', '原始 HTML、截图、日志何时删除'],
                            ['退出条件', '429、验证码、权限变化时怎样暂停']
                        ]
                    },
                    note: 'robots.txt 是需要遵守的访问规则之一，不等于完整授权。业务合法性、站点条款、版权和隐私仍需分别确认。'
                },
                {
                    heading: '别只在控制台打印“第几条”',
                    paragraphs: [
                        '以前的脚本只是 for 循环 URL，控制台打印当前下标。进程崩溃后只能凭最后一行日志猜位置；中间插入新 URL 或排序变化，下标也失去意义。',
                        '我会给目标留稳定的标识，至少分清没处理、处理中、成功和失败。下面把过程拆得细一点，方便说明恢复位置；个人小脚本不一定需要每一步都建状态。多 Worker 才需要进一步考虑领取冲突和租约，别一上来就为了采几十页搭完整调度系统。'
                    ],
                    flow: [
                        { title: '发现目标', detail: '规范化 URL 与来源标识' },
                        { title: '等待采集', detail: '进入队列并按站点限速' },
                        { title: '打开页面', detail: '记录状态码与最终 URL' },
                        { title: '结构解析', detail: '提取候选字段和证据' },
                        { title: '数据校验', detail: '类型、完整性与业务规则' },
                        { title: '幂等写入', detail: '按稳定实体键更新结果' },
                        { title: '记录完成', detail: '保存版本、时间和摘要' }
                    ],
                    table: {
                        headers: ['状态', '含义', '后续动作'],
                        rows: [
                            ['pending', '等待 Worker', 'running'],
                            ['running', '持有有效租约', 'fetched / retrying / failed'],
                            ['fetched', '页面或响应已取得', 'parsed / invalid'],
                            ['parsed', '候选字段已提取', 'validated / invalid'],
                            ['validated', '通过结构与业务校验', 'succeeded'],
                            ['retrying', '可恢复失败并等待退避', 'pending / failed'],
                            ['blocked', '登录、验证或权限异常', '人工确认'],
                            ['succeeded / failed', '任务终态', '按策略复查或重置']
                        ]
                    }
                },
                {
                    heading: '超时可以再试，选择器错了先别试',
                    paragraphs: [
                        '选择器找不到、HTTP 503、429、页面跳到登录、字段类型错误和 Chromium 崩溃都叫“失败”，但处理方式完全不同。统一 catch 后立即重试三次，会让页面改版被重复访问，也会让限流更加严重。',
                        '网络瞬时错误可以退避重试；429 优先遵循 Retry-After；结构变化通常需要暂停同一规则并通知维护者；登录或验证码进入 blocked；数据校验失败要保存脱敏样本，不直接当空值写入。'
                    ],
                    table: {
                        headers: ['失败类型', '是否自动重试', '处理方式'],
                        rows: [
                            ['连接重置/短暂超时', '有限次数', '指数退避并加随机抖动'],
                            ['HTTP 429', '延后', '遵循 Retry-After，降低站点并发'],
                            ['HTTP 5xx', '有限次数', '记录状态码，较长退避'],
                            ['401/403/验证码', '否', '暂停并人工确认授权/登录'],
                            ['必要选择器缺失', '通常否', '规则可能变更，保存样本'],
                            ['字段校验失败', '否', '进入 invalid，不写正式数据'],
                            ['浏览器崩溃', '可重试', '重启 Browser，从检查点继续'],
                            ['明确 404/下线', '否', '记录来源状态，不重复访问']
                        ]
                    }
                },
                {
                    heading: '多个任务一起跑时，间隔也得一起算',
                    paragraphs: [
                        '每个 Worker 各自 sleep 并不能形成稳定限速，多进程同时运行时仍可能在同一秒发出很多请求。更可靠的是按 host 建立队列或令牌桶，统一控制并发与最小间隔。',
                        '收到 429 后暂停该 host，而不是只暂停当前 URL。重试时间加入少量随机抖动，避免一批任务在相同时间一起恢复。最大次数和最大总等待都要有限制。'
                    ],
                    code: `function retryDelay(attempt: number, retryAfter?: string) {
  const serverDelay = parseRetryAfter(retryAfter)
  if (serverDelay !== undefined) return serverDelay

  const exponential = Math.min(60_000, 1_000 * 2 ** attempt)
  const jitter = Math.floor(Math.random() * 500)
  return exponential + jitter
}

async function runWithRetry(task: CrawlTask) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      return await crawlOne(task)
    } catch (error) {
      const decision = classifyError(error)
      if (!decision.retryable) throw error

      await hostLimiter.pause(
        task.host,
        retryDelay(attempt, decision.retryAfter)
      )
    }
  }

  throw new Error('retry limit exceeded')
}`,
                    note: '示例只说明退避结构。真实任务还需要总超时、持久化 nextRunAt，并确保 Worker 重启后不会把等待状态丢掉。'
                },
                {
                    heading: '列表变了，原来的下标就不准了',
                    paragraphs: [
                        '断点至少要保存稳定目标标识、当前阶段、尝试次数、规则版本和最后错误。列表页翻页过程中，还要记录发现游标和已经入队的 sourceKey，避免重启后重复扩散任务。',
                        '页面抓取成功但入库失败时，不应该重新访问目标站点；可以从已保存的中间结果继续校验或写入。反过来，如果页面内容有时效，中间结果也要有过期时间，不能几天后继续处理一份已经失效的数据。',
                        '任务状态更新和正式数据写入都按幂等设计。至少一次投递是常见现实，同一个 task 被重复执行不能产生两条实体记录。'
                    ],
                    table: {
                        headers: ['检查点字段', '用途'],
                        rows: [
                            ['taskId / sourceKey', '稳定识别目标，不依赖数组位置'],
                            ['stage / status', '从获取、解析或写入阶段继续'],
                            ['attempt / nextRunAt', '控制重试次数和退避时间'],
                            ['ruleVersion', '知道使用了哪版解析规则'],
                            ['contentHash', '识别页面是否发生变化'],
                            ['rawSnapshotKey', '必要时重放解析，不重复访问'],
                            ['leaseOwner / leaseUntil', 'Worker 失联后安全回收任务'],
                            ['lastErrorCode', '聚合失败原因，不只存堆栈']
                        ]
                    }
                },
                {
                    heading: '两个链接，可能是同一条内容',
                    paragraphs: [
                        '同一实体可能有 PC/移动地址、带追踪参数的链接、重定向后的 canonical 地址，也可能从多个列表入口被发现。先做 URL 规范化可以去掉 hash、已知追踪参数和无意义尾斜杠，但它只能解决地址层重复。',
                        '业务去重需要更稳定的实体键，例如站点明确提供的公开 ID，或经过验证的字段组合。名称很容易变化或重名，不能单独当唯一键。合并两条候选记录时保留来源和规则，不静默覆盖冲突字段。'
                    ],
                    steps: [
                        '保存原始 URL，便于追踪来源。',
                        '解析并限制协议，只允许批准的 http/https host。',
                        '去除 fragment 和已确认无语义的追踪参数。',
                        '跟随有限重定向，记录最终 URL 与 canonical。',
                        '按规范 URL 去除请求层重复。',
                        '解析后再按公开 ID 或业务复合键做实体去重。',
                        '冲突字段进入规则或人工复核，不自动选择更长文本。'
                    ]
                },
                {
                    heading: 'Browser 可以复用，Page 用完要关',
                    paragraphs: [
                        '每个 URL 启动一个 Chromium 成本太高，所有任务永远共用一个 Page 又会让 Cookie、localStorage、事件和内存互相污染。现在更倾向复用 Browser，在任务或同一授权会话级创建 BrowserContext，结束后关闭 Context，让页面和存储一起回收。',
                        '图片、字体、视频是否拦截要按采集目标决定。只读 DOM 文本时可以减少不需要的资源；依赖懒加载、Canvas 或页面布局时，粗暴屏蔽图片和样式可能改变页面行为。开启 request interception 后，每个请求都必须 continue、respond 或 abort，否则页面会一直挂起。',
                        'Browser 运行一定任务数或达到内存阈值后平滑重启。发现 disconnected 事件时停止领取新任务，把持有任务退回可重试状态。'
                    ],
                    code: `async function withIsolatedPage<T>(
  browser: Browser,
  run: (page: Page) => Promise<T>
) {
  const context = await browser.createBrowserContext()
  const page = await context.newPage()

  try {
    page.setDefaultNavigationTimeout(45_000)
    page.setDefaultTimeout(30_000)
    return await run(page)
  } finally {
    await context.close()
  }
}`,
                    table: {
                        headers: ['资源策略', '适用情况', '风险'],
                        rows: [
                            ['复用 Browser', '连续任务', '需要监控内存与崩溃'],
                            ['每任务新 Context', '账号/存储隔离', '创建成本高于只开 Page'],
                            ['复用同一 Context', '明确的同一授权会话', '状态可能跨任务污染'],
                            ['屏蔽图片/字体', '只解析且不依赖布局', '可能破坏懒加载和渲染'],
                            ['定期重启 Browser', '长期 Worker', '要先停止领取并归还任务']
                        ]
                    }
                },
                {
                    heading: '没选到内容，别存成空字符串就算成功',
                    paragraphs: [
                        'CSS class 往往来自构建产物，改版后很容易变化。能使用语义属性、结构化数据、稳定 data 属性或可访问名称时，优先选择这些信号；多个信号可以形成候选规则，但不能用一长串模糊选择器抓到什么算什么。',
                        '解析结果保留证据位置和 ruleVersion。规则升级时先用历史脱敏样本回放，再逐步放量。如果关键字段命中率突然下降，应暂停同类任务，而不是把 undefined 当成正常空值。'
                    ],
                    table: {
                        headers: ['字段结果', '处理方式'],
                        rows: [
                            ['必要字段完整且类型正确', '进入业务校验'],
                            ['可选字段缺失', '记录 warning，允许继续'],
                            ['必要字段缺失', 'invalid，保留规则和样本'],
                            ['多个候选值冲突', '进入复核，不静默取第一个'],
                            ['页面模板未知', '暂停该页面类型并通知'],
                            ['字段异常增长/缩短', '触发分布告警和抽样']
                        ]
                    }
                },
                {
                    heading: '结束时我想看到的摘要',
                    paragraphs: [
                        '我更关心的是这次发现多少条、真正新增多少条、失败多少条、缺必要字段多少条。先有这几个数，比只有一行“运行成功”好用。下面列的队列等待和规则统计，是任务规模继续增加以后可以补的观察项，不要求一个本地脚本全部做齐。',
                        '日志按 taskId 串起发现、访问、解析和写入阶段，同时脱敏 URL 参数与响应内容。截图只在允许且确有排查价值时保存，并设置短保留期。'
                    ],
                    items: [
                        '每个 host 的请求速率、429/5xx 与平均响应时间。',
                        'pending 数量、最老任务等待时间与租约超时数量。',
                        '按页面模板统计解析成功率和必要字段完整率。',
                        '规范 URL 去重率与业务实体合并冲突数。',
                        'Browser 内存、Context/Page 数量、崩溃和重启次数。',
                        '规则版本分布，以及升级前后的字段异常变化。',
                        '原始样本、截图和日志的过期清理是否执行。'
                    ]
                }
            ],
            closing:
                '如果下次脚本断了，我能直接找到没完成的那几条，而不是把整批再跑一遍，这一轮整理就值了。选择器以后还会改，先把来源、状态和错误原因留住。遇到权限变化或访问限制就停下来确认，不把“让它跑完”当成唯一目标。'
        })
    },
    {
        id: 21,
        title: '把网页里的重复摘录做成一个 Chrome 扩展',
        description: '有些页面还是人在浏览器里操作更方便，扩展只负责提取、预览和提交，不必强求全自动。',
        icon: 'Tool',
        createdAt: '2024-05-19 14:17:00',
        updatedAt: '2024-05-19 23:14:00',
        publishedAt: '2024-05-19 22:28:00',
        tags: ['JavaScript', 'Puppeteer'],
        tech: ['Node.js'],
        content: renderArticle({
            intro: '有些网站用 Puppeteer 处理起来挺绕：用户本来已经打开页面了，还要人工筛选和确认，服务端再模拟一遍完整操作反而增加维护量。我给这类场景做过浏览器扩展，人在网页里正常操作，确认要处理哪条内容，再点一下扩展提取字段。少复制几次，比追求所有步骤都自动跑更适合这个需求。',
            closingHeading: false,
            sections: [
                {
                    heading: '保留人的确认这一步',
                    paragraphs: [
                        '登录、验证码、页面选择和异常判断仍由用户完成。用户确认当前页面可以处理后点击扩展，Content Script 才读取页面中与任务有关的字段；提取结果先展示预览，必要字段缺失时不允许直接提交。',
                        '扩展不会读取或导出 Cookie、密码和页面里无关的个人数据，也不尝试绕过网站访问限制。目标站点、字段范围、使用账号和数据用途都要先由业务确认。相比完全自动化，它牺牲了一部分吞吐，但把不稳定的身份与判断环节交还给人。'
                    ],
                    table: {
                        headers: ['环节', '由人完成', '由扩展完成'],
                        rows: [
                            ['访问页面', '正常登录并进入允许页面', '识别页面类型'],
                            ['范围判断', '确认当前记录需要处理', '提示规则与字段范围'],
                            ['内容提取', '处理异常页面', '读取明确字段并规范化'],
                            ['结果确认', '查看预览、修正允许字段', '类型和必填校验'],
                            ['数据提交', '主动确认', '调用受控接口并返回结果'],
                            ['权限变化', '停止使用并反馈', '拒绝未知 host 与模板']
                        ]
                    }
                },
                {
                    heading: '页面脚本、Popup 和后台各放什么',
                    paragraphs: [
                        '扩展使用 Manifest V3。Content Script 负责读取 DOM 和显示少量页面提示；Popup 负责用户触发、预览和确认；Service Worker 负责消息路由、短任务状态和向受控后端提交。',
                        'Service Worker 不是一直常驻的后台页，浏览器可能在空闲时停止它，所以不能把长任务唯一状态只放在内存变量里。需要恢复的 draft 和 ruleVersion 写入 chrome.storage，真正的任务状态仍由后端保存。'
                    ],
                    flow: [
                        { title: '用户点击扩展', detail: 'activeTab 临时授权当前页' },
                        { title: '识别页面', detail: 'Content Script 匹配允许规则' },
                        { title: '提取字段', detail: '只读取声明的数据范围' },
                        { title: '本地校验', detail: '类型、必填和冲突检查' },
                        { title: '预览确认', detail: '用户检查后主动提交' },
                        { title: '后台发送', detail: 'Service Worker 调受控接口' },
                        { title: '记录结果', detail: '返回任务 ID 和失败原因' }
                    ],
                    table: {
                        headers: ['模块', '负责', '不负责'],
                        rows: [
                            ['Content Script', 'DOM 解析、页面内提示', '长期 Token、任意网络权限'],
                            ['Popup', '触发、预览、确认', '直接信任页面数据'],
                            ['Service Worker', '消息校验、请求、事件处理', '依赖常驻内存'],
                            ['chrome.storage', '短期 draft、规则版本', '保存密码和大批原始页面'],
                            ['后端 API', '鉴权、权限、幂等和任务状态', '信任扩展提交即合法']
                        ]
                    }
                },
                {
                    heading: '只在点击后读取当前标签页',
                    paragraphs: [
                        '用户只在需要时点击扩展，因此 activeTab + scripting 已经可以临时访问当前标签页，页面跳转到其他 origin 后权限会失效。这比安装时永久申请所有网站访问更符合实际需求。',
                        'host_permissions 只为扩展需要访问的业务后端声明。如果少数站点确实需要自动注入，也按具体域名和路径缩小 matches，并在扩展界面说明原因。clipboardRead、downloads、webRequest 等能力没有当前需求就不申请。'
                    ],
                    code: `{
  "manifest_version": 3,
  "name": "Page Data Helper",
  "version": "0.4.0",
  "action": {
    "default_popup": "popup.html"
  },
  "background": {
    "service_worker": "service-worker.js",
    "type": "module"
  },
  "permissions": [
    "activeTab",
    "scripting",
    "storage"
  ],
  "host_permissions": [
    "https://collector.example.internal/*"
  ]
}`,
                    note: '域名为示意。真实扩展不应把公司内部地址、令牌或环境配置提交到公开仓库。'
                },
                {
                    heading: '收到消息后，先看类型和来源',
                    paragraphs: [
                        'Content Script 接触的是不可信网页 DOM。页面可能包含恶意文本、超长字段或伪造结构；Service Worker 收到消息后不能因为 sender 来自 Content Script 就直接执行高权限动作。',
                        '消息只接受有限 type，每种 payload 用 schema 校验；同时检查 sender.tab.url 是否属于当前允许规则。后端还要再次鉴权和校验数据范围，扩展侧判断不能替代服务端权限。',
                        '预览页面使用 textContent 或框架正常文本插值展示采集值，不把网页字符串直接 innerHTML。'
                    ],
                    code: `chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    if (message?.type !== 'SUBMIT_RECORD') return

    const pageUrl = sender.tab?.url
    const parsed = submitRecordSchema.safeParse(message.payload)

    if (!pageUrl || !isAllowedPage(pageUrl) || !parsed.success) {
      sendResponse({ ok: false, code: 'INVALID_MESSAGE' })
      return
    }

    submitRecord(parsed.data)
      .then(result => sendResponse({ ok: true, taskId: result.taskId }))
      .catch(error =>
        sendResponse({ ok: false, code: toPublicErrorCode(error) })
      )

    return true
  }
)`,
                    note: '消息错误只返回有限错误码，不把后端响应、堆栈或鉴权细节原样发回页面相关上下文。'
                },
                {
                    heading: '选择器可以配，执行逻辑留在扩展包里',
                    paragraphs: [
                        '不同页面的字段、选择器和清洗方法确实需要配置化。Manifest V3 不允许把远程 JavaScript 拉下来执行，所以规则配置保持为经过 schema 验证的 JSON 数据：页面匹配、字段名、选择器、取 text/attribute 的方式和有限的内置 transform 名称。',
                        '扩展只执行安装包里已经实现并审核过的 transform，例如 trim、toNumber、parseDate。配置中出现 unknown transform、脚本字符串或超出允许 host 的匹配规则时直接拒绝。',
                        '每次结果带上 extensionVersion 和 ruleVersion。站点改版后可以知道错误来自哪版规则，也能用保存的脱敏样本离线回放。'
                    ],
                    table: {
                        headers: ['规则中允许', '规则中拒绝'],
                        rows: [
                            ['固定 pageType 与允许 host', '任意 <code>&lt;all_urls&gt;</code> 匹配'],
                            ['字段白名单与 CSS 选择器', 'eval / Function / 脚本字符串'],
                            ['text、attribute 等有限读取方式', '读取 Cookie、密码输入框'],
                            ['内置 transform 名称', '远程 JavaScript / WASM 地址'],
                            ['ruleVersion 与字段 schema', '绕过权限或隐藏页面操作']
                        ]
                    }
                },
                {
                    heading: '点了按钮，内容可能还没加载完',
                    paragraphs: [
                        '目标页面通常是 SPA，用户切换标签或筛选后 DOM 会变化。固定 setTimeout 容易在慢页面过早执行，在快页面白等。扩展会先识别页面类型，再等待代表内容区域 ready 的语义条件。',
                        'MutationObserver 只观察必要容器，并在获得稳定结果或超时后 disconnect。不能监听整个 document 后每次变化都重新解析，那会被动画、计时器和列表滚动持续触发。',
                        '如果页面需要用户完成一步操作，扩展显示“请完成筛选后再采集”，不会自动点击一串未知按钮。'
                    ],
                    steps: [
                        '确认当前 origin 和 path 命中一条允许规则。',
                        '等待页面类型对应的根元素出现，并设置总超时。',
                        '读取一次候选字段，记录必要字段缺失情况。',
                        '短暂观察目标容器，确认数据不再变化。',
                        '停止 observer，执行规范化和本地 schema 校验。',
                        '展示预览和来源页面，等待用户确认。',
                        '提交成功后保存 taskId，不长期保存完整页面数据。'
                    ]
                },
                {
                    heading: '扩展不用替网站保管登录信息',
                    paragraphs: [
                        '扩展之所以能看到页面，是因为用户已经在浏览器里正常登录，但这不意味着应该读取 Cookie 再传给后端。Content Script 只读取页面已经渲染且在授权范围内的字段，扩展调用自己的后端使用独立登录或短期令牌。',
                        '目标站点的登录状态继续由网站和用户管理。扩展检测到跳转登录页、权限提示或验证码时停止解析并提示，不保存凭据，也不尝试刷新登录。',
                        '扩展自己的令牌同样不能明文长期存进 localStorage。内部使用场景下仍要设置短期有效、受众和权限范围，并允许后端撤销。'
                    ],
                    table: {
                        headers: ['数据/凭据', '处理方式'],
                        rows: [
                            ['目标站点 Cookie', '不读取、不上传'],
                            ['密码输入框', '明确排除'],
                            ['页面已渲染业务字段', '按规则最小化提取'],
                            ['扩展后端 Token', '独立、短期、最小权限'],
                            ['采集预览 draft', '本地短期保存，提交后清理'],
                            ['后端任务结果', '只保存 taskId 与公开状态']
                        ]
                    }
                },
                {
                    heading: '“提取成功”不能是一张空表',
                    paragraphs: [
                        '最糟糕的体验不是提取失败，而是扩展显示成功、实际提交了一堆空字段。必要选择器缺失、页面类型未知、规则版本过旧和接口无权限需要不同提示。',
                        '错误反馈包含页面模板、extensionVersion、ruleVersion 和脱敏字段命中摘要。用户可以复制诊断 ID 给开发者，不需要截图整页或导出敏感内容。规则修复后先在保存的脱敏 DOM fixture 上测试，再发布新版本。',
                        'Popup 关闭以后，里面的临时状态很容易跟着丢掉。用户点击页面看一眼，再打开扩展，如果刚才的预览没了，体验会很差。所以需要保留的草稿单独存，带上来源标签页和地址；再次打开时发现地址已经变了，就提示重新提取，别把上一页的数据当成当前页。',
                        '更新扩展时也要考虑旧草稿。结构已经不兼容的话，明确提示重新提取，比悄悄补几个默认值继续提交更好。'
                    ],
                    table: {
                        headers: ['错误', '用户提示', '开发侧处理'],
                        rows: [
                            ['未知页面', '当前页面暂不支持', '确认是否应新增规则'],
                            ['必要字段缺失', '页面结构可能已变化', '按 ruleVersion 查看命中率'],
                            ['仍在加载', '等待或重新触发', '检查 ready 条件'],
                            ['需要登录/验证', '请用户正常处理后重试', '不自动绕过'],
                            ['接口无权限', '当前账号不能提交', '检查扩展后端授权'],
                            ['重复任务', '展示已有 taskId', '后端保持幂等']
                        ]
                    }
                },
                {
                    heading: '打包前再走这几种情况',
                    items: [
                        '允许站点的正常详情、列表、空数据和长文本页面。',
                        '未授权站点点击扩展时不注入、不读取页面。',
                        '页面跳转、刷新、iframe 和多个标签页之间状态不串。',
                        '必要字段缺失时阻止提交，可选字段缺失只给 warning。',
                        '恶意 HTML、超长文本和非预期消息不会进入 innerHTML 或后端。',
                        'Service Worker 重启后 draft 和任务状态能恢复或明确清理。',
                        '后端 401、409、429、5xx 分别显示正确结果，不无限重试。',
                        '升级规则或扩展版本后，旧 draft 有清晰迁移策略。'
                    ]
                }
            ],
            closing:
                '这类小工具做出来以后，最常改的还是页面规则和提示文案。用户看到“没有提取到标题，请确认页面加载完成”，比看到一个通用失败弹窗更知道下一步怎么做。自动处理的范围先小一点，剩下的让人确认，用起来反而省心。'
        })
    },
    {
        id: 22,
        title: '用千问和 DeepSeek 整理采集文本，哪些结果还得自己检查',
        description: '模型能帮忙提取和归类，但日期、空值和原文依据仍然要核对。记一版简单的处理思路。',
        icon: 'Tool',
        createdAt: '2024-07-21 13:52:00',
        updatedAt: '2024-07-21 23:33:00',
        publishedAt: '2024-07-21 22:47:00',
        tags: ['Python', 'JavaScript'],
        tech: ['Python', 'Node.js'],
        content: renderArticle({
            intro: '最近在采集后的数据清洗里接了一些模型能力，千问和 DeepSeek 都有尝试。主要是原文写法太散，同一类信息有时在表格里，有时混在一大段说明里，继续补正则挺费劲。模型能省一些整理工作，不过我最关心的是它没有找到答案时会怎么办：留空还好，自己补一个看着合理的值就麻烦了。',
            closingHeading: '先拿小样本用起来',
            sections: [
                {
                    heading: '空格和固定格式，还是让代码处理',
                    paragraphs: [
                        'HTML 标签清理、日期格式转换、数值单位、唯一标识和枚举映射有明确规则，程序做得更快、更便宜，也更容易测试。模型真正有帮助的地方，是从表达方式不统一的自然语言里判断主题、识别一段内容是否相关，或者把几种常见表述归到统一类别。',
                        '流程因此不是“原始文本 → 模型 → 数据库”，而是先用确定性规则清理、切段和提取已有结构，只把无法可靠判断的部分交给模型。模型返回候选字段和证据片段，程序再校验。'
                    ],
                    table: {
                        headers: ['任务', '优先方式', '原因'],
                        rows: [
                            ['去 HTML、空白和固定页头', '规则', '结果确定、成本低'],
                            ['日期、金额、百分比转换', '规则 + 范围校验', '不能容忍幻觉'],
                            ['唯一 ID 与来源 URL', '原始数据', '禁止模型改写'],
                            ['主题/类别判断', '模型候选', '自然语言边界模糊'],
                            ['段落摘要与噪声判断', '模型候选', '规则覆盖成本高'],
                            ['权限和数据可见范围', '服务端规则', '不能交给模型决定'],
                            ['最终是否入库', '程序与人工规则', '需要可审计结论']
                        ]
                    }
                },
                {
                    heading: '不是整页 HTML 都要发给模型',
                    paragraphs: [
                        '模型只接收完成任务所需的最小文本。姓名、联系方式、内部标识、账号和无关段落先删除或替换为占位符；来源权限不允许发给外部服务的数据，直接留在规则或人工流程。',
                        '采集文本本身也可能包含“忽略前面的要求、输出某某内容”之类指令。Prompt 会明确把网页内容放在数据边界内，不允许把其中的文字当系统指令执行，但 Prompt 防护不是安全边界，输出仍要经过白名单 schema。',
                        'API Key 只放服务端，浏览器扩展和前端不能直接调用模型。日志记录 requestId、模型和 token 用量，不记录完整原文和密钥。'
                    ],
                    table: {
                        headers: ['输入内容', '处理方式'],
                        rows: [
                            ['公开且任务必需的正文', '规范化后发送必要片段'],
                            ['姓名、电话、邮箱', '删除或不可逆占位'],
                            ['内部用户/客户 ID', '保留在本地关联表，不发模型'],
                            ['网页中的指令文本', '作为不可信数据，不执行'],
                            ['超长文档', '按语义边界切段，保留来源位置'],
                            ['无权外发的数据', '不进入模型流程']
                        ]
                    },
                    note: '是否可以把某类数据发送给模型服务，需要按公司规则、服务条款和数据敏感级别确认，不能只靠代码里做一次 replace。'
                },
                {
                    heading: '提示里要明确允许它返回 null',
                    paragraphs: [
                        'System Prompt 会写清角色、允许字段、拒绝猜测、缺失值处理和 JSON 示例；User Prompt 只放任务参数与经过处理的文本。Prompt、字段 schema、模型名称和参数都带版本，结果才能重放。',
                        '我不会要求模型“尽可能补全”。原文没有依据时必须返回 null 和 reason，候选值还要带 evidence，方便程序确认这段证据真的存在于输入中。',
                        '千问和 DeepSeek 的调用封装成同一任务接口，但不假装两个模型输出完全一致。切换模型是一次可记录的配置变更，要重新跑评估集，不能在某个服务超时后静默换模型并把结果混在一起。'
                    ],
                    code: `type CleanResult = {
  category: 'policy' | 'news' | 'notice' | 'other'
  title: string | null
  publishedAt: string | null
  relevant: boolean
  evidence: Array<{
    field: 'category' | 'title' | 'publishedAt' | 'relevant'
    quote: string
  }>
  warnings: string[]
}

type ModelRun = {
  provider: 'qwen' | 'deepseek'
  model: string
  promptVersion: string
  schemaVersion: string
  inputHash: string
  requestId: string
  rawOutput: string
  parsed?: CleanResult
}`
                },
                {
                    heading: 'JSON 没报错，也可能提取错了',
                    paragraphs: [
                        '模型输出需要依次通过 JSON 语法、schema、字段范围、跨字段关系和来源证据校验。JSON 格式正确不代表日期存在，也不代表 category 在业务枚举里。',
                        '例如模型返回 publishedAt，程序会用严格日期解析并检查合理范围，再确认 evidence.quote 能在规范化原文中定位。数值字段还要核对单位；模型擅自补出的唯一 ID 无论看起来多合理都直接拒绝。',
                        'Schema 失败可以在限制次数内用同一输入重新请求，业务矛盾通常进入人工复核。不能用第二次模型调用把一个无法验证的答案“修成看起来合法”。',
                        '拿一个简化例子来说，页面顶部写“更新时间：7 月 20 日”，正文里写“申请截止：8 月 1 日”。如果我要的是截止日期，模型返回 7 月 20 日，格式校验完全可能通过，原文里也确实有这几个字。还要检查证据对应的字段含义，不能只判断那段文字在不在原文里。',
                        '再比如原文只有“03/04”，没有地区和年份，提示里就不该催它补成完整日期。保留原始写法，返回无法判断，比数据库里多一个整齐但不可靠的日期好。'
                    ],
                    code: `const candidate = cleanResultSchema.parse(JSON.parse(rawOutput))

function validateCandidate(
  candidate: CleanResult,
  source: NormalizedSource
) {
  const issues: ValidationIssue[] = []

  if (
    candidate.publishedAt &&
    !isDateWithinSourceRange(candidate.publishedAt, source)
  ) {
    issues.push({ field: 'publishedAt', code: 'OUT_OF_RANGE' })
  }

  for (const evidence of candidate.evidence) {
    if (!source.text.includes(normalizeQuote(evidence.quote))) {
      issues.push({ field: evidence.field, code: 'EVIDENCE_NOT_FOUND' })
    }
  }

  return issues
}`,
                    table: {
                        headers: ['校验层', '检查内容', '失败去向'],
                        rows: [
                            ['语法', '是否为完整 JSON', '有限重试或失败'],
                            ['Schema', '类型、枚举、必填、长度', '有限重试或失败'],
                            ['业务范围', '日期、数值、字段组合', '人工复核'],
                            ['来源证据', '候选值是否有原文依据', '拒绝或复核'],
                            ['权限', '字段是否允许处理和写入', '直接拒绝'],
                            ['重复/冲突', '与已有正式数据是否矛盾', '不自动覆盖']
                        ]
                    }
                },
                {
                    heading: '它说 0.95，我也不知道怎么算出来的',
                    paragraphs: [
                        '让模型返回 0.95 并不代表它真的有 95% 正确率。这个数字可以帮助同一版本内部做粗略排序，但必须经过历史样本校准，不能作为自动入库的唯一阈值。',
                        '更可靠的路由信号来自程序：证据是否存在、多个字段是否一致、规则是否已经得到同样结果、两个模型是否冲突、这个字段出错后的影响有多大。',
                        '高影响字段即使“置信度高”也进入复核；低影响、可回滚且验证充分的候选，才可能在稳定评估后逐步自动化。'
                    ],
                    table: {
                        headers: ['情况', '处理'],
                        rows: [
                            ['JSON/Schema 不合法', '拒绝，有限重试'],
                            ['证据不存在', '拒绝，不参考 confidence'],
                            ['规则与模型一致', '可进入低风险自动候选'],
                            ['千问与 DeepSeek 冲突', '人工复核并记录'],
                            ['高影响字段变化', '始终复核或双人确认'],
                            ['低影响且历史准确稳定', '小流量自动化并持续抽检']
                        ]
                    }
                },
                {
                    heading: '改提示词以后，用同一批样本再试',
                    paragraphs: [
                        '只试几条容易的内容，很快就会觉得效果不错。我更想留一小批自己核对过的样本：有正常页面，也有缺字段、长文本、相互矛盾的日期和无关段落。每次改提示都跑这些，先看原来能处理的内容有没有退步，不急着把它叫完整的评测体系。',
                        '每次变更模型、Prompt 或 schema 都跑同一批样本，按字段统计准确、漏提、误提和无法判断。整体成功率会掩盖重要字段，所以日期、类别、相关性分别看；还要关注某种页面模板是否明显更差。',
                        '后面遇到的新错误也可以补进来，不过要留一些没有拿来调提示的样本，免得只把这几个例子越调越好。下面把检查顺序列一下，现阶段优先做能人工复核的小范围任务。'
                    ],
                    steps: [
                        '按页面类型和异常情况分层抽取历史样本。',
                        '脱敏后由人工给出字段结果和证据。',
                        '固定模型、Prompt、schema 与参数版本运行。',
                        '分别统计字段准确、漏提、误提和解析失败。',
                        '检查高影响字段与各页面模板的最差表现。',
                        '通过后先小流量运行，并保持随机人工抽检。',
                        '记录人工修正，定期扩充独立评估集。'
                    ]
                },
                {
                    heading: '别让重试把费用也翻几遍',
                    paragraphs: [
                        '模型 API 会超时、限流、余额不足或服务繁忙。清洗任务进入独立队列，按 provider 控制并发和退避。429、5xx 可以有限重试；401、参数错误和余额问题直接停止并通知，不让任务无限循环。',
                        '同一份规范化输入、promptVersion、schemaVersion、provider 和 model 组成 inputHash。已经有通过验证的结果时可以复用，模型或 Prompt 变化则生成新 run，不覆盖旧记录。',
                        'Token、耗时和人工复核量都要统计。便宜但大量进入人工复核的方案，不一定比稍贵但稳定的方案成本低。'
                    ],
                    table: {
                        headers: ['指标', '为什么要看'],
                        rows: [
                            ['输入/输出 Token', '估算单条与每日成本'],
                            ['P50/P95 延迟', '决定并发和任务 SLA'],
                            ['429/5xx/超时率', '判断服务稳定与退避'],
                            ['JSON/Schema 失败率', '发现 Prompt 或模型漂移'],
                            ['字段准确与拒绝率', '判断实际质量'],
                            ['人工复核比例', '计算真实运营成本'],
                            ['重复命中率', '验证缓存与幂等是否有效']
                        ]
                    }
                },
                {
                    heading: '以后还能查到这一项从哪来',
                    paragraphs: [
                        '正式数据旁边保留来源记录：原始内容版本、规范化规则版本、模型 runId、Prompt/schema/model 版本、程序校验结果和人工确认人。原始文本按权限与保留周期存储，不在普通业务页面直接暴露。',
                        '模型版本变化后，不会直接批量重算并覆盖历史正式值。新结果以候选版本进入，对比差异后再决定是否迁移。出现投诉或数据异常时，至少可以解释这条字段来自哪里、经过了哪些判断。'
                    ],
                    flow: [
                        { title: '规则预处理', detail: '清理、脱敏、切段并保留来源' },
                        { title: '模型候选', detail: '千问或 DeepSeek 按版本运行' },
                        { title: '结构校验', detail: 'JSON、Schema 与字段白名单' },
                        { title: '证据校验', detail: '日期、范围和原文片段回查' },
                        { title: '风险路由', detail: '自动候选、人工复核或拒绝' },
                        { title: '版本入库', detail: '保存正式值与完整来源链' }
                    ],
                    note: '“保留可追踪信息”不等于永久保存完整敏感原文。证据、日志和原始内容仍应遵守权限、脱敏与删除策略。'
                }
            ],
            closing:
                '目前对我最有用的是少写一些很难维护的文本规则，不是把人工检查全去掉。先看它能稳定处理哪几类内容，拿不准就留着给人看。模型、提示和字段要求都还会调整，原文和旧结果不能因为换了模型就直接覆盖掉。'
        })
    },
    {
        id: 23,
        title: '用 Python 把几种用户数据整理成同一种格式',
        description: '字段映射、简单去重、筛选排序，还有不能漏掉的权限透传。不做复杂的用户主数据系统。',
        icon: 'Python',
        createdAt: '2024-09-22 13:38:00',
        updatedAt: '2024-09-22 23:16:00',
        publishedAt: '2024-09-22 22:29:00',
        tags: ['Python'],
        tech: ['Python'],
        content: renderArticle({
            intro: '几个平台都有用户数据，但返回格式各是一套。这个叫 name，那个叫 userName；状态有数字也有字符串，组织信息还有嵌套层级的区别。前端如果每个页面都判断一遍来源，很快就写重复了。我用 Python 做聚合层时，先做的是把这些格式统一，再加一些简单的去重、筛选和排序，没有打算重新建一套用户系统。',
            closingHeading: '先把简单的转换做可靠',
            sections: [
                {
                    heading: '先列页面真的要用哪些字段',
                    paragraphs: [
                        '第一版最直觉的做法，是把平台 A、B、C 的所有字段放进一个大对象，哪个平台没有就填 null。结果下游仍然要先看 source，再猜某个 null 是平台不支持、当前用户没权限，还是这个人的值真的为空。',
                        '后来改成从业务动作倒推字段：筛选接收人需要哪些属性，展示预览需要哪些名称，后续审计需要哪些来源。只有这些稳定概念进入统一模型，平台特有字段留在 Adapter 内或受控 metadata 中。',
                        '缺失也不能只有 null。对权限敏感字段会保留 availability，区分 missing、not_supported 和 forbidden；否则聚合层很容易把“看不到”伪装成“没有”。'
                    ],
                    table: {
                        headers: ['统一字段', '含义', '不能直接混入'],
                        rows: [
                            ['entity_key', '聚合层稳定实体标识', '单个平台的临时行号'],
                            ['display_name', '允许展示的名称', '未经授权的完整账号信息'],
                            ['organization', '规范化院校/组织引用', '各平台自由文本原样并集'],
                            ['roles', '统一业务角色枚举', '平台内部权限代码'],
                            ['channels', '允许的投送渠道能力', '联系方式明文'],
                            ['status', 'active/inactive/unknown', '不同平台数字状态码'],
                            ['sources', '来源平台与上游 ID', '上游响应完整副本']
                        ]
                    }
                },
                {
                    heading: '每个平台单独写一个转换函数',
                    paragraphs: [
                        '聚合流程不直接散落 if platform == A。每个平台实现同一组能力：校验查询、分页读取、转换记录和说明错误。Adapter 只处理上游语义到统一模型的映射，不在里面写具体页面的筛选规则。',
                        '上游字段变化时，先改对应转换函数，再拿保存的脱敏样例跑一下。这里不一定要很重的类设计，普通函数也够用。转换失败至少留下来源和字段名，不能一个 try/except 全吞掉，然后前端收到的数据就悄悄少了几条。',
                        '状态映射尤其不能照着数字猜。平台 A 的 1 和平台 B 的 1 未必是同一个意思，要分别建映射表。遇到不认识的值先标成 unknown，别为了凑齐枚举默认成 active；否则新状态上线以后，聚合层会继续返回一个看似正常的旧状态。'
                    ],
                    code: `from typing import Protocol
from pydantic import BaseModel

class UnifiedUser(BaseModel):
    entity_key: str
    display_name: str | None
    organization_id: str | None
    roles: set[str]
    status: str
    sources: list["SourceRef"]

class UserSourceAdapter(Protocol):
    source_name: str

    async def fetch_page(
        self,
        auth: "AuthContext",
        cursor: str | None,
    ) -> "SourcePage": ...

    def normalize(
        self,
        record: dict,
        auth: "AuthContext",
    ) -> UnifiedUser: ...`,
                    note: '示例省略真实平台和字段。统一模型不包含明文联系方式；后续真正投送时再通过有权限的渠道服务解析目标。'
                },
                {
                    heading: '一个平台超时，页面该显示什么',
                    paragraphs: [
                        '多个上游互相独立，确实可以并发请求，但每个平台有自己的超时、分页和限流。一次把所有分页任务都 create_task，会在数据量大时放大连接数，也很难取消。',
                        '简单查询可以先按平台限制并发，分页不要一下全发出去。一个平台超时以后，是允许先展示其余结果，还是整次失败，需要跟调用方约定。下面拿“预览”和“最终确认”举例：这两种用途对完整性的要求不同，不能一律返回空数组算成功。'
                    ],
                    table: {
                        headers: ['请求模式', '上游部分失败', '返回语义'],
                        rows: [
                            ['preview', '允许', 'status=partial，列出缺失来源'],
                            ['count-only', '视业务允许', '每个平台数量带状态'],
                            ['final recipients', '不允许', '整体失败，不生成正式名单'],
                            ['audit replay', '按历史快照', '不临时补最新上游数据']
                        ]
                    }
                },
                {
                    heading: '别用一个大权限账号替所有人查询',
                    paragraphs: [
                        '聚合服务不能用一个万能账号读取所有平台，再在 Python 里“模拟权限”。它会让上游审计失效，也可能因为筛选遗漏把用户本来不可见的数据返回。',
                        '调用方身份、租户、角色和数据范围形成 AuthContext。Adapter 使用该上下文调用上游或交换范围受限的短期凭据；统一结果的可见字段是上游许可与本层业务权限的交集。',
                        '缓存 key 同样包含 tenant、subject 和 permissionVersion。按 URL 缓存一次然后给所有用户复用，是聚合层最危险的优化之一。'
                    ],
                    code: `@dataclass(frozen=True)
class AuthContext:
    subject_id: str
    tenant_id: str
    roles: frozenset[str]
    scope_ids: frozenset[str]
    permission_version: str

def cache_key(source: str, query_hash: str, auth: AuthContext) -> str:
    return ":".join([
        source,
        auth.tenant_id,
        auth.subject_id,
        auth.permission_version,
        query_hash,
    ])`,
                    table: {
                        headers: ['边界', '要求'],
                        rows: [
                            ['调用上游', '透传身份或使用范围受限凭据'],
                            ['字段转换', '无权字段不进入统一模型'],
                            ['数据合并', '不能由另一来源补出无权字段'],
                            ['缓存', '包含租户、主体与权限版本'],
                            ['日志', '记录主体和来源，不记录完整用户数据'],
                            ['响应', '只返回当前动作需要的最小字段']
                        ]
                    }
                },
                {
                    heading: '名字一样，不代表是同一个人',
                    paragraphs: [
                        '平台内可以用 source + upstream_user_id 保证唯一；跨平台是否是同一个人就复杂得多。邮箱和手机号可能缺失、变更或无权查看，姓名又会重名，不能把任一字段直接当全局唯一键。',
                        '如果业务已经维护可靠的账户映射，就使用 mapping_id。没有映射时，只做安全的基础合并：多个来源给出相同已验证标识，并且组织等关键字段不冲突。其余记录保持分开或进入候选匹配，不自动把两个人合成一个。',
                        '我这里先做能确认的基础去重，拿不准就保留两条和各自来源。合并时也要约定哪个字段优先，不能哪个请求最后回来就覆盖哪个。实体匹配、模糊姓名合并那一套复杂事情先不做，误合并以后再拆开更麻烦。'
                    ],
                    table: {
                        headers: ['信号', '能否单独跨平台去重', '原因'],
                        rows: [
                            ['已维护的 mapping_id', '可以', '明确映射关系'],
                            ['平台 + upstream_id', '只能平台内', '跨平台不共享'],
                            ['已验证且允许使用的联系方式', '谨慎组合使用', '会变化且涉及权限'],
                            ['姓名', '不可以', '重名、别名和格式差异'],
                            ['组织 + 姓名', '只作候选', '仍可能重名或调动'],
                            ['模型相似度', '只作候选', '不可解释且可能误合并']
                        ]
                    }
                },
                {
                    heading: '各取第一页，合起来不等于全局第一页',
                    paragraphs: [
                        '从三个平台各取第一页，合并后排序再返回 20 条，并不能得到真正的全局前 20。某个平台第二页可能还有更靠前的数据。这个问题在按更新时间、名称或组织排序时都会出现。',
                        '数据量可控时，可以在权限范围内拉取必要集合，规范化后建立一次查询快照，再统一筛选、排序和分页。数据量很大时，需要上游支持兼容的排序游标，或把规范化结果物化到可查询存储，不能假装内存 merge 已经解决。',
                        '目前只做数据量可控范围内的筛选和排序。如果后面必须支持大量数据连续翻页，才需要进一步考虑快照、游标或物化存储；这些方案列在下面作为备选，不是这层简单聚合已经全部实现了。'
                    ],
                    table: {
                        headers: ['方案', '适用情况', '局限'],
                        rows: [
                            ['各取一页后 merge', '只做粗略预览', '不是准确全局排序'],
                            ['拉取完整小集合', '权限范围与数据量可控', '内存和上游成本'],
                            ['k-way merge 游标', '上游支持同一排序语义', '实现和异常处理复杂'],
                            ['物化规范化快照', '重复查询、大数据量', '新鲜度与存储成本']
                        ]
                    }
                },
                {
                    heading: '字段改名了，来源别丢',
                    paragraphs: [
                        '统一以后最容易丢的是来源。业务看到一条名称或状态不对时，如果只剩 UnifiedUser，就不知道该去哪个平台、哪条记录检查。',
                        '每条数据保留 source、upstream_id、fetched_at、adapter_version 和允许记录的 source_updated_at；字段发生冲突时保留候选来源。公开响应可以隐藏内部细节，但服务端审计必须能回查。',
                        '来源记录也帮助做新鲜度判断。平台 A 昨天更新、平台 B 一个月前更新时，不能只按固定优先级覆盖；是否选择较新值要按字段语义明确。'
                    ],
                    flow: [
                        { title: '权限上下文', detail: '主体、租户和数据范围' },
                        { title: '平台 Adapter', detail: '分页、超时和字段转换' },
                        { title: '统一模型', detail: '稳定业务字段与来源引用' },
                        { title: '基础去重', detail: '可靠映射、冲突不强合并' },
                        { title: '筛选排序', detail: '基于同一查询快照' },
                        { title: '最小响应', detail: '按当前动作裁剪字段' }
                    ]
                },
                {
                    heading: '没有记录，和没有查到，是两回事',
                    paragraphs: [
                        '上游返回空数组、当前用户无权访问、请求超时、字段契约改变，最终都返回 users: [] 会严重误导调用方。统一结果需要 status、data、source_statuses 和 warnings。',
                        '适配器把上游错误映射成有限内部错误码，不把对方响应正文和地址直接暴露给前端。可重试信息用于队列或服务层判断，页面只看到是否完整及可以采取的动作。'
                    ],
                    table: {
                        headers: ['情况', '统一结果'],
                        rows: [
                            ['全部来源成功且无记录', 'complete + data=[]'],
                            ['某可选来源超时', 'partial + unavailable_sources'],
                            ['必要来源失败', 'failed，不返回正式名单'],
                            ['上游无权限', 'forbidden source，不等于空数据'],
                            ['字段契约变化', 'adapter_error + 告警'],
                            ['调用方查询越界', 'validation_error，不请求上游']
                        ]
                    }
                },
                {
                    heading: '先不把投送规则也搬进来',
                    paragraphs: [
                        '这一层适合处理平台差异、基础去重、查询快照和前端需要的组合数据，但“哪些人应该接收某类内容”仍然是核心业务规则。把它只写在 Python 服务里，会让其他入口出现另一套版本。',
                        '当前只实现简单、明确的筛选和排序，复杂规则由业务后端给出规则版本或通过专门能力计算。聚合层记录输入和结果摘要，方便复现，但不成为所有系统的第二业务中心。'
                    ],
                    steps: [
                        '为统一模型和每个 Adapter 建立脱敏 contract fixture。',
                        '验证字段映射、未知枚举、缺失和 forbidden 的区别。',
                        '覆盖一个上游超时、限流和契约改变的响应。',
                        '验证同一实体可靠合并与冲突不合并两类样本。',
                        '使用不同权限主体运行同一查询，确认结果不会串。',
                        '核对排序、快照分页和权限变化后的 cursor 失效。',
                        '检查日志、缓存和响应都没有多余敏感字段。'
                    ],
                    note: '文中的用户、组织、渠道字段都是简化示例。实际做的是格式统一、基础处理和权限透传，复杂匹配与大规模分页需要另外设计。'
                }
            ],
            closing:
                '这部分写完，前端少了不少“如果来自 A 平台就取这个字段”的判断。以后新接一个来源，先补转换函数和样例，原来的页面尽量不动。现在最该守住的是字段含义和权限别传错，其他复杂能力等有明确需求再加。'
        })
    },
    {
        id: 24,
        title: '小程序包体积缩减约 30% 的一次整理',
        description: '从旧页面、图片和公共依赖查起。页面挪进分包了，主包不一定就会变小。',
        icon: 'smartphone',
        createdAt: '2024-11-17 14:26:00',
        updatedAt: '2024-11-17 23:08:00',
        publishedAt: '2024-11-17 22:31:00',
        tags: ['Vue.js', 'JavaScript'],
        tech: ['Vue'],
        content: renderArticle({
            intro: '小程序这次做了一轮模块拆分和资源整理，整体包体积缩减了约 30%。没有特别神奇的压缩办法，主要还是旧代码、重复资源和依赖归属的问题。图片比较容易看见，公共入口把哪些代码一起带进主包，反而要花时间顺着 import 查。',
            closingHeading: '以后加依赖时顺手看一眼',
            sections: [
                {
                    heading: '先看清楚比较的是哪个体积',
                    paragraphs: [
                        '一开始大家看到的数字并不一致：开发者工具里有本地预览包，上传页面显示的是经过处理后的代码包，磁盘上的 dist 又包含 map 和一些不会上传的文件。用不同数字做前后对比，结论没有意义。',
                        '前后比较要用相同的构建模式和统计口径。这里保留整体约 30% 的结果，不单独列主包、图片和业务 JS 的降幅；它们受分包和公共依赖影响，也不能把几项数字简单相加。',
                        '除了总体积，我更关注主包。用户首次打开先下载主包，低频功能即使被挪进分包，只要公共依赖又把它拉回主包，首页体验并不会真正改善。'
                    ],
                    table: {
                        headers: ['看哪一项', '用来判断什么'],
                        rows: [
                            ['整体代码包', '本次整体缩减约 30%'],
                            ['主包', '首屏实际需要下载哪些内容'],
                            ['每个分包', '挪走的代码去了哪里，有没有重复'],
                            ['图片和业务 JS', '继续定位体积来源，不单独推算降幅'],
                            ['首屏核心功能', '体积减小以后登录、首页和导航仍然可用']
                        ]
                    },
                    note: '这次结果不能当作别的项目目标。代码包变小也不等于启动耗时同比降低，还要看主包和实际访问路径。'
                },
                {
                    heading: '从最大的产物往回查',
                    paragraphs: [
                        '我先看开发者工具的代码依赖分析和构建后的目录，再从最大的文件反查源码入口。只看 node_modules 大小没用，安装包很大不代表最终一定被打进小程序；反过来，一个很小的公共文件只要 import 了重依赖，就可能改变整棵依赖图。',
                        '盘点结果按“能直接删除、需要调整归属、暂时不能动”三类登记。每一项都写来源页面、验证人和回退方式，尤其是没有产品文档的旧活动资源，不能因为名字像废弃就直接删。'
                    ],
                    table: {
                        headers: ['发现', '怎么确认', '最后处理'],
                        rows: [
                            ['pages.json 仍注册旧页面', '搜索入口、运营链接和历史二维码', '确认下线后删除页面与路由'],
                            ['同一插画有多份不同文件名', '哈希与视觉比对', '统一引用并保留一份'],
                            ['大图只以小卡片尺寸展示', '核对设计稿和真机尺寸', '重新导出合适尺寸与格式'],
                            ['工具函数引入完整依赖', '从产物反查 import 链', '改为轻量实现或按函数引入'],
                            ['组件同时被主包和多个分包引用', '查看依赖归属', '只保留真正通用的最小部分'],
                            ['map、测试素材出现在 dist', '检查构建配置', '生产构建排除，不动源码']
                        ]
                    }
                },
                {
                    heading: '旧活动页，先别看到没引用就删',
                    paragraphs: [
                        '项目里最容易删错的不是代码，而是活动图片、模板和隐藏入口。静态搜索不到引用，不代表服务端配置、富文本、分享卡片或扫码路径没有使用。仅凭 rg 没结果就删除，风险很高。',
                        '我的检查顺序是：先查页面配置和源码引用，再查后台配置键、线上埋点与近一段时间访问，最后让对应业务同学确认。无法确认的先移动到待清理清单，不拿一次体积优化去赌线上功能。',
                        '确认可以删除后，页面文件、组件、样式、图片和路由配置一起清理。只删页面入口却留下 import，或者只删图片却保留重复组件，产物数字通常不会像预期那样下降。'
                    ],
                    steps: [
                        '从 pages.json、tabBar、subPackages 和条件编译入口列出所有页面。',
                        '扫描静态 import、动态路径、组件注册和资源引用。',
                        '核对服务端配置、分享落地页、二维码和运营入口。',
                        '用访问记录辅助判断，但不把“最近没人访问”直接等同于可删除。',
                        '小范围提交清理内容，真机走一遍登录、分享和核心业务路径。',
                        '重新构建并记录产物变化，数字不变时继续追依赖链。'
                    ]
                },
                {
                    heading: '用户会连续使用的页面，尽量放一起',
                    paragraphs: [
                        '主包只保留默认入口、TabBar 页面、登录初始化和多条高频路径都需要的基础能力。问卷、院校详情里的低频工具、某些后台入口各自进入业务分包。用户进入分包页面时才下载对应代码，所以边界要尽量贴近真实访问路径。',
                        'uni-app 在 pages.json 里通过 subPackages 配置分包。下面是结构示意，名称已经替换。独立分包这次没有贸然启用，因为它不能直接依赖主包初始化、全局样式和公共组件，迁移成本比数字看上去大。',
                        '分包也不是越多越好。一个两步流程被拆进两个包，用户每跳一步都可能等待下载；过多跨包复用又会让公共代码回到主包。最后我们按“进入后通常连续使用”的业务闭环来划分。'
                    ],
                    code: `{
  "pages": [
    { "path": "pages/home/index" },
    { "path": "pages/profile/index" }
  ],
  "subPackages": [
    {
      "root": "packages/survey",
      "pages": [
        { "path": "list/index" },
        { "path": "detail/index" },
        { "path": "result/index" }
      ]
    },
    {
      "root": "packages/school",
      "pages": [
        { "path": "detail/index" },
        { "path": "compare/index" }
      ]
    }
  ],
  "preloadRule": {
    "pages/home/index": {
      "network": "wifi",
      "packages": ["packages/school"]
    }
  }
}`,
                    note: '预下载只给从首页高概率进入的分包，并优先限制在 Wi-Fi。把全部分包都预下载，虽然跳转更顺，却会把节省首次下载的意义抵消掉。'
                },
                {
                    heading: '页面移走了，依赖还被主包拉着',
                    paragraphs: [
                        '有一轮我们明明把页面挪进分包，主包却几乎没变。继续追下去发现，主包里的公共组件引用了一个格式化工具，这个工具又从统一 utils 入口导出了很多与首页无关的代码。业务页面搬走了，依赖仍然被主包抓着。',
                        '后来把“方便的总出口”拆成更具体的入口，公共组件也分成基础版和业务版。仅被一个分包使用的组件、JS 和静态资源尽量放到分包目录；两个以上分包都用到的内容再判断是接受公共体积，还是各自保留一个很小的实现。',
                        '组件库同样按需核对。easycom 能减少手写注册，并会剔除未使用组件，但前提是没有在入口文件里把整套组件和样式提前注册。图表、富文本和日期处理这种能力尤其值得查。'
                    ],
                    table: {
                        headers: ['写法或现象', '为什么会变大', '调整方向'],
                        rows: [
                            ['从 @/utils 总入口引入一个函数', '总入口可能形成额外依赖链', '使用明确子路径，缩小公共模块'],
                            ['main.ts 全量注册组件库', '未用组件也可能进入公共产物', '按需或 easycom，检查最终产物'],
                            ['分包组件引用主包业务组件', '边界被反向依赖打穿', '基础能力下沉，业务组件留在包内'],
                            ['多个分包共享一个很重的模块', '可能提升公共包体积', '评估使用频率、重复与共享成本'],
                            ['只看源码行数', '编译后体积与行数不成比例', '以生产产物和依赖图为准']
                        ]
                    }
                },
                {
                    heading: '有些图片还是得留在本地',
                    paragraphs: [
                        '本地包里的大图是最直观的一块：重复图合并，按实际展示尺寸重新导出，照片类和透明图分别选择合适格式，小图标能复用组件就不再存多份位图。优化后一定在真机看，压缩工具给出的体积很漂亮，不代表文字和细线还能看。',
                        '低频内容图可以放到受控 CDN，但 TabBar、首屏骨架、错误占位和离线也必须出现的素材仍留本地。网络图还要考虑域名配置、缓存、弱网、内容更新和失效兜底，并不是把包体积转移出去就结束了。',
                        '另外我把按设备宽度实际只显示几百像素、却打包两三倍尺寸的图片列成规则。以后新资源进入仓库时就能提醒，而不是等包再次接近限制才统一返工。'
                    ],
                    table: {
                        headers: ['资源', '处理方式', '原因'],
                        rows: [
                            ['TabBar 与首屏关键图标', '本地、小尺寸', '启动和弱网必须可用'],
                            ['低频内容图片', 'CDN + 占位与失败态', '不必随代码包下载'],
                            ['大幅照片', '按展示尺寸压缩', '原图直接打包浪费明显'],
                            ['透明插画', '对比格式和视觉质量', '不能只按文件后缀决定'],
                            ['重复图与历史活动图', '确认入口后合并或删除', '减少长期沉积'],
                            ['运行时生成的小装饰', 'CSS 或组件能力', '避免大量相似位图']
                        ]
                    }
                },
                {
                    heading: '包小了，再拿真机走一遍',
                    paragraphs: [
                        '有些方案在报表里很好看，真机体验却变差。比如把首页马上需要的组件放进分包，会出现第一次点击明显等待；把所有图片搬到网络，弱网下页面先是大片空白；过度拆公共模块，又可能让不同分包各带一份相似代码。',
                        '所以这次没有只验“能上传”。冷启动、首页渲染、首次进入每个分包、分包间跳转、分享直达、弱网和缓存后的二次访问都走了一遍。开发者工具只能帮助定位，最后还是以几台真机的实际路径为准。'
                    ],
                    flow: [
                        { title: '构建基线', detail: '同一命令记录主包与分包' },
                        { title: '定位来源', detail: '从产物反查页面和依赖链' },
                        { title: '小步调整', detail: '删除、迁移或缩小公共入口' },
                        { title: '重新构建', detail: '确认变化来自本次修改' },
                        { title: '真机回归', detail: '冷启动、弱网与分享直达' },
                        { title: '写入门槛', detail: '阻止体积无声反弹' }
                    ]
                },
                {
                    heading: '构建后把大小打印出来',
                    paragraphs: [
                        '包体积最怕优化完就结束。后面再加一个页面、一个 SDK 或一组图片，几个月后还是会涨回来。现在生产构建后会输出各包和主要资源的大小，与仓库里保存的基线比较。',
                        '目前没有把每个字节都设成硬门槛：编译器变化也可能带来波动。超过预警值时先打印增长最多的文件和所属分包，明显越过上限才阻断。提交人至少要知道这次为什么变大，而不是上线前才在开发者工具里看到。'
                    ],
                    code: `const limits = {
  mainPackageKb: 1500,
  singleAssetKb: 180,
  warningGrowthKb: 80
}

for (const pkg of buildReport.packages) {
  compareWithBaseline(pkg.name, pkg.sizeKb)
}

assertBelow('main package', buildReport.main.sizeKb, limits.mainPackageKb)
reportLargeAssets(buildReport.assets, limits.singleAssetKb)`,
                    note: '示例阈值只是演示，实际项目应根据自己的基线和平台要求设置。检查脚本读取的是生产构建产物，不把 source map、日志和本地调试文件混进来。'
                }
            ],
            closing:
                '一次集中清理能省下一块体积，但后面继续从总入口引东西、继续把原图扔进仓库，很快又会涨回来。以后改公共组件或新增 SDK，我准备顺手看一次产物变化。知道多出来的是哪几个文件，通常比临近上传才一起排查轻松。'
        })
    },
    {
        id: 25,
        title: '2024 年终总结（提纲）：自动化、数据和 AI 进入日常工作',
        description: '一份停在 2024 年 12 月 31 日的回顾提纲：先整理 Puppeteer、浏览器扩展、Python 聚合、大模型清洗与小程序重构的真实节点。',
        icon: 'coffee',
        createdAt: '2024-12-31 15:42:00',
        updatedAt: '2024-12-31 23:28:00',
        publishedAt: '2024-12-31 22:47:00',
        tags: ['JavaScript', 'Python', 'Puppeteer'],
        tech: ['Node.js', 'Python'],
        content: renderArticle({
            intro: '今年的工作内容比前几年散得多：一边还在做 C 端网站、小程序和后台，一边开始写跑很久的 Puppeteer 任务、浏览器扩展、Python 数据聚合，也第一次把大模型真正放进数据清洗流程。现在还不想把它们硬凑成一篇“成长很多”的总结，所以先留一份提纲，把确定发生过的节点、想补的细节和暂时没有答案的问题列出来。',
            sections: [
                {
                    heading: '这一年大致做了什么',
                    paragraphs: [
                        '下面只列我亲手参与且可以公开描述的技术类型，不写公司、产品和真实平台名称。项目之间有前后关系，但不是都从 1 月开始，也不代表我独立负责了整条业务链。',
                        '如果以后补成完整文章，可以按“页面之外的问题越来越多”作为主线：浏览器自动化先让我碰到长任务和资源回收，扩展把规则带到人工确认现场，Python 聚合开始处理跨平台数据，大模型则被限制在可校验的候选生成环节。'
                    ],
                    table: {
                        headers: ['大致时间', '技术内容', '今年留下的关键词', '以后想补的现场'],
                        rows: [
                            ['年初', 'Puppeteer 采集任务', '并发、重试、断点、会话回收', '第一次发现任务跑通不等于能长期运行'],
                            ['年中', 'Chrome 浏览器扩展', '人工触发、规则配置、最小权限', '为什么有些特殊网站不适合继续堆服务端脚本'],
                            ['年中以后', '千问 / DeepSeek 数据清洗', 'schema、证据、评估集、人工复核', '一次“看起来正确但不能入库”的结果'],
                            ['下半年', 'Python 多平台数据聚合', 'Adapter、统一模型、权限透传、来源', '从字段并集改到业务模型的过程'],
                            ['年底', 'uni-app + Vue 3 小程序重构', '分包、依赖图、图片、体积基线', '包体积下降约 30% 后仍然保留的取舍']
                        ]
                    }
                },
                {
                    heading: '可以写成正文的第一条线：我开始离开“请求—渲染”',
                    paragraphs: [
                        '以前遇到的大多数问题，边界还在一次页面访问里：请求接口、维护状态、展示组件。今年明显多了另一类任务——它们要运行几分钟甚至几小时，要保存中间状态，要在浏览器崩溃或接口限流后继续，还要让下一位同事知道失败发生在哪里。',
                        '这里可以从一个具体采集任务写起，不必罗列所有技术。重点不是 Puppeteer API，而是自己什么时候意识到需要任务 ID、幂等、断点、失败样本和资源预算。再补一段浏览器扩展：为什么把最后一步交给用户在当前页面确认，反而比完全自动化更可靠。'
                    ],
                    items: [
                        '【待补】当时最早暴露的故障是什么：内存、登录态、页面变化，还是限流？',
                        '【待补】哪一次失败让日志从 console.log 变成了可检索的任务记录？',
                        '【待补】服务端脚本与浏览器扩展最终如何分工？',
                        '【待补】哪些站点或操作明确决定不自动化？'
                    ],
                    quote: '可考虑保留的年度判断：自动化不是“不要人”，而是把重复步骤交给程序，把不确定判断留在能看见上下文的位置。'
                },
                {
                    heading: '第二条线：AI 已经能干活，但还不能替我承担结果',
                    paragraphs: [
                        '今年接入千问和 DeepSeek 后，最直观的变化是过去很难穷举规则的文本，可以先得到结构化候选。但模型偶尔会补全不存在的信息，也会把不确定内容写得很肯定，所以最终流程没有采用“模型返回什么就入库什么”。',
                        '完整文章里最好选同一条数据走完整流程：输入如何裁剪和脱敏，模型返回怎样的 JSON，schema 校验拦住了什么，证据回查怎么做，什么情况进入人工复核。这样比写一串模型参数更像今年真实学到的东西。'
                    ],
                    flow: [
                        { title: '原始数据', detail: '先做确定性清理和最小化' },
                        { title: '模型候选', detail: '要求结构化输出和证据位置' },
                        { title: '程序校验', detail: 'schema、枚举、范围与来源回查' },
                        { title: '风险分流', detail: '自动接受、人工复核或拒绝' },
                        { title: '版本入库', detail: '记录模型、规则和修改来源' }
                    ],
                    items: [
                        '【待补】一个模型结果“语言通顺但事实错误”的例子。',
                        '【待补】千问与 DeepSeek 在项目里是否有明确分工，还是按阶段替换？',
                        '【待补】人工复核最费时间的地方，是否真的比原流程省？',
                        '【待补】哪些字段从一开始就不允许交给模型判断？'
                    ]
                },
                {
                    heading: '第三条线：从上游字段转向稳定的数据边界',
                    paragraphs: [
                        'Python 聚合层是今年另一个明显变化。最早觉得只是同时请求几个平台、统一字段名，实际很快遇到权限、缺失值、跨平台去重、全局排序和来源追踪。它让我第一次比较集中地思考：一个下游模型应该表达业务概念，还是把上游响应原样搬过来。',
                        '这里不需要把自己写成后端专家。可以诚实说明服务端和数据方面仍有很多知识是边做边补，具体基础设施也有后端与运维协作。重点写自己负责的适配、基础聚合、权限透传和问题定位。'
                    ],
                    table: {
                        headers: ['年初更习惯关注', '年底开始主动关注', '仍然想补的能力'],
                        rows: [
                            ['页面是否正确渲染', '一次任务是否可恢复', '数据库与查询设计'],
                            ['接口字段有没有拿到', '字段能否回到来源', '更系统的服务端测试'],
                            ['请求报错如何提示', '部分失败能否被识别', '容量评估和稳定性'],
                            ['当前用户看到了什么', '权限是否贯穿缓存和聚合', '认证授权的完整模型'],
                            ['功能能否按期上线', '上线后如何监控与复盘', '可观测性和告警治理']
                        ]
                    }
                },
                {
                    heading: '今年想保留的几个工程习惯',
                    paragraphs: [
                        '这部分以后可以写得更口语一点，不需要每条都包装成方法论。它们更像今年在不同项目里反复付过成本以后留下的习惯。',
                        '也可以补一两个反例：例如用固定延时等页面、把所有分页一次并发、为了包体积把关键资源全放网络、让模型输出直接覆盖正式字段。说明当时为什么那么做，以及后来怎么改。'
                    ],
                    items: [
                        '长任务开始前先想失败后从哪里继续，而不是完成后才补重试。',
                        '无法解释来源的数据，不急着合并成一个“干净结果”。',
                        '权限不仅在接口入口检查，缓存、字段选择和日志也要带着它。',
                        'AI 生成的是候选，确定性程序和人工才决定是否成为正式结果。',
                        '优化必须固定前后口径，并且在真机或真实任务上验证。',
                        '不熟悉的服务端、Docker 和运维内容，明确记录协作边界。'
                    ]
                },
                {
                    heading: '给 2025 留的问题，而不是先写答案',
                    paragraphs: [
                        '如果明年继续沿着现在的方向，最想补的是把数据聚合能力做成边界更清楚的服务：接口契约、身份与权限、缓存、超时、错误语义和测试都要比现在系统一些。FastAPI 可以作为实现工具，但不希望文章只停在“会写几个路由”。',
                        'AI 辅助研发也值得继续观察。它已经能帮我补测试、查文档和整理重复代码，但审查生成代码需要新的成本。明年可以记录哪些任务真正节省时间，哪些只是把写代码的时间换成了验证时间。'
                    ],
                    items: [
                        '【待补】希望 FastAPI/BFF 最先解决的一个真实问题是什么？',
                        '【待补】数据库、缓存、队列和容器里，准备优先补哪一块？',
                        '【待补】怎样衡量 AI 辅助开发是否真的更快、更可靠？',
                        '【待补】还想继续做偏前端，还是愿意承担更多服务端边界？'
                    ],
                    note: '这篇目前故意保留为提纲。等以后补写时，最好每个章节只选一个真实现场，不用为了完整而虚构数字、情绪或个人角色。'
                }
            ],
            closing:
                '先写到这里。2024 年还没有一个特别整齐的结论，只是工作边界从页面慢慢延伸到了浏览器、任务、数据和模型。等细节记得更清楚时，再把上面的【待补】逐项换成当时的现场；如果最后仍然没有答案，也可以保留问题本身。'
        })
    },
    {
        id: 26,
        title: '给 Python 聚合函数套一层 FastAPI 接口',
        description: '拿跨平台查询做一个接口示例，记请求模型、身份透传、HTTP Client 复用和上游失败的处理。',
        icon: 'Python',
        createdAt: '2025-02-23 13:52:00',
        updatedAt: '2025-02-23 23:21:00',
        publishedAt: '2025-02-23 22:38:00',
        tags: ['Python', 'DevOps'],
        tech: ['Python'],
        content: renderArticle({
            intro: '前面记过用 Python 整理不同平台的数据，这次把类似的聚合函数接成 FastAPI 接口试一下。路由本身挺好写，麻烦的是页面还需要知道：这次结果全不全、哪个来源没查到、还能不能重试。下面用一个匿名化的查询预览例子整理，不涉及具体公司的平台和接口。',
            closingHeading: '先让前端知道发生了什么',
            sections: [
                {
                    heading: '这层先只管查询和数据转换',
                    paragraphs: [
                        'BFF 面向当前前端场景提供更顺手的接口：把页面筛选条件转换成各平台查询，调用上一层 Adapter，返回统一预览数据和来源状态。页面不用再认识三套分页、枚举和错误格式。',
                        '但发送规则、渠道额度、正式任务状态和审计仍由对应业务服务负责。BFF 可以生成带权限和查询版本的候选快照，不能因为离前端近，就再实现一套“谁应该收到什么”的核心规则。',
                        '接口也没有照着页面组件一比一设计。组件今天分成三个 Tab，明天可能合并；BFF 暴露的是查询、预览和确认这些相对稳定的动作。'
                    ],
                    table: {
                        headers: ['能力', 'BFF 负责', '不放在 BFF'],
                        rows: [
                            ['跨平台查询', '参数转换、并发调用、统一响应', '修改上游平台数据'],
                            ['权限', '验证调用身份并向下透传范围', '用万能账号模拟用户权限'],
                            ['筛选预览', '基础条件、排序、数量与来源状态', '复制完整业务策略'],
                            ['确认名单', '固定查询快照并返回引用', '直接执行所有渠道投送'],
                            ['错误处理', '统一有限错误码和可重试提示', '暴露上游地址与响应正文'],
                            ['审计', '请求 ID、主体、范围和结果摘要', '记录完整敏感用户数据']
                        ]
                    }
                },
                {
                    heading: '参数写成模型，比接一个大 dict 好查',
                    paragraphs: [
                        '前端提交的筛选条件不能直接当 dict 往下传。平台名称、组织 ID 数量、排序字段、页大小和请求模式都有边界；未知字段默认拒绝，避免前端拼错参数却被服务静默忽略。',
                        '响应模型比请求模型更重要。聚合对象内部有来源字段、冲突候选和调试信息，但返回给页面的 RecipientPreview 只保留展示和选择需要的内容。FastAPI 的 response_model 会按声明过滤输出，这里相当于多一道防止“顺手 return 内部对象”的边界。',
                        'OpenAPI 自动文档让前后端对字段更方便，但文档生成不等于契约已经合理。状态枚举、空值语义和错误样例仍然需要人工约定。'
                    ],
                    code: `from enum import StrEnum
from pydantic import BaseModel, ConfigDict, Field

class QueryMode(StrEnum):
    PREVIEW = "preview"
    FINAL = "final"

class RecipientQuery(BaseModel):
    model_config = ConfigDict(extra="forbid")

    source_names: set[str] = Field(min_length=1, max_length=3)
    organization_ids: list[str] = Field(default_factory=list, max_length=100)
    roles: set[str] = Field(default_factory=set, max_length=10)
    keyword: str | None = Field(default=None, max_length=80)
    mode: QueryMode = QueryMode.PREVIEW
    page_size: int = Field(default=20, ge=1, le=100)
    cursor: str | None = Field(default=None, max_length=500)

class RecipientPreview(BaseModel):
    entity_key: str
    display_name: str | None
    organization_name: str | None
    roles: list[str]
    available_channels: list[str]

class QueryResponse(BaseModel):
    status: str
    items: list[RecipientPreview]
    next_cursor: str | None
    unavailable_sources: list[str]
    snapshot_id: str | None`,
                    note: '示例字段经过匿名化。联系方式不进入预览模型；真正执行渠道任务时，由有权限的服务根据稳定引用解析。'
                },
                {
                    heading: '请求往下传，权限也要跟着传',
                    paragraphs: [
                        '如果接在已有认证体系后面，这层应该复用经过验证的身份，而不是重新设计一套登录。示例用 AuthContext 表示当前请求的权限信息，实际要放哪些字段由上游约定决定，别只为了模型齐全就加一堆用不到的属性。',
                        '最少要能说明当前是谁、允许查哪些来源和范围。如果系统确实存在租户、角色或权限版本，再继续向下透传。单独一个 user_id 不一定足够，但把浏览器传来的所有身份字段原样相信也不对。',
                        '我也不直接相信浏览器传来的 X-User-Id。只有经过受信网关验证的 token 或签名上下文才能转换成 AuthContext；调试环境使用独立配置，不能为了本地好用把绕过逻辑带进生产。'
                    ],
                    code: `from typing import Annotated
from fastapi import Depends, HTTPException, Request

async def get_auth_context(request: Request) -> AuthContext:
    credential = read_trusted_credential(request.headers)
    claims = await verify_credential(credential)

    if not claims.active:
        raise HTTPException(status_code=401, detail="invalid_credential")

    return AuthContext(
        subject_id=claims.subject,
        tenant_id=claims.tenant,
        roles=frozenset(claims.roles),
        scope_ids=frozenset(claims.data_scopes),
        permission_version=claims.permission_version,
    )

CurrentAuth = Annotated[AuthContext, Depends(get_auth_context)]`,
                    table: {
                        headers: ['位置', '必须携带或校验的内容'],
                        rows: [
                            ['路由入口', '身份有效、租户匹配、动作权限'],
                            ['Adapter 调用', '上游允许的数据范围或受限凭据'],
                            ['聚合与裁剪', '字段级和来源级可见性'],
                            ['缓存 / 快照', '主体、租户、权限版本与查询哈希'],
                            ['日志', '可审计主体与 request_id，不含 token'],
                            ['后续确认', '快照仍属于当前主体且未过期']
                        ]
                    }
                },
                {
                    heading: '别每次请求都重新建 HTTP Client',
                    paragraphs: [
                        'BFF 大多数时间都在等上游 I/O，使用 async 路由和 HTTPX 比同步阻塞更合适，但 async 不代表连接可以无限开。每个请求里临时 new 一个 AsyncClient 会失去连接复用；长期全局对象又需要明确关闭。',
                        '现在通过 FastAPI lifespan 创建共享客户端，停止服务时关闭。连接、读取、写入和等待连接池分别设置超时，连接池也有限制。某个平台需要更长读取时间时在 Adapter 层单独覆盖，不把整个服务都改成永不超时。',
                        '总请求还有一个比各上游更短的业务 deadline。即使单次 HTTP 请求都没有超时，多个重试和分页加起来也不能让页面一直转圈。'
                    ],
                    code: `from contextlib import asynccontextmanager
import httpx
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    timeout = httpx.Timeout(
        connect=2.0,
        read=5.0,
        write=5.0,
        pool=1.0,
    )
    limits = httpx.Limits(
        max_connections=40,
        max_keepalive_connections=20,
    )
    async with httpx.AsyncClient(
        timeout=timeout,
        limits=limits,
        follow_redirects=False,
    ) as client:
        app.state.http = client
        yield

app = FastAPI(lifespan=lifespan)`,
                    note: '示例数字只是说明配置位置。真正阈值应结合上游 SLA、调用量和实例资源压测；重试只用于明确可重试且幂等的读取，不能对所有异常无脑重放。'
                },
                {
                    heading: '路由文件别塞进三套上游请求',
                    paragraphs: [
                        '路由里不再直接写三个平台的请求。它只接收已经校验的 Query、AuthContext 和服务依赖，调用一个 use case，再映射成公开响应。这样 FastAPI 是传输层，聚合逻辑不依赖 Request 对象，也能被任务或测试直接调用。',
                        '依赖注入对测试很方便，但没有把所有类都包装成 Depends。配置、认证、共享 Client 和聚合服务适合注入；纯转换函数保持普通函数，避免为了框架写出很深的依赖树。'
                    ],
                    code: `@router.post(
    "/recipient-queries",
    response_model=QueryResponse,
    responses={
        403: {"model": ErrorResponse},
        424: {"model": ErrorResponse},
    },
)
async def query_recipients(
    query: RecipientQuery,
    auth: CurrentAuth,
    service: Annotated[RecipientService, Depends(get_recipient_service)],
) -> QueryResponse:
    result = await service.query(query=query, auth=auth)

    return QueryResponse(
        status=result.status,
        items=[to_preview(item) for item in result.items],
        next_cursor=result.next_cursor,
        unavailable_sources=result.unavailable_sources,
        snapshot_id=result.snapshot_id,
    )`,
                    flow: [
                        { title: '认证依赖', detail: '验证身份并生成权限上下文' },
                        { title: '请求模型', detail: '限制字段、数量与查询模式' },
                        { title: '查询用例', detail: '控制 deadline 与来源策略' },
                        { title: '聚合 Adapter', detail: '复用统一模型和来源记录' },
                        { title: '响应模型', detail: '裁剪成页面所需最小字段' },
                        { title: '请求日志', detail: '记录状态、耗时与缺失来源' }
                    ]
                },
                {
                    heading: '一个来源超时，不要显示成“没有用户”',
                    paragraphs: [
                        '预览和最终确认对完整性的要求不同。预览时一个非必要平台超时，可以返回 partial，让页面明确展示“平台 B 暂不可用”；最终名单则要求所有必要来源成功，否则用户看到的数量会被误认为完整。',
                        'HTTP 状态码表示这一层请求是否可接受，响应中的 status 和 source_statuses 表示聚合完成度。上游 401 不直接原样透传成当前用户未登录；要区分 BFF 凭据失效、调用者无权限和上游服务异常。',
                        '错误正文只返回稳定 code、可安全展示的 message、request_id 和 retryable。上游 URL、响应正文、token 与堆栈留在受控日志中，并且同样需要脱敏。'
                    ],
                    table: {
                        headers: ['场景', '接口处理', '页面动作'],
                        rows: [
                            ['查询参数越界', '422 + validation_error', '提示修改条件'],
                            ['当前主体无动作权限', '403 + forbidden', '隐藏或禁用确认入口'],
                            ['预览的可选来源超时', '200 + partial', '展示缺失来源，可重试'],
                            ['最终名单的必要来源失败', '424 + upstream_incomplete', '禁止创建正式任务'],
                            ['连接池或服务总 deadline 到期', '504 + deadline_exceeded', '保留条件后重试'],
                            ['服务内部契约错误', '500 + internal_error', '显示 request_id，触发告警']
                        ]
                    }
                },
                {
                    heading: '如果以后加确认操作，预览结果怎么保留',
                    paragraphs: [
                        '如果页面先显示 128 人，用户停留两分钟后再提交同一筛选条件，上游数据和权限可能已经变化。直接重新查询并发送，最终人数可能与预览不同；保存全部明文名单到浏览器又不可取。',
                        '一种可选做法是在服务端保存短期预览快照，页面确认时交回 snapshot_id。快照需要绑定用户、查询条件和有效期，确认时重新检查权限。这比把整份名单塞进浏览器再原样交回来容易约束。',
                        '不过这已经超出单纯查询接口了。只做即时展示时，不必急着加快照存储；等有了“预览后执行”的需求，再跟业务服务约定谁保存、什么时候过期、数据变化后是否要求重新确认。下面只是需要考虑的字段。'
                    ],
                    table: {
                        headers: ['快照字段', '用途'],
                        rows: [
                            ['snapshot_id', '不可猜测的短期引用'],
                            ['query_hash', '确认查询条件未被替换'],
                            ['subject / tenant', '限制快照归属'],
                            ['permission_version', '权限变化后使结果失效'],
                            ['source_versions', '说明数据来自哪个时间点'],
                            ['status', '只有 complete 可进入正式确认'],
                            ['expires_at', '限制旧结果长期复用']
                        ]
                    }
                },
                {
                    heading: '先造一个上游超时，再看页面收到什么',
                    paragraphs: [
                        'FastAPI 的 TestClient 和依赖覆盖让路由测试很好写，但最值得测的不是正常返回 200，而是每一个边界是否真的生效。测试里用假的认证依赖和 Adapter，不访问真实平台。',
                        '我会先测几个容易写错的地方：多传了一个拼错的参数会不会被忽略，一个上游超时会不会返回空列表，内部对象加了字段会不会跟着传到前端。至于快照归属和权限版本，是采用上面那套确认方案后才需要补的测试。',
                        'response_model 能帮忙裁剪输出，但转换函数里也尽量只挑页面需要的字段。这样看代码的时候就知道返回了什么，不用把防泄漏全部寄托在一个装饰器上。'
                    ],
                    steps: [
                        '用合法身份请求最小筛选，确认响应符合公开 schema。',
                        '加入未知字段、超长列表和篡改 cursor，确认在调用上游前被拒绝。',
                        '让一个 Adapter 超时，分别验证 preview 与 final 模式。',
                        '用主体 A 创建快照，再由主体 B 和另一租户尝试确认。',
                        '改变 permission_version，确认旧快照与缓存不可继续使用。',
                        '给内部对象加入联系方式和调试字段，确认公开响应不存在。',
                        '检查日志只包含 request_id、来源状态、数量和耗时摘要。'
                    ]
                },
                {
                    heading: '还得继续补的基础',
                    paragraphs: [
                        '对我来说，数据转换、接口模型和前端联调比较容易接上原来的经验。连接池、取消请求、进程退出时怎么回收资源，还需要继续弄明白。真实项目里涉及部署、权限和容量，也要找后端、运维一起确认。',
                        'FastAPI 的类型提示、依赖注入和自动文档对前端开发者确实友好，不过框架不会自动解决鉴权、并发与数据边界。把能做的部分和需要协作的部分说清楚，反而更接近这次项目的真实情况。'
                    ],
                    note: '文章中的平台、字段、阈值和认证方式均做了抽象，不包含公司或客户信息，也不表示我设计或维护了完整基础设施。'
                }
            ],
            closing: '先做到参数错了能说明白、上游超时不伪装成空数据、返回字段不会越写越多。路由代码反而不需要很长。快照和正式任务那一段先作为扩展思路留着，不把一个查询接口提前写成完整业务平台。'
        })
    },
    {
        id: 27,
        title: '3000+ 份 PDF 集中生成：任务失败了，接下来怎么办',
        description: '接着报告模板那篇，聊 Node 服务、任务队列和多容器协作。重点放在恢复和结果核对。',
        icon: 'Server',
        createdAt: '2025-04-20 13:18:00',
        updatedAt: '2025-04-20 23:34:00',
        publishedAt: '2025-04-20 22:52:00',
        tags: ['Node.js', 'Puppeteer', 'DevOps'],
        tech: ['Node.js', 'Docker'],
        content: renderArticle({
            intro: '前面那篇主要讲 HTML 模板和打印，这次补集中生成时的事情。项目里有过 3000 多份报告一起生成的需求，用任务队列分配，再和后端、运维配合开多个阿里云弹性容器处理。我负责的 Node/Puppeteer 服务和模板在这条流程里，最需要说清楚的是每一份现在做到哪了，失败以后该重做哪一步。',
            closingHeading: '剩下的几份，比前面的进度更值得看',
            sections: [
                {
                    heading: '进程没了，不能连进度也没了',
                    paragraphs: [
                        '零散生成时，一个 Node 脚本从数据库读列表、循环打开页面、生成 PDF，失败了人工重跑就够用。集中任务里，这种写法很快遇到三个问题：进程退出后不知道做到哪一份；重跑可能覆盖已经交付的文件；脚本还活着也不代表某个页面没有卡死。',
                        '于是先把“批次”和“报告任务”拆开。批次负责统计整体进度和业务范围，每份报告有独立 task_id、稳定 business_key、状态、尝试次数和产物引用。执行器只领取任务，不在内存里保存唯一进度。',
                        '稳定 business_key 由报告类型、数据版本、模板版本和目标实体组成。同一个批次重复提交时先查现有任务，而不是继续创建一份同名文件。'
                    ],
                    table: {
                        headers: ['单机循环里的隐含状态', '批处理中的显式记录'],
                        rows: [
                            ['数组下标 i', '可持久化 task_id / business_key'],
                            ['当前 for 循环跑到哪里', 'queued、leased、rendering 等状态'],
                            ['catch 后 console.log', '有限错误码、阶段和尝试次数'],
                            ['本地 output.pdf', '带校验值和访问控制的产物记录'],
                            ['进程是否还在', '心跳、租约到期时间和阶段耗时'],
                            ['人工重新执行整个脚本', '只重试符合条件的单个任务']
                        ]
                    }
                },
                {
                    heading: '失败在哪一步，恢复方式就不一样',
                    paragraphs: [
                        '只写 pending、success、failed 很难排查一批任务。至少在日志里分出取数、渲染、加密、上传，才能决定下一步怎么处理。下面的状态名称是为了讲清流程简化的，不是公司的实际表结构。',
                        '状态不是页面展示用的文案，而是服务端允许的转换。例如只有 encrypted 才能进入 uploading，uploaded 还要写入产物校验和后才成为 succeeded。失败重试从上一个安全检查点开始，不允许随便把状态改回 queued。',
                        '原始 HTML、未加密 PDF 和最终文件是三种不同敏感级别的临时产物。每一阶段完成后记录引用，成功或最终失败后按策略清理，不把临时目录当长期存储。'
                    ],
                    flow: [
                        { title: 'queued', detail: '任务已创建，等待领取' },
                        { title: 'leased', detail: '某个 worker 获得限时执行权' },
                        { title: 'rendering', detail: '取数、页面就绪并输出原始 PDF' },
                        { title: 'encrypting', detail: '生成受保护的交付文件' },
                        { title: 'uploading', detail: '写入受控对象存储' },
                        { title: 'succeeded', detail: '校验产物并登记访问引用' }
                    ],
                    table: {
                        headers: ['失败阶段', '能否自动重试', '恢复起点'],
                        rows: [
                            ['取数超时', '幂等读取可重试', '重新读取固定数据版本'],
                            ['模板报告未 ready', '有限次数', '重新创建干净页面'],
                            ['浏览器崩溃', '可以', '释放租约后重新渲染'],
                            ['加密失败', '查明工具和输入后重试', '复用受控原始 PDF 或重渲染'],
                            ['上传超时且结果未知', '先查询产物键', '确认不存在后再上传'],
                            ['状态提交失败', '需要幂等确认', '以产物记录和版本号判断']
                        ]
                    }
                },
                {
                    heading: '多个 worker 领取同一任务怎么办',
                    paragraphs: [
                        '多个容器消费时，任务不能靠“先查出来，再改状态”这种没保护的两步操作领取。这里用租约举例说明：worker 拿到 task_id、lease_token 和 expires_at，后续更新检查 token，旧实例恢复后就不能随便覆盖新实例的结果。实际项目也可以用队列自身的确认机制配合条件更新，具体要跟后端约定。',
                        '执行过程中定期续租，但续租失败不会继续无限生成。当前阶段尽快停止，在 finally 中关闭页面并上报。租约过期的任务由回收逻辑重新排队，同时保留 attempt 和上一次错误。',
                        '消息至少一次到达是可以接受的，前提是业务效果幂等。队列消息只是“请检查这个 task_id”，真实状态仍从任务存储读取，不能把完整用户数据和密码塞进消息正文。'
                    ],
                    code: `type Lease = {
  taskId: string
  token: string
  expiresAt: Date
}

async function runTask(lease: Lease) {
  const heartbeat = startLeaseHeartbeat(lease)

  try {
    const task = await tasks.assertCurrentLease(lease)
    const artifact = await renderAndProtect(task, lease)

    await tasks.complete({
      ...lease,
      artifactKey: artifact.key,
      checksum: artifact.checksum
    })
  } catch (error) {
    await tasks.failIfLeaseIsCurrent(lease, classify(error))
  } finally {
    heartbeat.stop()
    await closeTaskResources(lease.taskId)
  }
}`,
                    note: '这里是简化后的控制流，不代表真实队列或数据库实现。关键点是所有状态变更都校验租约版本，不能只凭 task_id 更新。'
                },
                {
                    heading: 'worker 只等模板告诉它 ready',
                    paragraphs: [
                        '报告页面由我负责，页面会根据 query 中的短期任务引用请求数据，渲染图表、表格、AI 分析和已经算好的分页。以前 worker 等一个固定时间再打印，数据量一变就会出现空图或截断。',
                        '后来页面维护明确状态：pending、ready、error。只有数据请求完成、字体可用、所有图表完成动画或关闭动画、分页计算稳定后才进入 ready；任何关键模块失败都进入 error，并给出不含敏感数据的错误码。',
                        'worker 访问的是受信模板地址，只传不可猜测且短期有效的任务引用，不把用户数据拼在 query。导航会限制允许的 origin，页面内部也不会加载任意外部 URL，避免报告内容变成服务端浏览器的访问入口。'
                    ],
                    code: `declare global {
  interface Window {
    __REPORT__: {
      state: 'pending' | 'ready' | 'error'
      code?: string
      templateVersion: string
    }
  }
}

await page.goto(reportUrl, {
  waitUntil: 'domcontentloaded',
  timeout: NAVIGATION_TIMEOUT
})

await page.waitForFunction(
  () => window.__REPORT__?.state !== 'pending',
  { timeout: REPORT_READY_TIMEOUT }
)

const report = await page.evaluate(() => window.__REPORT__)
if (report.state !== 'ready') {
  throw new ReportRenderError(report.code ?? 'unknown')
}

await page.pdf(pdfOptions)`,
                    table: {
                        headers: ['ready 前必须满足', '失败时记录'],
                        rows: [
                            ['固定版本数据已返回', 'data_timeout / data_invalid'],
                            ['字体加载完成', 'font_timeout'],
                            ['图表已完成渲染', 'chart_error + 组件标识'],
                            ['分页高度稳定', 'pagination_unstable'],
                            ['关键图片加载成功', 'asset_error + 资源类型'],
                            ['页面没有全局异常', 'template_error + 模板版本']
                        ]
                    }
                },
                {
                    heading: '不要一口气开几百个 Page',
                    paragraphs: [
                        'Puppeteer 报告不是轻量 HTTP 请求。每个页面都要加载字体、图表和大量表格，峰值内存会明显高于稳定值。并发从 1 调到 2 可能有效，从 4 调到 8 不一定更快，反而会让垃圾回收、连接池和上游接口一起抖动。',
                        '我用脱敏后的大、中、小报告样本测单页峰值内存、渲染耗时和失败率，再给容器预留浏览器本身、Node 进程和系统空间。单容器并发是一个保守值，达到内存水位或连续出现慢任务时暂时不领取新任务。',
                        '页面完成后逐个关闭，浏览器处理一定数量任务或出现异常迹象后主动轮换。复用浏览器能减少启动成本，但“永远不重启”会让某些页面泄漏逐渐积累。'
                    ],
                    table: {
                        headers: ['观测值', '用来决定什么'],
                        rows: [
                            ['单页峰值 RSS / 容器内存', '单实例安全并发'],
                            ['P50 / P95 渲染耗时', '租约时长与批次预计完成时间'],
                            ['浏览器启动耗时', '是否复用与轮换频率'],
                            ['页面崩溃和超时率', '并发是否过高、模板是否异常'],
                            ['上游接口 QPS 与错误率', '全局消费速率上限'],
                            ['队列积压年龄', '是否需要扩容而不只看队列长度']
                        ]
                    }
                },
                {
                    heading: '加容器之前，也问一下数据接口扛不扛得住',
                    paragraphs: [
                        '后端和运维同事帮助把执行器运行在多个阿里云弹性容器中，按积压情况增加实例。我的工作重点是让 Node worker 能无状态启动、正确领取任务、响应终止信号，并把执行日志和状态交给统一系统。',
                        '扩容前先找整条链路的最小容量：数据接口、数据库连接、对象存储、加密 CPU 和队列都有上限。如果只按“还有 3000 条消息”快速拉很多容器，最可能发生的是所有 worker 一起超时和重试，形成更大的尖峰。',
                        '我这边要提供的是单份报告耗时、内存和错误情况，让后端、运维有依据判断怎么加实例。下游开始限流时，即使队列很长也得先降速。下面公式只方便估算大概时间，不代表项目实现了一套自动扩容算法。'
                    ],
                    code: `estimatedSeconds =
  pendingTasks /
  (
    workerCount *
    concurrencyPerWorker *
    successRate
  ) *
  p95TaskSeconds

effectiveConcurrency = Math.min(
  workerResourceLimit,
  upstreamRateLimit,
  storageWriteLimit,
  globalSafetyLimit
)`,
                    note: '公式只用于粗略估算和讨论，不是自动扩容算法。报告大小分布、重试、冷启动和长尾都会让实际完成时间更长。'
                },
                {
                    heading: '生成成功，不代表加密和上传也成功',
                    paragraphs: [
                        'Puppeteer 产出的原始 PDF 先写到受控临时目录，随后由约定工具生成加密版本。系统校验加密文件可打开、页数与原始报告一致，并计算校验值；只有校验通过的版本可以上传。',
                        '密码或密钥不写进队列、文件名和普通日志，也不与下载链接通过同一公开通道长期传递。具体管理由现有安全与业务方案负责，我这边只接收短期引用并避免在进程异常信息中输出。',
                        '对象存储 key 使用随机或内部任务标识，不包含姓名、院校等信息。上传后保存受控引用，下载由业务服务鉴权并签发短期地址，不把永久公开 URL 写回页面。'
                    ],
                    flow: [
                        { title: '原始 PDF', detail: '只存在于受控临时空间' },
                        { title: '加密处理', detail: '使用短期凭据或密钥引用' },
                        { title: '产物校验', detail: '页数、可读性与校验和' },
                        { title: '受控上传', detail: '随机 key，不含个人信息' },
                        { title: '登记引用', detail: '状态与 artifact_id 原子关联' },
                        { title: '清理临时文件', detail: '成功和失败路径都执行' }
                    ],
                    table: {
                        headers: ['风险', '控制'],
                        rows: [
                            ['未加密文件残留', '隔离临时目录 + finally 清理 + 定期兜底扫描'],
                            ['密码出现在日志', '只传引用，错误对象与命令输出脱敏'],
                            ['覆盖其他报告', '随机对象 key + 唯一产物版本'],
                            ['上传成功但状态失败', '先按 key 查询，再做幂等确认'],
                            ['永久公开下载', '私有存储 + 鉴权后的短期签名地址'],
                            ['失败样本泄露数据', '仅保存错误码和必要截图，受限访问并过期']
                        ]
                    }
                },
                {
                    heading: '最后几份一直不结束，具体卡在哪',
                    paragraphs: [
                        '总进度对业务有用，但排障更关心每个阶段的数量、最老任务等待多久、失败集中在哪个模板或数据范围。单看完成比例，最后几十个任务可能因为同一个缺陷无限重试。',
                        '日志以 batch_id、task_id、attempt、worker_id、template_version 和阶段串起来，每次外部调用记录耗时与安全错误分类，不记录完整报告数据。指标关注吞吐、积压年龄、阶段耗时、浏览器重启和错误率。',
                        '失败样本会保存必要的脱敏页面信息和截图，且有权限与过期时间。能只靠模板版本、错误码和 DOM 摘要定位时，就不保存完整页面。'
                    ],
                    table: {
                        headers: ['视角', '需要看到'],
                        rows: [
                            ['业务进度', '成功、处理中、可重试失败、最终失败'],
                            ['执行器', '活跃页面、内存、租约续期、浏览器轮换'],
                            ['队列', '积压长度、最老消息年龄、重投次数'],
                            ['模板', '按版本统计渲染错误和耗时'],
                            ['上游', '请求耗时、限流、超时与数据校验错误'],
                            ['交付', '加密、上传、校验与下载引用状态']
                        ]
                    }
                },
                {
                    heading: '小批量时就试一下中断和重试',
                    paragraphs: [
                        '小批量验证时，除了正常生成，还应该试停止 worker、浏览器异常、上游超时和上传结果未知。下面把这些情况列成回归项：队列里还有任务不代表一定会恢复，得实际看看中断以后谁负责接手。',
                        '批次从少量样本逐步放大，并混入最长表格、最多图表、空数据和包含特殊字符的报告。每一档先看内存、尾延迟和错误类型，再决定是否增加容器，而不是直接把 3000+ 条全部放进队列。',
                        '最终仍保留人工停止入口和按错误类型重放的工具。自动化能覆盖预期故障，但出现模板整体错误或数据源异常时，最快的正确动作往往是停止领取新任务。'
                    ],
                    steps: [
                        '用固定数据版本生成小样本，人工核对分页、图表和加密文件。',
                        '覆盖空数据、极长表格、多语言、特殊字符和最大图片。',
                        '在 rendering、encrypting、uploading 阶段分别终止 worker。',
                        '重复投递相同 task_id，确认只有一个有效产物。',
                        '模拟上游限流和对象存储超时，检查退避与全局降速。',
                        '按梯度扩大批次，观察 P95、内存水位和积压年龄。',
                        '验证暂停、恢复、按错误码重放和最终失败导出。'
                    ],
                    note: '容器、网络和伸缩策略由后端与运维同事共同完成。文章主要记录我负责的 HTML 模板、Node/Puppeteer 执行器、任务阶段衔接与联调，不把协作成果写成个人独立搭建。'
                }
            ],
            closing:
                '大部分报告顺利生成时，进度条涨得挺快，最后卡住的往往是少数特殊数据或模板问题。能把这几份单独找出来、确认原因、只重试它们，就不必重新折腾整批。容器和队列是大家一起配合的，我这边先把模板和执行器的状态交代清楚。'
        })
    },
    {
        id: 28,
        title: 'AI 写完代码以后，我通常会再看哪些地方',
        description: '不是一套正式审查制度，只是自己用下来容易漏看的几个地方：旧逻辑、类型断言、依赖和测试。',
        icon: 'Tool',
        createdAt: '2025-06-22 14:07:00',
        updatedAt: '2025-06-22 23:17:00',
        publishedAt: '2025-06-22 22:41:00',
        tags: ['JavaScript', 'TypeScript'],
        tech: [],
        content: renderArticle({
            intro: '现在写代码会经常用 AI，尤其是先搭一版、找报错位置、补重复逻辑这些事情。真正费精力的地方慢慢变成看它改了什么。有些代码单独看挺合理，放回项目里却不对：已有的请求封装没用，旧数据兼容删了，或者加一句 as 就把报错压下去了。我把自己比较常看的地方记在下面。',
            closingHeading: false,
            showToc: false,
            sections: [
                {
                    heading: '有些改动可以直接试，有些先别执行',
                    paragraphs: [
                        '不是所有改动都需要同一种审查强度。文案、样式和现有模式下的小组件，可以让 AI 直接给 diff；涉及认证、权限、支付、文件、数据库、外部 URL、部署和数据删除时，我会先让它只分析与列方案，不自动执行。',
                        '风险不只看改动行数。把一个按钮颜色改错影响很小；只改一行缓存 key，却可能让两个租户读到同一份数据。对于高风险代码，即使测试通过也会让熟悉该边界的人再看一遍。',
                        '我现在更少说“把这个功能做完”，而是把允许读哪些目录、禁止改哪些接口、需要通过哪些检查写清楚。工具能力越强，授权范围越需要具体。'
                    ],
                    table: {
                        headers: ['风险级别', '典型改动', 'AI 可以做什么', '合并前至少需要'],
                        rows: [
                            ['低', '文案、样式、快照更新', '直接生成有限 diff', '页面检查 + 基础 CI'],
                            ['中', '组件状态、接口适配、普通重构', '读调用链后实现', '异常分支 + 测试 + 人工 diff'],
                            ['高', '认证、权限、上传、外部请求', '先分析，再小步实现', '威胁检查 + 专项测试 + 同行复核'],
                            ['很高', '数据迁移、生产部署、密钥与删除', '只做辅助与演练方案', '明确审批、备份、回滚和最小权限']
                        ]
                    }
                },
                {
                    heading: '先让它找项目里已经有的写法',
                    paragraphs: [
                        '只把报错和当前文件发给 AI，它通常会围绕局部代码给一个自洽答案，却不知道项目已经有请求封装、权限组件、错误类型或兼容旧数据的逻辑。结果常见的是重复实现，或者绕过原有边界。',
                        '我会先让它列出相关入口、调用方、类型、测试和相似实现，并说明准备复用哪个模式。这里不是让模型写一篇长分析，而是检查它有没有遗漏关键文件。如果引用了不存在的函数或路径，说明上下文还没建立好。',
                        '需求也改成可验证的句子：谁可以调用、输入边界是什么、失败时页面看到什么、哪些旧行为必须保留。AI 如果无法复述这些约束，就先不让它动代码。'
                    ],
                    code: `任务：为文章后台增加“预览已发布内容”。

先只分析，不修改文件：
1. 找到现有文章读取接口、鉴权依赖、HTML 净化和发布状态类型。
2. 列出公开预览与后台预览的权限差异。
3. 找一个项目内相似路由作为实现依据。
4. 说明会修改哪些文件、不会修改哪些文件。
5. 给出成功、未登录、无权限、文章不存在、草稿五个验收场景。

约束：
- 不新增依赖；
- 不返回未净化 HTML；
- 不改变现有公开接口；
- 不使用 any、ts-ignore 或关闭测试。`,
                    note: '这种上下文清单对人工写代码同样有用。AI 只是让“需求含糊但代码很多”的问题出现得更快。'
                },
                {
                    heading: '需求只改筛选，为什么数据层也重写了',
                    paragraphs: [
                        '我先不被漂亮的函数名和注释带走，而是从用户动作反推：正常路径是否符合需求，权限不同的人会看到什么，请求失败后能不能恢复，旧入口是否仍然工作。',
                        'AI 很擅长补齐一个看似完整的功能，也容易顺手扩大范围。例如需求只说增加筛选，它可能重写数据层、修改共享类型、统一错误处理。每个额外改动都要问“是不是本次必须”，否则回归面会比需求本身大很多。',
                        '遇到大 diff，我会先要求拆成机械调整和行为调整两部分。重命名、格式化与业务逻辑混在一起，既难人工审查，也让测试失败时更难定位。'
                    ],
                    steps: [
                        '用一句话复述用户能观察到的变化。',
                        '把验收场景逐个映射到代码分支和测试。',
                        '标出所有本次需求没有要求的行为变化。',
                        '确认旧数据、旧入口和失败恢复没有被悄悄删除。',
                        '无法在合理时间解释的 diff，缩小后重新生成。'
                    ]
                },
                {
                    heading: '登录过了，不代表什么数据都能改',
                    paragraphs: [
                        '安全审查时我沿数据流看：输入从 URL、表单、header 或数据库进入后，在哪里验证、在哪里做权限判断、进入日志和响应前有没有裁剪。AI 常常会在“已有登录态”和“有权操作这个对象”之间直接画等号。',
                        '另一个高频问题是为了实现抓取、预览或代理，直接让服务端请求用户传入 URL。校验字符串以 https 开头并不够，还要限制目标、重定向和解析后的地址，避免服务变成访问内部网络的入口。',
                        '日志也会被顺手加得很详细。请求正文、token、密码、AI prompt、用户数据和报告内容都不应因为排查方便直接写入普通日志。记录 request_id、阶段、数量和安全错误码通常已经足够。'
                    ],
                    code: `// 看起来方便，但把调用者输入直接交给了服务端网络。
app.get('/api/preview', async (req, res) => {
  const response = await fetch(String(req.query.url))
  res.send(await response.text())
})

// 审查时至少要追问：
// - 当前用户是否有权预览这个资源？
// - 目标是否来自服务端维护的 allowlist / resource id？
// - DNS、私网地址、端口和重定向如何限制？
// - 响应大小、类型、超时和日志如何限制？
// - 返回 HTML 是否需要净化或隔离展示？`,
                    table: {
                        headers: ['边界', '我会追问'],
                        rows: [
                            ['认证与授权', '登录了是否真的等于能操作这个对象？'],
                            ['输入验证', '运行时是否校验，还是只有 TypeScript 类型？'],
                            ['数据库', '参数化、唯一约束、事务与越权查询是否成立？'],
                            ['外部请求', '目标、重定向、超时、响应大小是否受限？'],
                            ['文件处理', '类型、尺寸、路径、文件名和访问权限是否受限？'],
                            ['日志与错误', '是否输出 token、正文、个人数据或内部堆栈？'],
                            ['缓存', 'key 是否包含用户、租户、权限和内容版本？'],
                            ['危险动作', '是否有确认、幂等、回滚和最小作用域？']
                        ]
                    }
                },
                {
                    heading: '新增的 as 和默认值多看一眼',
                    paragraphs: [
                        'AI 很清楚怎样让 TypeScript 停止报错：as 某个类型、非空断言、<code>Record&lt;string, any&gt;</code>，或者给一个不确定对象补默认值。这些写法会让检查通过，却没有证明运行时数据真的符合类型。',
                        '接口响应、localStorage、URL 参数和 JSON.parse 的结果都属于 unknown。正确方向是运行时 schema 或显式类型守卫，再进入业务类型。可选字段也要区分“没有这个属性”和“值是 undefined”，尤其是 PATCH、表单和缓存数据。',
                        '如果一处改动新增很多断言，我会先回到边界找丢失的类型信息，而不是继续补断言。真正不可避免的断言应该靠近受控边界，并有测试解释为什么成立。'
                    ],
                    code: `// 容易把接口变化隐藏起来
const profile = (await response.json()) as UserProfile
return profile.school!.name

// 先把外部数据当 unknown，再显式验证
const payload: unknown = await response.json()
const parsed = UserProfileSchema.safeParse(payload)

if (!parsed.success) {
  throw new ApiContractError('invalid_user_profile', parsed.error)
}

return parsed.data.school?.name ?? '未填写'`,
                    table: {
                        headers: ['可疑写法', '可能隐藏的问题', '替代检查'],
                        rows: [
                            ['as SomeType', '没有运行时保证', 'schema / type guard'],
                            ['value!', '空值分支被忽略', '显式处理不存在'],
                            ['any', '错误沿调用链扩散', 'unknown + 收窄'],
                            ['catch (e) 后直接 e.message', '异常不一定是 Error', 'instanceof / 统一错误'],
                            ['默认 [] 或 {}', '把接口失败伪装成空数据', '区分 loading / empty / error'],
                            ['@ts-ignore', '跳过真实不兼容', '限定原因并修正类型边界']
                        ]
                    }
                },
                {
                    heading: '新包和新 API，查一下当前版本',
                    paragraphs: [
                        'AI 会推荐一个听起来很准确的包，也可能混用新旧版本 API。新增依赖前我会先看项目里是否已有能力，再到官方仓库和文档确认包名、版本、维护状态、许可证、体积和运行环境。',
                        '安装命令也不会直接复制执行。先看 lockfile 和包管理器，确认是不是开发依赖、是否真的要运行安装脚本，以及间接依赖变化有多大。一个十行工具函数通常不值得引入整棵新依赖。',
                        '即使包存在，也要确认生成代码引用的 API 属于当前锁定版本。最可靠的证据是项目安装后的类型声明、官方文档和实际测试，不是模型对函数签名的自信语气。'
                    ],
                    steps: [
                        '搜索仓库，确认没有已有封装或同类依赖。',
                        '核对官方包名、仓库、版本、许可证和维护状态。',
                        '检查 lockfile diff、间接依赖、安装脚本与产物体积。',
                        '在当前版本的类型和官方文档中确认 API。',
                        '评估移除成本，能用小段已有代码解决时不盲目加包。',
                        '执行依赖审计，但不把“audit 没报错”当完整安全结论。'
                    ]
                },
                {
                    heading: '测试绿了，先看它断言的是什么',
                    paragraphs: [
                        'AI 很会快速补覆盖率，也会写出只断言 mock 被调用、复制实现逻辑、把失败测试 skip 掉的测试。这样的测试和当前代码一起错时仍然全绿。',
                        '我优先从验收行为写测试：给定输入和权限，观察公开输出或副作用。关键边界至少有一个反例；修 bug 时先保留能复现旧问题的测试，再看实现如何变化。',
                        '快照测试适合稳定结构，不适合把一大段动态页面更新后直接按 u。只要我无法说明快照具体为什么变化，就不会把更新后的文件当作验证。'
                    ],
                    table: {
                        headers: ['表面上通过', '仍需检查'],
                        rows: [
                            ['新增单测全绿', '是否覆盖失败、权限和边界值'],
                            ['覆盖率提高', '断言是否能在错误实现下失败'],
                            ['E2E 点击成功', '是否等待真实状态而非固定延时'],
                            ['快照已更新', '变化是否逐项合理'],
                            ['mock 调用次数正确', '用户可观察结果是否正确'],
                            ['旧失败测试被删除', '需求是否真的允许删除行为']
                        ]
                    },
                    code: `it('不能读取其他用户的草稿', async () => {
  const article = await seedDraft({ ownerId: 'user-b' })

  const response = await requestAs('user-a')
    .get(\`/api/admin/articles/\${article.id}\`)

  expect(response.status).toBe(404)
  expect(response.body).not.toHaveProperty('content')
  expect(await auditEventsFor(article.id)).toContainEqual(
    expect.objectContaining({ type: 'article_access_denied' })
  )
})`
                },
                {
                    heading: '我想看到实际执行的命令和结果',
                    paragraphs: [
                        '我的基本顺序是格式化、类型检查、Lint、相关单测、再到构建和必要的 E2E。不是每次都机械跑全仓库最重的任务，但高风险改动不会只靠局部测试。',
                        'AI 有时会说“测试已通过”，实际只跑了一个文件，或者命令因环境问题根本没有执行。我会看完整命令、退出码和失败输出；无法运行的检查必须明确留下，而不是在总结里略过。',
                        '自动检查之后再读一次最终 diff，特别留意 package.json、配置、生成文件、权限声明和被删除的测试。最终提交应只包含能解释的变更。'
                    ],
                    flow: [
                        { title: '需求复述', detail: '确认解决正确问题' },
                        { title: '范围审查', detail: '删除非必要改动' },
                        { title: '安全数据流', detail: '输入、权限、日志与输出' },
                        { title: '类型和依赖', detail: '拒绝断言遮错与可疑包' },
                        { title: '行为测试', detail: '正常、异常与权限反例' },
                        { title: '最终 diff', detail: '命令证据和可回滚提交' }
                    ]
                },
                {
                    heading: '再找一个模型看，也得自己判断',
                    paragraphs: [
                        '有时我会把需求、最终 diff 和项目约束交给另一个模型，让它只找 correctness、安全和回归风险。不同模型能指出第一轮生成里被忽略的分支，但也会产生误报，甚至很自信地建议另一个错误改法。',
                        '所以 AI review 的结果仍然逐条验证：能否用代码、测试、类型或官方文档证明。无法验证且风险高的问题交给同事讨论，不用“两个模型都同意”替代人的判断。',
                        '我自己写的代码和同组同事的代码也按相同边界看，不给 AI 单独设一套神秘标准。区别只是 AI 生成量更快、更容易让人因为阅读疲劳而整体接受，所以更需要控制 diff 大小。'
                    ],
                    note: '这份清单是 2025 年中目前的个人做法，不代表团队制度。不同项目风险不同，涉及生产数据和基础设施时仍以正式评审与权限流程为准。'
                }
            ],
            closing:
                '当然不是每次都按上面的顺序审一遍，改两行文案没必要这么折腾。我现在最想保持的习惯是：看不明白的改动先缩小，不能因为生成得快就整段收下。真遇到自己也不懂的地方，就去查文档或者找同事讨论，多问另一个 AI 不能替代这一步。'
        })
    },
    {
        id: 29,
        title: 'Docker 用过几次后，记下这些不能靠猜的地方',
        description: '本地 Compose、数据卷、镜像和容器里的字体。很多配置借助了 AI 和同事，这篇只记我需要看懂的部分。',
        icon: 'Docker',
        createdAt: '2025-08-17 13:44:00',
        updatedAt: '2025-08-17 23:26:00',
        publishedAt: '2025-08-17 22:43:00',
        tags: ['DevOps', 'Node.js'],
        tech: ['Docker'],
        content: renderArticle({
            intro: 'Docker 在个人项目和工作项目里都用过，不过不少配置是借助 AI，或者跟后端、运维一起弄的。现在能看着配置把服务跑起来，也能查一些应用侧问题，但还不能说自己熟悉整套运维。下面把反复会用到、又不应该直接复制命令的地方记一下。',
            closingHeading: false,
            sections: [
                {
                    heading: '重新建容器以后，哪些东西还在',
                    paragraphs: [
                        'Dockerfile 描述怎样构建镜像，镜像是只读的运行模板，容器是某次运行实例。容器被删除后，写在可写层里的数据也不应该被当作可靠存储；需要持久化的数据库数据、上传文件或缓存，要明确交给 volume 或外部服务。',
                        '这个区别看起来基础，却解释了很多早期问题：为什么我进入容器临时 npm install，重建后修改消失；为什么把 SQLite 文件写在应用目录，重新部署后数据不见；为什么“在我电脑的容器里能跑”还不能证明镜像可复现。',
                        '现在我尽量让容器无状态：代码和运行依赖在镜像里，配置在运行时注入，业务数据在容器外，日志写标准输出。这样同一个镜像才能被替换和扩容。'
                    ],
                    table: {
                        headers: ['内容', '应该放在哪里', '不应该依赖'],
                        rows: [
                            ['应用代码与运行依赖', '版本化镜像', '进入容器后手工修改'],
                            ['环境配置', '部署环境的变量或配置机制', '写死在 Dockerfile'],
                            ['密钥', '专门的 secret 管理与短期注入', '镜像层、仓库或日志'],
                            ['数据库数据', '受管数据库或持久卷', '容器可写层'],
                            ['临时文件', '有界临时目录 / tmpfs', '无限累积到镜像宿主'],
                            ['应用日志', 'stdout / stderr 后统一采集', '只写容器内文件']
                        ]
                    }
                },
                {
                    heading: '照着一个 Node 镜像例子往下看',
                    paragraphs: [
                        '最早的 Dockerfile 是 FROM node、COPY .、npm install、npm start。它能跑，但构建上下文里可能带着 .env、.git 和本机 node_modules，开发依赖也全部留在最终镜像，缓存稍微改个源码就失效。',
                        '现在会用多阶段构建，把依赖安装、TypeScript 编译和运行拆开。先复制 lockfile 安装依赖，利用层缓存；构建阶段产生 dist；运行阶段只复制生产需要的文件，并切到非 root 用户。',
                        '下面是简化示意。真实命令要跟项目包管理器、workspace 和原生依赖调整，不能把这段 Dockerfile 当万能模板。'
                    ],
                    code: `# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable \
  && pnpm install --frozen-lockfile

FROM deps AS build
COPY tsconfig.json ./
COPY src ./src
RUN pnpm test \
  && pnpm build \
  && pnpm prune --prod

FROM node:22-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build --chown=node:node /app/package.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist

USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]`,
                    table: {
                        headers: ['调整', '解决的问题', '仍需注意'],
                        rows: [
                            ['固定 lockfile 安装', '依赖结果更可复现', '基础镜像和 registry 仍会变化'],
                            ['多阶段构建', '运行镜像不带完整源码和构建工具', '不能漏掉运行时动态文件'],
                            ['先复制依赖清单', '源码变化不必每次重装依赖', 'lockfile 变化会正确失效缓存'],
                            ['非 root USER', '缩小容器内进程权限', '挂载目录权限和宿主能力'],
                            ['JSON CMD', '信号更直接传给 Node 进程', '应用仍需监听并优雅退出'],
                            ['.dockerignore', '避免秘密和无关文件进构建上下文', '它不是 secret 管理方案']
                        ]
                    },
                    note: '示例中的基础镜像版本只对应写作时的演示。实际项目需要由更新流程维护版本或 digest，定期重建和扫描，不能固定一次后永远不动。'
                },
                {
                    heading: 'COPY 之前，先看 .dockerignore',
                    paragraphs: [
                        '构建时 Docker 会接收 build context。即使最终没有 COPY 某个文件，也不应该把不必要内容交给构建器。项目根目录中的 .env、密钥、数据库文件、报告产物、node_modules、.git 和测试截图都应明确排除。',
                        '我也不会靠 .dockerignore 掩盖已经提交到 Git 的秘密。它只能缩小本次构建上下文；密钥如果进过仓库或镜像层，需要按泄露处理并轮换。Dockerfile 中先 COPY 再 RUN rm 也没有真正删除前一层里的内容。',
                        '需要在构建期间访问私有 registry 的凭据，使用构建系统提供的 secret 能力，不写 ARG 后再 ENV。构建参数和历史层都可能被检查到。'
                    ],
                    code: `.git
.env
.env.*
!.env.example
node_modules
dist
coverage
*.log
tmp
reports
*.pdf
docker-compose.override.yml`,
                    table: {
                        headers: ['常见误区', '为什么不够'],
                        rows: [
                            ['COPY . 后删除 .env', '秘密可能仍存在于前一镜像层'],
                            ['只在 .gitignore 排除', 'Docker 构建上下文有自己的规则'],
                            ['通过 ARG 传长期密钥', '构建元数据和历史可能暴露'],
                            ['镜像是私有仓库所以没事', '访问控制不替代最小化与轮换'],
                            ['AI 生成的示例包含 token', '示例和日志同样会被复制传播']
                        ]
                    }
                },
                {
                    heading: '本地先用 Compose 拉起依赖',
                    paragraphs: [
                        '我最常用 Compose 的地方是本地：一次拉起 API、数据库和必要的缓存，让新人不用在系统里分别安装。应用代码可以 bind mount 方便热更新，数据库数据使用命名卷，两个场景的生命周期不同。',
                        'depends_on 只表示依赖关系时，数据库容器“正在运行”不等于已经接受连接。需要健康检查和 service_healthy，应用本身也仍要处理运行期间数据库重启，不能把启动顺序当永久可用保证。',
                        '本地 Compose 文件只放无敏感默认值和变量名，个人值进未提交的 env 文件。生产环境的网络、secret、资源、伸缩和发布策略由实际平台配置，不把本地 compose.yml 直接复制过去。'
                    ],
                    code: `services:
  api:
    build:
      context: .
      target: runtime
    environment:
      DATABASE_URL: \${DATABASE_URL}
    ports:
      - "127.0.0.1:3000:3000"
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:17
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d app"]
      interval: 5s
      timeout: 3s
      retries: 10
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:`,
                    note: '密码变量仍需由本地安全配置提供，示例不会给默认密码。端口绑定到 127.0.0.1，避免本地数据库或调试服务无意暴露到局域网。'
                },
                {
                    heading: '容器是 running，接口也可能不能用',
                    paragraphs: [
                        '只要 Node 进程还在，容器状态就可能是 running，但服务可能尚未加载配置、数据库不可用或已经无法处理新请求。现在会区分 liveness 和 readiness：前者判断进程是否需要重启，后者判断当前实例是否适合接收流量。',
                        '健康接口不能做很重的全链路查询，也不能返回版本、环境变量和连接信息。readiness 可以检查关键依赖的轻量状态，但要有很短超时；上游一个可选服务短暂失败，不一定要让整个进程重启。',
                        'Compose healthcheck 帮助本地启动顺序，生产平台的探针、重启和摘流规则仍由部署配置决定。阈值太敏感会把短暂抖动变成重启风暴。'
                    ],
                    table: {
                        headers: ['检查', '回答的问题', '失败动作'],
                        rows: [
                            ['进程 liveness', '事件循环和主进程是否存活', '持续失败后重启实例'],
                            ['服务 readiness', '是否能安全接收新请求', '先从流量中摘除'],
                            ['startup', '慢启动是否仍在正常进行', '超过合理上限才失败'],
                            ['业务监控', '核心功能是否真的成功', '告警与业务降级，不直接等同重启']
                        ]
                    }
                },
                {
                    heading: '正在生成报告时，容器要停了怎么办',
                    paragraphs: [
                        '部署新版本或缩容时，容器通常会收到终止信号。如果 Node 不处理，正在生成 PDF、写文件或更新任务状态的工作可能在宽限期结束后被强制中断。',
                        '服务收到 SIGTERM 后先把 readiness 设为失败，停止接收新任务，等待进行中的请求或任务到安全点，再关闭 HTTP server、数据库连接和浏览器。超过自己的短超时就记录未完成任务，让外层租约机制接管，不无限阻塞退出。',
                        '这也是为什么 CMD 更偏向 JSON 数组形式，并避免用一层不转发信号的 shell 包住 Node。最终是否正确仍要通过本地 docker stop 和部署环境演练。'
                    ],
                    code: `let shuttingDown = false

process.on('SIGTERM', async () => {
  if (shuttingDown) return
  shuttingDown = true
  readiness.set(false)

  try {
    await stopAcceptingJobs()
    await server.close()
    await closeBrowserPool()
    await database.end()
    process.exit(0)
  } catch (error) {
    logger.error({ code: 'shutdown_failed' })
    process.exit(1)
  }
})`,
                    note: '示例省略超时保护和具体库的关闭 API。信号处理器里不能只打印一句日志；也不能默认所有长任务都能在容器退出前完成。'
                },
                {
                    heading: 'down 后面有没有 -v，差别很大',
                    paragraphs: [
                        'Compose 用起来方便，也让删除看起来很容易。停止容器和删除卷的影响完全不同，执行任何带 volume、prune、down -v 的操作前，我会先列出具体项目、容器、挂载和卷，确认数据是否有备份。',
                        '开发环境的命名卷也可能存着难以重建的数据。备份不是“目录还在”，而是实际做过导出、恢复和校验。生产数据库的备份策略更不可能靠一个 compose volume 解决。',
                        '排查磁盘时优先用只读的 inspect、ps、logs、stats 和 system df 了解对象，不从一条网上命令或 AI 建议直接跳到 prune。目标不清楚就停下来问。'
                    ],
                    steps: [
                        '确认当前 Docker context 和目标项目，不在错误主机操作。',
                        '列出 compose services、containers、mounts 和具体 volume 名称。',
                        '判断数据是否可重建，确认最近备份与恢复方式。',
                        '先停止应用写入，再执行明确且最小范围的操作。',
                        '操作后验证服务、数据量和关键查询，不只看容器 running。',
                        '记录发生了什么以及如何恢复。'
                    ]
                },
                {
                    heading: 'Puppeteer 还要看架构、浏览器和字体',
                    paragraphs: [
                        '本地机器和部署环境的 CPU 架构可能不同。纯 JavaScript 服务通常不明显，一旦依赖原生模块、浏览器或系统字体，就可能在构建和运行时暴露差异。排查前先确认各自在用什么架构，不要直接把“我这里能启动”当作证明。',
                        'Puppeteer 服务还需要浏览器依赖、字体、沙箱和较大的共享内存，不能为了镜像小就随便换成自己不理解的极简基础镜像。比起复制一长串 apt 包，我更愿意基于受信、版本明确且经过测试的镜像，再在 CI 构建目标平台并实际启动。',
                        '字体也属于运行依赖。中文、英文、数字图表在本机正常，不代表容器里有相同字体。构建后用代表性页面生成 PDF，是这类镜像真正的冒烟测试。'
                    ],
                    table: {
                        headers: ['现象', '我会先查'],
                        rows: [
                            ['exec format error', '镜像与宿主 CPU 架构'],
                            ['原生模块加载失败', 'install 与 runtime 平台是否一致'],
                            ['Chromium 启动失败', '系统依赖、权限、沙箱和共享内存'],
                            ['PDF 中文变方块', '字体文件、font-family 和加载状态'],
                            ['本地快、容器超时', 'CPU / memory 限额与并发'],
                            ['镜像突然变化', '基础 tag 是否漂移、lockfile 是否一致']
                        ]
                    }
                },
                {
                    heading: '应用问题自己查，基础设施问题找人一起看',
                    paragraphs: [
                        '个人项目里，我可以完成 Dockerfile、Compose、本地数据库、基础健康检查、环境变量、日志查看和简单 CI 镜像构建。公司项目里也能配合排查容器内应用、浏览器和配置问题。',
                        '但生产网络策略、镜像仓库权限、节点与集群安全、secret 平台、负载均衡、弹性伸缩、数据库备份恢复、监控告警和应急响应，需要后端与运维同事共同负责。我能提出应用需求和验证结果，不会因为 AI 帮我写出 YAML 就把这些能力算成自己的。',
                        '遇到高风险操作时，我会先确认目标、影响、备份和回滚。工具可以告诉我命令语法，无法知道公司当前的基础设施约束和这个数据能不能删除。'
                    ],
                    table: {
                        headers: ['我目前可以主要负责', '需要专业协作 / 评审'],
                        rows: [
                            ['应用镜像与多阶段构建', '基础镜像治理和供应链策略'],
                            ['本地 Compose 与开发依赖', '生产编排、网络和服务发现'],
                            ['应用健康接口与优雅退出', '平台探针、伸缩和发布策略'],
                            ['应用日志结构与基础指标', '集中日志、告警和容量治理'],
                            ['容器内应用问题定位', '宿主机、集群和云资源故障'],
                            ['迁移脚本的应用侧验证', '生产数据备份、恢复和权限审批']
                        ]
                    },
                    note: '这篇记录的是实际使用边界，不是 Docker 教程。示例配置不包含生产基础设施，也不应未经评审直接用于线上。'
                }
            ],
            closing:
                '对我来说 Docker 先解决的是环境不好复现的问题。后面还得把常用配置一点点弄懂，尤其是数据放在哪、命令会删什么、停止时任务怎么收尾。AI 给出的配置可以作为起点，涉及数据卷或线上机器时，没看明白就先不执行。'
        })
    },
    {
        id: 30,
        title: '前端做着做着，也开始写一些 Node 和 Python',
        description: '从报告页面、自动化脚本到数据聚合，聊聊自己怎么一点点接触服务端，以及还没弄懂的部分。',
        icon: 'Nodejs',
        createdAt: '2025-10-19 14:12:00',
        updatedAt: '2025-10-19 23:31:00',
        publishedAt: '2025-10-19 22:48:00',
        tags: ['Node.js', 'Python', 'Vue.js'],
        tech: ['Node.js', 'Python', 'Vue'],
        content: renderArticle({
            intro: '最近回头看手头做过的东西，Node 和 Python 的代码比以前多了，但我还是更习惯说自己以前端为主。并没有哪一天决定从此转全栈，也没先把一张学习路线图走完。更多时候是一个需求已经做到页面外面了，只会改前端不太够，就接着往下做一点。',
            showToc: false,
            closingHeading: false,
            sections: [
                {
                    heading: '最容易接上的，还是跟页面有关的事',
                    paragraphs: [
                        '最典型的是报告。HTML、表格、图表和分页本来就是我在写，只不过最后不是给用户打开网页，而是要生成 PDF。用 Puppeteer 把这个页面打开，再打印出来，对前端来说不算很陌生。',
                        '继续往下做，事情就多了：浏览器要什么时候关，一份报告失败以后怎么再试，密码在哪一步加，几千份一起生成怎么安排。这里面有我负责的 Node 服务和模板，也有后端、运维一起做的队列衔接和弹性容器。不是把 page.pdf() 调通，就独立掌握了整套服务端。',
                        '这类需求有个好处，我能看见最后要交付的东西。PDF 里图没出来、页被截了、用户一直拿不到文件，问题都很具体。查一个问题补一点知识，比先记一堆暂时用不到的概念更容易坚持。'
                    ],
                    flow: [
                        {
                            title: '报告模板',
                            detail: '熟悉的 HTML、样式、图表和分页'
                        },
                        {
                            title: '自动打印',
                            detail: 'Puppeteer 打开页面，等渲染完成'
                        },
                        {
                            title: 'Node 服务',
                            detail: '任务状态、文件处理和资源回收'
                        },
                        {
                            title: '集中生成',
                            detail: '跟后端、运维一起处理队列和容器'
                        }
                    ]
                },
                {
                    heading: '同样是 JavaScript，跑在服务端以后得换一些想法',
                    paragraphs: [
                        '浏览器里的页面关掉了，大多数临时状态也就结束了。后台进程却可能要一直跑，今天留下的一点资源，后面会累积起来。页面请求失败可以让用户点重试，报告任务失败了则要先知道它有没有已经上传、有没有已经写入结果。',
                        '还有数据权限。前端不显示一个按钮，只能减少用户误点；服务端接到请求以后仍然得查这个人能不能操作这条数据。这件事以前跟后端联调时也知道，轮到自己写接口，就必须落实到查询条件和错误分支里。',
                        '所以我没有觉得“会 JS 就自然会 Node”。语法省了一部分学习时间，数据库、并发和运行环境这些东西还是得重新补。'
                    ]
                },
                {
                    heading: '采集和扩展用的也是原来那部分经验',
                    paragraphs: [
                        '自己和工作里都写过采集，DOM、选择器、网络请求这些前端经验确实用得上。但任务跑起来以后，还要关心断点、访问频率和数据有没有变空。抓到文本只是第一步，后面能不能放心用又是一回事。',
                        '有些特殊页面不适合一直交给服务端自动跑，我就做成浏览器扩展：人正常打开页面、完成必要操作，扩展负责重复的提取和整理。这里用到的依然是页面和交互经验，只是多学了扩展的权限、消息和后台运行方式。',
                        '我没有刻意规定所有自动化都必须用一种方式。已经有人工确认的步骤，就先把重复抄写去掉；适合稳定批量处理的，再交给脚本。'
                    ]
                },
                {
                    heading: 'Python 这块，先做的是很普通的数据处理',
                    paragraphs: [
                        '最近也在试着用 Python 整理不同来源的数据：先把格式对齐，再做简单去重、筛选和排序。拿样例数据跑通不难，但如果接到实际业务里，权限怎么继续向上游传、哪些字段能合并，都得重新确认。这部分还在边做边学。',
                        '这层最需要小心的是不要自作聪明。两个名字一样，不一定是一个人；一个字段没返回，可能是没权限，也可能是平台不支持。类型转好了，但意思转错了，页面不一定会立刻报错。',
                        'FastAPI 也拿来写了些小接口。写出一个能返回 JSON 的路由不难，我现在更需要补的是超时、连接复用和异常返回。这里有些东西能跟前端经验类比，有些不能，不能因为自动文档能打开，就觉得服务已经没问题。'
                    ],
                    table: {
                        headers: ['已有经验能帮上忙', '还得另外补'],
                        rows: [
                            ['接口类型、表单校验', '身份校验、数据权限和事务'],
                            ['页面加载和失败状态', '任务持久化、重试与重复执行'],
                            ['浏览器调试、图表和分页', '服务端 Chromium 的资源和进程管理'],
                            ['前端构建和环境变量', '容器、网络、数据备份和恢复']
                        ]
                    }
                },
                {
                    heading: 'AI 帮了不少忙，但有些地方不能只靠它',
                    paragraphs: [
                        '新领域里，我确实会让 AI 帮着搭骨架、解释配置和查报错。Docker 相关也常借助它，工作里的部署还会找后端和运维一起看。这些都不需要藏着，关键是最后哪些部分自己能解释，哪些只是照着跑通。',
                        '我通常会先做一个很小的样例：只生成一份报告，只接一个平台，只处理一种错误。正常路径通了以后，再故意给空值、断开一个依赖、让请求超时，看看会留下什么状态。范围小一点，出错以后比较知道从哪查。',
                        '涉及已有数据、线上权限和服务器操作，就先确认目标和恢复方式。自己还没理解的命令，不能因为 AI 说“直接执行即可”就试。'
                    ]
                },
                {
                    heading: '接下来还是补基础，前端也继续写',
                    paragraphs: [
                        '如果一定要给现在的技术栈排个顺序，Vue 和 Nuxt 用得最多，React 有早期项目经验，Next.js 主要是自己的项目。Node 和 Python 则是工作往外延伸后补上的。它们在我这里的熟练程度并不一样。',
                        '接下来想补的主要是数据库查询和事务、接口权限、长任务的失败处理。具体书和课程还没有列成完整计划，先从正在碰到的问题学起。但也不准备把前端丢掉，复杂表格、可视化、小程序这些仍然是日常工作的主要部分。'
                    ]
                }
            ],
            closing:
                '目前这样做下来，我更在意的是一个问题跨出页面以后，自己能不能再往下查一点。如果能把请求、数据和任务状态看明白，再找对的人一起处理，很多联调会顺不少。“全栈”叫什么先放一边，能把这一段做实就行。'
        })
    },
    {
        id: 31,
        title: '聊聊 React、Vue 和项目里的技术选择',
        description: '工作里 Vue 用得多，个人项目也写 React。比起给框架排座次，我更关心换一套以后要多做什么。',
        icon: 'JS',
        createdAt: '2025-12-14 13:36:00',
        updatedAt: '2025-12-14 23:19:00',
        publishedAt: '2025-12-14 22:36:00',
        tags: ['JavaScript', 'Vue.js', 'React'],
        tech: ['Vue', 'React', 'Nuxt', 'Next.js'],
        content: renderArticle({
            intro: '如果问我现在更喜欢 React 还是 Vue，我大概还是会回答都行。不是没想过区别，而是工作里很多时候没必要重新选：项目已经在跑，组件和同事的习惯也都在。最近 Vue 写得更多，React 也没有打算放下，自己的博客还在用 Next.js。趁着年底，聊一下目前的想法，不做框架排名。',
            showToc: false,
            closingHeading: false,
            sections: [
                {
                    heading: '换工作以后，主力技术栈也跟着换了',
                    paragraphs: [
                        '第一份工作主要是 React、Taro 和 TypeScript，做 H5、小程序和 App 内嵌页面。后来换了环境，Vue、Nuxt 的项目多起来，日常自然就写它们更多。并不是做了一次 React 不适合的结论，再把所有项目迁到 Vue。',
                        'Vue 这边现在比较熟的是后台、表格、图表，还有 Nuxt 静态内容站。React 有实际业务经验，不过近几年工作里用得少一些。Next.js 主要靠自己的项目摸索，不能拿它跟工作里维护 Nuxt 的深度直接画等号。',
                        '这会影响我判断一个需求要花多少时间。同样是普通后台，用已有 Vue 组件能很快拼起来，换一套不熟的库，就得把表格、弹窗、权限和请求习惯重新过一遍。这部分成本比语法上喜欢哪种写法更实际。'
                    ]
                },
                {
                    heading: '内容站和后台，先关心的事情就不一样',
                    paragraphs: [
                        '做公开内容站时，我先想页面怎么被访问：搜索引擎能不能直接拿到正文，内容多久更新一次，中英文地址怎么组织，有多少详情页。做登录后的 SaaS 后台，则先看筛选、表格、表单、权限和图表。',
                        'Nuxt 和 Next 都提供了多种渲染方式，但选了框架不等于自动选好了发布方式。我们做过的 Nuxt 站点主要是 SSG，生成 HTML 再发布。它在生成时也会执行服务端代码，所以同样会碰到 window 不存在一类问题；但这不等于已经做过逐请求 SSR 的容量、缓存和跨请求状态管理。',
                        '如果内容更新频率提高，或者不同用户必须看到不同的首屏，就要重新考虑原来的静态方案是否合适。这个时候讨论渲染方式，比直接问“要不要换 Next”更有针对性。'
                    ],
                    table: {
                        headers: ['场景', '我会先问'],
                        rows: [
                            ['公开内容站', '内容更新多久能等？正文和链接是否需要直接出现在 HTML？'],
                            ['复杂后台', '现有表格、表单、权限组件能复用多少？谁负责后续维护？'],
                            ['微信小程序', '只做微信还是确实要多端？哪些能力依赖平台 API？'],
                            ['个人项目', '想验证什么？自己是否能承担试错和后续升级？']
                        ]
                    }
                },
                {
                    heading: '9000 多个页面，也不是静态化以后就不用管了',
                    paragraphs: [
                        '静态站运行时比较省事，但构建不会自己变快。路由从哪来、公共接口重复请求多少次、中英文缺数据怎么处理，这些都会在几千页的规模下放大。',
                        'Nuxt 2 升 3 时，除了组件写法，还有旧 $axios 的加密兼容和动态路由准备。我们最后用单独脚本组织路由清单，再交给生成流程；构建也做了公共数据提取和动静代码拆分。由此省下的是发布前的等待，不是说 Nuxt 3 对所有站点都能带来同样的提升。',
                        '所以我现在看到“SSG 部署便宜”会再补几个问题：每天构建几次，失败重跑多久，某一条内容改了是否要等全量生成？答案不一样，选同一个框架也可能用出完全不同的方案。'
                    ]
                },
                {
                    heading: '小程序这边，框架只解决一部分重复工作',
                    paragraphs: [
                        'Taro、原生小程序和 uni-app 都做过一些。已有 React 项目继续用 Taro，有 Vue 经验的团队用 uni-app，或者只针对微信把原生能力用好，各自都能说得通。',
                        '我比较在意的是，不要把“以后也许会有另一个端”当成已经确定的需求。为了尚未出现的目标端先做很重的封装，当前页面反而可能难维护。真有两个端，再看哪些逻辑共用，哪些保留差异。',
                        '登录、分享、页面返回、键盘和包体积，不会因为框架 API 长得一样就完全一样。选型时至少拿一个有代表性的流程上真机试试，普通列表 Demo 太容易跑通，说明不了多少问题。'
                    ]
                },
                {
                    heading: '自己的博客可以留一点学习成本',
                    paragraphs: [
                        '这个博客用 Next.js，有一部分就是想继续写 React，看看它的全栈框架怎么组织。个人项目多查几次文档、改几轮结构，我能接受。工作项目则不能悄悄把这笔学习成本转给其他人。',
                        '这也不意味着业务项目永远不能用新东西。Webpack 换 Vite 的时候，开发反馈变慢就是很具体的问题；JS 加 TypeScript，也是为了让接口和组件约束更明确。只是换了工具以后还得确认效果，any 写得太多，类型收益照样会被吃掉。',
                        '如果要讨论一次迁移，我觉得留下面这样一小段记录就够起步了。别写一大篇生态优势，先说清当前哪里难受，改完以后准备怎么确认。'
                    ],
                    code: '当前问题：开发服务启动慢，改动后的等待影响日常开发\n准备验证：一个含旧依赖、动态资源和代理请求的代表页面\n必须保留：环境变量、资源路径、测试环境部署方式\n先不做：同时升级业务框架、重写所有公共组件\n回退方式：保留旧构建配置，迁移分支单独验证'
                },
                {
                    heading: '目前的偏好就到这里',
                    paragraphs: [
                        '有现成 Vue 项目和组件，我倾向于先把它继续维护好；进入 React 项目也可以适应，不会要求所有东西按自己的习惯重来。真的从零开始，再按页面类型、运行环境和团队经验比较。',
                        '我还没有负责过完整的团队技术规划，这些只是自己开发、迁移和维护项目时的判断。以后做的场景变了，想法可能也会变。现在没必要为了回答“到底喜欢谁”给自己立一个永远不能改的结论。'
                    ]
                }
            ],
            closing: '对我来说，两边都能继续写，是件挺好的事。遇到问题时能多一种参照，比每次看到框架讨论都要先站队轻松。'
        })
    },
    {
        id: 32,
        title: '五年前端开发总结（提纲）：从页面走到完整交付链路',
        description: '写在 2026 年 5 月的五年回顾框架：保留真实技术节点和待补问题，暂不替未来的自己编造选择、情绪与结论。',
        icon: 'coffee',
        createdAt: '2026-05-31 14:38:00',
        updatedAt: '2026-05-31 23:22:00',
        publishedAt: '2026-05-31 22:39:00',
        tags: ['JavaScript', 'Vue.js', 'React', 'Node.js', 'Python'],
        tech: ['Vue', 'React', 'Nuxt', 'Node.js', 'Python'],
        content: renderArticle({
            intro: '从 2021 年 7 月开始工作到现在，差不多五年。最近正好处在一段工作经历的尾声，想写一次回顾，又不想把真实过程修成一条特别顺的成长曲线。先把确定发生过的项目、技术变化和还没想明白的问题整理成提纲；个人选择、情绪和生活变化留给以后自己补，不用为了让文章完整现在就编一个答案。',
            sections: [
                {
                    heading: '先留一张不加滤镜的时间线',
                    paragraphs: [
                        '2016–2020 是大学阶段，真正的职业时间从 2021 年 7 月开始。下面只记录可以公开的技术类型，不写公司、客户和产品名称，也不把团队共同完成的基础设施算成个人独立成果。',
                        '五年里最明显的变化不是从 React 换到 Vue，而是交付边界逐渐变长：开始只负责页面，后来要关心构建、静态产物、浏览器任务、数据聚合、报告服务和容器里的运行状态。'
                    ],
                    table: {
                        headers: ['时间', '主要环境', '做过的事情', '当时出现的新问题'],
                        rows: [
                            ['2016–2020', '大学', '计算机学习与个人练习', '【待补】真正影响入行的项目或选择'],
                            ['2021.07–2022.06', 'React / Taro / TypeScript', 'H5、小程序、Hybrid、Sentry、组件库接触', '多端运行环境与交付习惯'],
                            ['2022.07–2023', 'Vue / Nuxt / Vite', '内容站、后台、可视化、Nuxt 迁移', '9000+ SSG、构建和数据兼容'],
                            ['2023–2024', 'Node / Puppeteer', 'PDF 报告、采集任务、浏览器扩展', '长任务、队列、资源和恢复'],
                            ['2024–2025', 'Python / AI / FastAPI', '数据清洗、多平台聚合、BFF', '模型证据、权限和接口边界'],
                            ['2025–2026.05', '跨层交付', '批量报告、AI 代码审查、容器协作', '如何定义自己的能力边界']
                        ]
                    }
                },
                {
                    heading: '2021：从“我写完了”变成“这个功能可以交付”',
                    paragraphs: [
                        '第一份工作用 React、Taro 和 TypeScript 做 H5、微信小程序、App 内嵌 H5。一套业务跑在不同宿主里，登录态、路由、生命周期、键盘、分享和 JSBridge 都会出现差异。Sentry 只是简单接入，却第一次让我从线上错误反过来看代码。',
                        '这段可以写成从学生项目到多人项目的变化：需求从哪里来，接口和客户端怎么联调，出错以后怎样复现，为什么公共组件不是复制一个目录。不要只列 React Hooks 或 Taro API。'
                    ],
                    items: [
                        '【待补】第一次真正对线上结果负责的需求是什么？',
                        '【待补】印象最深的一次 Hybrid / 小程序问题及排查过程。',
                        '【待补】第一次代码审查或被指出问题时，自己最不适应什么？',
                        '【待补】React + Rollup 组件库里实际参与到哪一部分？',
                        '【保留边界】微前端只参加分享和了解，没有实际落地。'
                    ]
                },
                {
                    heading: '2022–2023：技术栈变了，项目规模也变了',
                    paragraphs: [
                        '下一段工作以 Vue 和 Nuxt 为主。公开内容有 PC、移动、中英文站点，需要 SEO 和静态化；后台使用 Vue 3、Vite、Axios、vxe-table、ECharts 和 D3。技术栈变化来自项目与团队，不是对 React 的否定。',
                        '最适合展开的项目是 Nuxt 2 升 Nuxt 3。9000+ 页面不是一句 generate：动态路由要单独组织，$axios 插件迁到 fetch 后还要兼容原有请求加密，多语言、SEO、静态资源和回滚都要验证。',
                        '这一阶段也可以诚实写“大项目带来的不适应”：构建慢、CommonJS / ESM 不兼容、历史代码不敢动、TypeScript 里 any 越积越多。具体哪一次判断错了，等以后记清再补。'
                    ],
                    table: {
                        headers: ['可写主题', '确定事实', '待补现场'],
                        rows: [
                            ['Nuxt 2 → 3', '主导迁移并维持静态化链路', '第一次迁移失败在哪里'],
                            ['9000+ SSG 页面', 'PC / 移动 / 中英文', '构建时间和发布窗口的真实变化'],
                            ['$axios → fetch', '请求加密兼容是难点', '某个签名或序列化差异'],
                            ['Webpack → Vite', '开发反馈改善', 'CJS / ESM 的具体依赖'],
                            ['后台可视化', 'ECharts 与 D3 均有使用', '哪种图表真正需要 D3']
                        ]
                    }
                },
                {
                    heading: '2023–2024：页面之外的工作越来越多',
                    paragraphs: [
                        'PDF 报告把前端页面带进 Node 服务：HTML 模板、图表、表格和分页仍由我负责，Puppeteer 访问模板后生成 PDF。随着数量上来，又出现任务队列、状态、幂等、加密、上传和容器资源。',
                        '采集任务与浏览器扩展进一步改变了运行位置。服务端 Puppeteer 适合受控批量，特殊网站则让用户在已登录页面中通过扩展主动确认。不是“自动化越多越好”，而是把确定步骤和人工判断放到合适位置。',
                        '这部分以后最好选一条完整链路，不需要把每个工具都写一遍。重点是自己从什么时候开始意识到：成功返回一次，不等于服务能长期运行。'
                    ],
                    flow: [
                        { title: '页面能力', detail: '模板、图表、分页和交互' },
                        { title: '浏览器自动化', detail: 'Puppeteer 与 Chrome 扩展' },
                        { title: '长任务', detail: '状态、重试、断点与幂等' },
                        { title: '服务交付', detail: '队列、加密、存储和容器' },
                        { title: '团队协作', detail: '后端与运维补齐生产边界' }
                    ],
                    items: [
                        '【待补】第一次批量报告任务失败时，最先暴露的是什么？',
                        '【待补】哪一类特殊网站促成了浏览器扩展？',
                        '【待补】什么时候开始主动记录任务阶段，而不是只看日志？',
                        '【保留边界】弹性容器与生产部署由后端、运维共同完成。'
                    ]
                },
                {
                    heading: '2024–2025：AI 和 Python 进入项目，但没有自动给出正确答案',
                    paragraphs: [
                        '千问和 DeepSeek 被用于文本数据清洗，确实解决了一些很难穷举规则的问题；同时也出现事实补全、格式漂移和证据不足。后来流程强调结构化候选、schema、来源回查、评估集和人工复核，不允许模型结果直接覆盖正式数据。',
                        'Python 聚合层则处理多个平台的用户数据格式、基础去重、筛选排序和权限透传，再通过 FastAPI BFF 给前端使用。这里真正学到的是统一模型、来源、部分失败和权限上下文，不只是换一种语言写接口。',
                        '这部分需要留一个反面案例，避免文章变成“成功接入 AI”。最好写模型输出看起来多正确、为什么仍然不能入库，以及最后由哪一层拦住。'
                    ],
                    table: {
                        headers: ['新增工具', '最初期待', '后来增加的边界'],
                        rows: [
                            ['大模型', '处理难写规则的文本', '最小输入、schema、证据和人工复核'],
                            ['Python', '方便做数据处理', '统一模型、来源和异常语义'],
                            ['FastAPI', '快速暴露接口', '鉴权、响应裁剪、超时和快照'],
                            ['Docker', '统一运行环境', '数据、权限、信号、健康与协作'],
                            ['AI 编程工具', '更快写代码', '上下文、风险分级和人类审查']
                        ]
                    }
                },
                {
                    heading: '五年后，我现在会怎样描述自己的能力',
                    paragraphs: [
                        '主线仍然是前端。Vue / Nuxt 使用更多，React 有真实项目经验，Next.js 主要来自个人项目；Node 和 Python 是业务推动出来的第二能力。能跨页面、任务、数据和接口完成一段链路，但数据库、网络、容器基础设施等方向没有与前端相同深度。',
                        '简历或面试里可以按“主导、实际使用、参与、了解”分层，不需要把所有关键词写成熟练。能解释一个项目里的输入、状态、失败、权限、产物和协作边界，比列出更多技术名更可信。',
                        '这部分以后可以结合新的求职或工作选择再补。目前只保留技术事实，不替当时的自己预设下一份职位。'
                    ],
                    table: {
                        headers: ['层级', '目前可以放入的内容', '表述方式'],
                        rows: [
                            ['使用较多', 'Vue、Nuxt、JavaScript / TypeScript', '能独立交付并解释复杂故障'],
                            ['真实项目使用', 'React、Taro、原生小程序、uni-app', '说明项目时间与职责'],
                            ['业务扩展能力', 'Node、Puppeteer、Python、FastAPI', '说明前端侧重与协作边界'],
                            ['使用过但依赖协作', 'Docker、CI/CD、弹性容器', '不写成独立生产运维'],
                            ['了解', 'qiankun、Monorepo 等', '不与落地经验混写'],
                            ['没有实际经验', 'RSC、Server Actions、Vite 插件等', '需要时再学，不补经历']
                        ]
                    },
                    quote: '五年经验不是把五十个关键词写成“熟悉”，而是知道哪些问题已经处理过，哪些风险仍然需要别人一起守。'
                },
                {
                    heading: '以后补完整时，想写的是选择和代价',
                    paragraphs: [
                        '项目列表已经可以从前面的文章找到，这篇最终不应该再做一次技术汇总。更值得补的是当时为什么换环境、怎样面对不熟悉的职责、哪些选择带来长期收益，以及工作之外发生了什么变化。',
                        '这些内容目前信息不足，先把问题留给自己。真实回答哪怕不够励志，也比现在拼一个漂亮结论更有价值。'
                    ],
                    items: [
                        '【待补】2021 年真正想从第一份工作得到什么，后来得到了吗？',
                        '【待补】2022 年环境变化时，最担心和最期待的分别是什么？',
                        '【待补】哪一个项目最改变自己对“前端”的理解？',
                        '【待补】五年里最想重做的一次技术判断是什么？',
                        '【待补】工作方式、生活和对职业稳定性的看法发生了什么变化？',
                        '【待补】下一阶段想继续做深的能力，以及愿意放弃追逐的方向。'
                    ]
                },
                {
                    heading: '目前愿意保留的几个习惯',
                    paragraphs: [
                        '这些不是五年后总结出来的成功方法，更像反复踩坑后暂时留下的做事方式。以后也可能被新的经历修正。',
                        '如果最终写成长文，可以每条配一个具体现场；没有现场支撑的句子就删掉，不把它写成口号。'
                    ],
                    items: [
                        '先把问题稳定复现，再选择工具和修复方式。',
                        '外部输入、权限、日志和输出都要有明确边界。',
                        '长任务开始前就考虑失败后从哪里继续。',
                        '无法追踪来源的数据，不急着变成一个干净结论。',
                        'AI 可以给候选，最后合并和入库的人仍要负责。',
                        '不熟悉的生产操作先确认影响、备份、回滚和负责人。',
                        '对“主导、参与、使用过、了解”保持诚实。'
                    ],
                    note: '这篇按约定只保留提纲。公司名称、个人隐私和无法公开的业务细节不会补入；以后只增加能够确认、且确实愿意公开的内容。'
                }
            ],
            closing:
                '五年并没有让我变成什么都会的人，只是让我从“把页面写出来”慢慢走到了“这条链路怎样才能安全交付”。这份提纲先停在 2026 年 5 月：事实已经摆好，结论还可以等。以后再回来补时，希望保留当年的判断，也允许它不够完整。'
        })
    },
    {
        id: 33,
        title: '旧博客升级 Next.js 16，顺手整理了一轮本地问题',
        description: '异步 params、Proxy、构建配置，还有缺图和正文 HTML。先在本地跑顺，部署以后再说。',
        icon: 'Nextjs',
        createdAt: '2026-07-29 10:18:00',
        updatedAt: '2026-07-29 20:56:00',
        publishedAt: '2026-07-29 20:52:00',
        tags: ['Next.js', 'React', 'DevOps'],
        tech: ['Next.js', 'React', 'Docker'],
        content: renderArticle({
            intro: '这个博客放了一阵子，最近重新拉起来准备继续改。原来还停在 Next.js 14，文章、图片和后台都有没补完的地方。先把依赖升到 16 的稳定版本，再把本地能看到的问题过一遍。这篇记几处实际改到的地方，服务器和正式部署暂时还没接。',
            closingHeading: '先继续在本地把它用起来',
            sections: [
                {
                    heading: '先让旧项目能启动，再动依赖',
                    paragraphs: [
                        '旧项目最容易让人产生错觉的是目录很全：有页面、有接口、有数据库配置，看上去差不多了。但浏览器打开以后，图片请求 404、文章正文还是占位，后台入口也不等于已经能正常管理内容。',
                        '所以我先确认启动顺序、数据库连接和环境变量。真实值留在本地，仓库里的示例只写变量名和不可直接使用的占位内容。MySQL 也只需要在本机访问，开发配置没有理由把端口默认暴露给整个局域网。',
                        '接着再处理框架升级。Next.js、React 和对应类型要放在一起看，不能只把 next 的版本数字改大。认证和数据库工具先不跨大版本，减少同时变化的东西，出问题时也好缩小范围。'
                    ],
                    table: {
                        headers: ['这次先处理', '暂时分开做'],
                        rows: [
                            ['Next.js 16、React 和相关类型兼容', '认证库与 ORM 的大版本迁移'],
                            ['本地环境、检查命令和构建', '服务器、域名和正式发布流程'],
                            ['主要页面和公开文章访问', '新功能和大范围视觉重做']
                        ]
                    }
                },
                {
                    heading: 'params 先 await，lint 单独跑',
                    paragraphs: [
                        '动态接口的 params 现在按 Promise 处理。原来直接读 params.id 的地方要改，类型也一起改，不是补一个断言让编辑器安静下来。下面是详情接口的简化写法，省略了项目里的统一响应封装。',
                        '另外，next lint 已经移除，检查脚本直接调用 ESLint。构建通过不代表 lint 也跑过，所以我把类型检查、lint 和 build 明确列成几条命令。相关变化对照的是 <a href="https://nextjs.org/docs/app/guides/upgrading/version-16" target="_blank" rel="noopener noreferrer">Next.js 16 升级指南</a>。'
                    ],
                    code: "export async function GET(\n  _request: Request,\n  { params }: { params: Promise<{ id: string }> }\n) {\n  const { id: rawId } = await params\n  const id = Number(rawId)\n  if (!Number.isSafeInteger(id) || id <= 0) {\n    return Response.json({ message: '文章不存在' }, { status: 404 })\n  }\n\n  const article = await prisma.article.findFirst({\n    where: { id, status: 'PUBLISHED', deletedAt: null },\n    select: { id: true, title: true, content: true }\n  })\n  if (!article) {\n    return Response.json({ message: '文章不存在' }, { status: 404 })\n  }\n  return Response.json({\n    ...article,\n    content: sanitizeArticleHtml(article.content)\n  })\n}",
                    note: '公开详情的筛选条件由接口固定，不让调用者传一个 status 就能读到草稿。后台编辑另走受保护的接口。'
                },
                {
                    heading: 'Proxy 改名以后，接口里的鉴权仍然要留',
                    paragraphs: [
                        'middleware 迁到 proxy，是这次比较明显的文件变化。我顺便看了一遍它拦了哪些路径：静态图片没必要都经过，后台和写接口才需要重点检查。',
                        '但这层有 token，不代表具体操作就一定允许。文章更新、删除这些接口里，还得确认当前会话和角色，再验证参数。隐藏后台地址可以减少随手探测，不能代替这些判断。',
                        '公开列表尤其要单独看。博客只有我一个人用后台，也仍然有公开文章和草稿的区别。用户正常点页面不一定能发现问题，直接请求接口、换几个参数更容易验证这条限制有没有真正生效。'
                    ]
                },
                {
                    heading: '开发能跑，生产构建还是得另试',
                    paragraphs: [
                        'Next.js 16 默认使用 Turbopack。开发环境能正常启动，但这个旧项目的 Sass 配置和生产构建组合还需要继续排查，目前先保留 next build --webpack。没有把样式都重写一遍，也不把这个现象概括成 Turbopack 都不能用。',
                        '遇到构建长时间没有结束，要先保留日志、看具体阶段，再缩小配置做验证。仅仅切换构建器后成功，还不足以证明原来的问题一定是哪一项 Sass 配置造成的。',
                        '浏览器里还见过 module factory 不可用的开发错误。依赖升级时旧标签页可能仍拿着上一轮 chunk，我会先确认开发服务和端口，再重新启动、硬刷新验证。要是干净启动后仍然复现，就继续查，而不是把所有缓存永久关掉。'
                    ],
                    code: '{\n  "scripts": {\n    "dev": "next dev",\n    "lint": "eslint .",\n    "build": "next build --webpack"\n  }\n}',
                    note: '这是这个项目暂时采用的组合。以后构建配置调整后再复测，没必要为了跟上默认选项就带着未查清的问题切换。'
                },
                {
                    heading: '正文要保留格式，也不能直接信任整段 HTML',
                    paragraphs: [
                        '文章不是纯文本，代码块、表格、引用和图片都得能显示。于是不能简单把 HTML 标签全删掉，但也不能直接把数据库里的字符串塞到页面里就结束。',
                        '我保留允许使用的标签和属性，去掉脚本、事件属性和不合适的链接协议。读取旧文章时也会净化，因为不能默认历史数据都经过同一版编辑器处理。',
                        '这里有个实际的取舍：文章目录需要锚点，代码需要 pre 和 code，横向表格需要容器类名。新增一种展示元素，就确认它能通过允许列表，而不是图省事把 style、iframe 和任意属性全放开。',
                        '输入的长度和结构也分开检查。标题长度、正文大小、标签 ID、URL 格式属于接口校验；有没有编辑权限、标签是否存在，则由后面的业务逻辑和数据库处理。放一个 schema 在入口并不意味着后面可以随便写。'
                    ],
                    table: {
                        headers: ['要保留的效果', '要限制的内容'],
                        rows: [
                            ['代码、列表、引用和表格', '脚本与 onerror 等事件属性'],
                            ['目录锚点和受控类名', '任意样式和未知嵌入内容'],
                            ['正常外链和站内图片', 'javascript: 等危险协议'],
                            ['旧文章继续能读', '数据库内容不绕过输出净化']
                        ]
                    }
                },
                {
                    heading: '图片 404 是文件问题，别和升级报错混在一起',
                    paragraphs: [
                        '统计区那几个 overview、article、comment、views、likes 图片缺失，跟 React 的开发报错不是一回事。浏览器同时报出来，很容易以为都是升级造成的，实际要沿资源路径检查文件在不在、大小写对不对。',
                        '技术栈图标也优先找官方或许可证清楚的公开资源，统一尺寸放在本地。品牌图形没有必要重新画一版“差不多”的，后面换资源时还要知道它从哪里来。',
                        '文件补齐以后，不能只看首页这一屏。列表、文章详情、深色背景上都点一下，404 没了不代表留白和尺寸就合适。图标之外，长代码、宽表格和没有封面的文章也一起看，测试数据太整齐会把布局问题藏起来。'
                    ]
                },
                {
                    heading: '我准备怎样确认这轮整理没改坏',
                    paragraphs: [
                        '类型、lint、构建先各跑一遍，然后用浏览器点主要路径。不是每个问题都能从命令输出里看到：返回后筛选丢了、长标题把卡片撑歪、窄屏横向溢出，这些还是得实际看。',
                        '文章和数据库操作前先备份。日常修改一篇就更新一篇，不为了方便把初始化脚本再跑一遍。正文在源文件里整理、在后台里编辑以后，谁覆盖谁也要明确，不能让一个脚本把手动改过的内容无声抹掉。',
                        '正式部署这轮先不做。本地 HTTP、服务器反向代理后的 HTTPS、实际域名下的 Cookie 行为并不完全相同，等服务器接好还要重新验证。现在的重点是把博客本身用顺，不急着给它写“已上线”的结论。'
                    ],
                    steps: [
                        '打开列表和几篇不同长度的正文，检查图片、代码、目录和表格。',
                        '直接访问详情、刷新深层地址，再走一次返回和筛选。',
                        '退出登录后请求写接口，确认没有绕过后台页面直接修改的入口。',
                        '用草稿和不存在的 ID 验证公开接口。',
                        '保存一篇测试内容，再确认读取结果和旧版本恢复方式。',
                        '窄屏再走一遍，最后保留本次检查结果和待办。'
                    ]
                }
            ],
            closing: '这次先把版本、内容和本地流程接上。等我能稳定地写文章、编辑、查看，再去补部署和服务器那一段。博客没必要一次做得很大，但放在页面上的功能，还是希望点进去真的能用。'
        })
    }
];

export const articles = articleDrafts.map((article) => {
    const date = article.publishedAt.slice(0, 10);
    const visual = `<figure class="article-visual"><img src="/icon/${article.icon}.webp" alt="" width="120" height="120" loading="eager"><figcaption>${date} · ${article.tags.join(' / ')}</figcaption></figure>`;
    const summary = `<blockquote class="article-summary">${article.description}</blockquote>`;

    return {
        ...article,
        createdAt: article.createdAt || article.publishedAt,
        updatedAt: article.updatedAt || article.publishedAt,
        content: `${visual}\n${summary}\n${article.content}`
    };
});
