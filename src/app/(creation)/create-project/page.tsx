'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { HashIcon } from 'lucide-react';

import { CustomButton } from '@/components/forms/CustomButton';
import { SearchCardList } from '@/components/forms/SearchCardList';
import { CustomDropdownInput } from '@/components/forms/CustomDropdownInput';
import { CustomRadioGroup } from '@/components/forms/CustomRadioGroup';
import { CustomFormInput } from '@/components/forms/CustomFormInput';

import { createProjectSchema, CreateProjectFormValues } from '@/validations';
import { projectType } from '@/constants';
import { EngineerService } from '@/services/domains/engineerService';
import { AgencyService } from '@/services/domains/agencyService';
import { engineerProps } from '@/interfaces/engineer';
import { ProjectService } from '@/services/domains/projectService';
import { toast } from 'sonner';
import { ProjectType } from '@/types/project';

export default function CreateProjectPage() {
    const router = useRouter();
    const [engineers, setEngineers] = useState<
        { id: string; value: string; label: string }[]
    >([]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CreateProjectFormValues>({
        resolver: zodResolver(createProjectSchema),
        defaultValues: {
            projectType: '',
            selectedPerson: '',
            upeCode: '',
            agencyId: '',
        },
    });

    const onSubmit = async (data: CreateProjectFormValues) => {
        try {
            console.log(data);

            const newProject = await ProjectService.create({
                projectType: data.projectType as ProjectType,
                upeCode: Number(data.upeCode),
                agencyId: data.agencyId,
                engineerId: data.selectedPerson,
            });

            toast.success('Projeto criado com sucesso');
            router.push(`/projects/${newProject.data.id}`);
        } catch (error: unknown) {
            console.error('Erro ao criar projeto:', error);
        }
    };

    useEffect(() => {
        async function fetchEngineers() {
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
        }

        fetchEngineers();
    }, []);

    return (
        <div className="h-screen w-full flex items-center justify-center">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 bg-white grid place-items-center shadow-md p-6 rounded-lg w-full max-w-sm md:max-w-4xl"
            >
                <h1 className="text-2xl text-foreground mb-4 text-center font-sans">
                    Adicionar Novo Projeto
                </h1>

                <div className="w-full grid place-items-center gap-8">
                    <div className="grid grid-cols-2 w-full gap-6">
                        <CustomDropdownInput
                            options={projectType}
                            selectedOptionValue={watch('projectType')}
                            onOptionSelected={(val) => {
                                if (val) {
                                    setValue('projectType', val);
                                }
                            }}
                            placeholder="Selecione o Tipo do projeto*"
                            error={errors.projectType?.message}
                        />

                        <CustomRadioGroup
                            name="people"
                            options={engineers}
                            selectedValue={watch('selectedPerson')}
                            onChange={(val) => setValue('selectedPerson', val)}
                            className="p-4 border-2 rounded-lg row-span-2"
                            gridCols={1}
                        />

                        <CustomFormInput
                            icon={<HashIcon />}
                            label="UPE do projeto*"
                            {...register('upeCode')}
                            error={errors.upeCode?.message}
                            maxLength={6}
                            minLength={6}
                        />
                    </div>

                    <div className="w-full grid gap-0 place-items-start">
                        <SearchCardList
                            onSelectAgency={(agency) => {
                                setValue('agencyId', agency.id);
                            }}
                            searchAgencies={async (query: string) => {
                                if (query.length < 1) return [];
                                if (/^\d+$/.test(query)) {
                                    const response = await AgencyService.search(
                                        {
                                            agencyNumber: query,
                                        },
                                    );

                                    return response.data;
                                }

                                const response = await AgencyService.search({
                                    state: query,
                                    city: query,
                                    district: query,
                                });

                                return response.data;
                            }}
                        />
                        {errors.agencyId && (
                            <p className="text-sm text-error font-poppins">
                                {errors.agencyId.message}
                            </p>
                        )}
                        <p className="font-poppins">Selecione uma Agência*</p>
                    </div>
                </div>

                <div className="grid gap-4 pt-4">
                    <CustomButton
                        type="submit"
                        fontSize="text-lg"
                        className="hover:bg-secondary-hover"
                    >
                        Adicionar Projeto
                    </CustomButton>
                </div>
            </form>
        </div>
    );
}
