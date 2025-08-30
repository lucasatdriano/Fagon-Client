'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
    createEngineerSchema,
    CreateEngineerFormValues,
} from '../../../validations';
import { CustomButton } from '../../../components/forms/CustomButton';
import { CustomFormInput } from '../../../components/forms/CustomFormInput';
import {
    BriefcaseIcon,
    Building2Icon,
    FileDigitIcon,
    IdCardIcon,
    MailIcon,
    PhoneIcon,
    UserIcon,
} from 'lucide-react';
import { EngineerService } from '../../../services/domains/engineerService';
import { handleMaskedChange } from '../../../utils/helpers/handleMaskedInput';
import axios from 'axios';

export default function CreateEngineerPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CreateEngineerFormValues>({
        resolver: zodResolver(createEngineerSchema),
    });

    const onSubmit: SubmitHandler<CreateEngineerFormValues> = async (data) => {
        setIsLoading(true);
        try {
            const payload = {
                name: data.name,
                email: data.email,
                phone: data.phone.replace(/\D/g, ''),
                cpf: data.cpf.replace(/\D/g, ''),
                education: data.education,
                registrationEntity: data.registrationEntity,
                registrationNumber: data.registrationNumber,
            };

            await EngineerService.create(payload);

            toast.success('Engenheiro criado com sucesso!');
            router.push('/engineers');
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

    return (
        <div className="min-h-svh w-full flex items-center justify-center pt-24 pb-8 px-2">
            <form
                onSubmit={handleSubmit(onSubmit, (errors) => {
                    console.error('Form validation errors:', errors);
                })}
                className="space-y-4 bg-white grid place-items-center shadow-md p-6 rounded-lg w-full max-w-sm xs:max-w-xl md:max-w-4xl"
            >
                <h1 className="text-2xl text-foreground mb-4 text-center font-sans">
                    Adicionar Novo Engenheiro
                </h1>

                <div className="w-full grid place-items-center gap-4">
                    <div className="grid md:grid-cols-2 w-full gap-6">
                        <CustomFormInput
                            icon={<UserIcon />}
                            label="Nome do Engenheiro*"
                            registration={register('name')}
                            error={errors.name?.message}
                            id="EngineerNameInput"
                        />

                        <CustomFormInput
                            icon={<IdCardIcon />}
                            label="CPF do Engenheiro*"
                            registration={register('cpf')}
                            value={watch('cpf')}
                            onChange={(e) =>
                                handleMaskedChange('cpf', e, setValue)
                            }
                            inputMode="numeric"
                            maxLength={14}
                            error={errors.cpf?.message}
                            id="CPFInput"
                        />

                        <CustomFormInput
                            icon={<MailIcon />}
                            label="Email do Engenheiro*"
                            registration={register('email')}
                            error={errors.email?.message}
                            inputMode="email"
                            id="EngineerEmailInput"
                        />

                        <CustomFormInput
                            icon={<PhoneIcon />}
                            label="Telefone do Engenheiro*"
                            registration={register('phone')}
                            value={watch('phone')}
                            onChange={(e) =>
                                handleMaskedChange('phone', e, setValue)
                            }
                            inputMode="tel"
                            maxLength={15}
                            error={errors.phone?.message}
                            id="EngineerPhoneInput"
                        />

                        <CustomFormInput
                            icon={<BriefcaseIcon />}
                            label="Título Profissional*"
                            registration={register('education')}
                            error={errors.education?.message}
                            id="DistrictInput"
                            value={watch('education')}
                        />

                        <CustomFormInput
                            icon={<Building2Icon />}
                            label="Conselho Profissional*"
                            registration={register('registrationEntity')}
                            error={errors.registrationEntity?.message}
                            id="StreetInput"
                            value={watch('registrationEntity')}
                        />

                        <CustomFormInput
                            icon={<FileDigitIcon />}
                            label="Número do Registro*"
                            registration={register('registrationNumber')}
                            error={errors.registrationNumber?.message}
                            id="NumberEngineerInput"
                            value={watch('registrationNumber')}
                        />
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
                            ? 'Adicionando Engenheiro...'
                            : 'Adicionar Engenheiro'}
                    </CustomButton>
                </div>
            </form>
        </div>
    );
}
