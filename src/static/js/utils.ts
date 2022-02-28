export const LoadJs = (url: string, callback?: any) => {
    let domScript: any = document.createElement('script');
    domScript.src = url;
    let success =
        callback ||
        function () {
            //空函数
        };
    domScript.onload = domScript.onreadystatechange = function () {
        if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
            success();
            this.onload = this.onreadystatechange = null;
            this.parentNode.removeChild(this);
        }
    };
    document.getElementsByTagName('head')[0].appendChild(domScript);
};

export const randomNumber = (min: number, max: number, float: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min).toFixed(float);
};

export const randomColor = () => {
    return (
        'rgb(' +
        ~~(Math.random() * 255) +
        ',' +
        ~~(Math.random() * 255) +
        ',' +
        ~~(Math.random() * 255) +
        ')'
    );
};

