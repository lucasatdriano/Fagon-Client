'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { HashIcon } from 'lucide-react';

import { CustomButton } from '@/components/forms/CustomButton';
import { SearchCardList } from '@/components/forms/SearchCardList';
import { CustomDropdownInput } from '@/components/forms/CustomDropdownInput';
import { CustomRadioGroup } from '@/components/forms/CustomRadioGroup';
import { CustomFormInput } from '@/components/forms/CustomFormInput';

import { createProjectSchema, CreateProjectFormValues } from '@/validations';
import { projectType } from '@/constants';

export default function CreateProjectPage() {
    const router = useRouter();
    const [selectedAgencyId, setSelectedAgencyId] = useState<string>('');

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
        console.log('Formulário enviado com sucesso:', data);
        router.push('/project/123');
    };

    const peopleOptions = [
        {
            id: 'b529f812-9311-4b0d-aeab-78b2e2054c2b',
            value: 'b529f812-9311-4b0d-aeab-78b2e2054c2b',
            label: 'Cinara Aparecida Batista Goncalves',
        },
        {
            id: '2c18efaa-67bc-4310-b5d1-d4e6e7b6cc90',
            value: '2c18efaa-67bc-4310-b5d1-d4e6e7b6cc90',
            label: 'Bárbara Gonçalves',
        },
    ];

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
                            onOptionSelected={(val) =>
                                setValue('projectType', val)
                            }
                            placeholder="Selecione o Tipo do projeto*"
                            error={errors.projectType?.message}
                        />

                        <CustomRadioGroup
                            name="people"
                            options={peopleOptions}
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
                        />
                    </div>

                    <div className="w-full grid gap-0 place-items-start">
                        <SearchCardList
                            onSelectAgency={(agency) => {
                                setSelectedAgencyId(agency.id);
                                setValue('agencyId', agency.id);
                            }}
                            searchAgencies={async (query) => {
                                const response = await fetch(
                                    `/api/agencies?q=${query}`,
                                );
                                return response.json();
                            }}
                        />
                        {errors.agencyId && (
                            <p className="text-sm text-red-500 font-poppins">
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
