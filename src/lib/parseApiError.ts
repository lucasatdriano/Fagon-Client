import axios from 'axios';

export function parseApiError(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const apiError = error.response?.data;

        if (typeof apiError === 'string') {
            return apiError;
        }

        if (typeof apiError === 'object' && apiError?.message) {
            return Array.isArray(apiError.message)
                ? apiError.message.join(', ')
                : apiError.message;
        }

        return 'Erro desconhecido da API.';
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'Erro inesperado.';
}
