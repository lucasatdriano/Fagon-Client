import { LocationType } from '../types/location';

export interface LocationProps {
    href: string;
    relative?: boolean;
    id: string;
    name: string;
    locationType: LocationType;
    pavement?: string;
    height?: number;
    hasPhotosSelected?: boolean;
    onDelete?: (id: string) => void;
    disabled?: boolean;
    isVisitor?: boolean;
}
