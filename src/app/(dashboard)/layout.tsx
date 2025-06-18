'use client';
import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import SidebarNav from '@/components/layout/SidebarNav';
import { SearchProvider } from '@/contexts/SearchContext';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = (value: string) => {
        console.log('Search value updated:', value);
        setSearchValue(value);
    };

    return (
        <SearchProvider value={{ searchValue, handleSearchChange }}>
            <div className="min-h-screen w-full flex flex-col md:flex-row overflow-x-hidden">
                <SidebarNav />

                <div className="flex-1 md:ml-32 md:w-[calc(100%-8rem)]">
                    <Header type="search" onSearchChange={handleSearchChange} />

                    {children}
                </div>

                <BottomNav />
            </div>
        </SearchProvider>
    );
}
