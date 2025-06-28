import { SurfaceType } from '@/types/location';

export interface MaterialFinishing {
    id: string;
    locationId: string;
    surface: SurfaceType;
    materialFinishing: string;
}
