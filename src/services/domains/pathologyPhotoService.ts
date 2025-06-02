import { api, extractAxiosError } from '../api';
import API_ROUTES from '../api/routes';
import { ApiResponse } from '@/types/api';

export interface PathologyPhoto {
    id: string;
    pathologyId: string;
    filePath: string;
    url: string;
}

export const PathologyPhotosService = {
    async upload(
        pathologyId: string,
        files: File[],
    ): Promise<ApiResponse<PathologyPhoto[]>> {
        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append('files', file);
            });

            const response = await api.post(
                API_ROUTES.PATHOLOGY_PHOTOS.UPLOAD({ pathologyId }),
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            );
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async getById(id: string): Promise<ApiResponse<PathologyPhoto>> {
        try {
            const response = await api.get(
                API_ROUTES.PATHOLOGY_PHOTOS.BY_ID({ id }),
            );
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async delete(id: string): Promise<void> {
        try {
            await api.delete(API_ROUTES.PATHOLOGY_PHOTOS.DELETE({ id }));
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async listByPathology(
        pathologyId: string,
    ): Promise<ApiResponse<PathologyPhoto[]>> {
        try {
            const response = await api.get(
                API_ROUTES.PATHOLOGY_PHOTOS.BY_PATHOLOGY({ pathologyId }),
            );
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },
};
