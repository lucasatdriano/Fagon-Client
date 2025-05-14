import ProjectCard from '@/components/cards/ProjectCard';
import FabButton from '@/components/layout/FabButton';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardProjectsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/login');
    }

    return (
        <div className="h-svh flex flex-col items-center pt-20 px-6">
            <div className="w-full relative flex justify-center py-3">
                <h1 className="text-3xl font-sans bg-background px-2">
                    Projetos
                </h1>
                <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
            </div>
            <div className="w-full flex flex-col gap-2">
                <ProjectCard
                    id="123"
                    agencyNumber="0334"
                    upeCode={205034}
                    projectType="Laudo CMAR"
                    city="Salvador"
                    district="Pituba"
                    status="finalizado"
                    inspectorName="Maria Souza"
                    inspectorDate="03/06/2025"
                />
            </div>
            <FabButton title="Adicionar novo projeto" href="create-project" />
        </div>
    );
}
