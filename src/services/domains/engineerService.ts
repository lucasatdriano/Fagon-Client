import { engineerProps } from '@/interfaces/engineer';
import { api, extractAxiosError } from '../api';
import API_ROUTES from '../api/routes';
import { ApiResponse } from '@/types/api';

interface CreateEngineerData {
    name: string;
    email: string;
    phone: string;
    cpf: string;
    education: string;
    registrationNumber: string;
    registrationEntity: string;
}

interface ListEngineersParams {
    page?: number;
    limit?: number;
}

interface SearchEngineersParams {
    name?: string;
    education?: string;
    registrationNumber?: string;
}

export const EngineerService = {
    async create(data: CreateEngineerData): Promise<engineerProps> {
        try {
            const response = await api.post(API_ROUTES.ENGINEERS.CREATE, data);
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async listAll(
        params?: ListEngineersParams,
    ): Promise<ApiResponse<engineerProps[]>> {
        try {
            const response = await api.get(API_ROUTES.ENGINEERS.BASE, {
                params: params,
            });
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async search(params: SearchEngineersParams): Promise<engineerProps[]> {
        try {
            const response = await api.get(API_ROUTES.ENGINEERS.SEARCH, {
                params: params,
            });
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async getById(id: string): Promise<engineerProps> {
        try {
            const response = await api.get(API_ROUTES.ENGINEERS.BY_ID({ id }));
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async update(
        id: string,
        data: Partial<CreateEngineerData>,
    ): Promise<engineerProps> {
        try {
            const response = await api.patch(
                API_ROUTES.ENGINEERS.UPDATE({ id }),
                data,
            );
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async delete(id: string): Promise<void> {
        try {
            await api.delete(API_ROUTES.ENGINEERS.DELETE({ id }));
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },
};
