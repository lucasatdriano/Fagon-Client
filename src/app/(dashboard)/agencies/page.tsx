'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LoaderCircleIcon, SearchXIcon } from 'lucide-react';

import AgencyCard from '@/components/cards/AgencyCard';
import FabButton from '@/components/layout/FabButton';
import { AgencyService } from '@/services/domains/agencyService';
import { useSearch } from '@/contexts/SearchContext';
import { agencyProps } from '@/interfaces/agency';

export default function DashboardAgenciesPage() {
    const { searchValue } = useSearch();
    const [agencies, setAgencies] = useState<agencyProps[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        console.log(
            '[DashboardAgenciesPage] Search value changed:',
            searchValue,
        );

        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1];

        if (!token) {
            router.push('/login');
            return;
        }

        setLoading(true);

        if (searchValue.trim() === '') {
            AgencyService.listAll()
                .then((res) => {
                    setAgencies(res.data);
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => setLoading(false));
        } else {
            const searchParams = {
                name: searchValue,
                agencyNumber: !isNaN(Number(searchValue))
                    ? Number(searchValue)
                    : undefined,
                state:
                    searchValue.length === 2
                        ? searchValue.toUpperCase()
                        : undefined,
                city: searchValue,
                district: searchValue,
                cnpj: searchValue.replace(/\D/g, ''),
            };

            const cleanedParams = Object.fromEntries(
                Object.entries(searchParams).filter(
                    ([_, value]) => value !== undefined,
                ),
            );

            AgencyService.search(cleanedParams)
                .then((res) => {
                    setAgencies(res.data);
                })
                .catch((err) => {
                    toast.error('Erro ao buscar agências');
                    console.error(err);
                })
                .finally(() => setLoading(false));
        }
    }, [router, searchValue]);

    return (
        <div className="h-svh flex flex-col items-center pt-20 px-6">
            <div className="w-full relative flex justify-center py-3">
                <h1 className="text-3xl font-sans bg-background px-2">
                    Agências
                </h1>
                <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
            </div>

            <div className="w-full grid gap-2 place-items-center">
                {loading ? (
                    <p className="flex gap-2 text-foreground mt-10">
                        <LoaderCircleIcon className="animate-spin" />
                        {searchValue
                            ? 'Buscando agências...'
                            : 'Carregando agências...'}
                    </p>
                ) : agencies.length === 0 ? (
                    <p className="flex gap-2 text-foreground mt-10">
                        <SearchXIcon />
                        {searchValue
                            ? 'Nenhuma agência encontrada para esta busca.'
                            : 'Nenhuma agência cadastrada.'}
                    </p>
                ) : (
                    agencies.map((agency) => (
                        <AgencyCard
                            key={agency.id}
                            id={agency.id}
                            agencyNumber={String(agency.agencyNumber)}
                            name={agency.name}
                            city={agency.city}
                            district={agency.district}
                            street={agency.street}
                            number={String(agency.number)}
                            cnpj={agency.cnpj}
                            cep={agency.cep}
                            state={agency.state}
                        />
                    ))
                )}
            </div>

            <FabButton title="Adicionar nova agência" href="create-agency" />
        </div>
    );
}
