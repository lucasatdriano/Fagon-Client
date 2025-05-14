'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

type NavigationCardProps = {
    href: string;
    title: string;
    icon?: ReactNode;
    className?: string;
    cardClassName?: string;
    relative?: boolean;
};

export function NavigationCard({
    href,
    title,
    icon,
    className = '',
    cardClassName = '',
    relative = false,
}: NavigationCardProps) {
    const pathname = usePathname();

    const finalHref = relative
        ? `${pathname}/${href}`.replace('//', '/')
        : href;

    return (
        <Link href={finalHref} className={`block ${className}`}>
            <div
                className={`bg-white w-full rounded-lg shadow-sm p-6 text-center cursor-pointer transition-all hover:shadow-md border hover:bg-gray-50 ${cardClassName}`}
            >
                {icon && <div className="mb-2">{icon}</div>}
                <h3 className="text-foreground font-medium">{title}</h3>
            </div>
        </Link>
    );
}
