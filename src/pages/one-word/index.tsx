import React, { useState, useEffect } from 'react';
import { getWordApi } from '@/api/one-word';
import './index.scss';

export default function Home() {
    const [word, setWord] = useState('');

    const getWord = async () => {
        const res = await getWordApi();
        if (res.status == 0 && res.data) {
            setWord(res.data.text);
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
