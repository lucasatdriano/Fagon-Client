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

            console.log(
                `Requisição: ${config.method?.toUpperCase()} ${config.url}`,
            );
            return config;
        },
        (error) => {
            return Promise.reject(error);
        },
    );
};
