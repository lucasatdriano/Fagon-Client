'use client';

import { useState } from 'react';
import { RotateCwIcon, RotateCcwIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageRotatorProps {
    src: string;
    alt: string;
    className?: string;
}

export function ImageRotator({ src, alt, className = '' }: ImageRotatorProps) {
    const [rotation, setRotation] = useState(0);

    const rotateLeft = () => {
        setRotation((prev) => (prev - 90) % 360);
    };

    const rotateRight = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const rotationClasses = {
        0: '',
        90: 'rotate-90',
        180: 'rotate-180',
        270: 'rotate-270',
        '-90': '-rotate-90',
        '-180': '-rotate-180',
        '-270': '-rotate-270',
    };

    const rotationClass =
        rotationClasses[rotation as keyof typeof rotationClasses] || '';

    return (
        <div className="relative group">
            <div
                className={`${className} ${rotationClass} transition-transform duration-200`}
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-contain"
                    unoptimized={true}
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
            </div>
        </div>
    );
}
