'use client';

import { ArrowLeftIcon, MapPinnedIcon, SearchIcon } from 'lucide-react';
import Image from 'next/image';
import { CustomFormInput } from '../forms/CustomFormInput';
import { ReactNode } from 'react';
import { CustomButton } from '../forms/CustomButton';
import { useRouter } from 'next/navigation';

type HeaderType =
    | 'default'
    | 'back'
    | 'backMenu'
    | 'search'
    | 'searchWithButtonLocalizationInspector';

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
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onSearchChange) {
            onSearchChange(e.target.value);
        }
    };

    const handleNavigateLocationInspector = () => {
        router.push('/agencies/location-inspector');
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

            {type !== 'search' &&
                type !== 'searchWithButtonLocalizationInspector' && (
                    <div className="flex w-full justify-center items-center">
                        <Image
                            height={50}
                            width={50}
                            src="/images/logo-horizontal.svg"
                            alt="Logo Fagon"
                            className="w-auto h-12"
                            priority
                        />
                    </div>
                )}

            {type === 'back' && <div className="w-10"></div>}

            {(type === 'search' ||
                type === 'searchWithButtonLocalizationInspector') && (
                <>
                    <Image
                        width={50}
                        height={50}
                        src="/icons/logo-icon.svg"
                        alt="Logo Fagon"
                        className="md:hidden w-auto h-10"
                    />

                    <div className="flex-1">
                        <CustomFormInput
                            icon={<SearchIcon />}
                            label="Pesquisar..."
                            value={searchValue}
                            onChange={handleChange}
                            id="SearchInput"
                            borderColor="border-foreground"
                        />
                    </div>
                </>
            )}

            {type === 'searchWithButtonLocalizationInspector' && (
                <div className="flex-shrink-0">
                    <CustomButton
                        icon={<MapPinnedIcon />}
                        color="bg-primary"
                        onClick={handleNavigateLocationInspector}
                    >
                        Localizar Vistoriador
                    </CustomButton>
                </div>
            )}

            {type === 'backMenu' && dropdownMenu}
        </header>
    );
}
