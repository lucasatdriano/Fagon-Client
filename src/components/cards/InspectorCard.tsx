import { inspectorProps } from '@/interfaces/inspector';
import {
    formatCEP,
    formatPhone,
    formatStateToAbbreviation,
} from '@/utils/formatters';
import { ClipboardCheckIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { DeleteInspectorModal } from '../modals/inspectorModals/DeleteInspectorModal';

interface InspectorCardProps extends inspectorProps {
    onDelete?: (inspectorId: string) => void;
}

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
    onDelete,
}: InspectorCardProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);

    const handlePressStart = () => {
        longPressTimer.current = setTimeout(() => {
            setShowDeleteModal(true);
        }, 1000);
    };

    const handlePressEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    const handleClick = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
            return;
        }

        router.push(`/inspectors/${id}`);
    };

    const handleDeleteInspector = async () => {
        if (!onDelete || !id) return;

        setIsLoading(true);
        try {
            onDelete(id);
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting inspector:', error);
            toast.error('Erro ao deletar vistoriador');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div
                onClick={handleClick}
                className="w-full flex flex-col md:flex-row justify-between gap-4 md:gap-20 cursor-pointer p-4 border rounded-lg shadow-sm hover:shadow-md bg-white transition-shadow duration-200 relative"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleClick();
                }}
                onTouchStart={handlePressStart}
                onTouchEnd={handlePressEnd}
                onMouseDown={handlePressStart}
                onMouseUp={handlePressEnd}
                onMouseLeave={handlePressEnd}
            >
                {isLoading && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-lg">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                )}

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
            </div>

            <DeleteInspectorModal
                inspectorName={name}
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteInspector}
                isLoading={isLoading}
            />
        </>
    );
}
