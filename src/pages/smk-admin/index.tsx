import React, { useEffect, useState } from 'react';
import Login from './compontents/login';
import AdminContainer from './compontents/admin-container';
import { localStorageUtil } from '@/utils/storage';
import './index.scss';

const SmkAdmin: React.FC = () => {
    const [loginStatus, setLoginStatus] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorageUtil.get('access_token');
        if (token) {
            setLoginStatus(true);
        }
    }, [loginStatus]);

    return <div className="admin">{loginStatus ? <AdminContainer /> : <Login />}</div>;
};

export default SmkAdmin;
