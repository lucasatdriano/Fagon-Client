import { useSearch } from '@/hooks/useSearch';
import { debounce } from '@/utils/helpers/debounce';
import { LandmarkIcon, SearchIcon } from 'lucide-react';
import { CustomFormInput } from './CustomFormInput';
import { useState } from 'react';
import { agencyProps } from '@/interfaces/agency';
import { formatNumberAgency } from '@/utils/formatters/formatNumberAgency';

interface SearchCardListProps {
    onSelectAgency: (agency: agencyProps) => void;
    searchAgencies: (query: string) => Promise<agencyProps[]> | agencyProps[];
}

export function SearchCardList({
    onSelectAgency,
    searchAgencies,
}: SearchCardListProps) {
    const { query, setQuery, results, isLoading, error } =
        useSearch<agencyProps>(searchAgencies, 3, 300);
    const [localQuery, setLocalQuery] = useState(query);
    const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(
        null,
    );

    const handleInputChange = debounce((...args: unknown[]) => {
        const value = args[0] as string;
        setQuery(value);
    }, 300);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalQuery(value);
        handleInputChange(value);
    };

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
                    icon={<SearchIcon className="w-5 h-5" />}
                    label="Pesquisar agência..."
                    value={localQuery}
                    onChange={handleChange}
                />
                {isLoading && (
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 text-sm">
                        Carregando...
                    </span>
                )}
            </div>

            {error && <div className="text-red-600 mb-4">{error}</div>}

            {results.length > 0 ? (
                <ul className="space-y-2 pt-0 p-1">
                    {results.map((agency) => {
                        return (
                            <li
                                key={agency.id}
                                className={`bg-background px-4 py-3 rounded-md cursor-pointer border shadow-sm transition-all duration-100 ${
                                    selectedAgencyId === agency.id
                                        ? 'border-primary bg-orange-300/20'
                                        : 'border-transparent hover:border-primary hover:bg-gray-100/60'
                                }`}
                                onClick={() => handleSelectAgency(agency.id)}
                            >
                                <div className="flex items-center">
                                    <LandmarkIcon className="w-6 h-6 text-primary" />
                                    <span className="ml-2 text-gray-600">
                                        {agency.name} - AG.{' '}
                                        {formatNumberAgency(
                                            agency.agencyNumber,
                                        )}{' '}
                                        - {agency.city} - {agency.district}
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : query.length >= 3 && !isLoading ? (
                <div className="p-4 text-gray-600 text-center">
                    Nenhuma agência encontrada
                </div>
            ) : null}
        </div>
    );
}
