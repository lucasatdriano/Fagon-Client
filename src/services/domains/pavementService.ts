import { api, extractAxiosError } from '../api';
import API_ROUTES from '../api/routes';
import { ApiResponse } from '@/types/api';

export interface Pavement {
    id: string;
    projectId: string;
    pavement: string;
    height: number;
    area: number;
    createdAt: string;
    updatedAt: string;
}

export interface PavementItem {
    pavement: string;
}

export interface CreatePavementData {
    projectId: string;
    pavement: string;
    height: number;
    area: number;
}

export const PavementService = {
    async create(data: CreatePavementData): Promise<ApiResponse<Pavement>> {
        try {
            const response = await api.post(API_ROUTES.PAVEMENTS.CREATE, data);
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async getByProject(projectId: string): Promise<ApiResponse<Pavement[]>> {
        try {
            const response = await api.get(
                API_ROUTES.PAVEMENTS.BY_PROJECT({ projectId }),
            );
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async getById(id: string): Promise<ApiResponse<Pavement>> {
        try {
            const response = await api.get(API_ROUTES.PAVEMENTS.BY_ID({ id }));
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async update(
        id: string,
        data: Partial<CreatePavementData>,
    ): Promise<ApiResponse<Pavement>> {
        try {
            const response = await api.patch(
                API_ROUTES.PAVEMENTS.UPDATE({ id }),
                data,
            );
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async delete(id: string): Promise<void> {
        try {
            await api.delete(API_ROUTES.PAVEMENTS.DELETE({ id }));
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },
};
