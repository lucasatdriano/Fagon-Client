import { LocationCard } from '@/components/cards/LocationCard';
import { NavigationCard } from '@/components/cards/NavegationCard';
import { AlertTriangleIcon, MapPinPlusIcon } from 'lucide-react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardProjectPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/login');
    }

    return (
        <div className="h-svh flex flex-col items-center pt-20 px-6">
            <div className="w-full relative flex justify-center py-3">
                <h1 className="text-3xl font-sans bg-background px-2">
                    Vistoria
                </h1>
                <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
            </div>
            <div className="w-full h-full mb-80 flex flex-col justify-between gap-2">
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
                        id="15646"
                        name="Banheiro"
                        pavement="1° Andar"
                        locationType="interno"
                        height={2.5}
                        hasPhotosSelected={true}
                    />
                    <NavigationCard
                        href="/informacoes-projeto"
                        title="Adicionar Nova Patologia"
                        icon={
                            <AlertTriangleIcon className="mx-auto text-primary" />
                        }
                    />
                </div>
                <div className="w-full relative">
                    <NavigationCard
                        href="/informacoes-projeto"
                        title="Adicionar Novo Local"
                        icon={
                            <MapPinPlusIcon className="mx-auto text-primary" />
                        }
                        cardClassName="fixed bottom-4 border-primary"
                    />
                </div>
            </div>
        </div>
    );
}
