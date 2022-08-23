import React from 'react';
import { marked } from 'marked';
import './index.scss';

export default function Articles() {
    const test = () => {
        document.getElementById('content')!.innerHTML = marked(
            '# Marked in browser\n\nRendered by **marked**.'
        );
    };
    return (
        <div className="articles" id="content">
            <button onClick={test}>11111</button>
        </div>
    );
}
