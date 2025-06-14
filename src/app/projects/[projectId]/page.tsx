'use client';

import { useParams } from 'next/navigation';
import { NavigationCard } from '@/components/cards/NavegationCard';
import PDFGeneratorWrapper from '@/components/layout/PdfGeneratorWrapper';
import { Project, ProjectService } from '@/services/domains/projectService';
import { ClipboardEditIcon, InfoIcon, Loader2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DashboardProjectPage() {
    const { projectId } = useParams();
    const id = projectId as string;
    const [project, setProject] = useState<Project>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!projectId) return;

        async function fetchProject() {
            try {
                setLoading(true);
                const projectData = await ProjectService.getById(id);
                setProject(projectData.data);
            } catch (err) {
                console.error('Erro ao carregar projeto:', err);
                setError('Falha ao carregar projeto');
            } finally {
                setLoading(false);
            }
        }

        fetchProject();
    }, [projectId, id]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2Icon className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-error">
                    {error || 'Projeto não encontrado'}
                </p>
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col items-center pt-20 px-6">
            <div className="w-full">
                <div className="relative flex justify-center py-3">
                    <h1 className="text-3xl font-sans bg-background px-2">
                        UPE {project.upeCode} - {project.agency.city} -{' '}
                        {project.agency.district}
                    </h1>
                    <hr className="absolute left-0 top-1/2 -z-10 h-px w-full border-foreground" />
                </div>

                <div className="w-full flex flex-col gap-4 mt-4">
                    <NavigationCard
                        href={`/project`}
                        title="Ver Informações do Projeto"
                        icon={<InfoIcon className="mx-auto text-primary" />}
                        relative
                    />

                    <NavigationCard
                        href={`/locations`}
                        title="Ver Dados da Vistoria"
                        icon={
                            <ClipboardEditIcon className="mx-auto text-primary" />
                        }
                        relative
                    />

                    <div className="relative flex justify-start py-2 mt-4">
                        <h2 className="text-xl font-sans bg-background px-2 ml-8">
                            PDFs
                        </h2>
                        <hr className="absolute left-0 top-1/2 -z-10 h-px w-full border-foreground" />
                    </div>

                    <PDFGeneratorWrapper projectId={id} />
                </div>
            </div>
        </div>
    );
}
