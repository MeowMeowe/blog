import React from 'react';
import { Provider } from 'react-redux';
import Layout from './layout/layout';
import store from './store';
import './App.scss';

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <Layout />
        </Provider>
    );
};
export default App;
