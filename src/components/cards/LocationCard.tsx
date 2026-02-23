'use client';

import { useRef, useState } from 'react';
import {
    locationOptions,
    locationTypes as locationTypesOptions,
} from '../../constants';
import { LocationProps } from '../../interfaces/location';
import {
    getLocationLabelByValue,
    getPavementValueByLabel,
} from '../../utils/formatters/formatValues';
import { BadgeCheckIcon, BadgeIcon, MapPinIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { DeleteLocationModal } from '../modals/locationModals/DeleteLocationModal';

export function LocationCard({
    href,
    id,
    name,
    pavement,
    locationType,
    height,
    hasPhotosSelected,
    relative = false,
    disabled = false,
    isVisitor = false,
    onDelete,
}: LocationProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);

    const locationTypeData = locationTypesOptions.find(
        (type) => type.value === locationType,
    );

    const locationNameData = locationOptions.find((opt) => opt.value === name);

    const displayName = locationNameData
        ? locationNameData.label
        : getLocationLabelByValue(name);

    const displayType = locationTypeData
        ? locationTypeData.label
        : getLocationLabelByValue(locationType);

    const finalHref = href
        ? relative
            ? `${pathname}/${id}/create-location`.replace('//', '/')
            : href
        : '';

    const handlePressStart = () => {
        if (disabled || isLoading) return;

        longPressTimer.current = setTimeout(() => {
            if (isVisitor) {
                toast.error('Vistoriadores não podem deletar locais');
                return;
            }

            setShowDeleteModal(true);
        }, 2500);
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

        router.push(finalHref);
    };

    const handleDeleteLocation = async () => {
        if (!onDelete || !id) return;

        setIsLoading(true);
        try {
            onDelete(id);
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting location:', error);
            toast.error('Erro ao deletar local');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div
                onClick={handleClick}
                className={`bg-white cursor-pointer border w-full rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 relative ${
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
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

                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <MapPinIcon className="w-8 h-8 text-primary" />
                            {pavement ? (
                                <h2 className="font-bold text-lg">
                                    {getPavementValueByLabel(pavement)} -{' '}
                                    {displayName}
                                </h2>
                            ) : (
                                <h3 className="font-bold text-lg">
                                    {displayName}
                                </h3>
                            )}
                        </div>
                        <div className="flex gap-2 mt-1">
                            <span
                                className={`text-sm ${locationTypeData?.class} font-semibold px-2 py-1 rounded`}
                            >
                                {displayType}
                            </span>

                            {height && (
                                <span className="text-sm bg-gray-100 text-gray-800 font-medium px-2 py-1 rounded">
                                    Altura:{' '}
                                    {height.toLocaleString('pt-BR', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}{' '}
                                    m
                                </span>
                            )}
                        </div>
                    </div>

                    <span
                        aria-label={
                            hasPhotosSelected
                                ? 'Foto selecionada'
                                : 'Selecionar foto'
                        }
                        role="img"
                        className="p-1 flex self-center"
                    >
                        {hasPhotosSelected ? (
                            <BadgeCheckIcon className="w-8 h-8 text-green-500" />
                        ) : (
                            <BadgeIcon className="w-8 h-8 text-gray-300" />
                        )}
                    </span>
                </div>
            </div>

            <DeleteLocationModal
                locationName={displayName}
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteLocation}
                isLoading={isLoading}
            />
        </>
    );
}
