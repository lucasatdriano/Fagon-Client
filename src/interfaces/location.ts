import { locationType } from '@/constants/locationType';

type LocationType = (typeof locationType)[number]['value'];

export interface LocationProps {
    id: string;
    name: string;
    locationType: LocationType;
    pavement?: string;
    height?: number;
    hasPhotosSelected?: boolean;
}
