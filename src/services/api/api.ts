import axios, { AxiosError } from 'axios';

const isServer = typeof window === 'undefined';

const API_BASE_URL = isServer
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1/'
    : 'https://fagon-server.onrender.com/api/v1/';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000, // 15 segundos
});

export const extractAxiosError = (error: unknown) => {
    if (error instanceof AxiosError && error.response?.data) {
        return `${error.response.data.error} - ${error.response.data.details}`;
    }
    return 'Erro ao conectar ao servidor.';
};
