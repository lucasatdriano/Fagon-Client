'use client';

import { useState } from 'react';
import { CheckIcon, ImageIcon } from 'lucide-react';
import { Photo } from '@/interfaces/photo';

interface PhotoCardProps {
    photo: Photo;
    onSelect: (id: string) => Promise<void>;
    onView: (filePath: string) => void;
}

export function PhotoCard({ photo, onSelect, onView }: PhotoCardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSelected, setIsSelected] = useState(photo.selectedForPdf);

    const handleClick = async () => {
        onView(photo.filePath);
    };

    const handleDoubleClick = async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            await onSelect(photo.id);
            setIsSelected(!isSelected);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className={`px-4 bg-white relative cursor-pointer border rounded-lg overflow-hidden shadow-sm transition-all duration-200 ${
                isSelected ? 'ring-2 ring-primary' : 'hover:shadow-md'
            }`}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
        >
            <div className="flex items-center justify-center py-4 gap-2">
                <ImageIcon className="h-6 w-6" />
                {photo.filePath
                    ? photo.filePath.split('/').pop()
                    : `Foto${photo.id}.png`}
            </div>

            {isSelected && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="bg-primary p-2 rounded-full">
                        <CheckIcon className="h-5 w-5 text-white" />
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
            )}
        </div>
    );
}
