import React, { Suspense } from "react";
import {render} from "react-dom";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
render(
  <BrowserRouter>
    {/* 使用了路由懒加载，所以需要使用<Suspense>包起来 */}
    <Suspense fallback={<div>hahah</div>}>
      <Routes>
        <Route path="*" element={<App />}/>
      </Routes>
    </Suspense>
  </BrowserRouter>,
  document.getElementById("root")
);
