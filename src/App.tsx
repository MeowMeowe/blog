import { Route, Routes } from 'react-router-dom';
import { Home, NotFound ,ToolsBox } from './router';
import Nav from './compontents/nav';
import Bg from './compontents/bg';
import ScrollBar from './compontents/scroll-bar';
import Footer from './compontents/footer';
import React from 'react';
import './App.scss';

function App() {
    return (
        <div className="index">
            <Bg />
            <Nav />
            <ScrollBar />
            <Routes>
                <Route key="home" path="/home" element={<Home />} />
                <Route key="tools-box" path="/tools-box" element={< ToolsBox/>} />
                <Route key="default" path="/" element={<Home />} />
                <Route key="not-found" path="*" element={<NotFound />} />
            </Routes>
            <Footer/>
        </div>
    );
}

export default App;
