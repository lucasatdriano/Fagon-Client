import { inspectorProps } from '@/interfaces/inspector';
import {
    formatCEP,
    formatPhone,
    formatStateToAbbreviation,
} from '@/utils/formatters';
import { ClipboardCheckIcon } from 'lucide-react';
import Link from 'next/link';

export default function InspectorCard({
    id,
    name,
    phone,
    cep,
    state,
    city,
    district,
    street,
    selectedCities,
}: inspectorProps) {
    return (
        <Link
            href={`/inspectors/${id}`}
            passHref
            className="w-full flex flex-col md:flex-row justify-between gap-4 md:gap-20 cursor-pointer p-4 border rounded-lg shadow-sm hover:shadow-md bg-white transition-shadow duration-200"
        >
            <div className="flex-1">
                <div className="flex items-center gap-2 md:mb-2">
                    <ClipboardCheckIcon className="w-8 h-8 text-primary" />
                    <span className="font-semibold text-foreground">
                        {formatPhone(phone)}
                    </span>
                </div>

                <h2 className="font-bold text-lg mb-1">{name}</h2>
                {cep && (
                    <p className="text-foreground">CEP: {formatCEP(cep)}</p>
                )}
                <p className="text-foreground">
                    Cidade/UF: {city}/{formatStateToAbbreviation(state)}
                </p>
                {district && !street && (
                    <p className="text-foreground">Endereço: {district}</p>
                )}
                {district && street && (
                    <p className="text-foreground">
                        Endereço: {district} - {street}
                    </p>
                )}
            </div>
            <div className="border-t-2 md:border-t-0 md:border-l-2 border-dotted flex-1 pt-4 md:pt-0 md:pl-10">
                <div className="grid gap-2 h-min">
                    <p>Cidades Atendidas:</p>
                    <div className="grid grid-cols-3 xl:grid-cols-4 gap-2 h-min">
                        {selectedCities.map((city, index) => (
                            <p
                                key={index}
                                className="flex justify-center items-center py-1 px-5 bg-blue-100 text-blue-800 text-center rounded-2xl"
                            >
                                {city}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </Link>
    );
}
