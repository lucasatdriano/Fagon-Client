import { Photo } from '../../interfaces/photo';
import { api, extractAxiosError } from '../api';
import API_ROUTES from '../api/routes';
import { ApiResponse } from '../../types/api';

export interface UpdatePhotoData {
    locationId?: string;
    filePath?: string;
    selectedForPdf: boolean;
}

export interface GetSignedUrlOptions {
    signal?: AbortSignal;
}

export const PhotoService = {
    async upload(
        locationId: string,
        files: File[],
    ): Promise<ApiResponse<Photo[]>> {
        try {
            const formData = new FormData();

            files.forEach((file) => {
                formData.append(
                    'files',
                    file,
                    file.name || `photo-${Date.now()}.jpg`,
                );
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

    async listByLocation(
        locationId: string,
        includeSignedUrls = true,
        options?: GetSignedUrlOptions,
    ): Promise<ApiResponse<Photo[]>> {
        try {
            const response = await api.get(
                API_ROUTES.PHOTOS.BY_LOCATION({ locationId }),
                {
                    params: {
                        signed: includeSignedUrls,
                    },
                    signal: options?.signal,
                },
            );

            if (!includeSignedUrls) return response.data;

            const photos = response.data.data || response.data;

            const photosWithUrls = await Promise.all(
                photos.map(async (photo: Photo) => {
                    if (!photo.signedUrl) {
                        try {
                            photo.signedUrl = await this.getSignedUrl(
                                photo.id || '',
                                options,
                            );
                        } catch (error) {
                            console.error(
                                `Error getting signed URL for photo ${photo.id}:`,
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

    async rotatePhoto(
        photoId: string,
        rotation: number,
    ): Promise<ApiResponse<Photo>> {
        try {
            const response = await api.put(
                API_ROUTES.PHOTOS.ROTATE({ id: photoId }),
                { rotation },
            );
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
                API_ROUTES.PHOTOS.SIGNED_URL({ id: photoId }),
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

            console.error('Error getting signed URL:', error);
            throw new Error('Error connecting to server');
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
