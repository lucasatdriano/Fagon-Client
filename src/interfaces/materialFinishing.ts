import { SurfaceTypes } from '../types/location';

export interface MaterialFinishing {
    id: string;
    locationId: string;
    surface: SurfaceTypes;
    materialFinishing: string;
}
