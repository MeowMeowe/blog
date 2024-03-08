import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { disableReactDevTools } from '@/utils/utils';
import { createRoot } from 'react-dom/client';
import App from './App';

if (process.env.NODE_ENV == 'production') {
    disableReactDevTools();
}

const RootContainer = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<App />} />
            </Routes>
        </BrowserRouter>
    );
};
const root = createRoot(document.getElementById('root')!);

root.render(<RootContainer />);
