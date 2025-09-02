'use client';

import { useEffect, useState } from 'react';
import { Loader2Icon } from 'lucide-react';
import { SearchCardList } from '@/components/forms/SearchCardList';
import { AgencyService } from '@/services/domains/agencyService';
import { InspectorService } from '@/services/domains/inspectorService';
import { agencyProps } from '@/interfaces/agency';
import LocateInspectorCard from '@/components/cards/LocateInspectorCard';
import { DistanceService } from '@/services/domains/distanceService';
import { LocateInspectorProps } from '@/interfaces/locateInspector';
import { Pagination } from '@/components/layout/Pagination';
import { ITEMS_PER_PAGE } from '@/constants/pagination';
import { destroyCookie, setCookie } from 'nookies';

export default function LocateInspectorsPage() {
    const [, setAgencies] = useState<agencyProps[]>([]);
    const [inspectors, setInspectors] = useState<LocateInspectorProps[]>([]);
    const [selectedAgency, setSelectedAgency] = useState<agencyProps | null>(
        null,
    );
    const [loadingAgencies, setLoadingAgencies] = useState(true);
    const [loadingInspectors, setLoadingInspectors] = useState(false);
    const [calculatingDistances, setCalculatingDistances] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        async function fetchAgencies() {
            try {
                setLoadingAgencies(true);
                const response = await AgencyService.listAll({
                    page: 1,
                    limit: 100,
                });
                setAgencies(response.data.agencies || []);
            } catch (error) {
                console.error('Erro ao buscar agências:', error);
            } finally {
                setLoadingAgencies(false);
            }
        }
        fetchAgencies();
    }, []);

    const handleAgencySelect = (agency: agencyProps) => {
        destroyCookie(null, 'selectedAgencyId', { path: '/' });

        setCookie(null, 'selectedAgencyId', agency.id, {
            maxAge: 6 * 60 * 60, // 6 horas
            sameSite: 'lax',
            path: '/',
        });

        setSelectedAgency(agency);
    };

    useEffect(() => {
        async function fetchAndCalculateDistances() {
            if (selectedAgency) {
                try {
                    setLoadingInspectors(true);
                    setCalculatingDistances(true);
                    setInspectors([]);

                    const searchParams = {
                        page: currentPage,
                        limit: ITEMS_PER_PAGE,
                    };

                    const response = await InspectorService.listAll(
                        searchParams,
                    );

                    const inspectorsData = response.data.inspectors || [];

                    setTotalPages(
                        response.data.meta?.resource?.totalPages || 1,
                    );

                    const inspectorsWithDistances = await Promise.all(
                        inspectorsData.map(async (inspector) => {
                            try {
                                const response =
                                    await DistanceService.calculateApproximateDistance(
                                        {
                                            agency: selectedAgency,
                                            inspector: inspector,
                                        },
                                    );

                                return {
                                    ...inspector,
                                    distance: response.data.distance,
                                    distanceMethod: response.data.method,
                                };
                            } catch (error) {
                                console.warn(
                                    `Erro ao calcular distância para ${inspector.name}:`,
                                    error,
                                );
                                return {
                                    ...inspector,
                                    distance: undefined,
                                    distanceMethod: 'error',
                                };
                            }
                        }),
                    );

                    inspectorsWithDistances.sort((a, b) => {
                        if (a.distance === undefined) return 1;
                        if (b.distance === undefined) return -1;
                        return a.distance - b.distance;
                    });

                    setInspectors(inspectorsWithDistances);
                } catch (error) {
                    console.error('Erro ao buscar vistoriadores:', error);
                } finally {
                    setLoadingInspectors(false);
                    setCalculatingDistances(false);
                }
            }
        }

        fetchAndCalculateDistances();
    }, [selectedAgency, currentPage]);

    useEffect(() => {
        if (selectedAgency) {
            setCurrentPage(1);
        }
    }, [selectedAgency]);

    const groupedInspectors = {
        locais: inspectors.filter(
            (i) => i.distance !== undefined && i.distance <= 50,
        ),
        estaduais: inspectors.filter(
            (i) =>
                i.distance !== undefined &&
                i.distance > 50 &&
                i.distance <= 300,
        ),
        interestaduais: inspectors.filter(
            (i) => i.distance !== undefined && i.distance > 300,
        ),
        semDistancia: inspectors.filter((i) => i.distance === undefined),
    };

    if (loadingAgencies) {
        return (
            <div className="flex justify-center items-center h-svh w-screen">
                <Loader2Icon className="animate-spin h-12 w-12 text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-svh w-full flex items-center justify-center pt-24 pb-8 px-2">
            <div className="w-full grid gap-2 max-w-8xl bg-white rounded-2xl shadow-md p-6">
                <h1 className="text-2xl font-bold text-center">
                    Localizar Vistoriadores
                </h1>
                <p className="text-center text-gray-600">
                    Selecione uma agência para encontrar vistoriadores em todo o
                    Brasil
                </p>
                <hr className="w-full border-foreground mb-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="w-full grid place-items-start">
                        <p className="font-semibold mb-2 text-lg">
                            Selecionar Agência
                        </p>
                        <hr className="w-full border-foreground mb-6" />
                        <SearchCardList
                            onSelectAgency={handleAgencySelect}
                            className="max-h-[42rem]"
                        />
                    </div>

                    {/* Coluna da Direita - Vistoriadores */}
                    <div>
                        <h2 className="font-semibold mb-2 text-lg">
                            Vistoriadores Mais Próximos
                        </h2>
                        <hr className="w-full border-foreground mb-6" />

                        {selectedAgency ? (
                            <div className="flex flex-col gap-6">
                                {/* Loading dos vistoriadores */}
                                {(loadingInspectors ||
                                    calculatingDistances) && (
                                    <div className="flex justify-center items-center py-8">
                                        <Loader2Icon className="animate-spin h-8 w-8 text-primary mr-3" />
                                        <span>Buscando vistoriadores...</span>
                                    </div>
                                )}

                                {/* Conteúdo dos vistoriadores */}
                                {!loadingInspectors &&
                                    !calculatingDistances && (
                                        <>
                                            {groupedInspectors.locais.length >
                                                0 && (
                                                <div>
                                                    <h3 className="font-semibold text-green-600 mb-3">
                                                        📍 Locais (até 50km)
                                                    </h3>
                                                    <div className="grid gap-3">
                                                        {groupedInspectors.locais.map(
                                                            (inspector) => (
                                                                <LocateInspectorCard
                                                                    key={
                                                                        inspector.id
                                                                    }
                                                                    {...inspector}
                                                                />
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {groupedInspectors.estaduais
                                                .length > 0 && (
                                                <div>
                                                    <h3 className="font-semibold text-blue-600 mb-3">
                                                        🏙️ Estaduais (50-300km)
                                                    </h3>
                                                    <div className="grid gap-3">
                                                        {groupedInspectors.estaduais.map(
                                                            (inspector) => (
                                                                <LocateInspectorCard
                                                                    key={
                                                                        inspector.id
                                                                    }
                                                                    {...inspector}
                                                                />
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {groupedInspectors.interestaduais
                                                .length > 0 && (
                                                <div>
                                                    <h3 className="font-semibold text-orange-600 mb-3">
                                                        🗺️ Interestaduais
                                                        (+300km)
                                                    </h3>
                                                    <div className="grid gap-3">
                                                        {groupedInspectors.interestaduais.map(
                                                            (inspector) => (
                                                                <LocateInspectorCard
                                                                    key={
                                                                        inspector.id
                                                                    }
                                                                    {...inspector}
                                                                />
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {groupedInspectors.semDistancia
                                                .length > 0 && (
                                                <div>
                                                    <h3 className="font-semibold text-gray-600 mb-3">
                                                        ❓ Distância não
                                                        calculada
                                                    </h3>
                                                    <div className="grid gap-3">
                                                        {groupedInspectors.semDistancia.map(
                                                            (inspector) => (
                                                                <LocateInspectorCard
                                                                    key={
                                                                        inspector.id
                                                                    }
                                                                    {...inspector}
                                                                />
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {inspectors.length === 0 && (
                                                <p className="text-gray-500 text-center py-8">
                                                    Nenhum vistoriador
                                                    encontrado
                                                </p>
                                            )}

                                            {/* Paginação */}
                                            {totalPages > 1 && (
                                                <div className="mt-6">
                                                    <Pagination
                                                        currentPage={
                                                            currentPage
                                                        }
                                                        totalPages={totalPages}
                                                    />
                                                </div>
                                            )}
                                        </>
                                    )}
                            </div>
                        ) : (
                            <p className="text-gray-500">
                                Selecione uma agência para ver os vistoriadores
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
