import { ApiResponse } from '../../types/api';
import { api } from '../api';
import API_ROUTES from '../api/routes';

interface LoginData {
    email?: string;
    password?: string;
    accessKeyToken?: string;
}

export interface LoginResponse {
    access_token: string;
    projectId: string;
    user: {
        id: string;
        name: string;
        role: string;
        cameraType?: string;
    };
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
}

interface AccessKeyData {
    projectId: string;
    cameraType: string;
}

interface RevokeAccessKeyData {
    message: string;
}

export interface UserData {
    id: string;
    name: string;
    email?: string;
    role: string;
    cameraType?: string;
    status: boolean;
}

export const AuthService = {
    async getMe(): Promise<ApiResponse<UserData>> {
        try {
            const response = await api.get(API_ROUTES.AUTH.ME);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async login(loginData: LoginData) {
        try {
            const response = await api.post(API_ROUTES.AUTH.LOGIN, loginData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async register(registerData: RegisterData) {
        try {
            const response = await api.post(
                API_ROUTES.AUTH.REGISTER,
                registerData,
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async generateAccessKey(accessKeyData: AccessKeyData) {
        try {
            const response = await api.post(
                API_ROUTES.AUTH.ACCESS_KEYS,
                accessKeyData,
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async revokeAccessKey(
        accessKeyToken: string,
    ): Promise<ApiResponse<RevokeAccessKeyData>> {
        try {
            const response = await api.post(API_ROUTES.AUTH.REVOKE_ACCESS_KEY, {
                accessKeyToken,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
