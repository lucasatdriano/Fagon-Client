'use client';

import { Header } from '../../components/layout/Header';
import { useUserRole } from '../../hooks/useUserRole';
import { Loader2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import { useState, useEffect } from 'react';

export default function CreationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { loading, isVisitor } = useUserRole();
    const [isChecking, setIsChecking] = useState(true);

    const handleBack = () => {
        router.back();
    };

    useEffect(() => {
        if (!loading) {
            if (isVisitor && !window.location.pathname.includes('/locations')) {
                const cookies = parseCookies();
                const projectId = cookies.projectId;

                if (projectId) {
                    router.push(`/projects/${projectId}/locations`);
                } else {
                    router.push('/projects');
                }
            }
            setIsChecking(false);
        }
    }, [loading, isVisitor, router]);

    if (loading || isChecking) {
        return (
            <div className="flex justify-center items-center h-screen w-screen">
                <Loader2Icon className="animate-spin w-12 h-12 text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-svh w-full">
            <Header type="back" onBack={handleBack} />
            {children}
        </div>
    );
}
