type Params = {
    id?: string;
    userId?: string;
    projectId?: string;
    pavementId?: string;
    locationId?: string;
    pathologyId?: string;
};

const API_ROUTES = {
    METRICS: '/metrics',

    AUTH: {
        ME: '/auth/me',
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        ACCESS_KEYS: '/auth/access-keys',
        REVOKE_ACCESS_KEY: '/auth/access-keys/revoke',
    },

    LOGS: {
        BASE: '/logs',
        SEARCH: '/logs/search',
        USER_LOGS: ({ userId }: Params) => `/logs/user/${userId}`,
    },

    USERS: {
        BASE: '/users',
        SEARCH: '/users/search',
        BY_ID: ({ id }: Params) => `/users/${id}`,
        UPDATE: ({ id }: Params) => `/users/${id}`,
        DELETE: ({ id }: Params) => `/users/${id}`,
    },

    AGENCIES: {
        BASE: '/agencies',
        SEARCH: '/agencies/search',
        CREATE: '/agencies',
        BY_ID: ({ id }: Params) => `/agencies/${id}`,
        UPDATE: ({ id }: Params) => `/agencies/${id}`,
        DELETE: ({ id }: Params) => `/agencies/${id}`,
    },

    ENGINEERS: {
        BASE: '/engineers',
        SEARCH: '/engineers/search',
        CREATE: '/engineers',
        BY_ID: ({ id }: Params) => `/engineers/${id}`,
        UPDATE: ({ id }: Params) => `/engineers/${id}`,
        DELETE: ({ id }: Params) => `/engineers/${id}`,
    },

    PROJECTS: {
        BASE: '/projects',
        SEARCH: '/projects/search',
        CREATE: '/projects',
        BY_ID: ({ id }: Params) => `/projects/${id}`,
        UPDATE: ({ id }: Params) => `/projects/${id}`,
        DELETE: ({ id }: Params) => `/projects/${id}`,
        PAVEMENTS: ({ id }: Params) => `/projects/${id}/pavements`,
        PATHOLOGIES: ({ id }: Params) => `/projects/${id}/pathologies`,
    },

    LOCATIONS: {
        BASE: '/locations',
        CREATE: '/locations',
        BY_PROJECT: ({ projectId }: Params) =>
            `/locations/project/${projectId}`,
        BY_PAVEMENT: ({ pavementId }: Params) =>
            `/locations/pavement/${pavementId}`,
        BY_ID: ({ id }: Params) => `/locations/${id}`,
        UPDATE: ({ id }: Params) => `/locations/${id}`,
        DELETE: ({ id }: Params) => `/locations/${id}`,
    },

    MATERIAL_FINISHINGS: {
        BASE: '/material-finishings',
        CREATE: '/material-finishings',
        BY_LOCATION: ({ locationId }: Params) =>
            `/material-finishings/location/${locationId}`,
        BY_ID: ({ id }: Params) => `/material-finishings/${id}`,
        UPDATE: ({ id }: Params) => `/material-finishings/${id}`,
        DELETE: ({ id }: Params) => `/material-finishings/${id}`,
    },

    PATHOLOGIES: {
        BASE: '/pathologies',
        SEARCH: '/pathologies/search',
        CREATE: '/pathologies',
        BY_ID: ({ id }: Params) => `/pathologies/${id}`,
        UPDATE: ({ id }: Params) => `/pathologies/${id}`,
        DELETE: ({ id }: Params) => `/pathologies/${id}`,
    },

    PATHOLOGY_PHOTOS: {
        UPLOAD: ({ pathologyId }: Params) =>
            `/pathology-photos/upload/${pathologyId}`,
        BY_ID: ({ id }: Params) => `/pathology-photos/${id}`,
        SIGNED_URL: ({ id }: Params) => `/pathology-photos/${id}/signed-url`,
        BY_PATHOLOGY: ({ pathologyId }: Params) =>
            `/pathology-photos/pathology/${pathologyId}`,
        DELETE: ({ id }: Params) => `/pathology-photos/${id}`,
    },

    PAVEMENTS: {
        BASE: '/pavements',
        CREATE: '/pavements',
        BY_PROJECT: ({ projectId }: Params) =>
            `/pavements/project/${projectId}`,
        BY_ID: ({ id }: Params) => `/pavements/${id}`,
        UPDATE: ({ id }: Params) => `/pavements/${id}`,
        DELETE: ({ id }: Params) => `/pavements/${id}`,
    },

    PHOTOS: {
        UPLOAD: ({ locationId }: Params) => `/photos/upload/${locationId}`,
        BY_LOCATION: ({ locationId }: Params) =>
            `/photos/location/${locationId}`,
        SIGNED_URL: ({ id }: Params) => `/photos/${id}/signed-url`,
        UPDATE: ({ id }: Params) => `/photos/${id}`,
        DELETE: ({ id }: Params) => `/photos/${id}`,
        ROTATE: ({ id }: Params) => `/photos/${id}/rotate`,
    },

    PDFS: {
        BASE: '/pdfs',
        GENERATE: '/pdfs',
        SIGN: ({ id }: Params) => `/pdfs/${id}/sign`,
        BY_PROJECT: ({ projectId }: Params) => `/pdfs/project/${projectId}`,
        BY_ID: ({ id }: Params) => `/pdfs/${id}`,
        SIGNED_URL: ({ id }: Params) => `/pdfs/${id}/signed-url`,
        DOWNLOAD: ({ id }: Params) => `/pdfs/${id}/download`,
        DELETE: ({ id }: Params) => `/pdfs/${id}`,
    },

    STATE_LAWS: {
        BASE: '/state-laws',
        CREATE: '/state-laws',
        BY_ID: ({ id }: Params) => `/state-laws/${id}`,
        UPDATE: ({ id }: Params) => `/state-laws/${id}`,
        DELETE: ({ id }: Params) => `/state-laws/${id}`,
    },
};

export default API_ROUTES;
