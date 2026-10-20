export function allowedRequestOrigin(origin: string, host: string | null, protocol: string, configuredUrl?: string) {
    try {
        const parsed = new URL(origin);
        if (parsed.origin !== origin || !['http:', 'https:'].includes(parsed.protocol)) return false;
        if (configuredUrl && origin === new URL(configuredUrl).origin) return true;
        // Next normalizes loopback URLs to localhost; the original Host retains the browser's actual origin.
        return parsed.host === host && parsed.protocol === protocol;
    } catch {
        return false;
    }
}
