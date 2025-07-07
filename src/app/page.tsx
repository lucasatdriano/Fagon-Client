'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '../services/domains/authService';
import { Loader2Icon } from 'lucide-react';

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
        <div className="flex justify-center items-center h-screen w-screen">
            <Loader2Icon className="animate-spin w-16 h-16 text-primary" />
        </div>
    );
}
