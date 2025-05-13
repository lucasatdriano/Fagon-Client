'use client';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FabButtonProps {
    title: string;
    href: string;
}

export default function FabButton({ title, href }: FabButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        router.push(href);
    };

    return (
        <button
            title={title}
            aria-label={title}
            onClick={handleClick}
            className="fixed bottom-22 md:bottom-6 right-4 md:right-6 bg-primary p-4 md:p-5 rounded-full shadow-lg z-20 hover:bg-primary-hover transition-all duration-100"
        >
            <PlusIcon className="text-background md:w-8 md:h-8" />
        </button>
    );
}
