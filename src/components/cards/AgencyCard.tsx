import { agencyProps } from '@/interfaces/agency';
import { formatCNPJ } from '@/utils/formatters/formatCNPJ';
import { LandmarkIcon } from 'lucide-react';

export default function AgencyCard({
    agencyNumber,
    name,
    cnpj,
    city,
    district,
    street,
    number,
}: agencyProps) {
    const formattedAgencyNumber = agencyNumber.toString().padStart(4, '0');

    return (
        <div className="w-full cursor-pointer p-4 border rounded-lg shadow-sm hover:shadow-md bg-white transition-shadow duration-200">
            <div className="flex items-center gap-2 mb-3">
                <LandmarkIcon className="w-8 h-8 text-primary" />
                <span className="font-semibold text-foreground">
                    AG. {formattedAgencyNumber}
                </span>
            </div>

            <h3 className="font-bold text-lg">{name}</h3>
            <p className="text-foreground">
                {street}, {number} - {city}, {district}
            </p>
            {cnpj && (
                <p className="text-foreground">CNPJ: {formatCNPJ(cnpj)}</p>
            )}
        </div>
    );
}
