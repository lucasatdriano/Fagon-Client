import { api, extractAxiosError } from '../api';
import API_ROUTES from '../api/routes';
import { ApiResponse } from '@/types/api';
import { Location } from './locationService';
import { Project } from './projectService';
import { PathologyPhoto } from './pathologyPhotoService';

export interface Pathology {
    id: string;
    referenceLocation: string;
    title: string;
    description: string;
    recordDate: string;
    project: Project;
    location: Location;
    pathologyPhoto?: PathologyPhoto[];
}

export type CreatePathologyData =
    | {
          projectId: string;
          locationId: string;
          referenceLocation: string;
          title: string;
          description: string;
          photos: File[];
      }
    | FormData;

export interface ListPathologiesParams {
    projectId?: string;
}

export interface SearchPathologiesParams {
    title?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
}

export const PathologyService = {
    async create(data: CreatePathologyData): Promise<ApiResponse<Pathology>> {
        try {
            const response = await api.post(
                API_ROUTES.PATHOLOGIES.CREATE,
                data,
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

    async listAll(
        params?: ListPathologiesParams,
    ): Promise<ApiResponse<Pathology[]>> {
        try {
            const response = await api.get(API_ROUTES.PATHOLOGIES.BASE, {
                params,
            });
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async search(
        params: SearchPathologiesParams,
    ): Promise<ApiResponse<Pathology[]>> {
        try {
            const response = await api.get(API_ROUTES.PATHOLOGIES.SEARCH, {
                params,
            });
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async getById(id: string): Promise<ApiResponse<Pathology>> {
        try {
            const response = await api.get(
                API_ROUTES.PATHOLOGIES.BY_ID({ id }),
            );
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async update(
        id: string,
        data: Partial<CreatePathologyData>,
    ): Promise<ApiResponse<Pathology>> {
        try {
            const response = await api.patch(
                API_ROUTES.PATHOLOGIES.UPDATE({ id }),
                data,
            );
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async delete(id: string): Promise<void> {
        try {
            await api.delete(API_ROUTES.PATHOLOGIES.DELETE({ id }));
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },
};
