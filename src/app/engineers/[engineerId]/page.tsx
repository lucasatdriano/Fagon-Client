'use client';

import { useState, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomEditInput } from '../../../components/forms/CustomEditInput';
import { CustomButton } from '../../../components/forms/CustomButton';
import {
    UpdateEngineerFormValues,
    updateEngineerSchema,
} from '../../../validations';
import { useParams } from 'next/navigation';
import { handleMaskedChange } from '../../../utils/helpers/handleMaskedInput';
import { Loader2Icon, SaveIcon } from 'lucide-react';
import { toast } from 'sonner';
import { EngineerService } from '@/services/domains/engineerService';
import { formatCPF, formatPhone } from '@/utils/formatters';

export default function EngineerEditPage() {
    const { engineerId } = useParams();
    const id = engineerId as string;
    const [isLoading, setIsLoading] = useState(true);
    const [engineer, setEngineer] = useState<UpdateEngineerFormValues | null>(
        null,
    );
    const [isFormModified, setIsFormModified] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<UpdateEngineerFormValues>({
        resolver: zodResolver(updateEngineerSchema),
    });

    useEffect(() => {
        const subscription = watch(() => {
            setIsFormModified(true);
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    useEffect(() => {
        const fetchEngineerData = async () => {
            try {
                setIsLoading(true);
                const response = await EngineerService.getById(id);
                const data = response.data;
                setEngineer(data);

                setValue('name', data.name || '');
                setValue('email', data.email || '');
                setValue('phone', data.phone || '');
                setValue('cpf', data.cpf || '');
                setValue('education', data.education || '');
                setValue('registrationEntity', data.registrationEntity || '');
                setValue('registrationNumber', data.registrationNumber || '');
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEngineerData();
    }, [id, setValue]);

    const onSubmit: SubmitHandler<UpdateEngineerFormValues> = async (
        formData,
    ) => {
        try {
            setIsLoading(true);

            const updateData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone?.replace(/\D/g, '') || undefined,
                cpf: formData.cpf?.replace(/\D/g, '') || undefined,
                education: formData.education,
                registrationEntity: formData.registrationEntity,
                registrationNumber: formData.registrationNumber,
            };

            const response = await EngineerService.update(id, updateData);

            if (response) {
                toast.success('Engenheiro atualizado com sucesso!');
                const updatedEngineer = await EngineerService.getById(id);
                setEngineer(updatedEngineer.data);
                setIsFormModified(false);
            }
        } catch (error) {
            console.error(error);
            toast.error('Erro ao atualizar engenheiro');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !engineer) {
        return (
            <div className="flex justify-center items-center h-svh">
                <Loader2Icon className="animate-spin w-12 h-12 text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-svh grid place-items-center bg-background pt-20 sm:pt-24 pb-6 px-2">
            <div className="w-full md:w-4/5 lg:w-3/4 2xl:w-2/4 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex items-center justify-center py-4 px-12">
                    <h1 className="text-2xl font-bold text-center">
                        {engineer?.name}
                    </h1>
                </div>
                <div className="flex items-center justify-center">
                    <hr className="w-full" />
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="py-4 px-8 space-y-6 mt-12"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <CustomEditInput
                            label="Nome do Engenheiro"
                            registration={register('name')}
                            error={errors.name?.message}
                            id="EngineerNameInput"
                            defaultValue={watch('name')}
                        />

                        <CustomEditInput
                            label="CPF do Engenheiro"
                            registration={register('cpf')}
                            value={formatCPF(watch('cpf') || '')}
                            onChange={(e) =>
                                handleMaskedChange('cpf', e, setValue)
                            }
                            error={errors.cpf?.message}
                            inputMode="numeric"
                            id="CPFInput"
                            maxLength={18}
                        />

                        <CustomEditInput
                            label="Email do Engenheiro"
                            registration={register('email')}
                            error={errors.email?.message}
                            id="EngineerEmailInput"
                            inputMode="email"
                            value={watch('email')}
                        />

                        <CustomEditInput
                            label="Telefone do Engenheiro"
                            registration={register('phone')}
                            value={formatPhone(watch('phone') || '')}
                            onChange={(e) =>
                                handleMaskedChange('phone', e, setValue)
                            }
                            error={errors.phone?.message}
                            inputMode="tel"
                            id="EngineerPhoneInput"
                            maxLength={15}
                        />

                        <CustomEditInput
                            label="Título Profissional"
                            registration={register('education')}
                            error={errors.education?.message}
                            id="DistrictInput"
                            value={watch('education')}
                        />

                        <CustomEditInput
                            label="Conselho Profissional"
                            registration={register('registrationEntity')}
                            error={errors.registrationEntity?.message}
                            id="StreetInput"
                            value={watch('registrationEntity')}
                        />

                        <CustomEditInput
                            label="Número do Registro"
                            registration={register('registrationNumber')}
                            error={errors.registrationNumber?.message}
                            id="NumberEngineerInput"
                            value={watch('registrationNumber')}
                        />
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
