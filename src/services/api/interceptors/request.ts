import { AxiosInstance } from 'axios';

export const setupRequestInterceptor = (api: AxiosInstance) => {
    api.interceptors.request.use(
        (config) => {
            // Obtendo o token de autenticação do localStorage
            const token = localStorage.getItem('authToken');

            // Se o token existir, adiciona ao cabeçalho Authorization
            if (token) {
                // Usando o método `set` para adicionar o cabeçalho Authorization corretamente
                config.headers?.set('Authorization', `Bearer ${token}`);
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
