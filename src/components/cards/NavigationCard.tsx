'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';

type NavigationCardProps = {
    href?: string;
    title: string;
    icon?: ReactNode;
    className?: string;
    cardClassName?: string;
    relative?: boolean;
    onClick?: () => void;
};

export function NavigationCard({
    href,
    title,
    icon,
    className = '',
    cardClassName = '',
    relative = false,
    onClick,
}: NavigationCardProps) {
    const pathname = usePathname();
    const router = useRouter();

    const finalHref = href
        ? relative
            ? `${pathname}/${href}`.replace('//', '/')
            : href
        : '';

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (href) {
            router.push(finalHref);
        }
    };

    return (
        <div
            className={`block ${className}`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter') handleClick();
            }}
        >
            <div
                className={`bg-white w-full rounded-lg shadow-sm p-6 text-center cursor-pointer transition-all hover:shadow-md border hover:bg-gray-50 ${cardClassName}`}
            >
                {icon && <div className="mb-2">{icon}</div>}
                <p className="text-foreground font-medium">{title}</p>
            </div>
        </div>
    );
}
