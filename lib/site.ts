export function siteUrl() {
    const value = process.env.SITE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('SITE_URL must be an HTTP(S) origin');
    return new URL(url.origin);
}
export function publicLink(value: string | null) {
    if (!value) return null;
    if (value.startsWith('/') && !value.startsWith('//') && !value.includes('\\')) return value;
    try {
        const url = new URL(value);
        return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? value : null;
    } catch {
        return null;
    }
}
