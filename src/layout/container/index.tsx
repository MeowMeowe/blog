import { Route, Routes } from 'react-router-dom';
import RouterSchemle from '@/router';
import './index.scss';

export default function Container() {
    return (
        <div className="container">
            <Routes>
                {RouterSchemle.map((item) => {
                    return <Route key={item.key} path={item.path} element={<item.element />} />;
                })}
            </Routes>
        </div>
    );
}
