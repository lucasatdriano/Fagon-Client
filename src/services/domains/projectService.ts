import { api, extractAxiosError } from '../api';
import API_ROUTES from '../api/routes';
import { Pavement } from '@/interfaces/pavement';
import { PathologyProps } from '@/interfaces/pathology';
import { ApiResponse } from '@/types/api';
import { ProjectType, ProjectStatus } from '@/types/project';

export interface Project {
    id: string;
    name: string;
    upeCode: number;
    projectType: ProjectType;
    projectDate: string;
    status: string;
    structureType: string;
    inspectorName: string;
    inspectionDate: string;
    totalArea: string;
    maxHeight: string;
    createdAt: string;
    agency: {
        id: string;
        name: string;
        agencyNumber: string;
        cnpj: string;
        cep: string;
        state: string;
        city: string;
        district: string;
        street: string;
        number: string;
    };
    engineer: {
        id: string;
        name: string;
    };
    pavement: {
        id: string;
        pavement: string;
    };
}

interface PavementItem {
    pavement: string;
}

interface CreateProjectData {
    projectType: ProjectType;
    upeCode: number;
    pavements?: PavementItem[];
    agencyId: string;
    engineerId: string;
}

interface ListProjectsParams {
    status?: ProjectStatus;
    projectType?: ProjectType;
    agencyId?: string;
    engineerId?: string;
    page?: number;
    limit?: number;
}

export const ProjectService = {
    async create(data: CreateProjectData): Promise<ApiResponse<Project>> {
        try {
            const response = await api.post(API_ROUTES.PROJECTS.CREATE, data);
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async listAll(
        params?: ListProjectsParams,
    ): Promise<ApiResponse<Project[]>> {
        try {
            const response = await api.get(API_ROUTES.PROJECTS.BASE, {
                params,
            });
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async getById(id: string): Promise<ApiResponse<Project>> {
        try {
            const response = await api.get(API_ROUTES.PROJECTS.BY_ID({ id }));
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async update(
        id: string,
        data: Partial<CreateProjectData>,
    ): Promise<Project> {
        try {
            const response = await api.patch(
                API_ROUTES.PROJECTS.UPDATE({ id }),
                data,
            );
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async delete(id: string): Promise<void> {
        try {
            await api.delete(API_ROUTES.PROJECTS.DELETE({ id }));
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async getPavements(id: string): Promise<Pavement[]> {
        try {
            const response = await api.get(
                API_ROUTES.PROJECTS.PAVEMENTS({ id }),
            );
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async getPathologies(id: string): Promise<PathologyProps[]> {
        try {
            const response = await api.get(
                API_ROUTES.PROJECTS.PATHOLOGIES({ id }),
            );
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },
};
