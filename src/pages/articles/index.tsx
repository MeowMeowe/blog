import React, { useEffect } from 'react';
import * as marked from 'marked'; // 修正 marked 的引入

import './index.scss';

const Articles: React.FC = () => {
    useEffect(() => {
        // 在组件挂载后执行 marked 函数
        const test = () => {
            document.getElementById('content')!.innerHTML = marked('# Marked in browser\n\nRendered by **marked**.');
        };
        test();

        // 返回清理函数，在组件销毁时清理副作用
        return () => {
            // 清空 content 元素的 innerHTML
            const contentElement = document.getElementById('content');
            if (contentElement) {
                contentElement.innerHTML = '';
            }
        };
    }, []); // 第二个参数是一个空数组，表示该 useEffect 仅在组件挂载时执行一次

    return (
        <div className="articles" id="content">
            <button onClick={() => marked('# Marked in browser\n\nRendered by **marked**.')}>11111</button>
        </div>
    );
};

export default Articles;
