import { Route, Routes } from 'react-router-dom';
import RouterSchemle from '@/router';
import Bg from '@/compontents/bg';
import './index.scss';

export default function Container() {
    return (
        <div className="container">
            <Routes>
                {RouterSchemle.map((item) => {
                    return <Route key={item.key} path={item.path} element={<item.element />} />;
                })}
            </Routes>
            <Bg />
        </div>
    );
}
