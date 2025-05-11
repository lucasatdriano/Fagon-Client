import { LandmarkIcon } from 'lucide-react';

interface AgencyCardProps {
    agencyNumber: number;
    name: string;
    cnpj?: string;
    cep: string;
    state: string;
    city: string;
    district: string;
    street: string;
    number: number;
}

export default function AgencyCard({
    agencyNumber,
    name,
    cnpj,
    city,
    district,
    street,
    number,
}: AgencyCardProps) {
    return (
        <div className="w-full p-4 border rounded-lg shadow-sm bg-white">
            <div className="flex items-center gap-2 mb-3">
                <LandmarkIcon className="w-8 h-8 text-primary" />
                <span className="font-semibold text-foreground">
                    AG. {agencyNumber}
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

const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5',
    );
};
