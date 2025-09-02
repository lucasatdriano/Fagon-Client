'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2Icon, SearchXIcon } from 'lucide-react';

import AgencyCard from '../../../components/cards/AgencyCard';
import FabButton from '../../../components/layout/FabButton';
import { AgencyService } from '../../../services/domains/agencyService';
import { useSearch } from '../../../contexts/SearchContext';
import { agencyProps } from '../../../interfaces/agency';
import { useAuth } from '../../../hooks/useAuth';
import { Pagination } from '@/components/layout/Pagination';
import { AgenciesApiResponse, ApiResponse } from '@/types/api';
import { ITEMS_PER_PAGE } from '@/constants/pagination';

export default function DashboardAgenciesPage() {
    const { searchValue } = useSearch();
    const [agencies, setAgencies] = useState<agencyProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        totalPages: 1,
    });
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    useAuth();

    useEffect(() => {
        setLoading(true);

        const fetchData = async () => {
            try {
                let response: ApiResponse<AgenciesApiResponse>;

                if (searchValue.trim() === '') {
                    response = await AgencyService.listAll({
                        page: currentPage,
                        limit: ITEMS_PER_PAGE,
                    });
                } else {
                    const searchParams = {
                        name: searchValue,
                        agencyNumber: !isNaN(Number(searchValue))
                            ? Number(searchValue)
                            : undefined,
                        state: searchValue,
                        city: searchValue,
                        district: searchValue,
                        page: currentPage,
                        limit: ITEMS_PER_PAGE,
                    };

                    const cleanedParams = Object.fromEntries(
                        Object.entries(searchParams).filter(
                            ([, value]) => value !== undefined,
                        ),
                    );

                    response = await AgencyService.search(cleanedParams);
                }

                setAgencies(response.data.agencies);

                setPagination({
                    total: response.data.meta?.resource?.total || 0,
                    page: currentPage,
                    totalPages: response.data.meta?.resource?.totalPages || 1,
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router, searchValue, currentPage]);

    return (
        <div className="min-h-svh flex flex-col items-center pt-16 px-2 pb-24 md:pt-18 md:px-4 md:pb-4">
            <div className="w-full relative flex justify-center py-3">
                <h1 className="text-3xl font-sans bg-background px-2">
                    Agências
                </h1>
                <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
            </div>

            <div className="w-full grid gap-2 place-items-center">
                {loading ? (
                    <p className="flex gap-2 mt-10 text-primary">
                        <Loader2Icon className="animate-spin" />
                        {searchValue
                            ? 'Buscando agências...'
                            : 'Carregando agências...'}
                    </p>
                ) : agencies.length === 0 ? (
                    <p className="flex gap-2 text-primary mt-10">
                        <SearchXIcon />
                        {searchValue
                            ? 'Nenhuma agência encontrada para esta busca.'
                            : 'Nenhuma agência cadastrada.'}
                    </p>
                ) : (
                    <>
                        {agencies.map((agency) => (
                            <AgencyCard
                                key={agency.id}
                                id={agency.id}
                                name={agency.name}
                                agencyNumber={agency.agencyNumber}
                                cnpj={agency.cnpj}
                                cep={agency.cep}
                                state={agency.state}
                                city={agency.city}
                                district={agency.district}
                                street={agency.street}
                                number={agency.number}
                                complement={agency.complement}
                            />
                        ))}
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                        />
                    </>
                )}
            </div>

            <FabButton title="Adicionar nova agência" href="create-agency" />
        </div>
    );
}
