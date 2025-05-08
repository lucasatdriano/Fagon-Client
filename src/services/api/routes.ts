export const ROUTES = {
    USERS: {
        GET_ALL: '/users',
        GET_BY_ID: (id: string) => `/users/${id}`,
        CREATE: '/users',
    },
    AUTH: {
        LOGIN: '/auth/login',
    },
};
