'use client';

import { Header } from '../../components/layout/Header';
import { useRouter } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const handleBack = () => {
        router.push('/engineers');
    };

    return (
        <div className="w-full">
            <Header type="back" onBack={handleBack} />
            {children}
        </div>
    );
}
