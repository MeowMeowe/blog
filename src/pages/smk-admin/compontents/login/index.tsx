import React from 'react';
import LazyImage from '@/compontents/lazy-image';
import './index.scss';

const Login: React.FC = () => {
    return (
        <div className="login">
            <LazyImage className="logo" src="./static/img/icon/cat.webp" alt="logo" />
            <input className="username" placeholder="input username" type="text" />
            <input className="pswd" placeholder="input password" type="password" />
            <button className="btn">Login In</button>
        </div>
    );
};

export default Login;
