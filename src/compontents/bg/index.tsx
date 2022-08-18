import React from 'react';
import { randomNumber } from '@/utils/utils';
import './index.scss';

export default function Bg() {
    return (
        <div className="bg animate fadeIn">
            <img className="bg-img" src={`./img/bg/${randomNumber(2, 2, 0)}.webp`} alt="bg" />
        </div>
    );
}
