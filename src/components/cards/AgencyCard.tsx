import { agencyProps } from '../../interfaces/agency';
import { formatCNPJ } from '../../utils/formatters/formatCNPJ';
import { formatNumberAgency } from '../../utils/formatters/formatNumberAgency';
import { LandmarkIcon } from 'lucide-react';
import Link from 'next/link';

export default function AgencyCard({
    id,
    agencyNumber,
    name,
    cnpj,
    state,
    city,
    district,
    street,
    number,
    complement,
}: agencyProps) {
    return (
        <Link
            href={`/agencies/${id}`}
            passHref
            className="w-full cursor-pointer p-4 border rounded-lg shadow-sm hover:shadow-md bg-white transition-shadow duration-200"
        >
            <div className="flex items-center gap-2 mb-3">
                <LandmarkIcon className="w-8 h-8 text-primary" />
                <span className="font-semibold text-foreground">
                    AG. {formatNumberAgency(agencyNumber.toString())}
                </span>
            </div>

            <h2 className="font-bold text-lg">{name}</h2>
            {!complement && (
                <p className="text-foreground">
                    {street}, {number} - {district}, {city} - {state}
                </p>
            )}
            {complement && (
                <p className="text-foreground">
                    {street}, {number}, {complement} - {district}, {city} -{' '}
                    {state}
                </p>
            )}
            {cnpj && (
                <p className="text-foreground">CNPJ: {formatCNPJ(cnpj)}</p>
            )}
        </Link>
    );
}
