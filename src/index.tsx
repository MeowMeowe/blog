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
