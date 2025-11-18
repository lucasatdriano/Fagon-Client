'use client';

import { formatWithCapitals } from '../../utils/formatters/formatValues';
import { OctagonAlertIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { DeletePathologyModal } from '../modals/pathologyModals/DeletePathologyModal';

interface PathologyCardProps {
    id: string;
    title: string;
    location: string;
    photoCount?: number;
    onClick?: () => void;
    onDelete?: (id: string) => void;
    disabled?: boolean;
    isVisitor?: boolean;
}

export function PathologyCard({
    id,
    title,
    location,
    photoCount,
    onClick,
    onDelete,
    disabled = false,
    isVisitor = false,
}: PathologyCardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);

    const handlePressStart = () => {
        if (disabled || isLoading || !onDelete) return;

        longPressTimer.current = setTimeout(() => {
            if (isVisitor) {
                toast.error('Vistoriadores não podem deletar patologias');
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
        if (disabled || isLoading) return;

        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
            return;
        }

        onClick?.();
    };

    const handleDeletePathology = async () => {
        if (!onDelete || !id) return;

        setIsLoading(true);
        try {
            await onDelete(id);
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting pathology:', error);
            toast.error('Erro ao deletar patologia');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div
                className={`bg-white cursor-pointer border w-full rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 ${
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleClick()}
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

                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div>
                                <OctagonAlertIcon className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="font-bold text-lg">{title}</h3>
                        </div>
                        <div className="flex gap-2 mt-1 flex-wrap">
                            <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm">
                                Local: {formatWithCapitals(location)}
                            </span>
                            {photoCount && (
                                <span className="bg-blue-100 text-blue-900 px-2 py-1 rounded text-sm">
                                    Fotos: {photoCount}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {onDelete && (
                <DeletePathologyModal
                    pathology={title}
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeletePathology}
                    isLoading={isLoading}
                />
            )}
        </>
    );
}
