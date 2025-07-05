import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

const pwaConfig = withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
});

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'qzlcjbvacfvkxfwiuodo.supabase.co',
                port: '',
                pathname: '/storage/v1/object/sign/**',
            },
        ],
    },
    reactStrictMode: true,
};

export default pwaConfig(nextConfig);
