'use client';

import { AxiosInstance } from 'axios';
import { getCookie } from 'cookies-next';

export const setupRequestInterceptor = (api: AxiosInstance) => {
    api.interceptors.request.use(
        async (config) => {
            const authToken = getCookie('authToken');
            const accessToken = getCookie('accessToken');

            if (authToken) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${authToken}`;
            } else if (accessToken) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${accessToken}`;
            }

            console.group(
                `[Axios] Requisição: ${config.method?.toUpperCase()} ${
                    config.url
                }`,
            );
            console.info('Config:', {
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
