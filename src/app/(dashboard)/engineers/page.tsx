'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2Icon, SearchXIcon } from 'lucide-react';

import FabButton from '../../../components/layout/FabButton';
import { useSearch } from '../../../contexts/SearchContext';
import { useAuth } from '../../../hooks/useAuth';
import { Pagination } from '@/components/layout/Pagination';
import { EngineersApiResponse, ApiResponse } from '@/types/api';
import { ITEMS_PER_PAGE } from '@/constants/pagination';
import { EngineerService } from '@/services/domains/engineerService';
import { engineerProps } from '@/interfaces/engineer';
import EngineerCard from '@/components/cards/EngineerCard';
import { toast } from 'sonner';
import { useUserRole } from '@/hooks/useUserRole';

export default function DashboardEngineersPage() {
    const { searchValue } = useSearch();
    const [engineers, setEngineers] = useState<engineerProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        totalPages: 1,
    });
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;
    const { isAdmin } = useUserRole();

    useAuth();

    useEffect(() => {
        setLoading(true);

        const fetchData = async () => {
            try {
                let response: ApiResponse<EngineersApiResponse>;

                if (searchValue.trim() === '') {
                    response = await EngineerService.listAll({
                        page: currentPage,
                        limit: ITEMS_PER_PAGE,
                    });
                } else {
                    const searchParams = {
                        name: searchValue,
                        phone: searchValue,
                        education: searchValue,
                        page: currentPage,
                        limit: ITEMS_PER_PAGE,
                    };

                    const cleanedParams = Object.fromEntries(
                        Object.entries(searchParams).filter(
                            ([, value]) => value !== undefined,
                        ),
                    );

                    response = await EngineerService.search(cleanedParams);
                }

                setEngineers(response.data.engineers);

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

    const handleDeleteEngineer = async (engineerId: string) => {
        try {
            await EngineerService.delete(engineerId);
            toast.success('Engenheiro deletado com sucesso');

            // Recarregar a lista após deletar
            const response = await EngineerService.listAll({
                page: currentPage,
                limit: ITEMS_PER_PAGE,
            });

            setEngineers(response.data.engineers);
            setPagination({
                total: response.data.meta?.resource?.total || 0,
                page: currentPage,
                totalPages: response.data.meta?.resource?.totalPages || 1,
            });
        } catch (err) {
            toast.error('Erro ao deletar engenheiro');
            console.error(err);
        }
    };

    return (
        <div className="min-h-svh flex flex-col items-center pt-16 px-2 pb-24 md:pt-18 md:px-4 md:pb-4">
            <div className="w-full relative flex justify-center py-3">
                <h1 className="text-3xl font-sans bg-background px-2">
                    Engenheiros
                </h1>
                <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
            </div>

            <div className="w-full grid gap-2 place-items-center">
                {loading ? (
                    <p className="flex gap-2 mt-10 text-primary">
                        <Loader2Icon className="animate-spin" />
                        {searchValue
                            ? 'Buscando engenheiros...'
                            : 'Carregando engenheiros...'}
                    </p>
                ) : engineers.length === 0 ? (
                    <p className="flex gap-2 text-primary mt-10">
                        <SearchXIcon />
                        {searchValue
                            ? 'Nenhum engenheiro encontrado para esta busca.'
                            : 'Nenhum engenheiro cadastrado.'}
                    </p>
                ) : (
                    <>
                        {engineers.map((engineer) => (
                            <EngineerCard
                                key={engineer.id}
                                id={engineer.id}
                                name={engineer.name}
                                email={engineer.email}
                                phone={engineer.phone}
                                cpf={engineer.cpf}
                                education={engineer.education}
                                registrationEntity={engineer.registrationEntity}
                                registrationNumber={engineer.registrationNumber}
                                onDelete={handleDeleteEngineer}
                                isAdmin={isAdmin}
                            />
                        ))}
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                        />
                    </>
                )}
            </div>

            <FabButton
                title="Adicionar novo engenheiro"
                href="create-engineer"
            />
        </div>
    );
}
