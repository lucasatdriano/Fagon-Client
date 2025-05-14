'use client';

import { useState } from 'react';
import { CheckIcon, ImageIcon } from 'lucide-react';

interface PhotoCardProps {
    photo: {
        id: string;
        file_path: string;
        selected_for_pdf: boolean;
    };
    onSelect: (id: string) => Promise<void>;
    onView: (filePath: string) => void;
}

export function PhotoCard({ photo, onSelect, onView }: PhotoCardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSelected, setIsSelected] = useState(photo.selected_for_pdf);

    const handleClick = async () => {
        onView(photo.file_path);
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
            className={`relative border rounded-lg overflow-hidden shadow-sm transition-all duration-200 ${
                isSelected ? 'ring-2 ring-primary' : 'hover:shadow-md'
            }`}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
        >
            <div className="bg-white flex items-center justify-center py-4 gap-2">
                <ImageIcon className="h-6 w-6" />
                {photo.file_path.split('/').pop()}
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
