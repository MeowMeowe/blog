import React, { useState } from 'react';
import Login from './compontents/login';
import AdminContainer from './compontents/admin-container';
import './index.scss';

export default function SmkAdmin() {
    const [loginStatus, setLoginStatus] = useState(false);
    setLoginStatus(false);
    return <div className="admin">{loginStatus ? <AdminContainer /> : <Login />}</div>;
}
