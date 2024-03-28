interface StorageUtil<T> {
    set(key: string, value: T): void;
    get(key: string): T | null;
    remove(key: string): void;
}

const createStorageUtil = <T extends string>(storage: Storage): StorageUtil<T> => ({
    set: (key: string, value: T): void => {
        try {
            storage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(
                `Error setting ${storage === localStorage ? 'localStorage' : 'sessionStorage'}:`,
                error
            );
        }
    },

    get: (key: string): T | null => {
        try {
            const value = storage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error(
                `Error getting ${storage === localStorage ? 'localStorage' : 'sessionStorage'}:`,
                error
            );
            return null;
        }
    },

    remove: (key: string): void => {
        try {
            storage.removeItem(key);
        } catch (error) {
            console.error(
                `Error removing ${storage === localStorage ? 'localStorage' : 'sessionStorage'}:`,
                error
            );
        }
    }
});

const localStorageUtil: StorageUtil<string> = createStorageUtil(localStorage);
const sessionStorageUtil: StorageUtil<string> = createStorageUtil(sessionStorage);

const cookieUtil: StorageUtil<string> = {
    set: (name: string, value: string, days = 365): void => {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + days);

        document.cookie = `${name}=${encodeURIComponent(
            value
        )}; expires=${expirationDate.toUTCString()}; path=/`;
    },

    get: (name: string): string | null => {
        const cookieValue = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`));

        return cookieValue ? decodeURIComponent(cookieValue.split('=')[1]) : null;
    },

    remove: (name: string): void => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
};

export { localStorageUtil, sessionStorageUtil, cookieUtil };
