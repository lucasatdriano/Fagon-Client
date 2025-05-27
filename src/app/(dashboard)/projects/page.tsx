'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import ProjectCard from '@/components/cards/ProjectCard';
import FabButton from '@/components/layout/FabButton';
import { Project, ProjectService } from '@/services/domains/projectService';
import { LoaderCircleIcon, SearchXIcon } from 'lucide-react';

export default function DashboardProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1];

        if (!token) {
            router.push('/login');
            return;
        }

        ProjectService.listAll()
            .then((res) => {
                setProjects(res.data);
            })
            .catch((err) => {
                toast.error('Erro ao carregar projetos');
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, [router]);

    return (
        <div className="h-svh flex flex-col items-center pt-20 px-6">
            <div className="w-full relative flex justify-center py-3">
                <h1 className="text-3xl font-sans bg-background px-2">
                    Projetos
                </h1>
                <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
            </div>

            <div className="w-full grid gap-2 place-items-center">
                {loading ? (
                    <p className="flex gap-2 text-foreground mt-10">
                        <LoaderCircleIcon className="animate-spin" />
                        Carregando projetos...
                    </p>
                ) : projects.length === 0 ? (
                    <p className="flex gap-2 text-foreground mt-10">
                        <SearchXIcon />
                        Nenhum projeto encontrado.
                    </p>
                ) : (
                    projects.map((project: Project) => (
                        <ProjectCard
                            key={project.id}
                            id={project.id || ''}
                            agencyNumber={
                                project.agency.agencyNumber.toString() || ''
                            }
                            upeCode={project.upeCode.toString() || ''}
                            projectType={project.projectType || ''}
                            city={project.agency.city.toString() || ''}
                            district={project.agency.district.toString() || ''}
                            engineer={project.engineer.name.toString() || ''}
                            status={project.status || ''}
                            inspectorName={project.inspectorName || ''}
                            inspectionDate={project.inspectionDate || ''}
                        />
                    ))
                )}
            </div>

            <FabButton title="Adicionar novo projeto" href="create-project" />
        </div>
    );
}
