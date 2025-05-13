'use client';

import Header from '@/components/layout/Header';
import { EditIcon, TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    const handleBack = () => {
        router.back();
    };

    const confirmDelete = () => {
        if (window.confirm('Tem certeza que deseja excluir este item?')) {
            console.log('Item excluído');
            router.push('/');
        }
    };

    return (
        <div className="w-full">
            <Header
                type="backMenu"
                onBack={handleBack}
                dropdownItems={[
                    {
                        label: 'Editar',
                        action: () => setIsEditing(true),
                        icon: <EditIcon size={16} />,
                    },
                    {
                        label: 'Excluir',
                        action: confirmDelete,
                        icon: <TrashIcon size={16} className="text-red-500" />,
                    },
                ]}
            />
            {children}
        </div>
    );
}
