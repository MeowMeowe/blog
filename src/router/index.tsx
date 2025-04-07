import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import PublicLayout from '@/layout/public';
import AdminLayout from '@/layout/admin';

export const RouterSchemle = [
    {
        path: '/',
        element: <PublicLayout />,
        children: [
            {
                key: 'home',
                path: '/home',
                Component: lazy(() => import('@/pages/home')),
                title: '首页'
            },
            {
                key: 'miao',
                path: '/miao',
                Component: lazy(() => import('@/pages/miao')),
                title: 'Miao'
            },
            {
                key: 'study',
                path: '/study',
                Component: lazy(() => import('@/pages/study')),
                title: '学习'
            },
            {
                key: 'projects',
                path: '/projects',
                Component: lazy(() => import('@/pages/projects')),
                title: '项目'
            },
            {
                key: 'about',
                path: '/about',
                Component: lazy(() => import('@/pages/about')),
                title: '关于'
            },
            {
                key: 'articles',
                path: '/articles',
                Component: lazy(() => import('@/pages/articles')),
                title: '文章'
            }
        ]
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            {
                key: 'admin',
                path: 'home',
                Component: lazy(() => import('@/pages-admin/home')),
                title: '仪表盘'
            }
        ]
    }
];

export const router = createBrowserRouter(RouterSchemle);
