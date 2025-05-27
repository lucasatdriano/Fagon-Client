import { api, extractAxiosError } from '../api';
import API_ROUTES from '../api/routes';
import { ApiResponse } from '@/types/api';

export interface Pathology {
    id: string;
    referenceLocation: string;
    title: string;
    description: string;
    recordDate: string;
    project: {
        id: string;
        // Add other project properties as needed
    };
    location: {
        id: string;
        // Add other location properties as needed
    };
    photos?: string[];
}

export interface CreatePathologyData {
    projectId: string;
    locationId: string;
    referenceLocation: string;
    title: string;
    description: string;
    recordDate: string;
    photos?: string[];
}

export interface ListPathologiesParams {
    projectId?: string;
}

export interface SearchPathologiesParams {
    title?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
}

export const PathologyService = {
    async create(data: CreatePathologyData): Promise<ApiResponse<Pathology>> {
        try {
            const response = await api.post(
                API_ROUTES.PATHOLOGIES.CREATE,
                data,
            );
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async listAll(
        params?: ListPathologiesParams,
    ): Promise<ApiResponse<Pathology[]>> {
        try {
            const response = await api.get(API_ROUTES.PATHOLOGIES.BASE, {
                params,
            });
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async search(
        params: SearchPathologiesParams,
    ): Promise<ApiResponse<Pathology[]>> {
        try {
            const response = await api.get(API_ROUTES.PATHOLOGIES.SEARCH, {
                params,
            });
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async getById(id: string): Promise<ApiResponse<Pathology>> {
        try {
            const response = await api.get(
                API_ROUTES.PATHOLOGIES.BY_ID({ id }),
            );
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async update(
        id: string,
        data: Partial<CreatePathologyData>,
    ): Promise<ApiResponse<Pathology>> {
        try {
            const response = await api.patch(
                API_ROUTES.PATHOLOGIES.UPDATE({ id }),
                data,
            );
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async delete(id: string): Promise<void> {
        try {
            await api.delete(API_ROUTES.PATHOLOGIES.DELETE({ id }));
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },
};
