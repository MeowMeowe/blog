import React, { useEffect, useState } from 'react';
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

    return <div className="admin">admin home</div>;
};

export default SmkAdmin;
