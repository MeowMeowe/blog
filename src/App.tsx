import React from 'react';
import { Provider } from 'react-redux';
import Layout from './layout/layout';
import store from './store';
import './App.scss';

export default function App() {
    return (
        <Provider store={store}>
            <Layout />
        </Provider>
    );
}
