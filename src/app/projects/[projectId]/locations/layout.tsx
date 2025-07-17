'use client';

import { Header } from '../../../../components/layout/Header';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUserRole } from '../../../../hooks/useUserRole';
import { Loader2Icon } from 'lucide-react';

export default function CreationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const params = useParams();
    const { loading, isVisitor } = useUserRole();
    const [headerType, setHeaderType] = useState<'back' | 'default'>('back');

    useEffect(() => {
        if (loading) return;

        const checkPermissions = async () => {
            if (isVisitor) {
                setHeaderType('default');
                return;
            }
        };

        checkPermissions();
    }, [loading, isVisitor]);

    const handleBack = () => {
        const projectId = params?.projectId as string;
        router.push(`/projects/${projectId}`);
    };

    if (loading) {
        <div className="flex justify-center items-center h-screen w-screen">
            <Loader2Icon className="animate-spin h-12 w-12 text-primary" />
        </div>;
    }

    return (
        <div className="w-full">
            <Header type={headerType} onBack={handleBack} />
            {children}
        </div>
    );
}
