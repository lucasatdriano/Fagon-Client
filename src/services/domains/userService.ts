import { api, extractAxiosError } from '../api';
import API_ROUTES from '../api/routes';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'funcionario' | 'vistoriador';
    status: boolean;
    cameraType: string;
    createdAt: string;
    updatedAt: string;
}

interface ListUserParams {
    status?: boolean;
}

interface SearchUserParams {
    name?: string;
    email?: string;
    role?: 'admin' | 'funcionario' | 'vistoriador';
    status?: boolean;
}

interface UpdateUserData {
    name?: string;
    email?: string;
    password?: string;
    role?: 'admin' | 'funcionario' | 'vistoriador';
    status?: boolean;
}

export const UserService = {
    async listAll(params?: ListUserParams): Promise<User[]> {
        try {
            const response = await api.get(API_ROUTES.USERS.BASE, {
                params: params,
            });
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async search(params: SearchUserParams): Promise<User[]> {
        try {
            const response = await api.get(API_ROUTES.USERS.SEARCH, {
                params: params,
            });
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async getById(id: string): Promise<User> {
        try {
            const response = await api.get(API_ROUTES.USERS.BY_ID({ id }));
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async update(id: string, data: UpdateUserData): Promise<User> {
        try {
            const response = await api.patch(
                API_ROUTES.USERS.UPDATE({ id }),
                data,
            );
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async delete(id: string): Promise<void> {
        try {
            await api.delete(API_ROUTES.USERS.DELETE({ id }));
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },
};
