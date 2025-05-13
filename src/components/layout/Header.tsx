'use client';

import { ArrowLeftIcon, MoreVerticalIcon, SearchIcon } from 'lucide-react';
import Image from 'next/image';
import CustomFormInput from '../forms/CustomFormInput';
import { ReactNode, useState } from 'react';
import { DropdownMenu } from './DropdownMenu';

type HeaderType = 'default' | 'back' | 'backMenu' | 'search';

interface DropdownItem {
    label: string;
    action: () => void;
    icon?: ReactNode;
    className?: string;
}

interface HeaderProps {
    type: HeaderType;
    onBack?: () => void;
    dropdownItems?: DropdownItem[];
    hasSidebar?: boolean;
}

export default function Header({
    type,
    onBack,
    dropdownItems = [],
    hasSidebar = false,
}: HeaderProps) {
    const [search, setSearch] = useState('');

    return (
        <header
            className={`fixed z-40 top-0 w-full ${
                hasSidebar ? 'md:w-[calc(100%-8rem)]' : 'md:w-full'
            } bg-white px-16 py-3 shadow flex items-center justify-between gap-4 rounded-b-2xl`}
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
                        src="/images/logo-horizontal.svg"
                        alt="Logo Fagon"
                        width={150}
                        height={150}
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
                    />
                    <CustomFormInput
                        icon={<SearchIcon />}
                        label="Pesquisar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        borderColor="border-foreground"
                    />
                </div>
            )}
            {type === 'backMenu' && (
                <DropdownMenu
                    trigger={
                        <button
                            title="Menu de opções"
                            aria-label="Menu de opções"
                            className="hover:bg-gray-500/10 p-1 rounded-full"
                        >
                            <MoreVerticalIcon className="w-6 h-6" />
                        </button>
                    }
                    items={dropdownItems}
                    side="bottom"
                    bg="bg-white"
                    textColor="text-gray-800"
                    hoverBg="hover:bg-gray-100"
                    zIndex="z-50"
                />
            )}
        </header>
    );
}
