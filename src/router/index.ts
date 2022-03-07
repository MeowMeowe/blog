// 路由懒加载
import { lazy } from 'react'

const Home = lazy(() => import('../pages/home'))
const NotFound = lazy(() => import('../pages/not-found'))
const ToolsBox = lazy(() => import('../pages/tools-box'))
const OneWord = lazy(() => import('../pages/one-word'))

export {
  Home,
  NotFound,
  ToolsBox,
  OneWord
}