import { AuthService } from '@/services/domains/authService';
import { redirect } from 'next/navigation';

export default async function Home() {
    try {
        await AuthService.getMe();
        redirect('/projects');
    } catch (error) {
        console.error('Usuário não autenticado:', error);
        redirect('/login');
    }
}
