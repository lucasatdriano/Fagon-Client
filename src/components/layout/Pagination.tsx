'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    maxVisiblePages?: number;
}

export function Pagination({
    currentPage,
    totalPages,
    maxVisiblePages = 5,
}: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        router.push(`?${params.toString()}`);
    };

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i,
    );

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                title="Página anterior"
                className={`flex items-center justify-center p-2 h-9 w-9 rounded-md border ${
                    currentPage === 1
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-100'
                }`}
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
            >
                <ChevronLeft className="h-4 w-4" />
            </button>

            {startPage > 1 && (
                <>
                    <button
                        title={`Ir para página 1`}
                        className={`flex items-center justify-center p-2 h-9 w-9 rounded-md border ${
                            currentPage === 1
                                ? 'bg-primary text-white'
                                : 'hover:bg-gray-100'
                        }`}
                        onClick={() => handlePageChange(1)}
                    >
                        1
                    </button>
                    {startPage > 2 && <span className="px-2">...</span>}
                </>
            )}

            {pages.map((page) => (
                <button
                    key={page}
                    title={`Ir para página ${page}`}
                    className={`flex items-center justify-center p-2 h-9 w-9 rounded-md border ${
                        currentPage === page
                            ? 'bg-primary text-white'
                            : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handlePageChange(page)}
                >
                    {page}
                </button>
            ))}

            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && (
                        <span className="px-2">...</span>
                    )}
                    <button
                        title={`Ir para página ${totalPages} (última página)`}
                        className={`flex items-center justify-center p-2 h-9 w-9 rounded-md border ${
                            currentPage === totalPages
                                ? 'bg-primary text-white'
                                : 'hover:bg-gray-100'
                        }`}
                        onClick={() => handlePageChange(totalPages)}
                    >
                        {totalPages}
                    </button>
                </>
            )}

            <button
                title="Próxima página"
                className={`flex items-center justify-center p-2 h-9 w-9 rounded-md border ${
                    currentPage === totalPages
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-100'
                }`}
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    );
}
