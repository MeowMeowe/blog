export const LoadJs = (url: string, callback?: any) :void => {
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

export const randomNumber = (min: number, max: number, float: number) :string => {
    return Math.floor(Math.random() * (max - min + 1) + min).toFixed(float);
};

export const randomColor = () :string => {
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

export const disableReactDevTools = (): void => {
    const noop = (): void => undefined;
    const DEV_TOOLS = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;

    if (typeof DEV_TOOLS === 'object') {
        for (const [key, value] of (<any>Object).entries(DEV_TOOLS)) {
            DEV_TOOLS[key] = typeof value === 'function' ? noop : null;
        }
    }
};


