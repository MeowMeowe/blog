import { lazy } from 'react';

const Home = lazy(() => import('@/pages/home'));
const NotFound = lazy(() => import('@/pages/not-found'));
const Study = lazy(() => import('@/pages/study'));
const Miao = lazy(() => import('@/pages/miao'));
const SmkAdmin = lazy(() => import('@/pages/smk-admin'));
const Articles = lazy(() => import('@/pages/articles'));
const Projects = lazy(() => import('@/pages/projects'));
const About = lazy(() => import('@/pages/about'));
// const Timo = lazy(() => import('@/pages/projects/timo-run'));
// const Ylgy = lazy(() => import('@/pages/games/ylgy'));

interface IRouter {
    key: string;
    path: string;
    element: React.LazyExoticComponent<() => JSX.Element>;
    title: string;
    navShow: boolean;
}

const RouterSchemle: IRouter[] = [
    {
        key: 'default',
        path: '/',
        element: Home,
        title: '首页',
        navShow: true
    },
    {
        key: 'home',
        path: '/home',
        element: Home,
        title: '首页',
        navShow: false
    },
    {
        key: 'miao',
        path: '/miao',
        element: Miao,
        title: 'Miao',
        navShow: true
    },
    {
        key: 'study',
        path: '/study',
        element: Study,
        title: '学习',
        navShow: true
    },
    {
        key: 'projects',
        path: '/projects',
        element: Projects,
        title: '项目',
        navShow: true
    },
    {
        key: 'about',
        path: '/about',
        element: About,
        title: '关于',
        navShow: true
    },
    {
        key: 'articles',
        path: '/articles',
        element: Articles,
        title: '文章',
        navShow: false
    },
    {
        key: 'smk-admin',
        path: '/smk-admin',
        element: SmkAdmin,
        title: '管理员',
        navShow: false
    }
    // {
    //     key: 'timo-run',
    //     path: '/projects/timo-run',
    //     element: Timo
    // },
    // {
    //     key: 'ylgy',
    //     path: '/projects/ylgy',
    //     element: Ylgy
    // }
];

RouterSchemle.push({
    key: 'not-found',
    path: '*',
    element: NotFound,
    title: '404',
    navShow: false
});
export default RouterSchemle;
