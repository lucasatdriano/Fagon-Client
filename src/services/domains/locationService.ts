import { LocationType, SurfaceType } from '@/types/location';
import { api, extractAxiosError } from '../api';
import API_ROUTES from '../api/routes';
import { ApiResponse } from '@/types/api';

export interface Location {
    id: string;
    projectId: string;
    pavementId?: string;
    name: string;
    locationType: LocationType;
    height?: number;
    pavement: {
        id: string;
        name: string;
    };
    photos: Array<{
        id: string;
        filePath: string;
        selectedForPdf: boolean;
    }>;
    materialFinishing: Array<{
        id: string;
        surface: SurfaceType;
        materialFinishing: string;
    }>;
}

interface CreateLocationData {
    projectId: string;
    name: string;
    locationType: LocationType;
    height?: number;
    photos?: File[];
    pavement?: {
        pavement: string;
        height: number;
        area: number;
        projectId: string;
    };
    materialFinishings?: Array<{
        surface: SurfaceType;
        materialFinishing: string;
    }>;
}

// interface UpdateLocationData extends Partial<CreateLocationData> {}

export const LocationService = {
    async create(data: CreateLocationData): Promise<ApiResponse<Location>> {
        try {
            const response = await api.post(API_ROUTES.LOCATIONS.CREATE, data);
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async listAll(projectId: string): Promise<ApiResponse<Location[]>> {
        try {
            const response = await api.get(
                API_ROUTES.LOCATIONS.BY_PROJECT({ projectId }),
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
        data: Partial<CreateLocationData>,
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
