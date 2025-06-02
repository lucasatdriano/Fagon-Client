'use client';

import { AxiosInstance } from 'axios';
import { getCookie } from 'cookies-next';

export const setupRequestInterceptor = (api: AxiosInstance) => {
    api.interceptors.request.use(
        async (config) => {
            const token = getCookie('token');

            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${token}`;
            }

            console.group(
                `[Axios] Requisição: ${config.method?.toUpperCase()} ${
                    config.url
                }`,
            );
            console.log('Config:', {
                method: config.method,
                url: config.url,
                headers: config.headers,
                params: config.params,
                data: config.data,
            });
            console.groupEnd();

            return config;
        },
        (error) => {
            console.error('[Axios] Erro no interceptor de requisição:', error);
            return Promise.reject(error);
        },
    );
};
