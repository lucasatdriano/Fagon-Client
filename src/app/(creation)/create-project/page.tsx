'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { HashIcon } from 'lucide-react';

import { CustomButton } from '../../../components/forms/CustomButton';
import { SearchCardList } from '../../../components/forms/SearchCardList';
import { CustomDropdownInput } from '../../../components/forms/CustomDropdownInput';
import { CustomRadioGroup } from '../../../components/forms/CustomRadioGroup';
import { CustomFormInput } from '../../../components/forms/CustomFormInput';

import {
    createProjectSchema,
    CreateProjectFormValues,
} from '../../../validations';
import { pavements, projectType } from '../../../constants';
import { EngineerService } from '../../../services/domains/engineerService';
import { engineerProps } from '../../../interfaces/engineer';
import { ProjectService } from '../../../services/domains/projectService';
import { toast } from 'sonner';
import { ProjectType } from '../../../types/project';
import { CustomCheckboxGroup } from '../../../components/forms/CustomCheckbox';
import { handleMaskedChange } from '../../../utils/helpers/handleMaskedInput';
import { PavementItem } from '../../../services/domains/pavementService';

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
            pavements: [],
            upeCode: '',
            agencyId: '',
        },
    });

    const onSubmit = async (data: CreateProjectFormValues) => {
        try {
            const pavementsArray = Array.isArray(data.pavements)
                ? data.pavements
                : [];

            const payload = {
                projectType: data.projectType as ProjectType,
                upeCode: Number(data.upeCode),
                pavement: pavementsArray.map((p) => ({
                    pavement:
                        typeof p === 'string'
                            ? p
                            : (p as PavementItem).pavement,
                })),
                agencyId: data.agencyId,
                engineerId: data.engineer.id,
            };

            const newProject = await ProjectService.create(payload);
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
                onSubmit={handleSubmit(onSubmit, (errors) => {
                    console.error('Form validation errors:', errors);
                })}
                className="space-y-4 bg-white grid place-items-center shadow-md p-6 rounded-lg w-full max-w-sm md:max-w-4xl"
            >
                <h1 className="text-2xl text-foreground mb-4 text-center font-sans">
                    Adicionar Novo Projeto
                </h1>

                <div className="w-full grid place-items-center gap-4">
                    <div className="grid grid-cols-2 w-full gap-4">
                        <CustomDropdownInput
                            placeholder="Selecione o Tipo do projeto*"
                            options={projectType}
                            selectedOptionValue={watch('projectType')}
                            onOptionSelected={(val) => {
                                if (val) {
                                    setValue('projectType', val);
                                }
                            }}
                            error={errors.projectType?.message}
                        />

                        <CustomRadioGroup
                            name="engineer"
                            options={engineers}
                            selectedValue={watch('engineer.id')}
                            onChange={(val) => setValue('engineer.id', val)}
                            className="p-4 border-2 rounded-lg row-span-2"
                            gridCols={1}
                        />

                        <CustomFormInput
                            icon={<HashIcon />}
                            label="UPE do projeto*"
                            {...register('upeCode')}
                            onChange={(e) =>
                                handleMaskedChange('upeCode', e, setValue)
                            }
                            error={errors.upeCode?.message}
                            inputMode="numeric"
                            maxLength={6}
                            minLength={6}
                        />

                        <CustomCheckboxGroup
                            name="pavements"
                            options={pavements.map((p) => ({
                                value: p.value,
                                label: p.label,
                            }))}
                            selectedValues={watch('pavements') || []}
                            onChange={(values) => setValue('pavements', values)}
                            error={errors.pavements?.message}
                            gridCols={'full'}
                            className="col-span-2 border-2 rounded-lg p-4"
                        />
                    </div>

                    <div className="w-full grid gap-0 place-items-start">
                        <SearchCardList
                            onSelectAgency={(agency) => {
                                setValue('agencyId', agency.id);
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
