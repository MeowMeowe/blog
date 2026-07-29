interface StorageUtil<T> {
    set(key: string, value: T): void;
    get(key: string): T | null;
    remove(key: string): void;
}

const createStorageUtil = <T extends string>(getStorage: () => Storage | null): StorageUtil<T> => ({
    set: (key: string, value: T): void => {
        try {
            getStorage()?.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting ${key}:`, error);
        }
    },

    get: (key: string): T | null => {
        try {
            const value = getStorage()?.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error(`Error getting ${key}:`, error);
            return null;
        }
    },

    remove: (key: string): void => {
        try {
            getStorage()?.removeItem(key);
        } catch (error) {
            console.error(`Error removing ${key}:`, error);
        }
    }
});

const localStorageUtil = createStorageUtil<string>(() => (typeof window === 'undefined' ? null : window.localStorage));
const sessionStorageUtil = createStorageUtil<string>(() => (typeof window === 'undefined' ? null : window.sessionStorage));

const cookieUtil: StorageUtil<string> = {
    set: (name: string, value: string, days = 365): void => {
        if (typeof document === 'undefined') return;

        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + days);
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expirationDate.toUTCString()}; path=/`;
    },

    get: (name: string): string | null => {
        if (typeof document === 'undefined') return null;

        const cookieValue = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`));
        return cookieValue ? decodeURIComponent(cookieValue.split('=')[1]) : null;
    },

    remove: (name: string): void => {
        if (typeof document === 'undefined') return;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
};

export { localStorageUtil, sessionStorageUtil, cookieUtil };
