'use client';
import { locationType as locationTypeOptions } from '@/constants/locationType';
import { LocationProps } from '@/interfaces/location';
import { BadgeCheckIcon, BadgeIcon, MapPinIcon } from 'lucide-react';

export function LocationCard({
    name,
    pavement,
    locationType,
    height,
    hasPhotosSelected,
}: LocationProps) {
    const locationTypeData = locationTypeOptions.find(
        (type) => type.value === locationType,
    );

    if (!locationTypeData) return null;

    return (
        <div className="bg-white cursor-pointer border w-full rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <MapPinIcon className="w-8 h-8 text-primary" />
                        <h3 className="font-bold text-lg">
                            {pavement} - {name}
                        </h3>
                    </div>
                    <div className="flex gap-2 mt-1">
                        <span
                            className={`text-sm ${locationTypeData.bg} ${locationTypeData.text} px-2 py-1 rounded`}
                        >
                            {locationTypeData.label}
                        </span>

                        {height && (
                            <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                Altura: {height}m
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
    );
}
