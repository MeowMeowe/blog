export const FALLBACK_IMAGE = '/icon/default.svg';

export function resourceImage(value?: string | null) {
    if (!value) return FALLBACK_IMAGE;
    if (value.startsWith('/') && !value.startsWith('//') && !value.includes('\\')) return value;
    try {
        const url = new URL(value);
        if (['https:', 'http:'].includes(url.protocol) && !url.username && !url.password) return value;
    } catch {
        /* Legacy content stores an icon name rather than a URL. */
    }
    return /^[a-z0-9_-]+$/i.test(value) ? `/icon/${value}.webp` : FALLBACK_IMAGE;
}
