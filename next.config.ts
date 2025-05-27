import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

const pwaConfig = withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
});

const nextConfig: NextConfig = {
    reactStrictMode: true,
    // experimental: {
    //     turbopack: true,
    // },
};

export default pwaConfig(nextConfig);
