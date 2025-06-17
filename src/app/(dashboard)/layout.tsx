'use client';

import SidebarNav from '@/components/layout/SidebarNav';
import BottomNav from '@/components/layout/BottomNav';
import { Header } from '@/components/layout/Header';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const handleSearchChange = debounce((value: string) => {
        setSearchValue(value);
    }, 500);

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row overflow-x-hidden">
            <SidebarNav />

            <div className="flex-1 md:ml-32 md:w-[calc(100%-8rem)]">
                <Header
                    type="search"
                    hasSidebar={true}
                    searchValue={searchValue}
                    onSearchChange={handleSearchChange}
                />{' '}
                {children}
            </div>

            <BottomNav />
        </div>
    );
}
