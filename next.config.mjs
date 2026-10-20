/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';
const contentSecurityPolicy = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isProduction ? '' : " 'unsafe-eval'"}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    `connect-src 'self' https://v1.hitokoto.cn${isProduction ? '' : ' ws: wss:'}`,
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    ...(isProduction && process.env.NEXTAUTH_URL?.startsWith('https:') ? ['upgrade-insecure-requests'] : [])
].join('; ');

const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    // Preserve the server origin for internal admin rewrites (Next normalizes loopback hosts).
    skipProxyUrlNormalize: true,
    sassOptions: {
        implementation: 'sass-embedded',
        includePaths: ['./app'],
        prependData: `@use '@/assets/style/public.scss' as *;`
    },
    images: { unoptimized: true },
    async headers() {
        const securityHeaders = [
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'X-Frame-Options', value: 'DENY' },
            { key: 'X-DNS-Prefetch-Control', value: 'off' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
            { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
            { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
            { key: 'Content-Security-Policy', value: contentSecurityPolicy }
        ];

        if (isProduction) {
            securityHeaders.push({ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' });
        }

        return [
            {
                source: '/:path*',
                headers: securityHeaders
            }
        ];
    }
};

export default nextConfig;
