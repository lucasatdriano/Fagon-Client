'use client';

import { FileTextIcon, LandmarkIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const navItems = [
    {
        label: 'Projetos',
        href: '/projects',
        icon: FileTextIcon,
    },
    {
        label: 'Agências',
        href: '/agencies',
        icon: LandmarkIcon,
    },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 w-svw bg-primary p-2 flex justify-around items-center rounded-t-2xl shadow-md md:hidden z-50">
            {navItems.map((item, index) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                    <div
                        key={item.href}
                        className="flex-1 flex justify-center relative"
                    >
                        <Link
                            href={item.href}
                            className={clsx(
                                'flex flex-col items-center gap-1 px-2 py-1 transition-all duration-150',
                                isActive && 'border-b-2 border-background',
                            )}
                        >
                            <Icon
                                className={clsx('w-6 h-6', {
                                    'text-background': isActive,
                                    'text-orange-200': !isActive,
                                })}
                            />
                            <span
                                className={clsx('text-xs mt-1 font-semibold', {
                                    'text-background': isActive,
                                    'text-orange-200': !isActive,
                                })}
                            >
                                {item.label}
                            </span>
                        </Link>

                        {index !== navItems.length - 1 && (
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-4/5 bg-background rounded-lg" />
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
