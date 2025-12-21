import { locationType, surfaceType } from '../constants';

export type LocationType = (typeof locationType)[number]['value'];
export type SurfaceType = (typeof surfaceType)[number]['value'];
