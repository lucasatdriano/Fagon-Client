import { LocationCard } from '@/components/cards/LocationCard';
import { NavigationCard } from '@/components/cards/navegationCard';
import { InfoIcon } from 'lucide-react';
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
                <h2 className="text-3xl font-sans bg-background px-2">
                    Projeto - Salvador - Pituba
                </h2>
                <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
            </div>
            <div className="w-full flex flex-col gap-2">
                <NavigationCard
                    href="/informacoes-projeto"
                    title="Ver Informações do Projeto"
                    icon={<InfoIcon className="mx-auto text-primary" />}
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
            </div>
        </div>
    );
}
