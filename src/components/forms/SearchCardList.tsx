'use client';

import { LandmarkIcon, Loader2Icon, SearchIcon } from 'lucide-react';
import { CustomFormInput } from './CustomFormInput';
import { useState, useEffect } from 'react';
import { agencyProps } from '../../interfaces/agency';
import { formatNumberAgency } from '../../utils/formatters/formatNumberAgency';
import { AgencyService } from '../../services/domains/agencyService';
import { AgenciesApiResponse, ApiResponse } from '@/types/api';
import { ITEMS_PER_PAGE } from '@/constants/pagination';
import { useSearchParams } from 'next/navigation';
import { Pagination } from '@/components/layout/Pagination';

interface SearchCardListProps {
    onSelectAgency: (agency: agencyProps) => void;
}

export function SearchCardList({ onSelectAgency }: SearchCardListProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<agencyProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(
        null,
    );
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        totalPages: 1,
    });
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    useEffect(() => {
        const searchAgencies = async () => {
            setIsLoading(true);
            try {
                let response: ApiResponse<AgenciesApiResponse>;

                if (query.trim() === '') {
                    response = await AgencyService.listAll({
                        page: currentPage,
                        limit: ITEMS_PER_PAGE,
                    });
                    const newAgencies = response.data.agencies;
                    setResults(newAgencies);
                    setPagination({
                        total: response.data.meta?.resource?.total || 0,
                        page: currentPage,
                        totalPages:
                            response.data.meta?.resource?.totalPages || 1,
                    });
                } else {
                    const searchParams = {
                        name: query,
                        agencyNumber: !isNaN(Number(query))
                            ? Number(query)
                            : undefined,
                        state: query,
                        city: query,
                        district: query,
                        page: currentPage,
                        limit: ITEMS_PER_PAGE,
                    };

                    const cleanedParams = Object.fromEntries(
                        Object.entries(searchParams).filter(
                            ([, value]) => value !== undefined,
                        ),
                    );

                    response = await AgencyService.search(cleanedParams);
                    const newAgencies = response.data.agencies;
                    setResults(newAgencies);
                    setPagination({
                        total: response.data.meta?.resource?.total || 0,
                        page: currentPage,
                        totalPages:
                            response.data.meta?.resource?.totalPages || 1,
                    });
                }
            } catch (error) {
                console.error('Erro ao buscar agências:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceSearch = setTimeout(() => {
            if (query.length >= 3 || query.length === 0) {
                searchAgencies();
            }
        }, 300);

        return () => clearTimeout(debounceSearch);
    }, [query, currentPage]);

    const handleSelectAgency = (agencyId: string) => {
        setSelectedAgencyId(agencyId);
        const selectedAgency = results.find((agency) => agency.id === agencyId);
        if (selectedAgency) {
            onSelectAgency(selectedAgency);
        }
    };

    return (
        <div className="w-full mx-auto font-sans px-4 py-2 border-2 rounded-md">
            <div className="relative mb-4">
                <CustomFormInput
                    icon={<SearchIcon className="w-6 h-6" />}
                    label="Pesquisar agência..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    id="SearchAgency"
                />
                {isLoading && (
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 text-sm">
                        <Loader2Icon className="animate-spin w-6 h-6 text-primary" />
                    </span>
                )}
            </div>

            {results.length > 0 ? (
                <>
                    <ul className="space-y-2 pt-0 p-1 h-60 overflow-auto">
                        {results.map((agency) => {
                            return (
                                <li
                                    key={agency.id}
                                    className={`bg-background px-4 py-3 rounded-md cursor-pointer border shadow-sm transition-all duration-100 ${
                                        selectedAgencyId === agency.id
                                            ? 'border-primary bg-orange-300/20'
                                            : 'border-transparent hover:border-primary hover:bg-gray-100/60'
                                    }`}
                                    onClick={() =>
                                        handleSelectAgency(agency.id)
                                    }
                                >
                                    <div className="flex items-center">
                                        <LandmarkIcon className="hidden sm:block w-6 h-6 text-primary" />
                                        <span className="ml-2 text-gray-600">
                                            {agency.name} - AG.{' '}
                                            {formatNumberAgency(
                                                agency.agencyNumber.toString(),
                                            )}{' '}
                                            - {agency.city} - {agency.district}
                                        </span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    <div className="mt-4">
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                        />
                    </div>
                </>
            ) : query.length >= 3 && !isLoading ? (
                <div className="p-4 text-gray-600 text-center">
                    Nenhuma agência encontrada
                </div>
            ) : null}
        </div>
    );
}
