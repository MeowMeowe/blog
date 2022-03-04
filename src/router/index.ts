// 路由懒加载
import { lazy } from 'react'

const Home = lazy(() => import('../pages/home'))
const NotFound = lazy(() => import('../pages/not-found'))
const ToolsBox = lazy(() => import('../pages/tools-box'))

export {
  Home,
  NotFound,
  ToolsBox
}