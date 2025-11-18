import { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { parseCookies } from 'nookies';

export const setupResponseInterceptor = (api: AxiosInstance) => {
    api.interceptors.response.use(
        (response: AxiosResponse) => {
            console.group(
                `[Axios] Resposta de sucesso: ${response.status} ${response.config.url}`,
            );
            console.info('Response:', {
                status: response.status,
                statusText: response.statusText,
                data: response.data.data,
                meta: response.data.meta,
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
        (error: AxiosError) => {
            console.group('[Axios] Erro na resposta');

            const isCanceled =
                error instanceof Error &&
                (error.code === 'ERR_CANCELED' ||
                    error.name === 'CanceledError');

            if (isCanceled) {
                return Promise.reject(error);
            }

            if (error.response) {
                console.error('Detalhes do erro:', {
                    status: error.response.status,
                    headers: error.response.headers,
                    data: error.response.data,
                    request: {
                        method: error.config?.method,
                        url: error.config?.url,
                        data: error.config?.data,
                        params: error.config?.params,
                    },
                });

                if (error.response.status === 401) {
                    const cookies = parseCookies();

                    if (cookies.accessToken) {
                        window.location.href = '/accessKey';
                    } else if (cookies.authToken) {
                        window.location.href = '/login';
                    }
                }
                return Promise.reject(error);
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
