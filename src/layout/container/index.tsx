import { Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';
import Loading from '@/compontents/loading';
import RouterSchemle from '@/router';
import Bg from '@/compontents/bg';
import './index.scss';

export default function Container() {
    return (
        <div className="container">
            <Suspense fallback={<Loading />}>
                <Routes>
                    {RouterSchemle.map((item) => {
                        return <Route key={item.key} path={item.path} element={<item.element />} />;
                    })}
                </Routes>
            </Suspense>
            <Bg />
        </div>
    );
}
