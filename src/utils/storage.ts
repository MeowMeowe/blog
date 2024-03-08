interface StorageUtil {
    // localStorage
    setLocalStorage<T>(key: string, value: T): void;
    getLocalStorage<T>(key: string): T | null;
    removeLocalStorage(key: string): void;

    // sessionStorage
    setSessionStorage<T>(key: string, value: T): void;
    getSessionStorage<T>(key: string): T | null;
    removeSessionStorage(key: string): void;

    // cookie
    setCookie(name: string, value: string, days?: number): void;
    getCookie(name: string): string | null;
    removeCookie(name: string): void;
}

const storageUtil: StorageUtil = {
    // localStorage
    setLocalStorage: <T>(key: string, value: T): void => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error setting localStorage:', error);
        }
    },

    getLocalStorage: <T>(key: string): T | null => {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Error getting localStorage:', error);
            return null;
        }
    },

    removeLocalStorage: (key: string): void => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing localStorage:', error);
        }
    },

    // sessionStorage
    setSessionStorage: <T>(key: string, value: T): void => {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error setting sessionStorage:', error);
        }
    },

    getSessionStorage: <T>(key: string): T | null => {
        try {
            const value = sessionStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Error getting sessionStorage:', error);
            return null;
        }
    },

    removeSessionStorage: (key: string): void => {
        try {
            sessionStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing sessionStorage:', error);
        }
    },

    // cookie
    setCookie: (name: string, value: string, days = 365): void => {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + days);

        document.cookie = `${name}=${encodeURIComponent(
            value
        )}; expires=${expirationDate.toUTCString()}; path=/`;
    },

    getCookie: (name: string): string | null => {
        const cookieValue = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`));

        return cookieValue ? decodeURIComponent(cookieValue.split('=')[1]) : null;
    },

    removeCookie: (name: string): void => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
};

export default storageUtil;
