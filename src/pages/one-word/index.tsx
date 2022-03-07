import React, { useState, useEffect } from 'react';
import { get } from '../../static/js/axios';
import './index.scss';

export default function Home() {
    const [word, setWord] = useState('');

    const getWord = async () => {
        let res = await get('https://meowgod.com/api/sweet_word/randomOne', {});
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
            <p> {word}</p>
        </div>
    );
}
