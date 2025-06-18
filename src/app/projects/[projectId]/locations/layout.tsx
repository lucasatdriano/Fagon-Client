'use client';

import { Header } from '@/components/layout/Header';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { LocationService } from '@/services/domains/locationService';

export default function CreationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const params = useParams();
    const { isVisitor } = useUserRole();

    const [canShowBack, setCanShowBack] = useState(true);

    useEffect(() => {
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
            <Header type="back" onBack={canShowBack ? handleBack : undefined} />
            {children}
        </div>
    );
}
