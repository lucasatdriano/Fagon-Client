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
import { pavements, projectTypes } from '../../../constants';
import { EngineerService } from '../../../services/domains/engineerService';
import { engineerProps } from '../../../interfaces/engineer';
import { ProjectService } from '../../../services/domains/projectService';
import { toast } from 'sonner';
import { ProjectTypes } from '../../../types/project';
import { CustomCheckboxGroup } from '../../../components/forms/CustomCheckbox';
import { handleMaskedChange } from '../../../utils/helpers/handleMaskedInput';
import { PavementItem } from '../../../services/domains/pavementService';
import axios from 'axios';

export default function CreateProjectPage() {
    const router = useRouter();
    const [engineers, setEngineers] = useState<
        { id: string; value: string; label: string }[]
    >([]);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CreateProjectFormValues>({
        resolver: zodResolver(createProjectSchema),
    });

    const onSubmit = async (data: CreateProjectFormValues) => {
        setIsLoading(true);

        try {
            const pavementsArray = Array.isArray(data.pavements)
                ? data.pavements
                : [];

            const payload = {
                projectType: data.projectType as ProjectTypes,
                upeCode: Number(data.upeCode),
                pavements: pavementsArray.map((p) => ({
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
            if (axios.isAxiosError(error)) {
                const errorData = error.response?.data;

                const errorMessage = errorData.message || errorData.error;

                toast.error(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        async function fetchEngineers() {
            try {
                const response = await EngineerService.listAll();
                const data = response.data.engineers;
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
        <div className="min-h-svh w-full flex items-center justify-center pt-24 pb-8 px-2">
            <form
                onSubmit={handleSubmit(onSubmit, (errors) => {
                    console.error('Form validation errors:', errors);
                })}
                className="space-y-4 bg-white grid place-items-center shadow-md p-6 rounded-lg w-full max-w-2xl md:max-w-4xl"
            >
                <h1 className="text-2xl text-foreground md:mb-4 text-center font-sans">
                    Adicionar Novo Projeto
                </h1>

                <div className="w-full grid place-items-center gap-4">
                    <div className="grid md:grid-cols-2 w-full gap-4">
                        <CustomDropdownInput
                            placeholder="Selecione o Tipo do projeto*"
                            options={projectTypes}
                            selectedOptionValue={watch('projectType')}
                            onOptionSelected={(val) => {
                                if (val) {
                                    setValue('projectType', val);
                                }
                            }}
                            error={errors.projectType?.message}
                            className="col-span-2 md:col-span-1"
                        />

                        <CustomFormInput
                            icon={<HashIcon />}
                            label="UPE do projeto*"
                            {...register('upeCode')}
                            onChange={(e) =>
                                handleMaskedChange('upeCode', e, setValue)
                            }
                            error={errors.upeCode?.message}
                            id="UpeInput"
                            inputMode="numeric"
                            maxLength={6}
                            minLength={6}
                            className="col-span-2 md:col-span-1"
                        />

                        <CustomRadioGroup
                            name="engineer"
                            options={engineers}
                            selectedValue={watch('engineer.id')}
                            onChange={(val) => setValue('engineer.id', val)}
                            gridCols={'2B'}
                            error={errors.engineer?.message}
                            className="p-4 border-2 rounded-lg col-span-2"
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
                        disabled={isLoading}
                        className="hover:bg-secondary-hover"
                    >
                        {isLoading
                            ? 'Adicionando Projeto...'
                            : 'Adicionar Projeto'}
                    </CustomButton>
                </div>
            </form>
        </div>
    );
}
