'use client';

import { useParams, useRouter } from 'next/navigation';
import { NavigationCard } from '../../../components/cards/NavigationCard';
import PDFGeneratorWrapper from '../../../components/layout/PdfGeneratorWrapper';
import {
    Project,
    ProjectService,
} from '../../../services/domains/projectService';
import { ClipboardEditIcon, InfoIcon, Loader2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { parseCookies } from 'nookies';
import { useUserRole } from '../../../hooks/useUserRole';
import { formatNumberAgency } from '@/utils/formatters/formatNumberAgency';

export default function DashboardProjectPage() {
    const { projectId } = useParams();
    const id = projectId as string;
    const [project, setProject] = useState<Project>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { loading: roleLoading, isVisitor } = useUserRole();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (!roleLoading) {
            if (isVisitor && !window.location.pathname.includes('/locations')) {
                const cookies = parseCookies();
                const projectId = cookies.projectId || id;

                if (projectId) {
                    router.push(`/projects/${projectId}/locations`);
                } else {
                    router.push('/projects');
                }
            }
            setIsChecking(false);
        }
    }, [roleLoading, isVisitor, router, id]);

    useEffect(() => {
        if (!projectId || isVisitor) return;

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
    }, [projectId, id, isVisitor]);

    if (roleLoading || isChecking || loading) {
        return (
            <div className="flex h-svh items-center justify-center">
                <Loader2Icon className="animate-spin h-12 w-12 text-primary" />
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="flex h-svh items-center justify-center">
                <p className="text-error">
                    {error || 'Projeto não encontrado'}
                </p>
            </div>
        );
    }

    return (
        <div className="flex min-h-svh flex-col items-center pt-18 px-3 md:px-6">
            <div className="w-full">
                <div className="relative flex justify-center py-0 md:py-2">
                    <h1 className="text-3xl font-sans bg-background px-2 text-center">
                        AG. {formatNumberAgency(project.agency.agencyNumber)} -{' '}
                        {project.agency.city} - {project.agency.district}
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

                    <div className="relative flex justify-start">
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
