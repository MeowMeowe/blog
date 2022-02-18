import React from "react";
import { Route, Routes } from "react-router-dom";
import Nav from "./compontents/nav";
import BG from "./compontents/bg";
import "./App.scss";
import "./static/css/animate.scss";
import { Home, NotFound } from "./router";
function App() {
  return (
    <div>
      <BG />
      <div className="index">
        <Nav />
        <Routes>
          <Route key="home" path={"/home"} element={<Home />} />
          {/* 设置默认路由 */}
          <Route key="default" path={"/"} element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
