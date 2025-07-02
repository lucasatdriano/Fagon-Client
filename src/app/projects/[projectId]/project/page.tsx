'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomEditInput } from '@/components/forms/CustomEditInput';
import { CustomButton } from '@/components/forms/CustomButton';
import { projectStatus } from '@/constants';
import { UpdateProjectFormValues, updateProjectSchema } from '@/validations';
import { Project, ProjectService } from '@/services/domains/projectService';
import { useParams } from 'next/navigation';

type StatusItem = {
    value: string;
    label: string;
    bg: string;
    text: string;
};

export default function ProjectEditPage() {
    const { projectId } = useParams();
    const id = projectId as string;
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [statusData, setStatusData] = useState<StatusItem>();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<UpdateProjectFormValues>({
        resolver: zodResolver(updateProjectSchema),
    });

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                setIsLoading(true);
                const response = await ProjectService.getById(id);
                const data = response.data;
                setProject(data);
                console.log(data);
                setValue('name', data.name || '');
                setValue('upeCode', data.upeCode.toString() || '');
                setValue('agency', data.agency || '');
                setValue('agency.agencyNumber', data.agency.agencyNumber || '');
                setValue('agency.state', data.agency.state || '');
                setValue('agency.city', data.agency.city || '');
                setValue('agency.district', data.agency.district || '');
                setValue('projectType', data.projectType || '');
                setValue('projectDate', data.createdAt || '');
                setValue('engineer.name', data.engineer.name || '');
                setValue('inspectorName', data.inspectorName || '');
                setValue('inspectionDate', data.inspectionDate || '');
                setValue('floorHeight', data.floorHeight || '');
                setValue('status', data.status || '');

                const foundStatus = projectStatus.find(
                    (s) => s.value === data.status,
                );
                if (foundStatus) {
                    setStatusData(foundStatus);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjectData();
    }, [id, setValue]);

    const onSubmit = async (formData: UpdateProjectFormValues) => {
        try {
            setIsLoading(true);

            const updateData = {
                inspectorName: formData.inspectorName,
                inspectionDate: formData.inspectionDate,
                structureType: formData.structureType,
                floorHeight: formData.floorHeight,
            };

            const response = await ProjectService.update(id, {
                updateData,
            });

            if (response) {
                alert('Projeto atualizado com sucesso!');
                if (
                    statusData &&
                    formData.status &&
                    formData.status !== statusData.value
                ) {
                    const foundStatus = projectStatus.find(
                        (s) => s.value === formData.status,
                    );
                    if (foundStatus) setStatusData(foundStatus);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="grid place-items-center min-h-screen bg-background pt-20 px-4">
            <div className="w-3/5 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex items-center justify-center py-4 px-12">
                    <h1 className="text-2xl font-bold">
                        Projeto - {project?.agency.city} -{' '}
                        {project?.agency.district}
                    </h1>
                </div>
                <div className="flex items-center justify-center">
                    <hr className="w-full" />
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="py-4 px-8 space-y-6"
                >
                    <div className="flex justify-between pb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            UPE {project?.upeCode}
                        </h2>
                        {statusData && (
                            <h2
                                className={`text-xl font-semibold ${statusData.bg} ${statusData.text} px-4 py-1 rounded-xl`}
                            >
                                {statusData.label}
                            </h2>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <CustomEditInput
                            label="Agência"
                            registration={register('agency.name')}
                            error={errors.agency?.name?.message}
                            defaultValue={project?.agency.name}
                            textColor="text-foreground"
                            disabled
                        />

                        <CustomEditInput
                            label="Número da Agência"
                            registration={register('agency.agencyNumber')}
                            error={errors.agency?.agencyNumber?.message}
                            defaultValue={project?.agency.agencyNumber}
                            textColor="text-foreground"
                            disabled
                        />

                        <CustomEditInput
                            label="Estado"
                            registration={register('agency.state')}
                            error={errors.agency?.state?.message}
                            defaultValue={project?.agency.state}
                            textColor="text-foreground"
                            disabled
                        />

                        <CustomEditInput
                            label="Cidade"
                            registration={register('agency.city')}
                            error={errors.agency?.city?.message}
                            defaultValue={project?.agency.city}
                            textColor="text-foreground"
                            disabled
                        />

                        <CustomEditInput
                            label="Bairro"
                            registration={register('agency.district')}
                            error={errors.agency?.district?.message}
                            defaultValue={project?.agency.district}
                            textColor="text-foreground"
                            disabled
                        />

                        <CustomEditInput
                            label="Tipo do Projeto"
                            registration={register('projectType')}
                            error={errors.projectType?.message}
                            defaultValue={project?.projectType}
                            textColor="text-foreground"
                            disabled
                        />

                        <CustomEditInput
                            label="Data do Projeto"
                            type="date"
                            registration={register('projectDate')}
                            error={errors.projectDate?.message}
                            defaultValue={project?.createdAt}
                            textColor="text-foreground"
                            disabled
                        />

                        <CustomEditInput
                            label="Engenheiro(a) Responsável"
                            registration={register('engineer.name')}
                            error={errors.engineer?.name?.message}
                            defaultValue={project?.engineer.name}
                            textColor="text-foreground"
                            disabled
                        />

                        <CustomEditInput
                            label="Nome do Vistoriador"
                            registration={register('inspectorName')}
                            error={errors.inspectorName?.message}
                            defaultValue={project?.inspectorName}
                            textColor="text-foreground"
                        />

                        <CustomEditInput
                            label="Data da Vistoria"
                            type="date"
                            registration={register('inspectionDate')}
                            error={errors.inspectionDate?.message}
                            defaultValue={project?.inspectionDate?.toString()}
                            textColor="text-foreground"
                        />

                        <CustomEditInput
                            label="Tipo da estrutura"
                            registration={register('structureType')}
                            error={errors.structureType?.message}
                            defaultValue={project?.structureType}
                            textColor="text-foreground"
                        />

                        {/* <div className="flex items-center gap-2">
                            <CustomEditInput
                                label="Área Total da Agência"
                                registration={register('totalArea')}
                                error={errors.totalArea?.message}
                                defaultValue={project?.totalArea}
                                textColor="text-foreground"
                                className="flex-1"
                            />
                            <span>m²</span>
                        </div> */}
                        {/* <div className="flex items-center gap-2">
                            <CustomEditInput
                                label="Altura Máxima do Pé Direito"
                                registration={register('maxHeight')}
                                error={errors.maxHeight?.message}
                                defaultValue={project?.maxHeight}
                                textColor="text-foreground"
                                className="flex-1"
                            />
                            <span>m</span>
                        </div> */}
                    </div>

                    <div className="flex justify-center pt-4">
                        <CustomButton type="submit" disabled={isLoading}>
                            {isLoading ? 'Salvando...' : 'Salvar Informações'}
                        </CustomButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
