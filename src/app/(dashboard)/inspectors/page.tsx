'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2Icon, SearchXIcon } from 'lucide-react';

import FabButton from '../../../components/layout/FabButton';
import { useSearch } from '../../../contexts/SearchContext';
import { useAuth } from '../../../hooks/useAuth';
import { Pagination } from '@/components/layout/Pagination';
import { InspectorsApiResponse, ApiResponse } from '@/types/api';
import { ITEMS_PER_PAGE } from '@/constants/pagination';
import { inspectorProps } from '@/interfaces/inspector';
import { InspectorService } from '@/services/domains/inspectorService';
import InspectorCard from '@/components/cards/InspectorCard';
import { toast } from 'sonner';

export default function DashboardInspectorsPage() {
    const { searchValue } = useSearch();
    const [inspectors, setInspectors] = useState<inspectorProps[]>([]);
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
                let response: ApiResponse<InspectorsApiResponse>;

                if (searchValue.trim() === '') {
                    response = await InspectorService.listAll({
                        page: currentPage,
                        limit: ITEMS_PER_PAGE,
                    });
                } else {
                    const searchParams = {
                        name: searchValue,
                        state: searchValue,
                        city: searchValue,
                        page: currentPage,
                        limit: ITEMS_PER_PAGE,
                    };

                    const cleanedParams = Object.fromEntries(
                        Object.entries(searchParams).filter(
                            ([, value]) => value !== undefined,
                        ),
                    );

                    response = await InspectorService.search(cleanedParams);
                }

                setInspectors(response.data.inspectors);

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

    const handleDeleteInspector = async (inspectorId: string) => {
        try {
            await InspectorService.delete(inspectorId);
            toast.success('Vistoriador deletado com sucesso');

            // Recarregar a lista após deletar
            const response = await InspectorService.listAll({
                page: currentPage,
                limit: ITEMS_PER_PAGE,
            });

            setInspectors(response.data.inspectors);
            setPagination({
                total: response.data.meta?.resource?.total || 0,
                page: currentPage,
                totalPages: response.data.meta?.resource?.totalPages || 1,
            });
        } catch (err) {
            toast.error('Erro ao deletar vistoriador');
            console.error(err);
        }
    };

    return (
        <div className="min-h-svh flex flex-col items-center pt-16 px-2 pb-24 md:pt-18 md:px-4 md:pb-4">
            <div className="w-full relative flex justify-center py-3">
                <h1 className="text-3xl font-sans bg-background px-2">
                    Vistoriadores
                </h1>
                <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
            </div>

            <div className="w-full grid gap-2 place-items-center">
                {loading ? (
                    <p className="flex gap-2 mt-10 text-primary">
                        <Loader2Icon className="animate-spin" />
                        {searchValue
                            ? 'Buscando vistoriadores...'
                            : 'Carregando vistoriadores...'}
                    </p>
                ) : inspectors.length === 0 ? (
                    <p className="flex gap-2 text-primary mt-10">
                        <SearchXIcon />
                        {searchValue
                            ? 'Nenhum vistoriador encontrado para esta busca.'
                            : 'Nenhum vistoriador cadastrado.'}
                    </p>
                ) : (
                    <>
                        {inspectors.map((inspector) => (
                            <InspectorCard
                                key={inspector.id}
                                id={inspector.id}
                                name={inspector.name}
                                phone={inspector.phone}
                                cep={inspector.cep}
                                state={inspector.state}
                                city={inspector.city}
                                district={inspector.district}
                                street={inspector.street}
                                rating={inspector.rating}
                                selectedCities={inspector.selectedCities}
                                onDelete={handleDeleteInspector}
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
                title="Adicionar novo vistoriador"
                href="create-inspector"
            />
        </div>
    );
}
