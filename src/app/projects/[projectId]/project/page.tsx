'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomEditInput } from '@/components/forms/CustomEditInput';
import { CustomButton } from '@/components/forms/CustomButton';
import { projectStatus, pavements } from '@/constants';
import { UpdateProjectFormValues, updateProjectSchema } from '@/validations';
import { Project, ProjectService } from '@/services/domains/projectService';
import { useParams } from 'next/navigation';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { formatDateForInput } from '@/utils/formatters/formatDate';
import { getProjectTypeLabel } from '@/utils/formatters/formatValues';
import { EngineerService } from '@/services/domains/engineerService';
import { CustomRadioGroup } from '@/components/forms/CustomRadioGroup';
import { engineerProps } from '@/interfaces/engineer';
import { CustomCheckboxGroup } from '@/components/forms/CustomCheckbox';

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
    const [engineers, setEngineers] = useState<
        { id: string; value: string; label: string }[]
    >([]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<UpdateProjectFormValues>({
        resolver: zodResolver(updateProjectSchema),
    });

    useEffect(() => {
        const fetchEngineers = async () => {
            try {
                const result = await EngineerService.listAll();
                const data = result.data;
                const formatted = data.map((engineer: engineerProps) => ({
                    id: engineer.id,
                    value: engineer.id,
                    label: engineer.name,
                }));
                setEngineers(formatted);
            } catch (error) {
                console.error('Erro ao buscar engenheiros:', error);
            }
        };

        fetchEngineers();
    }, []);

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                setIsLoading(true);
                const response = await ProjectService.getById(id);
                const data = response.data;
                setProject(data);

                setValue('name', data.name || '');
                setValue('upeCode', data.upeCode.toString() || '');
                setValue('agency', data.agency || '');
                setValue('agency.agencyNumber', data.agency.agencyNumber || '');
                setValue('agency.state', data.agency.state || '');
                setValue('agency.city', data.agency.city || '');
                setValue('agency.district', data.agency.district || '');
                setValue(
                    'projectType',
                    getProjectTypeLabel(data.projectType || ''),
                );
                setValue('projectDate', formatDateForInput(data.createdAt));
                setValue('engineer.id', data.engineer.id || '');
                setValue('inspectorName', data.inspectorName || '');
                setValue(
                    'inspectionDate',
                    formatDateForInput(data.inspectionDate),
                );
                setValue('structureType', data.structureType || '');
                setValue('status', data.status || '');
                setValue(
                    'pavements',
                    data.pavement?.map((p) => p.pavement) || [],
                );

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
                inspectionDate: formData.inspectionDate
                    ? new Date(formData.inspectionDate).toISOString()
                    : null,
                structureType: formData.structureType,
                engineerId: formData.engineer?.id,
                pavement: formData.pavements?.map((pavement) => ({
                    pavement,
                })),
                // floorHeight: formData.floorHeight,
            };

            const response = await ProjectService.update(id, updateData);

            if (response) {
                toast.success('Projeto atualizado com sucesso!');
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
                <Loader2Icon className="animate-spin w-12 h-12 text-primary" />
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
                    onSubmit={handleSubmit(onSubmit, (errors) => {
                        console.error('Form validation errors:', errors);
                    })}
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
                    </div>

                    {/* Seção Engenheiro Responsável */}
                    <div className="col-span-2">
                        <div className="w-full relative flex justify-start">
                            <hr className="w-full h-px absolute border-foreground top-1/2 left-0" />
                            <h2 className="text-xl text-foreground font-sans bg-white px-2 ml-6 z-0">
                                Engenheiro Responsável
                            </h2>
                        </div>

                        <CustomRadioGroup
                            name="engineer"
                            placeholder="Engenheiro(a) Responsável"
                            options={engineers}
                            selectedValue={watch('engineer.id')}
                            onChange={(val) => setValue('engineer.id', val)}
                            className="p-4 border-2 rounded-lg mt-6"
                            gridCols={2}
                        />
                    </div>

                    {/* Seção Pavimentos */}
                    <div className="col-span-2">
                        <div className="w-full relative flex justify-start">
                            <hr className="w-full h-px absolute border-foreground top-1/2 left-0" />
                            <h2 className="text-xl text-foreground font-sans bg-white px-2 ml-6 z-0">
                                Pavimentos
                            </h2>
                        </div>

                        <CustomCheckboxGroup
                            name="pavements"
                            options={pavements.map((p) => ({
                                value: p.value,
                                label: p.label,
                            }))}
                            selectedValues={watch('pavements') || []}
                            onChange={(values) => setValue('pavements', values)}
                            className="p-4 border-2 rounded-lg mt-6"
                            gridCols={'full'}
                        />
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
