import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

// const isServer = typeof window === 'undefined';

// const API_BASE_URL = isServer
//     ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1/'
//     : 'https://fagon-server-production.up.railway.app/api/v1/';

const API_BASE_URL = 'http://localhost:3000/api/v1/';
const TIMEOUT_15_SECONDS = 15 * 1000;

const axiosConfig: AxiosRequestConfig = {
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: TIMEOUT_15_SECONDS,
    withCredentials: true,
};

export const api: AxiosInstance = axios.create(axiosConfig);

export const extractAxiosError = (error: unknown) => {
    if (error instanceof AxiosError && error.response?.data) {
        return `${error.response.data.error} - ${error.response.data.details}`;
    }
    return 'Erro ao conectar ao servidor.';
};
