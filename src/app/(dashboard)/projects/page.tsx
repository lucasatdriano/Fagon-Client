'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2Icon, SearchXIcon } from 'lucide-react';

import ProjectCard from '../../../components/cards/ProjectCard';
import FabButton from '../../../components/layout/FabButton';
import {
    Project,
    ProjectService,
} from '../../../services/domains/projectService';
import { useSearch } from '../../../contexts/SearchContext';
import { useAuth } from '../../../hooks/useAuth';
import { Pagination } from '@/components/layout/Pagination';
import { ITEMS_PER_PAGE } from '@/constants/pagination';
import { ApiResponse, ProjectsApiResponse } from '@/types/api';

export default function DashboardProjectsPage() {
    const { searchValue } = useSearch();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        totalPages: 1,
    });
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    useAuth();

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                let response: ApiResponse<ProjectsApiResponse>;

                if (searchValue.trim() === '') {
                    response = await ProjectService.listAll({
                        page: currentPage,
                        limit: ITEMS_PER_PAGE,
                    });
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
                        page: currentPage,
                        limit: ITEMS_PER_PAGE,
                    };
                    const cleanedParams = Object.fromEntries(
                        Object.entries(searchParams).filter(
                            ([, value]) => value !== undefined,
                        ),
                    );

                    response = await ProjectService.search(cleanedParams);
                }

                setProjects(response.data.projects);
                setPagination({
                    total: response.data.meta?.resource?.total || 0,
                    page: currentPage,
                    totalPages: response.data.meta?.resource?.totalPages || 1,
                });
            } catch (err) {
                console.error('Erro ao carregar projetos:', err);
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router, searchValue, currentPage]);

    return (
        <div className="min-h-svh flex flex-col items-center pt-16 px-2 pb-24 md:pt-18 md:px-4 md:pb-4">
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
                    <>
                        {projects.map((project: Project) => (
                            <ProjectCard
                                key={project.id}
                                id={project.id || ''}
                                agencyNumber={project.agency.agencyNumber || ''}
                                upeCode={project.upeCode.toString() || ''}
                                projectType={project.projectType || ''}
                                state={project.agency.state}
                                city={project.agency.city}
                                district={project.agency.district}
                                engineer={project.engineer.name}
                                status={project.status || ''}
                                inspectorName={project.inspectorName || ''}
                                inspectionDate={project.inspectionDate || ''}
                            />
                        ))}
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                        />
                    </>
                )}
            </div>

            <FabButton title="Adicionar novo projeto" href="create-project" />
        </div>
    );
}
