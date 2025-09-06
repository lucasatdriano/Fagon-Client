import { agencyProps } from '@/interfaces/agency';
import { engineerProps } from '@/interfaces/engineer';
import { inspectorProps } from '@/interfaces/inspector';
import { Pathology } from '@/services/domains/pathologyService';
import { Project } from '@/services/domains/projectService';

interface ApiMetaPerformance {
    executionTimeMs: number;
    serverTimeMs: number;
}

interface ApiMetaRateLimit {
    limit: number;
    remaining: number;
    reset: number;
}

interface ApiMetaRequest {
    requestId: number;
    originIp: string;
    userAgent: string;
}

interface ApiMetaResource {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface ApiMeta {
    performance?: ApiMetaPerformance;
    rateLimit?: ApiMetaRateLimit;
    request?: ApiMetaRequest;
    resource?: ApiMetaResource;
}

export interface ApiResponse<T> {
    statusCode?: number;
    data: T;
    message?: string;
    meta?: ApiMeta;
    timestamp?: string;
    success?: boolean;
}

export interface AgenciesApiResponse {
    meta?: ApiMeta;
    agencies: agencyProps[];
}

export interface ProjectsApiResponse {
    meta?: ApiMeta;
    projects: Project[];
}

export interface EngineersApiResponse {
    meta?: ApiMeta;
    engineers: engineerProps[];
}

export interface InspectorsApiResponse {
    meta?: ApiMeta;
    inspectors: inspectorProps[];
}

export interface EngineersApiResponse {
    meta?: ApiMeta;
    engineers: engineerProps[];
}

export interface PathologiesApiResponse {
    meta?: ApiMeta;
    pathologies: Pathology[];
}
