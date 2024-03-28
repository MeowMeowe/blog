import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';
import Loading from '@/compontents/loading';
import RouterSchemle from '@/router';
import './index.scss';

const Container: React.FC = () => {
    return (
        <div className="container">
            <Suspense fallback={<Loading />}>
                <Routes>
                    {RouterSchemle.map((item) => (
                        <Route key={item.key} path={item.path} element={<item.element />} />
                    ))}
                </Routes>
            </Suspense>
        </div>
    );
};

export default Container;
