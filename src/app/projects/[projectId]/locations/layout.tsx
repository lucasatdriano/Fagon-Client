'use client';

import { Header } from '@/components/layout/Header';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { LocationService } from '@/services/domains/locationService';
import { parseCookies } from 'nookies';

export default function CreationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const params = useParams();
    const { isVisitor } = useUserRole();
    const [canShowBack, setCanShowBack] = useState(true);
    const [headerType, setHeaderType] = useState<'back' | 'default'>('back');

    useEffect(() => {
        const cookies = parseCookies();
        const userRole = cookies.role;

        if (userRole === 'vistoriador') {
            setHeaderType('default');
            return;
        }

        // Se não for vistoriador, mantém a lógica original
        const checkIfCanShowBack = async () => {
            if (!isVisitor) return;

            const locationId = params?.locationId as string;
            if (!locationId) return;

            try {
                const response = await LocationService.getById(locationId);
                const hasPhotos = response.data?.photo?.length > 0;

                if (!hasPhotos) {
                    setCanShowBack(false);
                }
            } catch (error) {
                console.error('Erro ao buscar location:', error);
            }
        };

        checkIfCanShowBack();
    }, [isVisitor, params]);

    const handleBack = () => {
        router.back();
    };

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
