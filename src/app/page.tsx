'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/domains/authService';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await AuthService.getMe();
                router.push('/projects');
            } catch (error) {
                console.error('Usuário não autenticado:', error);
                router.push('/login');
            }
        };

        checkAuth();
    }, [router]);

    return null;
}
