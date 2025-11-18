'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomEditInput } from '../../../../components/forms/CustomEditInput';
import { CustomButton } from '../../../../components/forms/CustomButton';
import { projectStatus, pavements } from '../../../../constants';
import {
    UpdateProjectFormValues,
    updateProjectSchema,
} from '../../../../validations';
import {
    Project,
    ProjectService,
} from '../../../../services/domains/projectService';
import { useParams } from 'next/navigation';
import { Loader2Icon, SaveIcon } from 'lucide-react';
import { toast } from 'sonner';
import { formatDateForInput } from '../../../../utils/formatters/formatDate';
import { getProjectTypeLabel } from '../../../../utils/formatters/formatValues';
import { EngineerService } from '../../../../services/domains/engineerService';
import { CustomRadioGroup } from '../../../../components/forms/CustomRadioGroup';
import { engineerProps } from '../../../../interfaces/engineer';
import { CustomCheckboxGroup } from '../../../../components/forms/CustomCheckbox';
import { Pavement } from '../../../../interfaces/pavement';
import { formatNumberAgency } from '../../../../utils/formatters/formatNumberAgency';
import { handleMaskedChange } from '../../../../utils/helpers/handleMaskedInput';
import { formatDecimalValue } from '../../../../utils/formatters/formatDecimal';

type StatusItem = {
    value: string;
    label: string;
    class: string;
};

type FormValues = UpdateProjectFormValues & {
    pavements?: Array<{
        id: string;
        pavement: string;
        height: number;
        area?: string;
    }>;
    engineer?: {
        id: string;
    };
};

export default function ProjectEditPage() {
    const { projectId } = useParams();
    const id = projectId as string;
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormModified, setIsFormModified] = useState(false);
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
    } = useForm<FormValues>({
        resolver: zodResolver(updateProjectSchema),
        defaultValues: {
            pavements: [],
            engineer: { id: '' },
        },
    });

    useEffect(() => {
        const fetchEngineers = async () => {
            try {
                const result = await EngineerService.listAll();
                const data = result.data.engineers;
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
                setValue('status', data.status || '');
                setValue('upeCode', data.upeCode.toString() || '');
                setValue('agency', {
                    id: data.agency.id,
                    name: data.agency.name,
                    agencyNumber: formatNumberAgency(data.agency.agencyNumber),
                    state: data.agency.state,
                    city: data.agency.city,
                    district: data.agency.district,
                });
                setValue(
                    'projectType',
                    getProjectTypeLabel(data.projectType || ''),
                );
                setValue('projectDate', formatDateForInput(data.createdAt));
                setValue('engineer', { id: data.engineer.id || '' });
                setValue('inspectorName', data.inspectorName || '');
                setValue(
                    'inspectionDate',
                    formatDateForInput(data.inspectionDate),
                );
                setValue(
                    'technicalResponsibilityNumber',
                    data.technicalResponsibilityNumber || '',
                );
                setValue('structureType', data.structureType || '');
                setValue('floorHeight', data.floorHeight || '');
                setValue(
                    'pavements',
                    data.pavements
                        ? data.pavements.map((p: Pavement) => ({
                              id: p.id,
                              pavement: p.pavement,
                              height: p.height || 0,
                              area: p.area
                                  ? formatDecimalValue(p.area.toString())
                                  : '',
                          }))
                        : [],
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

    useEffect(() => {
        const checkFormChanges = (currentValues: FormValues) => {
            if (!project) return false;

            const basicFieldsChanged =
                currentValues.inspectorName !== project.inspectorName ||
                currentValues.inspectionDate !==
                    formatDateForInput(project.inspectionDate) ||
                currentValues.structureType !== project.structureType ||
                currentValues.floorHeight !== project.floorHeight ||
                currentValues.engineer?.id !== project.engineer.id;

            const pavementsChanged = () => {
                if (!currentValues.pavements || !project.pavements)
                    return currentValues.pavements !== project.pavements;

                if (currentValues.pavements.length !== project.pavements.length)
                    return true;

                for (let i = 0; i < currentValues.pavements.length; i++) {
                    const currentPavement = currentValues.pavements[i];
                    const originalPavement = project.pavements[i];

                    if (
                        currentPavement.pavement !==
                            originalPavement.pavement ||
                        currentPavement.height !== originalPavement.height ||
                        (currentPavement.area || '') !==
                            (originalPavement.area?.toString() || '')
                    ) {
                        return true;
                    }
                }

                return false;
            };

            return basicFieldsChanged || pavementsChanged();
        };

        const subscription = watch((value) => {
            setIsFormModified(checkFormChanges(value as FormValues));
        });

        return () => subscription.unsubscribe();
    }, [watch, project]);

    const onSubmit = async (formData: FormValues) => {
        try {
            setIsLoading(true);

            const formattedInspectionDate = formData.inspectionDate
                ? new Date(formData.inspectionDate).toISOString()
                : undefined;

            const updateData = {
                inspectorName: formData.inspectorName || undefined,
                inspectionDate: formattedInspectionDate,
                structureType: formData.structureType || undefined,
                engineerId: formData.engineer?.id,
                floorHeight: formData.floorHeight,
                technicalResponsibilityNumber:
                    formData.technicalResponsibilityNumber,
                pavements: formData.pavements?.map((p) => ({
                    id: p.id,
                    pavement: p.pavement,
                    height: p.height,
                    area: p.area
                        ? parseFloat(p.area.replace(',', '.'))
                        : undefined,
                })),
            };

            const response = await ProjectService.update(id, updateData);

            if (response) {
                toast.success('Projeto atualizado com sucesso!');
                const updatedProject = await ProjectService.getById(id);
                setProject(updatedProject.data);
                setIsFormModified(false);

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
            <div className="flex justify-center items-center min-h-svh">
                <Loader2Icon className="animate-spin w-12 h-12 text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-svh grid place-items-center bg-background pt-20 sm:pt-24 pb-6 px-2">
            <div className="w-full md:w-4/5 lg:w-3/4 2xl:w-2/4 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex items-center justify-center py-4 px-12">
                    <h1 className="text-2xl font-bold text-center">
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
                    className="py-4 px-10 space-y-6"
                >
                    <div className="flex flex-col-reverse gap-4 md:flex-row justify-between pb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            UPE {project?.upeCode}
                        </h2>
                        {statusData && (
                            <h2
                                className={`text-lg md:text-xl font-semibold ${statusData?.class} px-4 py-1 rounded-xl`}
                            >
                                {statusData?.label}
                            </h2>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <CustomEditInput
                            label="Agência"
                            registration={register('agency.name', {
                                required: false,
                            })}
                            error={undefined}
                            id="AgencyNameInput"
                            defaultValue={project?.agency.name}
                            disabled
                        />

                        <CustomEditInput
                            label="Número da Agência"
                            registration={register('agency.agencyNumber', {
                                required: false,
                            })}
                            error={undefined}
                            id="AgencyNumberInput"
                            defaultValue={project?.agency.agencyNumber}
                            disabled
                        />

                        <CustomEditInput
                            label="Estado"
                            registration={register('agency.state', {
                                required: false,
                            })}
                            error={undefined}
                            id="StateInput"
                            defaultValue={project?.agency.state}
                            disabled
                        />

                        <CustomEditInput
                            label="Cidade"
                            registration={register('agency.city', {
                                required: false,
                            })}
                            error={undefined}
                            id="CityInput"
                            defaultValue={project?.agency.city}
                            disabled
                        />

                        <CustomEditInput
                            label="Bairro"
                            registration={register('agency.district', {
                                required: false,
                            })}
                            error={undefined}
                            id="DistrictInput"
                            defaultValue={project?.agency.district}
                            disabled
                        />

                        <CustomEditInput
                            label="Tipo do Projeto"
                            registration={register('projectType', {
                                required: false,
                            })}
                            error={undefined}
                            id="ProjectTypeInput"
                            defaultValue={project?.projectType}
                            disabled
                        />

                        <CustomEditInput
                            label="Data do Projeto"
                            type="date"
                            registration={register('projectDate', {
                                required: false,
                            })}
                            error={undefined}
                            id="ProjectDateInput"
                            defaultValue={project?.createdAt}
                            disabled
                        />

                        <CustomEditInput
                            label="Número ART/RRT do Projeto"
                            registration={register(
                                'technicalResponsibilityNumber',
                            )}
                            error={
                                errors.technicalResponsibilityNumber?.message
                            }
                            id="TechnicalResponsibilityNumberInput"
                            defaultValue={
                                project?.technicalResponsibilityNumber
                            }
                        />

                        <CustomEditInput
                            label="Nome do Vistoriador"
                            registration={register('inspectorName')}
                            error={errors.inspectorName?.message}
                            id="InspectorNameInput"
                            defaultValue={project?.inspectorName}
                        />

                        <CustomEditInput
                            label="Data da Vistoria"
                            registration={register('inspectionDate', {
                                validate: (value) => {
                                    if (!value) return 'Data é obrigatória';
                                    const parts = value.split('/');
                                    if (parts.length !== 3)
                                        return 'Data inválida';
                                    return true;
                                },
                            })}
                            error={errors.inspectionDate?.message}
                            id="InspectionDateInput"
                            defaultValue={project?.inspectionDate || ''}
                            isDate={true}
                        />

                        <CustomEditInput
                            label="Tipo da estrutura"
                            registration={register('structureType')}
                            error={errors.structureType?.message}
                            id="StructureTypeInput"
                            defaultValue={project?.structureType}
                        />

                        <CustomEditInput
                            label="Valor Piso a Piso (m)"
                            registration={register('floorHeight')}
                            onChange={(e) =>
                                handleMaskedChange('floorHeight', e, setValue)
                            }
                            error={errors.floorHeight?.message}
                            id="FloorHeightInput"
                            defaultValue={project?.floorHeight}
                        />
                    </div>

                    <div className="col-span-2">
                        <div className="w-full relative flex justify-start">
                            <hr className="w-full h-px absolute border-foreground top-1/2 left-0" />
                            <h2 className="text-xl text-foreground font-sans bg-white px-2 ml-6 z-0">
                                Engenheiro Responsável
                            </h2>
                        </div>

                        <CustomRadioGroup
                            name="engineer.id"
                            placeholder="Engenheiro(a) Responsável"
                            options={engineers}
                            selectedValue={watch('engineer.id')}
                            onChange={(val) => setValue('engineer.id', val)}
                            gridCols={'2B'}
                            error={errors.engineer?.message}
                            className="p-4 border-2 rounded-lg mt-6"
                        />
                    </div>

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
                            selectedValues={
                                watch('pavements')?.map((p) => p.pavement) || []
                            }
                            onChange={(values) => {
                                const currentPavements =
                                    watch('pavements') || [];
                                const newPavements = values.map((value) => {
                                    const existing = currentPavements.find(
                                        (p) => p.pavement === value,
                                    );
                                    return (
                                        existing || {
                                            id: '',
                                            pavement: value,
                                            height: 0,
                                            area: '',
                                        }
                                    );
                                });
                                setValue('pavements', newPavements);
                            }}
                            gridCols={'full'}
                            error={errors.pavements?.root?.message}
                            className="p-4 border-2 rounded-lg mt-6"
                        />

                        <div className="w-full grid md:grid-cols-2 gap-10 mt-8">
                            {watch('pavements')?.map((pavement, index) => (
                                <CustomEditInput
                                    key={index}
                                    label={`Área do ${
                                        pavements.find(
                                            (p) =>
                                                p.value === pavement.pavement,
                                        )?.label
                                    } (m²)`}
                                    registration={register(
                                        `pavements.${index}.area`,
                                    )}
                                    defaultValue={pavement.area}
                                    onChange={(e) =>
                                        handleMaskedChange(
                                            `pavements.${index}.area`,
                                            e,
                                            setValue,
                                        )
                                    }
                                    error={
                                        errors.pavements?.[index]?.area?.message
                                    }
                                    id={`Pavements${index}AreaInput`}
                                    inputMode="decimal"
                                    maxLength={7}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center pt-4">
                        <CustomButton
                            type="submit"
                            icon={<SaveIcon />}
                            disabled={!isFormModified || isLoading}
                        >
                            {isLoading ? 'Salvando...' : 'Salvar Informações'}
                        </CustomButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
