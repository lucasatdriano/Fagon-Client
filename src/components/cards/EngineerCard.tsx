import { engineerProps } from '@/interfaces/engineer';
import { formatPhone } from '@/utils/formatters';
import { HardHatIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { DeleteEngineerModal } from '../modals/engineerModals/DeleteEngineerModal';

interface EngineerCardProps extends engineerProps {
    onDelete?: (engineerId: string) => void;
    isAdmin?: boolean;
}

export default function EngineerCard({
    id,
    name,
    phone,
    email,
    education,
    registrationEntity,
    registrationNumber,
    onDelete,
    isAdmin,
}: EngineerCardProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);

    const handlePressStart = () => {
        if (!onDelete) return;

        longPressTimer.current = setTimeout(() => {
            if (!isAdmin) {
                toast.error('Apenas administradores podem deletar engenheiros');
                return;
            }

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

        router.push(`/engineers/${id}`);
    };

    const handleDeleteEngineer = async () => {
        if (!onDelete || !id) return;

        setIsLoading(true);
        try {
            onDelete(id);
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting engineer:', error);
            toast.error('Erro ao deletar engenheiro');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div
                onClick={handleClick}
                className="w-full cursor-pointer p-4 border rounded-lg shadow-sm hover:shadow-md bg-white transition-shadow duration-200 relative"
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

                <div className="flex items-center gap-2 mb-2">
                    <HardHatIcon className="w-8 h-8 text-primary" />
                    <span className="font-semibold text-foreground">
                        {email}
                    </span>
                </div>

                <h2 className="font-bold text-lg mb-1">{name}</h2>
                <p className="text-foreground">
                    Telefone: {formatPhone(phone)}
                </p>
                <p className="text-foreground">
                    Formação: {education} - {registrationEntity}{' '}
                    {registrationNumber}
                </p>
            </div>

            {onDelete && (
                <DeleteEngineerModal
                    engineerName={name}
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteEngineer}
                    isLoading={isLoading}
                />
            )}
        </>
    );
}
