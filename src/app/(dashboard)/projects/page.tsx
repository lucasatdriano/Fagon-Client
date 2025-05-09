import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/login');
    }

    return (
        <main className="h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold">Bem-vindo ao Dashboard</h1>
            <p className="text-gray-600 mt-2">Você está autenticado.</p>
        </main>
    );
}
