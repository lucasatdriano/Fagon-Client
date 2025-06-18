import { AxiosInstance } from 'axios';

export const setupResponseInterceptor = (api: AxiosInstance) => {
    api.interceptors.response.use(
        (response) => {
            console.group(
                `[Axios] Resposta de sucesso: ${response.status} ${response.config.url}`,
            );
            console.info('Response:', {
                status: response.status,
                statusText: response.statusText,
                data: response.data,
                headers: response.headers,
                config: {
                    method: response.config.method,
                    url: response.config.url,
                    params: response.config.params,
                },
            });
            console.groupEnd();

            return response;
        },
        (error) => {
            console.group('[Axios] Erro na resposta');

            if (error.response) {
                console.error('Detalhes do erro:', {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers,
                    request: {
                        method: error.config.method,
                        url: error.config.url,
                        data: error.config.data,
                        params: error.config.params,
                    },
                });
            } else if (error.request) {
                console.error('Erro de rede/timeout:', {
                    message: error.message,
                    request: error.request,
                });
            } else {
                console.error('Erro ao configurar requisição:', error.message);
            }

            console.groupEnd();

            return Promise.reject(error);
        },
    );
};
