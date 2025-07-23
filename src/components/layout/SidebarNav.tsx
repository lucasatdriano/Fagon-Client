'use client';

import { FileTextIcon, LandmarkIcon } from 'lucide-react';
import Image from 'next/image';
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

export default function SidebarNav() {
    const pathname = usePathname();

    return (
        <div className="fixed z-20 hidden md:flex w-32 min-h-svh flex-col items-center bg-primary py-6 px-2 text-background rounded-r-2xl">
            <div className="mb-10">
                <Image
                    width={50}
                    height={50}
                    src="/icons/logo-icon-alternative.svg"
                    alt="Logo Fagon"
                    className="text-secondary w-16 h-auto"
                />
            </div>

            <nav className="flex flex-col gap-6 w-full items-center">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                'flex flex-col items-center gap-1 px-2 py-1 w-full rounded hover:bg-primary-hover transition-all duration-150',
                                isActive && 'border-l-4 border-background',
                            )}
                        >
                            <Icon className="w-8 h-8" />
                            <span className="text-sm">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
