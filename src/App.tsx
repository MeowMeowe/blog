import { Route, Routes } from "react-router-dom";
import { Home, NotFound } from "./router";
import Nav from "./compontents/nav";
import Bg from "./compontents/bg";
import React from "react";
import "./App.scss";

function App() {

  return (
    <div>
      <Bg />
      <div className="index">
        <Nav />
        <Routes>
          <Route key="home" path="/home" element={<Home />} />
          {/* 设置默认路由 */}
          <Route key="default" path="/" element={<Home />} />
          <Route key="default" path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
