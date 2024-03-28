## 开发详细记录
### 1. 项目搭建(2022/02/11) 
* 使用create-react-app创建项目：
```
npm install -g create-react-app
npx create-react-app blog --template typescript
cd ./blog
npm install
npm start
```
&emsp;&emsp;package.json:
```json
{
  "name": "blog",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.3.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/jest": "^27.5.2",
    "@types/node": "^16.11.56",
    "@types/react": "^18.0.17",
    "@types/react-dom": "^18.0.6",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "typescript": "^4.8.2",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```
+ 新增文件夹:
```
src
--|api            接口
--|api-type       接口类型约定
--|assets         静态资源
--|compontents    组件
--|layout         布局
--|pages          页面组件
--|router         路由
--|utils          工具
App.scss
App.tsx
index.tsx
```
+ 下载依赖使其支持scss:(create-react-app其实已经在webpack中配置了sass-loader)
```
npm run eject  //使用create-react-app时在文件夹内找不到webpack配置，需要用这行命令将其调出，这个操作可要可不要，主要是方便以后做配置修改，执行完后，根目录会有个config文件夹，webpack的配置项就在这里
npm install sass-loader node-sass --save-dev
```
### 2. 接入GithubAction做自动化部署(2022/02/18)
* GitHub Actions是GitHub推出的一款持续集成（CI/CD）服务，它给我们提供了虚拟的服务器资源，让我们可以基于它完成自动化测试、集成、部署等操作。
* 这里省去创建仓库和推送本地仓库到远程这些操作，直接开始介绍这个githubaction要怎么使用：

&emsp;&emsp;首先在项目的根目录创建.github文件夹，在.github文件夹下创建workflow文件夹，在workflow文件夹下写我们的配置文件，配置文件为YAML格式，文件后缀名为.yml,workflow文件夹下可以有多个.yml文件，github会自动运行所有.yml文件。workflow文件的配置可以查看官方文档，下边是我的配置：
```yml
name: Blog CI/CD  # 脚本名称

on:
  push:
    branches:
      - main  # 只在master上push触发部署
    paths-ignore:   # 下列文件的变更不触发部署，可以自行添加
      - README.md
      - LICENSE

jobs: # 要执行的任务
  build-production:  # 任务名称
    runs-on: ubuntu-latest   # 使用ubuntu系统镜像运行自动化脚本(温馨提示：和你所使用的操作系统及服务器系统无关，我本地用的windows10,云服务器用的centos)
    strategy:
      matrix:
        node-version: [16.x] # 配置所需node版本

    steps:  # 自动化步骤
    - uses: actions/checkout@v2   # 第一步，检出仓库副本

    - name: Use Node.js ${{ matrix.node-version }} #规定node.js版本(可不配置)
      uses: actions/setup-node@v1
      with:
        node-version: ${{ matrix.node-version }}

    - name: Install dependencies  # 第二步，安装依赖
      run: npm install

    - name: Build                 # 第三步，打包代码
      run: npm run build --if-present

    - name: Deploy to Server      # 第四步，rsync推送文件
      uses: AEnterprise/rsync-deploy@v1.0  # 使用别人包装好的步骤镜像
      env:
        DEPLOY_KEY: ${{ secrets.TENTCENT_BLOG }}   # 引用配置，SSH私钥
        ARGS: -avz --delete --exclude='*.pyc'   # rsync参数，排除.pyc文件
        SERVER_PORT: '22'  # SSH端口
        FOLDER: ./dist/*  # 要推送的文件夹，路径相对于代码仓库的根目录
        SERVER_IP: ${{ secrets.SSH_HOST }}  # 引用配置，服务器的host名（IP或者域名domain.com）
        USERNAME: ${{ secrets.SSH_NAME }}  # 引用配置，服务器登录名
        PASSWORD: ${{ secrets.SSH_PASSWORD }}  # 引用配置，服务器登录密码
        SERVER_DESTINATION: /usr/local/meow/   # 部署到目标文件夹
        ## 这里的secrets是github中储存的私密变量，有一定的泄露风险，如果服务器上资料比较贵重推荐用其他方式
```
&emsp;&emsp;配置完成后，进行main分支上的push后，会自动触发该action,进行打包并将打包后的文件夹发送到服务器上的指定位置，打包编译和发布过程可以在该仓库的action选项中看到，过程中出现错误也会有相应的消息。
### 3. 公共背景组件(2022/02/18)
&emsp;&emsp;compontents文件夹下bg组件，主要做了全局随机背景。
### 4. eslint + prettier(2022/02/19)
&emsp;&emsp;这里主要介绍这两个工具的配置项，分别是：
```cjs
//./.prettierrc.cjs
// prettier.config.js or .prettierrc.js
module.exports = {
    printWidth: 100,// 一行最多 100 字符
    tabWidth: 4, // 使用 4 个空格缩进
    useTabs: false, // 不使用缩进符，而使用空格
    semi: true,// 行尾需要有分号
    singleQuote: true, // 使用单引号
    quoteProps: 'as-needed',// 对象的 key 仅在必要时用引号
    jsxSingleQuote: false,// jsx 不使用单引号，而使用双引号
    trailingComma: 'none',// 末尾不需要逗号
    bracketSpacing: true,// 大括号内的首尾需要空格
    jsxBracketSameLine: false,// jsx 标签的反尖括号需要换行
    arrowParens: 'always', // 箭头函数，只有一个参数的时候，也需要括号
    rangeStart: 0,// 每个文件格式化的范围是文件的全部内容
    rangeEnd: Infinity,
    requirePragma: false,// 不需要写文件开头的 @prettier
    insertPragma: false,// 不需要自动在文件开头插入 @prettier
    proseWrap: 'preserve', // 使用默认的折行标准
    htmlWhitespaceSensitivity: 'css',// 根据显示样式决定 html 要不要折行
    endOfLine: 'auto'// 换行符
};
```
```cjs
//./.eslintrc.cjs
module.exports = {
    env: { //环境支持
        browser: true,
        es2021: true,
        es6: true,
        jest: true
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'plugin:react/jsx-runtime'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: ['react', '@typescript-eslint', 'prettier'],
    rules: {
        'prettier/prettier': 'error',
        'arrow-body-style': 'off',
        'prefer-arrow-callback': 'off',
        'no-async-promise-executor': 'off',
        'no-misleading-character-class': 'off',
        'no-useless-catch': 'off',
        'react/jsx-uses-react': 'error',
        'react/jsx-uses-vars': 'error',
        '@typescript-eslint/no-explicit-any': ['off'],
        '@typescript-eslint/no-non-null-assertion': 'off'
    },
    settings: {
        react: {
            version: 'detect'
        }
    }
};
```
### 5. 工具函数库(2022/02/24)
&emsp;&emsp;utils文件夹下utils文件，主要是日常开发会用到的一些工具函数，如：防抖、节流、随机数、随机颜色、深拷贝等... 会在开发过程中继续补充。
### 6. 公共加载组件(2022/02/28)
&emsp;&emsp;compontents文件夹下loading组件，主要做了全局随机加载效果，我用css做出了29种不同的加载效果，导致这个scss文件比较臃肿，但最终效果不错，瑕不掩瑜。做这个组件的原因主要是由于我们使用了懒加载路由，所以要在src目录下的index.tsx中使用SSuspense标签包裹路由组件，在加载路由的时候这个loading就会先展现出来，提升交互的流畅度：
```tsx
//src/index.tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { disableReactDevTools } from '@/utils/utils';
import Loading from '@/compontents/loading';
import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

if (process.env.NODE_ENV == 'production') {
    disableReactDevTools();
}

const RootContainer = () => {
    return (
        <BrowserRouter>
            {/* 使用了路由懒加载，所以需要使用<Suspense>包起来 */}
            <Suspense fallback={<Loading />}>
                <Routes>
                    <Route path="*" element={<App />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};
const root = document.getElementById('root');
if (root) {
    createRoot(root).render(<RootContainer />);
}
```
```tsx
//src/router/index.ts
// 路由懒加载
import { lazy } from 'react';

const Home = lazy(() => import('@/pages/home'));
const NotFound = lazy(() => import('@/pages/not-found'));
const ToolsBox = lazy(() => import('@/pages/tools-box'));
const OneWord = lazy(() => import('@/pages/one-word'));
const SmkAdmin = lazy(() => import('@/pages/smk-admin'));
const Articles = lazy(() => import('@/pages/articles'));

export { Home, NotFound, ToolsBox, OneWord, SmkAdmin, Articles };

```
### 7. 自动回顶组件(2022/03/03)
&emsp;&emsp;compontents文件夹下scroll-bar组件,主要做了下滑超过一个视口高度显示该组件，点击后回到页面顶部，自己设计了一下效果，仍有瑕疵，还在不断优化。
### 8. 图片转webp(2022/03/04)
&emsp;&emsp;背景图和icon本来想用cdn来做，但要分出来两个库，还是有些麻烦，就先用转成webp的方式来优化一下，平均能压缩80%，不会损失太多显示效果。用的是一个叫做WebpConverter的免费桌面软件可以实现jpeg/png和webp的互转。
### 9.  接口测试、生产环境优化(2022/03/07)
&emsp;&emsp;接口是使用的以前学习node + express时候写的demo，改了改就先用着，只提供出来一个接口，后端这方面还要学习研究，重新捡起来。
### 10. 管理员入口及鉴权规划(2022/03/08)
&emsp;&emsp;准备把文章的增删改查做到这里，之后再考虑添加其他功能。入口肯定是隐藏起来且会加上鉴权。
### 11. 公共导航栏组件(2022/06/14)
### 12. 首页组件、全局样式、滚动组件(2022/07/06)
### 13. 滚动组件Bug修复(2022/07/11)
### 14. 更换Webpack为Vite(2022/08/18)
### 15. 导航组件菜单自适应(2022/08/22)
### 16. 布局优化、文章列表组件、底部组件(2022/08/23)
### 17. Redux + Redux-tookit(2022/08/24)
### 19. 路由和菜单优化，新增学习页和项目页(2022/10/10) 
### 20. 新增主题选择(2022/10/10) 
&emsp;&emsp;暂定白和黑切换，后续再考虑其他配色