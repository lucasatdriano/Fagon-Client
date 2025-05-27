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
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
    meta?: ApiMeta;
    timestamp?: string;
}
