import { Route, Routes } from 'react-router-dom';
import { Home, NotFound, ToolsBox, OneWord, SmkAdmin } from './router';
import { renderCompontentsByPath } from './layout/layout';
import '@/assets/style/base.scss';
import './App.scss';

function App() {
    return (
        <>
            <div className="container">
                <Routes>
                    <Route key="one-word" path="/exclusive" element={<OneWord />} />
                    <Route key="tools-box" path="/tools-box" element={<ToolsBox />} />
                    <Route key="smk-admin" path="/smk-admin" element={<SmkAdmin />} />
                    <Route key="default" path="/" element={<Home />} />
                    <Route key="not-found" path="*" element={<NotFound />} />
                </Routes>
            </div>
            {renderCompontentsByPath()}
        </>
    );
}

export default App;
