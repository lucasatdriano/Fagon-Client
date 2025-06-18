'use client';

import { ArrowLeftIcon, SearchIcon } from 'lucide-react';
import Image from 'next/image';
import { CustomFormInput } from '../forms/CustomFormInput';
import { ReactNode } from 'react';

type HeaderType = 'default' | 'back' | 'backMenu' | 'search';

interface HeaderProps {
    type: HeaderType;
    onBack?: () => void;
    dropdownMenu?: ReactNode;
    hasSidebar?: boolean;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
}

export function Header({
    type,
    onBack,
    dropdownMenu,
    hasSidebar = false,
    searchValue = '',
    onSearchChange,
}: HeaderProps) {
    console.log('[Header] Component rendered with props:', {
        type,
        searchValue,
        hasOnChange: !!onSearchChange,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('[Header] Input changed:', e.target.value);
        if (onSearchChange) {
            onSearchChange(e.target.value);
        }
    };

    return (
        <header
            className={`fixed z-40 top-0 w-full ${
                hasSidebar ? 'md:w-[calc(100%-8rem)]' : 'md:w-full'
            } bg-white px-8 md:px-16 py-3 shadow flex items-center justify-between gap-4 rounded-b-2xl`}
        >
            {(type === 'back' || type === 'backMenu') && onBack && (
                <button
                    title="Botão de voltar para a página anterior"
                    aria-label="Botão de voltar para a página anterior"
                    onClick={onBack}
                    className="hover:bg-gray-500/10 p-2 rounded-full transition-all duration-200"
                >
                    <ArrowLeftIcon className="w-7 h-7" />
                </button>
            )}

            {type !== 'search' && (
                <div className="flex items-center self-center">
                    <Image
                        src="/images/logo-horizontal.svg"
                        alt="Logo Fagon"
                        width={150}
                        height={150}
                        priority
                    />
                </div>
            )}

            {type === 'back' && <span></span>}

            {type === 'search' && (
                <div className="flex items-center justify-center gap-8 w-full px-4 md:px-16">
                    <Image
                        src="/icons/logo-icon.svg"
                        alt="Logo Fagon"
                        width={50}
                        height={50}
                        className="md:hidden"
                        priority
                    />
                    <CustomFormInput
                        icon={<SearchIcon />}
                        label="Pesquisar..."
                        value={searchValue}
                        onChange={handleChange}
                        borderColor="border-foreground"
                    />
                </div>
            )}

            {type === 'backMenu' && dropdownMenu}
        </header>
    );
}
