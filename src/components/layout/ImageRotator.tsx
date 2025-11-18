'use client';

import { useState } from 'react';
import { RotateCcwIcon, RotateCwIcon, SaveIcon } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface ImageRotatorProps {
    src: string;
    alt: string;
    photoId?: string;
    className?: string;
    onSaveRotation?: (photoId: string, rotation: number) => Promise<void>;
}

export function ImageRotator({
    src,
    alt,
    photoId,
    className = '',
    onSaveRotation,
}: ImageRotatorProps) {
    const [rotation, setRotation] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    const rotateLeft = () => {
        setRotation((prev) => (prev - 90) % 360);
    };

    const rotateRight = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const getRotationClass = (deg: number) => {
        switch (deg) {
            case 0:
                return '';
            case 90:
                return 'rotate-90';
            case 180:
                return 'rotate-180';
            case 270:
                return 'rotate-270';
            case -90:
                return '-rotate-90';
            case -180:
                return '-rotate-180';
            case -270:
                return '-rotate-270';
            default:
                return '';
        }
    };

    const rotationClass = getRotationClass(rotation);

    const handleSaveRotation = async () => {
        if (!photoId || !onSaveRotation) {
            toast.error('Não é possível salvar a rotação');
            return;
        }

        try {
            setIsSaving(true);
            await onSaveRotation(photoId, rotation);
            toast.success('Foto rotacionada e salva com sucesso!');
            setRotation(0);
        } catch (error) {
            console.error('Erro ao salvar rotação:', error);
            toast.error('Erro ao rotacionar a foto');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="relative group flex justify-center items-center">
            <div
                className={`${rotationClass} transition-transform duration-200 ${className}`}
            >
                <Image
                    key={`${src}-${Date.now()}`}
                    src={src}
                    alt={alt}
                    width={600}
                    height={400}
                    className="object-contain max-w-full max-h-[70vh]"
                    unoptimized={true}
                    style={{ width: 'auto', height: 'auto' }}
                    priority={true}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `${src}&force-reload=${Date.now()}`;
                    }}
                />
            </div>

            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                <button
                    onClick={rotateLeft}
                    className="bg-black/50 text-white p-1 rounded hover:bg-black/75"
                    title="Girar 90° anti-horário"
                >
                    <RotateCcwIcon className="w-4 h-4" />
                </button>
                <button
                    onClick={rotateRight}
                    className="bg-black/50 text-white p-1 rounded hover:bg-black/75"
                    title="Girar 90° horário"
                >
                    <RotateCwIcon className="w-4 h-4" />
                </button>

                {photoId && onSaveRotation && (
                    <button
                        onClick={handleSaveRotation}
                        disabled={isSaving || rotation === 0}
                        className="bg-green-600 text-white p-1 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Salvar rotação"
                    >
                        <SaveIcon className="w-4 h-4" />
                    </button>
                )}
            </div>

            {rotation !== 0 && (
                <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    {rotation}°
                </div>
            )}
        </div>
    );
}
