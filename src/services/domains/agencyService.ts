import { CreateAgencyFormValues } from '@/validations';
import { api, extractAxiosError } from '../api';
import API_ROUTES from '../api/routes';
import { agencyProps } from '@/interfaces/agency';

interface ListAgenciesParams {
    page?: number;
    limit?: number;
}

interface SearchAgenciesParams {
    name?: string;
    agencyNumber?: string;
    state?: string;
    city?: string;
    district?: string;
}

export const AgencyService = {
    async create(data: CreateAgencyFormValues): Promise<agencyProps> {
        try {
            const response = await api.post(API_ROUTES.AGENCIES.CREATE, data);
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async listAll(
        params?: ListAgenciesParams,
    ): Promise<{ data: agencyProps[] }> {
        try {
            const response = await api.get(API_ROUTES.AGENCIES.BASE, {
                params: params,
            });
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async search(params: SearchAgenciesParams): Promise<agencyProps[]> {
        try {
            const cleanedParams = Object.fromEntries(
                Object.entries(params).filter(
                    ([value]) =>
                        value !== undefined && value !== null && value !== '',
                ),
            );

            const response = await api.get(API_ROUTES.AGENCIES.SEARCH, {
                params: cleanedParams,
            });
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async getById(id: string): Promise<agencyProps> {
        try {
            const response = await api.get(API_ROUTES.AGENCIES.BY_ID({ id }));
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async update(
        id: string,
        data: Partial<CreateAgencyFormValues>,
    ): Promise<agencyProps> {
        try {
            const response = await api.patch(
                API_ROUTES.AGENCIES.UPDATE({ id }),
                data,
            );
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async delete(id: string): Promise<void> {
        try {
            await api.delete(API_ROUTES.AGENCIES.DELETE({ id }));
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },
};
