import { api, extractAxiosError } from '../api';
import API_ROUTES from '../api/routes';
import { ApiResponse } from '@/types/api';

type SurfaceType = 'piso' | 'parede' | 'forro';

export interface MaterialFinishing {
    id: string;
    locationId: string;
    surface: SurfaceType;
    materialFinishing: string;
    location: {
        id: string;
        // Add other location properties as needed
    };
}

export interface CreateMaterialFinishingData {
    locationId: string;
    surface: SurfaceType;
    materialFinishing: string;
}

export const MaterialFinishingService = {
    async create(
        data: CreateMaterialFinishingData,
    ): Promise<ApiResponse<MaterialFinishing>> {
        try {
            const response = await api.post(
                API_ROUTES.MATERIAL_FINISHINGS.CREATE,
                data,
            );
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async listByLocation(
        locationId: string,
    ): Promise<ApiResponse<MaterialFinishing[]>> {
        try {
            const response = await api.get(
                API_ROUTES.MATERIAL_FINISHINGS.BY_LOCATION({ locationId }),
            );
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async getById(id: string): Promise<ApiResponse<MaterialFinishing>> {
        try {
            const response = await api.get(
                API_ROUTES.MATERIAL_FINISHINGS.BY_ID({ id }),
            );
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async update(
        id: string,
        data: Partial<CreateMaterialFinishingData>,
    ): Promise<ApiResponse<MaterialFinishing>> {
        try {
            const response = await api.patch(
                API_ROUTES.MATERIAL_FINISHINGS.UPDATE({ id }),
                data,
            );
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async delete(id: string): Promise<void> {
        try {
            await api.delete(API_ROUTES.MATERIAL_FINISHINGS.DELETE({ id }));
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },
};
