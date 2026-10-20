type RateLimitEntry = {
    count: number;
    resetAt: number;
};

type RateLimitResult = {
    allowed: boolean;
    remaining: number;
    retryAfterSeconds: number;
};

const STORE_LIMIT = 5000;
const globalRateLimit = globalThis as typeof globalThis & {
    blogRateLimitStore?: Map<string, RateLimitEntry>;
};

const store = globalRateLimit.blogRateLimitStore ?? new Map<string, RateLimitEntry>();
globalRateLimit.blogRateLimitStore = store;

function pruneStore(now: number) {
    for (const [key, entry] of store) {
        if (entry.resetAt <= now) {
            store.delete(key);
        }
    }

    while (store.size >= STORE_LIMIT) {
        const oldestKey = store.keys().next().value;
        if (typeof oldestKey !== 'string') break;
        store.delete(oldestKey);
    }
}

export function consumeRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
    const now = Date.now();

    if (store.size >= STORE_LIMIT) {
        pruneStore(now);
    }

    const current = store.get(key);
    if (!current || current.resetAt <= now) {
        store.set(key, {
            count: 1,
            resetAt: now + windowMs
        });

        return {
            allowed: true,
            remaining: Math.max(0, limit - 1),
            retryAfterSeconds: Math.ceil(windowMs / 1000)
        };
    }

    current.count += 1;
    store.set(key, current);

    return {
        allowed: current.count <= limit,
        remaining: Math.max(0, limit - current.count),
        retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000))
    };
}

export function clearRateLimit(key: string) {
    store.delete(key);
}

function readHeader(headers: Headers | Record<string, unknown>, name: string) {
    if (headers instanceof Headers) return headers.get(name);
    const value = headers[name] ?? headers[name.toLowerCase()];
    return Array.isArray(value) ? value[0] : typeof value === 'string' ? value : null;
}

export function getClientIp(headers: Headers | Record<string, unknown>) {
    const forwardedFor = readHeader(headers, 'x-forwarded-for');
    return readHeader(headers, 'x-real-ip') || forwardedFor?.split(',')[0]?.trim() || 'unknown';
}

export function getClientIdentifier(headers: Headers | Record<string, unknown>) {
    const ip = getClientIp(headers);
    const userAgent = (readHeader(headers, 'user-agent') || 'unknown').slice(0, 120);

    return `${ip}:${userAgent}`;
}
