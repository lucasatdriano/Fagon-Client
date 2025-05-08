import { AxiosInstance } from 'axios';

export const setupResponseInterceptor = (api: AxiosInstance) => {
    api.interceptors.response.use(
        (response) => {
            console.log(
                `Resposta de sucesso: ${response.status} ${response.config.url}`,
            );
            return response;
        },
        (error) => {
            if (error.response) {
                console.error(
                    `Erro na resposta: ${error.response.status} ${error.response.data}`,
                );
            } else {
                console.error('Erro de rede ou timeout');
            }
            return Promise.reject(error);
        },
    );
};
