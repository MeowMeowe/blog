import React from 'react'
import {  Route, Routes } from 'react-router-dom'
import "./App.scss"
import { 
  Home,
  NotFound
} from './router'
function App () {
  return (
      <Routes>
        <Route  key="home"  path={"/home"}  element={<Home/>}/>
        {/* 设置默认路由 */}
        <Route  key="default"  path={"/"} element={<NotFound/>} />
      </Routes>
  )
}

export default App
