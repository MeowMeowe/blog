interface LoadJsOptions {
    callback?: () => void;
}

export const LoadJs = (url: string, { callback }: LoadJsOptions = {}): void => {
    const domScript = document.createElement('script');
    domScript.src = url;
    const success = callback || (() => {});
    domScript.onload = function () {
        success();
    };
    document.getElementsByTagName('head')[0].appendChild(domScript);
};

export const randomNumber = (min: number, max: number, float = 0): string => {
    // 移除了显式的类型注释
    return Math.floor(Math.random() * (max - min + 1) + min).toFixed(float);
};

export const randomColor = (): string => {
    return `rgb(${~~(Math.random() * 255)},${~~(Math.random() * 255)},${~~(Math.random() * 255)})`;
};

export const disableReactDevTools = (): void => {
    const noop = (): void => {};
    const DEV_TOOLS = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;

    if (typeof DEV_TOOLS === 'object') {
        for (const [key, value] of Object.entries(DEV_TOOLS)) {
            DEV_TOOLS[key] = typeof value === 'function' ? noop : null;
        }
    }
};

export const debounce = <T extends (...args: any[]) => void>(
    func: T,
    delay = 500,
    immediately = false
): ReturnType<T> => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return function (this: any, ...args: Parameters<T>) {
        if (timer) clearTimeout(timer);
        if (immediately) {
            const callNow = !timer;
            timer = setTimeout(() => {
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
    } as ReturnType<T>;
};

export const throttle = <T extends (...args: any[]) => void>(
    func: T,
    delay = 500,
    immediately = false
): ReturnType<T> => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return function (this: any, ...args: Parameters<T>) {
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
    } as ReturnType<T>;
};

const copySymbol = (val: symbol) => Symbol(val.description);

export const cloneDeep = <T>(target: T, map = new Map()): any => {
    if (map.has(target)) {
        return target;
    }

    if (typeof target !== 'object' || target === null) {
        return target;
    }

    if (target instanceof RegExp) {
        return new RegExp(target);
    }

    if (target instanceof Date) {
        return new Date(target.getTime()) as any;
    }

    if (typeof target === 'function') {
        return target;
    }

    if (typeof target === 'symbol') {
        return copySymbol(target);
    }

    const cloneTarget: any = Array.isArray(target) ? [] : {};
    map.set(target, cloneTarget);
    for (const key in target) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
            cloneTarget[key] = cloneDeep(target[key], map);
        }
    }
    return cloneTarget;
};
