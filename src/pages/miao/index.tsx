import React, { useState, useEffect } from 'react';
import { getWordApi } from '@/api/one-word';
import './index.scss';

export default function Home() {
    const [word, setWord] = useState('');

    const getWord = async () => {
        const res = await getWordApi();
        if (res.code == 200 && res.data.text) {
            setWord(res.data.text);
        } else {
            setWord('今天小脑瓜里没有情话啦，但还是比昨天多爱你一点。');
        }
    };
    useEffect(() => {
        if (!word) {
            getWord();
        }
    }, [word]);

    return (
        <div className="one-word">
            <p className="word"> {word}</p>
        </div>
    );
}
