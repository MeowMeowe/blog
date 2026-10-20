const DEFAULT_ADMIN_PATH = '/backstage';
const RESERVED_SEGMENTS = new Set(['admin', 'api', '_next', 'articles', 'about', 'projects', 'study', 'miao', 'table', 'home']);

export function getAdminPath() {
    const configuredPath = process.env.ADMIN_PATH?.trim();

    if (!configuredPath) {
        return DEFAULT_ADMIN_PATH;
    }

    if (!/^\/[a-z0-9][a-z0-9-]{7,63}$/i.test(configuredPath)) {
        return DEFAULT_ADMIN_PATH;
    }

    const segment = configuredPath.slice(1).toLowerCase();
    return RESERVED_SEGMENTS.has(segment) ? DEFAULT_ADMIN_PATH : configuredPath;
}

export function getAdminLoginPath() {
    return `${getAdminPath()}/login`;
}
