'use client';
import { locationOptions } from '@/constants';
import { locationType as locationTypeOptions } from '@/constants/locationType';
import { LocationProps } from '@/interfaces/location';
import { getLocationLabelByValue } from '@/utils/formatters/formatValues';
import { BadgeCheckIcon, BadgeIcon, MapPinIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export function LocationCard({
    href,
    id,
    name,
    pavement,
    locationType,
    height,
    hasPhotosSelected,
    relative = false,
}: LocationProps) {
    const pathname = usePathname();
    const router = useRouter();

    const locationTypeData = locationTypeOptions.find(
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

    const handleClick = () => {
        router.push(finalHref);
    };

    return (
        <div
            onClick={handleClick}
            className="bg-white cursor-pointer border w-full rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter') handleClick();
            }}
        >
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <MapPinIcon className="w-8 h-8 text-primary" />
                        {pavement ? (
                            <h3 className="font-bold text-lg">
                                {pavement} - {displayName}
                            </h3>
                        ) : (
                            <h3 className="font-bold text-lg">{displayName}</h3>
                        )}
                    </div>
                    <div className="flex gap-2 mt-1">
                        <span
                            className={`text-sm ${
                                locationTypeData?.bg || 'bg-gray-100'
                            } ${
                                locationTypeData?.text || 'text-gray-800'
                            } px-2 py-1 rounded`}
                        >
                            {displayType}
                        </span>

                        {height && (
                            <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
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
    );
}
