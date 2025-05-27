import { api, extractAxiosError } from '../api';
import API_ROUTES from '../api/routes';
import { ApiResponse } from '@/types/api';

type LocationType = 'externo' | 'interno' | string; // Add other possible types

export interface Location {
    id: string;
    projectId: string;
    pavementId: string;
    name: string;
    locationType: LocationType;
    height: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateLocationData {
    projectId: string;
    pavementId: string;
    name: string;
    locationType: LocationType;
    height: number;
}

export interface UpdateLocationData {
    photos?: string[];
    pavement?: {
        projectId: string;
        pavement: string;
        height: number;
        area: number;
    };
    materialFinishings?: Array<{
        locationId: string;
        surface: string;
        materialFinishing: string;
    }>;
}

export const LocationService = {
    async create(data: CreateLocationData): Promise<ApiResponse<Location>> {
        try {
            const response = await api.post(API_ROUTES.LOCATIONS.CREATE, data);
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async getByProject(projectId: string): Promise<ApiResponse<Location[]>> {
        try {
            const response = await api.get(
                API_ROUTES.LOCATIONS.BY_PROJECT(projectId),
            );
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async getByPavement(pavementId: string): Promise<ApiResponse<Location[]>> {
        try {
            const response = await api.get(
                API_ROUTES.LOCATIONS.BY_PAVEMENT(pavementId),
            );
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async getById(id: string): Promise<ApiResponse<Location>> {
        try {
            const response = await api.get(API_ROUTES.LOCATIONS.BY_ID({ id }));
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async update(
        id: string,
        data: UpdateLocationData,
    ): Promise<ApiResponse<Location>> {
        try {
            const response = await api.patch(
                API_ROUTES.LOCATIONS.UPDATE({ id }),
                data,
            );
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async delete(id: string): Promise<void> {
        try {
            await api.delete(API_ROUTES.LOCATIONS.DELETE({ id }));
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },
};
