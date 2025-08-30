'use client';

import { useEffect, useState } from 'react';
import { Header } from '../../../components/layout/Header';
import { SearchProvider } from '../../../contexts/SearchContext';
import { useUserRole } from '../../../hooks/useUserRole';
import { Loader2Icon } from 'lucide-react';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState('');
    const { loading, isVisitor } = useUserRole();
    const [isChecking, setIsChecking] = useState(true);

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
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
            <div className="flex justify-center items-center h-svh w-screen">
                <Loader2Icon className="animate-spin w-12 h-12 text-primary" />
            </div>
        );
    }

    return (
        <SearchProvider value={{ searchValue, handleSearchChange }}>
            <div className="min-h-svh w-full flex flex-col md:flex-row overflow-x-hidden">
                <div className="flex-1  md:w-[calc(100%-8rem)]">
                    <Header
                        type="searchWithButtonLocalizationInspector"
                        hasSidebar
                        onSearchChange={handleSearchChange}
                    />
                    {children}
                </div>
            </div>
        </SearchProvider>
    );
}
