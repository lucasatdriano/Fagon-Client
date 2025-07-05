'use client';

import { formatWithCapitals } from '../../utils/formatters/formatValues';
import { OctagonAlertIcon } from 'lucide-react';

interface PathologyCardProps {
    id: string;
    title: string;
    location: string;
    photoCount?: number;
    onClick?: () => void;
}

export function PathologyCard({
    title,
    location,
    photoCount,
    onClick,
}: PathologyCardProps) {
    return (
        <div
            className="bg-white cursor-pointer border w-full rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
        >
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
    );
}
