import Link from 'next/link';
import { ReactNode } from 'react';

type NavigationCardProps = {
    href: string;
    title: string;
    icon?: ReactNode;
    className?: string;
    cardClassName?: string;
};

export function NavigationCard({
    href,
    title,
    icon,
    className = '',
    cardClassName = '',
}: NavigationCardProps) {
    return (
        <Link href={href} passHref className={`${className}`}>
            <div
                className={`bg-white w-full rounded-lg shadow-sm p-6 text-center cursor-pointer transition-all hover:shadow-md border border-gray-200 hover:bg-gray-50 ${cardClassName}`}
            >
                {icon && <div className="mb-2">{icon}</div>}
                <h3 className="text-foreground font-medium">{title}</h3>
            </div>
        </Link>
    );
}
