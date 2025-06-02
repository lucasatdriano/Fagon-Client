import { api, extractAxiosError } from '../api';
import API_ROUTES from '../api/routes';
import { ApiResponse } from '@/types/api';

export interface Photo {
    id: string;
    locationId: string;
    filePath: string;
    selectedForPdf: boolean;
    location: {
        id: string;
        // Add other location properties as needed
    };
}

export interface UpdatePhotoData {
    locationId?: string;
    filePath?: string;
    selectedForPdf: boolean;
}

export const PhotoService = {
    async upload(
        locationId: string,
        files: File[],
    ): Promise<ApiResponse<Photo[]>> {
        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append('files', file);
            });

            const response = await api.post(
                API_ROUTES.PHOTOS.UPLOAD({ locationId }),
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

    async listByLocation(locationId: string): Promise<ApiResponse<Photo[]>> {
        try {
            const response = await api.get(
                API_ROUTES.PHOTOS.BY_LOCATION({ locationId }),
            );
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async update(
        id: string,
        data: UpdatePhotoData,
    ): Promise<ApiResponse<Photo>> {
        try {
            const response = await api.patch(
                API_ROUTES.PHOTOS.UPDATE({ id }),
                data,
            );
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async delete(id: string): Promise<void> {
        try {
            await api.delete(API_ROUTES.PHOTOS.DELETE({ id }));
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },
};
