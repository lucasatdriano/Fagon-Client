import { api, extractAxiosError } from '../api';
import API_ROUTES from '../api/routes';
import { ApiResponse } from '../../types/api';
import { GetSignedUrlOptions } from '@/interfaces/signedUrlOptions';
import { compressImages } from '@/utils/helpers/imageCompressor';

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

interface UploadProcessResponse {
    processId: string;
    message: string;
    fileCount: number;
    pathologyId: string;
    estimatedTime: string;
    status: string;
}

export const PathologyPhotosService = {
    async upload(
        pathologyId: string,
        files: File[],
        enableCompression: boolean = true,
        batchSize: number = 2,
    ): Promise<UploadProcessResponse[]> {
        try {
            const responses = [];

            for (let i = 0; i < files.length; i += batchSize) {
                const batch = files.slice(i, i + batchSize);

                const response = await this.uploadBatch(
                    pathologyId,
                    batch,
                    enableCompression,
                );

                responses.push(response);

                if (i + batchSize < files.length) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
            }

            return responses;
        } catch (error) {
            console.error('❌ Erro no upload das fotos de patologia:', error);
            throw new Error(extractAxiosError(error));
        }
    },

    async uploadBatch(
        pathologyId: string,
        files: File[],
        enableCompression: boolean = true,
    ): Promise<UploadProcessResponse> {
        try {
            let filesToUpload = files;

            if (enableCompression) {
                try {
                    filesToUpload = await compressImages(files, {
                        maxSizeMB: 2,
                        quality: 0.8,
                    });
                } catch (compressionError) {
                    console.warn(
                        'Compressão falhou, usando arquivos originais:',
                        compressionError,
                    );
                    filesToUpload = files;
                }
            }

            const formData = new FormData();
            filesToUpload.forEach((file) => {
                formData.append('files', file);
            });

            const response = await api.post(
                API_ROUTES.PATHOLOGY_PHOTOS.UPLOAD({ pathologyId }),
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    timeout: 30000,
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
        options?: GetSignedUrlOptions,
    ): Promise<ApiResponse<PathologyPhoto[]>> {
        try {
            const response = await api.get(
                API_ROUTES.PATHOLOGY_PHOTOS.BY_PATHOLOGY({ pathologyId }),
                {
                    params: { signed: includeSignedUrls },
                    signal: options?.signal,
                },
            );

            const photos = response.data.data || response.data;

            if (!includeSignedUrls) {
                return {
                    ...response.data,
                    data: photos,
                };
            }

            const photosWithUrls = await Promise.all(
                photos.map(async (photo: PathologyPhoto) => {
                    if (!photo.signedUrl) {
                        try {
                            photo.signedUrl = await this.getSignedUrl(
                                photo.id,
                                options,
                            );
                        } catch (error) {
                            console.error(
                                `Erro ao obter URL assinada para foto ${photo.id}:`,
                                error,
                            );
                            photo.signedUrl = '/fallback-image.jpg';
                        }
                    }
                    return photo;
                }),
            );

            return {
                ...response.data,
                data: photosWithUrls,
            };
        } catch (error) {
            console.error('❌ Erro ao listar fotos da patologia:', error);
            throw new Error(extractAxiosError(error));
        }
    },

    async getById(
        id: string,
        options?: GetSignedUrlOptions,
    ): Promise<ApiResponse<PathologyPhoto>> {
        try {
            const response = await api.get(
                API_ROUTES.PATHOLOGY_PHOTOS.BY_ID({ id }),
                {
                    signal: options?.signal,
                },
            );

            if (response.data.data && !response.data.data.signedUrl) {
                response.data.data.signedUrl = await this.getSignedUrl(
                    id,
                    options,
                );
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
                API_ROUTES.PATHOLOGY_PHOTOS.SIGNED_URL({ id: photoId }),
                { signal: options?.signal },
            );

            if (!response.data?.data?.url) {
                throw new Error('Formato de resposta inválido do servidor');
            }

            return response.data.data.url;
        } catch (error) {
            const isCanceled =
                error instanceof Error &&
                (error.name === 'CanceledError' || error.name === 'AbortError');

            if (isCanceled) {
                throw error;
            }

            console.error('Erro ao obter URL assinada:', error);
            throw new Error('Erro ao conectar ao servidor');
        }
    },

    async rotatePhoto(
        photoId: string,
        rotation: number,
    ): Promise<ApiResponse<PathologyPhoto>> {
        try {
            const response = await api.put(
                API_ROUTES.PATHOLOGY_PHOTOS.ROTATE({ id: photoId }),
                { rotation },
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
};
