'use client';

import { useRouter, useParams } from 'next/navigation';
import { MoreVerticalIcon } from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { InspectorDropdownMenu } from '@/components/dropdownMenus/InspectorDropdownMenu';
import { parseCookies } from 'nookies';

export default function ProjectLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { inspectorId } = useParams();
    const id = inspectorId as string;

    // Recuperar o ID da agência dos cookies
    const cookies = parseCookies();
    const agencyId = cookies.selectedAgencyId;

    const handleBack = () => {
        router.push('/inspectors');
    };

    return (
        <div className="w-full">
            <Header
                type="backMenu"
                onBack={handleBack}
                dropdownMenu={
                    <InspectorDropdownMenu
                        trigger={
                            <button
                                className="hover:bg-gray-500/10 p-2 rounded-full transition-all duration-200"
                                aria-label="Menu de opções"
                            >
                                <MoreVerticalIcon className="w-6 h-6" />
                            </button>
                        }
                        inspectorId={id}
                        agencyId={agencyId}
                    />
                }
            />
            {children}
        </div>
    );
}
