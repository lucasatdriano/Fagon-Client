'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2Icon, SearchXIcon } from 'lucide-react';

import ProjectCard from '../../../components/cards/ProjectCard';
import FabButton from '../../../components/layout/FabButton';
import {
    Project,
    ProjectService,
} from '../../../services/domains/projectService';
import { useSearch } from '../../../contexts/SearchContext';
import { useAuth } from '../../../hooks/useAuth';

export default function DashboardProjectsPage() {
    const { searchValue } = useSearch();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useAuth();

    useEffect(() => {
        setLoading(true);

        if (searchValue.trim() === '') {
            ProjectService.listAll()
                .then((res) => {
                    setProjects(res.data);
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => setLoading(false));
        } else {
            const searchParams = {
                upeCode: !isNaN(Number(searchValue))
                    ? Number(searchValue)
                    : undefined,
                inspectorName: searchValue,
                city: searchValue,
                engineerName: searchValue,
                agencyNumber: !isNaN(Number(searchValue))
                    ? Number(searchValue)
                    : undefined,
                state:
                    searchValue.length === 2
                        ? searchValue.toUpperCase()
                        : undefined,
            };

            const cleanedParams = Object.fromEntries(
                Object.entries(searchParams).filter(
                    ([, value]) => value !== undefined,
                ),
            );

            ProjectService.search(cleanedParams)
                .then((res) => {
                    setProjects(res.data);
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => setLoading(false));
        }
    }, [router, searchValue]);

    return (
        <div className="min-h-svh flex flex-col items-center pt-16 px-2 pb-24 md:pt-20 md:px-6 md:pb-4">
            <div className="w-full relative flex justify-center py-3">
                <h1 className="text-3xl font-sans bg-background px-2">
                    Projetos
                </h1>
                <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
            </div>

            <div className="w-full grid gap-2 place-items-center">
                {loading ? (
                    <p className="flex gap-2 mt-10 text-primary">
                        <Loader2Icon className="animate-spin" />
                        {searchValue
                            ? 'Buscando projetos...'
                            : 'Carregando projetos...'}
                    </p>
                ) : projects.length === 0 ? (
                    <p className="flex gap-2 text-primary mt-10">
                        <SearchXIcon />
                        {searchValue
                            ? 'Nenhum projeto encontrado para esta busca.'
                            : 'Nenhum projeto encontrado.'}
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
