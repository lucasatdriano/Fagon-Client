import AgencyCard from '@/components/cards/AgencyCard';
import FabButton from '@/components/layout/FabButton';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardAgenciesPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/login');
    }

    return (
        <div className="h-svh flex flex-col items-center pt-20 px-6">
            <div className="w-full relative flex justify-center py-3">
                <h2 className="text-3xl font-sans bg-background px-2">
                    Agências
                </h2>
                <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
            </div>
            <AgencyCard
                id="112132"
                agencyNumber="0334"
                name="Itaú Unibanco S/A"
                city="Salvador"
                district="Pituba"
                street="Av. México Díaz da Silva"
                number="1832"
                cnpj="60701190075880"
                cep="06140040"
                state="Bahia"
            />
            <FabButton title="Adicionar nova agência" href="create-agency" />
        </div>
    );
}
