import type { NextConfig } from 'next';
import withPWA from 'next-pwa';
import path from 'path';

const pwaConfig = withPWA({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
    buildExcludes: [/middleware-manifest\.json$/],
});

const nextConfig: NextConfig = {
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@/components': path.resolve(__dirname, 'src/components'),
            '@/services': path.resolve(__dirname, 'src/services'),
            '@/validations': path.resolve(__dirname, 'src/validations'),
            '@/modals': path.resolve(__dirname, 'src/components/modals'),
        };
        return config;
    },

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
    productionBrowserSourceMaps: true,
    output: 'standalone',
};

export default pwaConfig(nextConfig);
