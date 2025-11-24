'use client';

import { ArrowLeftIcon, SearchIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link'; // ← Adicionar este import
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
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onSearchChange) {
            onSearchChange(e.target.value);
        }
    };

    return (
        <header
            className={`fixed z-40 top-0 w-full ${
                hasSidebar ? 'md:w-[calc(100%-8rem)]' : 'md:w-full'
            } bg-white px-8 md:px-16 py-2 shadow flex items-center justify-between gap-4 rounded-b-2xl`}
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
                <div className="flex w-full justify-center items-center self-center">
                    <Link href="/" className="flex justify-center">
                        <Image
                            height={50}
                            width={50}
                            src="/images/logo-horizontal.svg"
                            alt="Logo Fagon"
                            className="items-center w-auto h-12 cursor-pointer hover:opacity-80 transition-opacity" // ← Adicionar cursor-pointer
                            priority
                        />
                    </Link>
                </div>
            )}

            {type === 'back' && <span className="h-10 w-10"></span>}

            {type === 'search' && (
                <div className="flex items-center justify-center gap-8 w-full px-4 md:px-16">
                    <Link href="/">
                        <Image
                            width={50}
                            height={50}
                            src="/icons/logo-icon.svg"
                            alt="Logo Fagon"
                            className="md:hidden w-auto h-12 cursor-pointer hover:opacity-80 transition-opacity"
                        />
                    </Link>
                    <CustomFormInput
                        icon={<SearchIcon />}
                        label="Pesquisar..."
                        value={searchValue}
                        onChange={handleChange}
                        id="SearchInput"
                        borderColor="border-foreground"
                    />
                </div>
            )}

            {type === 'backMenu' && dropdownMenu}
        </header>
    );
}
