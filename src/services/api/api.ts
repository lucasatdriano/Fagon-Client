import axios, { AxiosError } from 'axios';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000, // 5 segundos
});

export const extractAxiosError = (error: unknown) => {
    if (error instanceof AxiosError && error.response?.data) {
        return `${error.response.data.error} - ${error.response.data.details}`;
    }
    return 'Erro ao conectar ao servidor.';
};
