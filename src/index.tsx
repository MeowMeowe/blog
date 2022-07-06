import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { disableReactDevTools } from './static/js/utils';
import React, { Suspense } from 'react';
import { render } from 'react-dom';
import App from './App';
import Bg from './compontents/common/bg';
if (process.env.NODE_ENV == 'production') {
    disableReactDevTools();
}
render(
    <BrowserRouter>
        {/* 使用了路由懒加载，所以需要使用<Suspense>包起来 */}
        <Suspense fallback={<Bg />}>
            <Routes>
                <Route path="*" element={<App />} />
            </Routes>
        </Suspense>
    </BrowserRouter>,
    document.getElementById('root')
);
