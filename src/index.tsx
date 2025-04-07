import React from 'react';
import { disableReactDevTools } from '@/utils/utils';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'virtual:svg-icons-register';

if (process.env.NODE_ENV == 'production') {
    disableReactDevTools();
}

const RootContainer = () => {
    return (
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
};
const root = createRoot(document.getElementById('root')!);
root.render(<RootContainer />);
