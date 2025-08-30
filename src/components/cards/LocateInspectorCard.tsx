import { LocateInspectorProps } from '@/interfaces/locateInspector';
import { formatPhone, formatStateToAbbreviation } from '@/utils/formatters';
import { ClipboardCheckIcon, MapPinIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LocateInspectorCard({
    id,
    name,
    phone,
    cep,
    state,
    city,
    district,
    street,
    distance,
}: LocateInspectorProps) {
    const route = useRouter();

    const handleNavigateForInspectorPage = () => {
        route.push(`/inspectors/${id}`);
    };

    return (
        <div className="w-full flex justify-between items-center p-4 border rounded-lg shadow-sm hover:shadow-md bg-white transition-shadow duration-200">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <ClipboardCheckIcon className="w-6 h-6 text-primary" />
                    <h2 className="font-bold text-lg">{name}</h2>
                </div>

                <div className="grid gap-1 text-sm">
                    <p className="font-semibold text-base">
                        {formatPhone(phone)}
                    </p>
                    <p className="font-semibold text-base">
                        {city}/{formatStateToAbbreviation(state)}
                    </p>
                    {district && street && (
                        <p>
                            {street}, {district}
                        </p>
                    )}
                    {cep && <p>CEP: {cep}</p>}
                </div>
            </div>

            <div className="flex flex-col border-l-2 border-dotted pl-4 justify-between h-full items-end gap-3 ml-4">
                {distance !== undefined && (
                    <div className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                            <MapPinIcon className="w-4 h-4 text-blue-600" />
                            <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-sm">
                                {distance.toFixed(1)} km de Distância
                            </span>
                        </div>
                    </div>
                )}

                <button
                    className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleNavigateForInspectorPage();
                    }}
                >
                    Solicitar Vistoria
                </button>
            </div>
        </div>
    );
}
