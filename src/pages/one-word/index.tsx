import React, { useState } from 'react';
import { get } from '../../static/js/axios';
import './index.scss';

export default function Home() {
    const [word, setWord] = useState('');

    const getWord = async () => {
        let res = await get('http://meowgod.com:9001/api/sweet_word/randomOne', {});
        if (res.status == 0 && res.data) {
            setWord(res.data.text);
        }
    };
    getWord();

    return (
        <div className="one-word">
            <p> {word}</p>
        </div>
    );
}
