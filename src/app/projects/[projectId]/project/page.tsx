'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomEditInput } from '@/components/forms/CustomEditInput';
import { CustomButton } from '@/components/forms/CustomButton';
import { projectStatus } from '@/constants';
import { UpdateProjectFormValues, updateProjectSchema } from '@/validations';

type StatusItem = {
    value: string;
    label: string;
    bg: string;
    text: string;
};

export default function ProjectEditPage({
    params,
}: {
    params: { id: string };
}) {
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState('');
    const [statusData, setStatusData] = useState<StatusItem>({
        value: 'finalizado',
        label: 'Finalizado',
        bg: 'bg-green-100',
        text: 'text-green-700',
    });

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
                const response = await fetch(`/api/projects/${params.id}`);
                const data = await response.json();

                if (response.ok) {
                    // Preenche os valores iniciais
                    setValue('projectName', data.name || '');
                    setValue('upeCode', data.upe || '');
                    setValue('agency', data.agency || '');
                    setValue('numberAgency', data.numberAgency || '');
                    setValue('stateAgency', data.stateAgency || '');
                    setValue('cityAgency', data.cityAgency || '');
                    setValue('districtAgency', data.districtAgency || '');
                    setValue('projectType', data.projectType || '');
                    setValue('projectDate', data.projectDate || '');
                    setValue(
                        'responsibleEngineer',
                        data.responsibleEngineer || '',
                    );
                    setValue('inspectorName', data.inspectorName || '');
                    setValue('inspectorDate', data.inspectorDate || '');
                    setValue(
                        'totalArea',
                        data.totalArea ? data.totalArea.replace(' m²', '') : '',
                    );
                    setValue(
                        'height',
                        data.height ? data.height.replace(' m', '') : '',
                    );
                    setValue('status', data.status || '');

                    const foundStatus = projectStatus.find(
                        (s) => s.value === data.status,
                    );
                    if (foundStatus) {
                        setStatusData(foundStatus);
                    }
                } else {
                    setApiError('Falha ao carregar dados do projeto');
                }
            } catch (error) {
                setApiError('Erro na conexão com o servidor');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjectData();
    }, [params.id, setValue]);

    const onSubmit = async (data: UpdateProjectFormValues) => {
        try {
            const response = await fetch(`/api/projects/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                alert('Projeto atualizado com sucesso!');
            } else {
                throw new Error('Falha ao atualizar projeto');
            }
        } catch (error) {
            setApiError('Erro ao salvar as alterações');
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
                        Projeto - Salvador - Pituba
                    </h1>
                </div>
                <div className="flex items-center justify-center">
                    <hr className="w-full" />
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="py-4 px-8 space-y-6"
                >
                    {apiError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {apiError}
                        </div>
                    )}

                    <div className="flex justify-between pb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            UPE 205034
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
                            registration={register('agency')}
                            error={errors.agency?.message}
                            defaultValue="Itaú Unibanco S/A"
                            textColor="text-foreground"
                            disabled
                        />

                        <CustomEditInput
                            label="Número da Agência"
                            registration={register('numberAgency')}
                            error={errors.numberAgency?.message}
                            defaultValue="0334"
                            textColor="text-foreground"
                            disabled
                        />

                        <CustomEditInput
                            label="Estado"
                            registration={register('stateAgency')}
                            error={errors.stateAgency?.message}
                            defaultValue="Bahia"
                            textColor="text-foreground"
                            disabled
                        />

                        <CustomEditInput
                            label="Cidade"
                            registration={register('cityAgency')}
                            error={errors.cityAgency?.message}
                            defaultValue="Salvador"
                            textColor="text-foreground"
                            disabled
                        />

                        <CustomEditInput
                            label="Bairro"
                            registration={register('districtAgency')}
                            error={errors.districtAgency?.message}
                            defaultValue="Pituba"
                            textColor="text-foreground"
                            disabled
                        />

                        <CustomEditInput
                            label="Tipo do Projeto"
                            registration={register('projectType')}
                            error={errors.projectType?.message}
                            defaultValue="Laudo CMAR"
                            textColor="text-foreground"
                            disabled
                        />

                        <CustomEditInput
                            label="Data de Projeto"
                            type="date"
                            registration={register('projectDate')}
                            error={errors.projectDate?.message}
                            defaultValue="2022-04-01"
                            textColor="text-foreground"
                            disabled
                        />

                        <CustomEditInput
                            label="Engenheiro(a) Responsável"
                            registration={register('responsibleEngineer')}
                            error={errors.responsibleEngineer?.message}
                            defaultValue="Cinara Aparecida Batista Gonçalves"
                            textColor="text-foreground"
                        />

                        <CustomEditInput
                            label="Nome do Vistoriador"
                            registration={register('inspectorName')}
                            error={errors.inspectorName?.message}
                            defaultValue="Guilherme dos Santos"
                            textColor="text-foreground"
                        />

                        <CustomEditInput
                            label="Data da Vistoria"
                            type="date"
                            registration={register('inspectionDate')}
                            error={errors.inspectionDate?.message}
                            defaultValue="2025-04-07"
                            textColor="text-foreground"
                        />

                        <div className="flex items-center gap-2">
                            <CustomEditInput
                                label="Área Total da Agência"
                                registration={register('totalArea')}
                                error={errors.totalArea?.message}
                                textColor="text-foreground"
                                defaultValue="174,5"
                                className="flex-1"
                                disabled
                            />
                            <span>m²</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CustomEditInput
                                label="Altura Máxima do Pé Direito"
                                registration={register('height')}
                                error={errors.height?.message}
                                textColor="text-foreground"
                                defaultValue="5,98"
                                className="flex-1"
                                disabled
                            />
                            <span>m</span>
                        </div>
                    </div>

                    <div className="flex justify-center pt-4">
                        <CustomButton type="submit">
                            Salvar Informações
                        </CustomButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
