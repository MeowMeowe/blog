export const LoadJs = (url: string, callback?: any): void => {
    const domScript: any = document.createElement('script');
    domScript.src = url;
    const success =
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

export const randomNumber = (min: number, max: number, float: number): string => {
    return Math.floor(Math.random() * (max - min + 1) + min).toFixed(float);
};

export const randomColor = (): string => {
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

export const debounce = (func: () => void, delay = 500, immediately = false) => {
    let timer: null | ReturnType<typeof setTimeout> = null;
    return function (this: any, ...args: any) {
        if (timer) clearTimeout(timer);
        if (immediately) {
            const callNow = !timer; // 根据当前的定时器信息来决定要不要立即执行
            timer = setTimeout(function () {
                timer = null;
            }, delay);
            if (callNow) {
                func.apply(this, args);
            }
        } else {
            timer = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        }
    };
};

export const throttle = function (func: () => void, delay = 500, immediately = false) {
    let timer: null | ReturnType<typeof setTimeout> = null;
    return function (this: any, ...args: any) {
        if (immediately) {
            func.apply(this, args);
            immediately = false;
            timer = setTimeout(() => {
                immediately = true;
                timer = null;
            }, delay);
            return;
        }
        if (!timer) {
            timer = setTimeout(() => {
                func.apply(this, args);
                timer = null;
            }, delay);
        }
    };
};

const isObject = (target: any) => {
    return typeof target === 'object' && target !== null;
};

const copyFn = (fn: any) => {
    const result = eval('0,' + fn);
    console.log(fn);
    for (const i in fn) {
        result[i] = fn[i];
    }
    return result;
};

const copySymbol = (val: symbol) => {
    const str = val.toString();
    const tempArr = str.split('(');
    const arr = tempArr[1].split(')')[0];
    return Symbol(arr);
};

export const cloneDeep = (target: any, map = new Map()) => {
    if (map.get(target)) {
        return target;
    }
    const constructor = target?.constructor;
    if (constructor) {
        if (/^(RegExp|Date)$/i.test(constructor.name)) {
            return new constructor(target);
        }
    }
    if (typeof target === 'function') {
        map.set(target, true);
        const cloneFn = eval('0,' + target);
        for (const prop in target) {
            cloneFn[prop] = cloneDeep(target[prop], map);
        }
        return cloneFn;
    }
    if (isObject(target)) {
        map.set(target, true);
        const cloneTarget: any = Array.isArray(target) ? [] : {};
        for (const prop in target) {
            cloneTarget[prop] = cloneDeep(target[prop], map);
        }
        return cloneTarget;
    }
    if (typeof target === 'symbol') {
        return copySymbol(target);
    }
    return target;
};
