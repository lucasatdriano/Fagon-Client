import { api, extractAxiosError } from '../api';
import API_ROUTES from '../api/routes';
import { ApiResponse } from '../../types/api';
import { GetSignedUrlOptions } from '@/interfaces/signedUrlOptions';

export interface PathologyPhoto {
    id: string;
    pathologyId: string;
    filePath: string;
    name?: string;
    createdAt: string;
    signedUrl?: string;
    pathology: {
        id: string;
        name: string;
        location: {
            id: string;
            name: string;
            locationType: string;
        };
        project: {
            id: string;
            upeCode: string;
        };
    };
}

export const PathologyPhotosService = {
    async upload(
        pathologyId: string,
        files: File[],
    ): Promise<ApiResponse<PathologyPhoto[]>> {
        try {
            const formData = new FormData();

            files.forEach((file) => {
                formData.append(
                    'files',
                    file,
                    file.name || `pathology-photo-${Date.now()}.jpg`,
                );
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

    async listByPathology(
        pathologyId: string,
        includeSignedUrls = true,
    ): Promise<ApiResponse<PathologyPhoto[]>> {
        try {
            const response = await api.get(
                API_ROUTES.PATHOLOGY_PHOTOS.BY_PATHOLOGY({ pathologyId }),
                {
                    params: {
                        signed: includeSignedUrls,
                    },
                },
            );

            if (!includeSignedUrls) return response.data;

            const photos = response.data.data || response.data;

            const photosWithUrls = await Promise.all(
                photos.map(async (photo: PathologyPhoto) => {
                    if (!photo.signedUrl) {
                        try {
                            photo.signedUrl = await this.getSignedUrl(photo.id);
                        } catch (error) {
                            console.error(
                                `Error getting signed URL for pathology photo ${photo.id}:`,
                                error,
                            );
                            photo.signedUrl = '/fallback-image.jpg';
                        }
                    }
                    return photo;
                }),
            );

            response.data.data = photosWithUrls;
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

            if (response.data.data && !response.data.data.signedUrl) {
                response.data.data.signedUrl = await this.getSignedUrl(id);
            }

            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async getSignedUrl(
        photoId: string,
        options?: GetSignedUrlOptions,
    ): Promise<string> {
        try {
            const response = await api.get(
                `/pathology-photos/${photoId}/signed-url`,
                {
                    signal: options?.signal,
                },
            );

            if (!response.data?.data.url) {
                throw new Error('Invalid response format from server');
            }

            return response.data.data.url;
        } catch (error) {
            const isCanceled =
                error instanceof Error &&
                (error.name === 'CanceledError' || error.name === 'AbortError');

            if (isCanceled) {
                throw error;
            }

            console.error(
                'Error getting signed URL for pathology photo:',
                error,
            );
            throw new Error('Error connecting to server');
        }
    },

    async delete(id: string): Promise<void> {
        try {
            await api.delete(API_ROUTES.PATHOLOGY_PHOTOS.DELETE({ id }));
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },
};
