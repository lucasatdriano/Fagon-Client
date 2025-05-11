'use client';

import { ArrowLeftIcon, MoreVerticalIcon, SearchIcon } from 'lucide-react';
import Image from 'next/image';
import CustomFormInput from '../forms/CustomFormInput';
import { useState } from 'react';

type HeaderType = 'default' | 'back' | 'backMenu' | 'search';

interface HeaderProps {
    type: HeaderType;
    onBack?: () => void;
    onMenu?: () => void;
    hasSidebar?: boolean;
}

export default function Header({
    type,
    onBack,
    onMenu,
    hasSidebar = false,
}: HeaderProps) {
    const [search, setSearch] = useState('');

    return (
        <header
            className={`fixed top-0 w-full ${
                hasSidebar ? 'md:w-[calc(100%-8rem)]' : 'md:w-full'
            } bg-white px-4 py-3 shadow flex items-center justify-between gap-4 rounded-b-2xl`}
        >
            {(type === 'back' || type === 'backMenu') && (
                <button
                    title="Botão de voltar para a página anterior"
                    aria-label="Botão de voltar para a página anterior"
                    onClick={onBack}
                    className="hover:bg-gray-500/10 p-2 rounded-full transition-all duration-200"
                >
                    <ArrowLeftIcon className="w-8 h-8" />
                </button>
            )}
            {type !== 'search' && (
                <div className="flex items-center self-center">
                    <Image
                        src="images/logo-horizontal.svg"
                        alt="Logo Fagon"
                        width={150}
                        height={150}
                    />
                </div>
            )}
            {type !== 'search' && <span></span>}
            {type === 'search' && (
                <div className="flex items-center justify-center gap-8 w-full px-4 md:px-16">
                    <Image
                        src="icons/logo-icon.svg"
                        alt="Logo Fagon"
                        width={50}
                        height={50}
                        className="md:hidden"
                    />
                    <CustomFormInput
                        icon={<SearchIcon />}
                        label="Pesquisar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    ></CustomFormInput>
                </div>
            )}
            {type === 'backMenu' && (
                <button
                    title="Botão de abrir menu"
                    aria-label="Botão de abrir menu"
                    onClick={onMenu}
                    className="ml-auto"
                >
                    <MoreVerticalIcon className="w-6 h-6" />
                </button>
            )}
        </header>
    );
}
