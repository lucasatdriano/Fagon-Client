import type { NextConfig } from 'next';
import path from 'path';
import withPWA from 'next-pwa';
import withTM from 'next-transpile-modules';

withTM(['@/components', '@/services', '@/validations']);

const pwaConfig = withPWA({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
    // Adicione esta linha para evitar conflitos:
    buildExcludes: [/middleware-manifest\.json$/],
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
    productionBrowserSourceMaps: true,
    // Adicione estas configurações importantes:
    webpack: (config) => {
        // Resolve aliases manualmente se necessário
        config.resolve.alias = {
            ...config.resolve.alias,
            '@/components': path.resolve(__dirname, 'src/components'),
            '@/services': path.resolve(__dirname, 'src/services'),
            '@/validations': path.resolve(__dirname, 'src/validations'),
        };
        return config;
    },
    // Configuração para builds mais robustos:
    output: 'standalone',
};

// Aplique os plugins na ordem correta:
export default withTM(pwaConfig(nextConfig));
