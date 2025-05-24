import { agencyProps } from '@/interfaces/agency';
import { api, extractAxiosError } from '../api';
import API_ROUTES from '../api/routes';
import { engineerProps } from '@/interfaces/engineer';
import { Pavement } from '@/interfaces/pavement';
import { PathologyProps } from '@/interfaces/pathology';
import { projectStatus, projectType } from '@/constants';

type ProjectStatus = (typeof projectStatus)[number]['value'];
type ProjectType = (typeof projectType)[number]['value'];

interface Project {
    id: string;
    projectType: ProjectType;
    upeCode: number;
    status: string;
    structureType: string;
    inspectorName: string;
    inspectionDate: string;
    createdAt: string;
    agency: Record<string, agencyProps>;
    engineer: Record<string, engineerProps>;
}

interface CreateProjectData {
    projectType: ProjectStatus;
    upeCode: number;
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
    async create(data: CreateProjectData): Promise<Project> {
        try {
            const response = await api.post(API_ROUTES.PROJECTS.CREATE, data);
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async listAll(params?: ListProjectsParams): Promise<Project[]> {
        try {
            const response = await api.get(API_ROUTES.PROJECTS.BASE, {
                params,
            });
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async getById(id: string): Promise<Project> {
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
