'use client';

import { Header } from '../../../../../../components/layout/Header';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LocationService } from '../../../../../../services/domains/locationService';
import { useUserRole } from '../../../../../../hooks/useUserRole';
import { Loader2Icon } from 'lucide-react';

export default function CreationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const params = useParams();
    const { loading, isVisitor } = useUserRole();
    const [headerType, setHeaderType] = useState<'back' | 'default'>('default');

    useEffect(() => {
        if (loading) return;

        const checkPermissions = async () => {
            if (!isVisitor) {
                setHeaderType('back');
                return;
            }

            setHeaderType('default');

            const locationId = params?.locationId as string;
            if (!locationId) return;

            try {
                const response = await LocationService.getById(locationId);
                const hasData =
                    response.data?.photo?.length >= 5 &&
                    response.data?.materialFinishing?.length > 1;
                if (hasData) setHeaderType('back');
            } catch (error) {
                console.error('Erro ao buscar location:', error);
            }
        };

        checkPermissions();
    }, [loading, isVisitor, params?.locationId]);

    const handleBack = () => {
        const projectId = params?.projectId as string;
        router.push(`/projects/${projectId}/locations`);
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
