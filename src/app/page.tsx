'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/domains/authService';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                console.log('Tentando AuthService.getMe()...');
                await AuthService.getMe();
                console.log('Autenticado! Redirecionando para /projects');
                router.push('/projects');
            } catch (error) {
                console.error('Usuário não autenticado:', error);
                router.push('/login');
            }
        };

        checkAuth();
    }, [router]);

    return (
        <div className="grid items-center h-screen w-full">
            Redirecionando...
        </div>
    );
}
