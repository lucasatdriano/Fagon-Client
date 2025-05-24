import { api, extractAxiosError } from '../api';
import API_ROUTES from '../api/routes';

interface LoginData {
    email?: string;
    password?: string;
    accessKeyToken?: string;
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

export const AuthService = {
    async login(loginData: LoginData) {
        try {
            const response = await api.post(API_ROUTES.AUTH.LOGIN, loginData);
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
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
            throw new Error(extractAxiosError(error));
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
            throw new Error(extractAxiosError(error));
        }
    },
};
