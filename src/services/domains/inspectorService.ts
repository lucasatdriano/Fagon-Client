import { api, extractAxiosError } from '../api';
import API_ROUTES from '../api/routes';
import { ApiResponse, InspectorsApiResponse } from '../../types/api';
import { inspectorProps } from '@/interfaces/inspector';

interface CreateInspectorData {
    name: string;
    phone: string;
    cep?: string;
    state: string;
    city: string;
    district?: string;
    street?: string;
    selectedCities: string[];
}

interface ListInspectorsParams {
    page?: number;
    limit?: number;
}

interface SearchInspectorsParams {
    name?: string;
    state?: string;
    city?: string;
    selectedCities?: string[];
}

export const InspectorService = {
    async create(
        data: CreateInspectorData,
    ): Promise<ApiResponse<inspectorProps>> {
        try {
            const response = await api.post(API_ROUTES.INSPECTORS.CREATE, data);
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async listAll(
        params?: ListInspectorsParams,
    ): Promise<{ data: InspectorsApiResponse }> {
        try {
            const response = await api.get(API_ROUTES.INSPECTORS.BASE, {
                params: params,
            });
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async search(
        params: SearchInspectorsParams,
    ): Promise<ApiResponse<InspectorsApiResponse>> {
        try {
            const response = await api.get(API_ROUTES.INSPECTORS.SEARCH, {
                params: params,
            });
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async getById(id: string): Promise<ApiResponse<inspectorProps>> {
        try {
            const response = await api.get(API_ROUTES.INSPECTORS.BY_ID({ id }));
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async update(
        id: string,
        data: Partial<CreateInspectorData>,
    ): Promise<ApiResponse<inspectorProps>> {
        try {
            const response = await api.patch(
                API_ROUTES.INSPECTORS.UPDATE({ id }),
                data,
            );
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async delete(id: string): Promise<void> {
        try {
            await api.delete(API_ROUTES.INSPECTORS.DELETE({ id }));
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },
};
