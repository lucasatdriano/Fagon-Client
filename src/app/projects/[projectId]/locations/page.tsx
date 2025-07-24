'use client';

import { LocationCard } from '../../../../components/cards/LocationCard';
import { NavigationCard } from '../../../../components/cards/NavigationCard';
import { AlertTriangleIcon, Loader2Icon, MapPinPlusIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
    Location,
    LocationService,
} from '../../../../services/domains/locationService';
import CreateLocationModal from '../../../../components/modals/locationModals/CreateLocationModal';
import { toast } from 'sonner';
import { useUserRole } from '../../../../hooks/useUserRole';

export default function DashboardInspectorPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const { isVisitor } = useUserRole();
    const params = useParams();
    const projectId = params.projectId as string;

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                setLoading(true);
                const response = await LocationService.listAll(projectId);

                setLocations(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            fetchLocations();
        }
    }, [projectId]);

    const handleLocationCreated = async () => {
        try {
            const response = await LocationService.listAll(projectId);
            setLocations(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteLocation = async (locationId: string) => {
        try {
            await LocationService.delete(locationId);
            toast.success('Local deletado com sucesso');
            const response = await LocationService.listAll(projectId);
            setLocations(response.data);
        } catch (err) {
            toast.error('Erro ao deletar local');
            console.error(err);
        }
    };

    return (
        <div className="min-h-svh flex flex-col items-center pt-16 px-2 md:px-6">
            <div className="w-full relative flex justify-center py-3">
                <h2 className="text-3xl font-sans bg-background px-2">
                    Vistoria
                </h2>
                <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2Icon className="animate-spin h-12 w-12 text-primary" />
                </div>
            ) : (
                <div className="relative w-full min-h-svh pb-48">
                    <div className="flex flex-col gap-2">
                        {locations.map((location: Location) => (
                            <LocationCard
                                href={`${location.id}`}
                                relative
                                key={location.id}
                                id={location.id}
                                name={location.name}
                                locationType={location.locationType}
                                height={location.height}
                                pavement={location.pavement?.pavement || ''}
                                hasPhotosSelected={
                                    location.photo?.some(
                                        (photo) => photo.selectedForPdf,
                                    ) || false
                                }
                                onDelete={handleDeleteLocation}
                                isVisitor={isVisitor}
                            />
                        ))}

                        <NavigationCard
                            href={`/projects/${projectId}/pathologies/create-pathology`}
                            title="Verificar/Adicionar Nova Patologia"
                            icon={
                                <AlertTriangleIcon className="mx-auto text-primary" />
                            }
                        />
                    </div>

                    <div className="fixed bottom-2 xl:bottom-4 left-0 right-0 px-2 md:px-6">
                        <NavigationCard
                            title="Adicionar Novo Local"
                            onClick={() => setIsModalOpen(true)}
                            icon={
                                <MapPinPlusIcon className="mx-auto text-primary" />
                            }
                            cardClassName="border-primary"
                        />

                        <CreateLocationModal
                            isOpen={isModalOpen}
                            projectId={projectId}
                            onClose={() => setIsModalOpen(false)}
                            onSuccess={handleLocationCreated}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
