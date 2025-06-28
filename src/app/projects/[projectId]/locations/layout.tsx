'use client';

import { Header } from '@/components/layout/Header';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LocationService } from '@/services/domains/locationService';
import { useUserRole } from '@/hooks/useUserRole';

export default function CreationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const params = useParams();
    const { loading, isVisitor } = useUserRole();
    const [canShowBack, setCanShowBack] = useState(true);
    const [headerType, setHeaderType] = useState<'back' | 'default'>('back');

    useEffect(() => {
        if (loading) return; // Aguarda o carregamento do role

        const checkPermissions = async () => {
            // Define o tipo de header baseado no role
            if (isVisitor) {
                setHeaderType('default');
                return;
            }

            // Verifica as fotos apenas para não-visitantes
            const locationId = params?.locationId as string;
            if (!locationId) return;

            try {
                const response = await LocationService.getById(locationId);
                const hasPhotos = response.data?.photo?.length > 0;
                setCanShowBack(hasPhotos);
            } catch (error) {
                console.error('Erro ao buscar location:', error);
                setCanShowBack(false);
            }
        };

        checkPermissions();
    }, [loading, isVisitor, params?.locationId]);

    const handleBack = () => {
        router.back();
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="w-full">
            <Header
                type={headerType}
                onBack={
                    headerType === 'back' && canShowBack
                        ? handleBack
                        : undefined
                }
            />
            {children}
        </div>
    );
}
