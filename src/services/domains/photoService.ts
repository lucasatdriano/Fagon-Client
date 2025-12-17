import { Photo } from '../../interfaces/photo';
import { api, extractAxiosError } from '../api';
import API_ROUTES from '../api/routes';
import { ApiResponse } from '../../types/api';
import {
    compressImages,
    DEFAULT_COMPRESSION_OPTIONS,
} from '@/utils/helpers/imageCompressor';

export interface UpdatePhotoData {
    locationId?: string;
    filePath?: string;
    selectedForPdf: boolean;
}

export interface GetSignedUrlOptions {
    signal?: AbortSignal;
}

export interface UploadProcessResponse {
    processId: string;
    message: string;
    fileCount: number;
    locationId: string;
    estimatedTime: string;
    status: string;
}

export interface UploadStatusResponse {
    status: string;
    progress: { completed: number; total: number; percentage: number };
    message: string;
    results?: Array<{
        id: string;
        name: string;
        filePath: string;
        photoNumber: number;
        locationName: string;
        sizeKB: number;
    }>;
    errors?: Array<{
        photoIndex: number;
        fileName: string;
        error: string;
    }>;
}

export const PhotoService = {
    async upload(
        locationId: string,
        files: File[],
        enableCompression: boolean = true,
    ): Promise<UploadProcessResponse> {
        try {
            console.log('📸 Iniciando upload de', files.length, 'fotos');

            const originalTotalMB =
                files.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024;
            console.log(
                `📊 Tamanho total original: ${originalTotalMB.toFixed(2)}MB`,
            );

            let filesToUpload = files;

            if (enableCompression) {
                console.log('🔧 Aplicando compressão...');
                try {
                    filesToUpload = await compressImages(files, {
                        ...DEFAULT_COMPRESSION_OPTIONS,
                        maxSizeMB: 2,
                    });

                    const compressedTotalMB =
                        filesToUpload.reduce((sum, f) => sum + f.size, 0) /
                        1024 /
                        1024;
                    console.log(
                        `✅ Compressão aplicada: ${compressedTotalMB.toFixed(
                            2,
                        )}MB (${(
                            (compressedTotalMB / originalTotalMB) *
                            100
                        ).toFixed(1)}% do original)`,
                    );
                } catch (compressionError) {
                    console.warn(
                        '⚠️ Compressão falhou, usando arquivos originais:',
                        compressionError,
                    );
                    filesToUpload = files;
                }
            }

            const formData = new FormData();
            filesToUpload.forEach((file, index) => {
                formData.append(
                    'files',
                    file,
                    file.name || `photo-${Date.now()}-${index}.jpg`,
                );
            });

            console.log('🚀 Enviando para API...');

            const response = await api.post(
                API_ROUTES.PHOTOS.UPLOAD({ locationId }),
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    timeout: 30000,
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const percent = Math.round(
                                (progressEvent.loaded * 100) /
                                    progressEvent.total,
                            );
                            const loadedMB = (
                                progressEvent.loaded /
                                1024 /
                                1024
                            ).toFixed(2);
                            const totalMB = (
                                progressEvent.total /
                                1024 /
                                1024
                            ).toFixed(2);
                            console.log(
                                `📤 Upload: ${percent}% (${loadedMB}MB de ${totalMB}MB)`,
                            );
                        }
                    },
                },
            );

            console.log('✅ Upload aceito para processamento');
            return response.data;
        } catch (error) {
            console.error('❌ Erro no upload:', error);
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
                    params: { signed: includeSignedUrls },
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
                { signal: options?.signal },
            );

            if (!response.data?.data.url) {
                throw new Error('Invalid response format from server');
            }

            return response.data.data.url;
        } catch (error) {
            const isCanceled =
                error instanceof Error &&
                (error.name === 'CanceledError' || error.name === 'AbortError');

            if (isCanceled) throw error;

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
