import React from 'react';
import { randomNumber, randomColor } from '@/utils/utils';
import './index.scss';

const Loading: React.FC = () => {
    return (
        <div className="loading" style={{ color: randomColor() }}>
            <div className={`loader-${randomNumber(1, 29, 0)}`} />
        </div>
    );
};

export default Loading;
