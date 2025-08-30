import { api, extractAxiosError } from '../api';
import API_ROUTES from '../api/routes';
import { ApiResponse } from '../../types/api';
import { agencyProps } from '@/interfaces/agency';
import { inspectorProps } from '@/interfaces/inspector';

export interface DistanceResult {
    distance: number;
    duration: number;
    status: string;
}

export interface ApproximateDistanceResult {
    distance: number;
    method: string;
}

interface CalculateDistanceData {
    origin: string;
    destination: string;
}

interface ApproximateDistanceData {
    agency: agencyProps;
    inspector: inspectorProps;
}

interface BatchDistanceData {
    agencies: agencyProps[];
    inspectors: inspectorProps[];
}

export const DistanceService = {
    async calculateDistance(
        data: CalculateDistanceData,
    ): Promise<ApiResponse<DistanceResult>> {
        try {
            const response = await api.post(
                API_ROUTES.DISTANCE.CALCULATE,
                data,
            );
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async calculateApproximateDistance(
        data: ApproximateDistanceData,
    ): Promise<ApiResponse<ApproximateDistanceResult>> {
        try {
            const response = await api.post(API_ROUTES.DISTANCE.APPROXIMATE, {
                agency: data.agency,
                inspector: data.inspector,
            });
            return response.data;
        } catch (error) {
            console.error('Error details:', error);
            throw new Error(extractAxiosError(error));
        }
    },

    async calculateBatchDistances(
        data: BatchDistanceData,
    ): Promise<ApiResponse<Map<string, ApproximateDistanceResult[]>>> {
        try {
            const response = await api.post(API_ROUTES.DISTANCE.BATCH, data);

            if (response.data.data && typeof response.data.data === 'object') {
                const mapData = new Map(Object.entries(response.data.data));
                return {
                    ...response.data,
                    data: mapData,
                };
            }

            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async calculateDistanceDirect(
        origin: string,
        destination: string,
    ): Promise<DistanceResult> {
        try {
            const response = await this.calculateDistance({
                origin,
                destination,
            });
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async calculateApproximateDistanceDirect(
        agency: agencyProps,
        inspector: inspectorProps,
    ): Promise<ApproximateDistanceResult> {
        try {
            const response = await this.calculateApproximateDistance({
                agency,
                inspector,
            });
            return response.data;
        } catch {
            return {
                distance: Math.random() * 100 + 20,
                method: 'fallback_direct',
            };
        }
    },
};
