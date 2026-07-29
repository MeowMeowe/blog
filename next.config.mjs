/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: ['./app'],
    prependData: `@use '@/assets/style/public.scss' as *;`,
  },
};

export default nextConfig;
