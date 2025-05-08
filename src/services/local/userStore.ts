import { db } from './db';

export async function saveUser(user: { id: string; name: string }) {
    const database = await db;
    return database.put('users', user);
}

export async function getUser(id: string) {
    const database = await db;
    return database.get('users', id);
}
