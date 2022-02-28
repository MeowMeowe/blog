import { Route, Routes } from 'react-router-dom';
import { Home, NotFound } from './router';
import Nav from './compontents/nav';
import Bg from './compontents/bg';
import React from 'react';
import './App.scss';

function App() {
    return (
        <div className="index">
            <Bg />
            <Nav />
            <Routes>
                <Route key="home" path="/home" element={<Home />} />
                <Route key="default" path="/" element={<Home />} />
                <Route key="not-found" path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default App;
