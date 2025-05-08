import { api } from '../api';
import { ROUTES } from '../api/routes';

export async function getUserById(id: string) {
    const { data } = await api.get(ROUTES.USERS.GET_BY_ID(id));
    return data;
}
