import { Route, Routes } from 'react-router-dom';
import { Home, NotFound, ToolsBox, OneWord, SmkAdmin, Articles } from '@/router';
import './index.scss';

export default function Container() {
    return (
        <div className="container">
            <Routes>
                <Route key="one-word" path="/exclusive" element={<OneWord />} />
                <Route key="tools-box" path="/tools-box" element={<ToolsBox />} />
                <Route key="smk-admin" path="/smk-admin" element={<SmkAdmin />} />
                <Route key="articles" path="/articles" element={<Articles />} />
                <Route key="default" path="/" element={<Home />} />
                <Route key="not-found" path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}
