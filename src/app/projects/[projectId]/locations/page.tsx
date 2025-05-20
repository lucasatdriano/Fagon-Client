'use client';

import { LocationCard } from '@/components/cards/LocationCard';
import { NavigationCard } from '@/components/cards/NavegationCard';
import { AlertTriangleIcon, MapPinPlusIcon } from 'lucide-react';
import LocationModal from '@/components/modals/LocationModal';
import { useState } from 'react';

export default function DashboardInspectorPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="h-svh flex flex-col items-center pt-20 px-6">
            <div className="w-full relative flex justify-center py-3">
                <h2 className="text-3xl font-sans bg-background px-2">
                    Vistoria
                </h2>
                <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
            </div>
            <div className="relative w-full h-full mb-80 flex flex-col justify-between gap-2">
                <div className="flex flex-col gap-2 pb-56">
                    <LocationCard
                        id="12"
                        name="Fachada"
                        pavement="Área Externa"
                        locationType="externo"
                        height={2.5}
                        hasPhotosSelected={false}
                    />
                    <LocationCard
                        id="12"
                        name="Fachada"
                        pavement="Área Externa"
                        locationType="externo"
                        height={2.5}
                        hasPhotosSelected={false}
                    />
                    <LocationCard
                        id="12"
                        name="Fachada"
                        pavement="Área Externa"
                        locationType="externo"
                        height={2.5}
                        hasPhotosSelected={false}
                    />
                    <LocationCard
                        id="12"
                        name="Fachada"
                        pavement="Área Externa"
                        locationType="externo"
                        height={2.5}
                        hasPhotosSelected={false}
                    />
                    <LocationCard
                        id="12"
                        name="Fachada"
                        pavement="Área Externa"
                        locationType="externo"
                        height={2.5}
                        hasPhotosSelected={false}
                    />
                    <LocationCard
                        id="12"
                        name="Fachada"
                        pavement="Área Externa"
                        locationType="externo"
                        height={2.5}
                        hasPhotosSelected={false}
                    />
                    <LocationCard
                        id="12"
                        name="Fachada"
                        pavement="Área Externa"
                        locationType="externo"
                        height={2.5}
                        hasPhotosSelected={false}
                    />
                    <LocationCard
                        id="12"
                        name="Fachada"
                        pavement="Área Externa"
                        locationType="externo"
                        height={2.5}
                        hasPhotosSelected={false}
                    />
                    <LocationCard
                        id="12"
                        name="Fachada"
                        pavement="Área Externa"
                        locationType="externo"
                        height={2.5}
                        hasPhotosSelected={false}
                    />
                    <LocationCard
                        id="12"
                        name="Fachada"
                        pavement="Área Externa"
                        locationType="externo"
                        height={2.5}
                        hasPhotosSelected={false}
                    />
                    <LocationCard
                        id="15646"
                        name="Banheiro"
                        pavement="1° Andar"
                        locationType="interno"
                        height={2.5}
                        hasPhotosSelected={true}
                    />
                    <NavigationCard
                        href="pathologies/create-pathology"
                        title="Verificar/Adicionar Nova Patologia"
                        icon={
                            <AlertTriangleIcon className="mx-auto text-primary" />
                        }
                    />
                </div>

                <div className="fixed bottom-4 left-0 right-0 px-6">
                    <NavigationCard
                        title="Adicionar Novo Local"
                        onClick={() => setIsModalOpen(true)}
                        icon={
                            <MapPinPlusIcon className="mx-auto text-primary" />
                        }
                        cardClassName="border-primary"
                    />

                    <LocationModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />
                </div>
            </div>
        </div>
    );
}
