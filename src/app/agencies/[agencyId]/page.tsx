'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomEditInput } from '@/components/forms/CustomEditInput';
import { CustomButton } from '@/components/forms/CustomButton';
import { UpdateAgencyFormValues, updateAgencySchema } from '@/validations';
import { AgencyService } from '@/services/domains/agencyService';
import { useParams } from 'next/navigation';
import { formatCNPJ } from '@/utils/formatters/formatCNPJ';
import { formatCEP } from '@/utils/formatters/formatCEP';
import { formatNumberAgency } from '@/utils/formatters/formatNumberAgency';
import { handleMaskedChange } from '@/utils/helpers/handleMaskedInput';

export default function AgencyEditPage() {
    const { agencyId } = useParams();
    const id = agencyId as string;
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState('');
    const [agency, setAgency] = useState<UpdateAgencyFormValues | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<UpdateAgencyFormValues>({
        resolver: zodResolver(updateAgencySchema),
    });

    useEffect(() => {
        const fetchAgencyData = async () => {
            try {
                setIsLoading(true);
                const response = await AgencyService.getById(id);
                const data = response.data;
                setAgency(data);

                setValue('agencyNumber', data.agencyNumber);
                setValue('cnpj', data.cnpj || '');
                setValue('cep', data.cep || '');
                setValue('state', data.state || '');
                setValue('city', data.city || '');
                setValue('district', data.district || '');
                setValue('street', data.street || '');
                setValue('number', data.number || '');
            } catch (error) {
                setApiError('Falha ao carregar dados da agência');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAgencyData();
    }, [id, setValue]);

    const onSubmit = async (formData: UpdateAgencyFormValues) => {
        try {
            setIsLoading(true);

            const updateData = {
                agencyNumber: formData.agencyNumber,
                cnpj: formData.cnpj?.replace(/\D/g, '') || undefined,
                cep: formData.cep?.replace(/\D/g, '') || undefined,
                state: formData.state,
                city: formData.city,
                district: formData.district,
                street: formData.street,
                number: formData.number,
            };

            const response = await AgencyService.update(id, updateData);

            if (response) {
                alert('Agência atualizada com sucesso!');
                setAgency(formData);
            }
        } catch (error) {
            setApiError('Erro ao salvar as alterações');
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
        <div className="grid place-items-center min-h-screen bg-background py-8 px-4">
            <div className="w-4/5 md:w-3/5 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex items-center justify-center py-4 px-12">
                    <h1 className="text-2xl font-bold">
                        Agência - {agency?.city} - {agency?.district}
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
                        <div className="bg-red-100 border border-red-400 text-error px-4 py-3 rounded">
                            {apiError}
                        </div>
                    )}

                    <div className="flex justify-between pb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Itaú Unibanco S/A
                        </h2>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Ag. {formatNumberAgency(agency?.agencyNumber || '')}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <CustomEditInput
                            label="Número da Agência"
                            registration={register('agencyNumber')}
                            error={errors.agencyNumber?.message}
                            defaultValue={agency?.agencyNumber}
                            textColor="text-foreground"
                        />

                        <CustomEditInput
                            label="CNPJ"
                            registration={register('cnpj')}
                            value={formatCNPJ(watch('cnpj') || '')}
                            onChange={(e) =>
                                handleMaskedChange('cnpj', e, setValue)
                            }
                            error={errors.cnpj?.message}
                            maxLength={18}
                            textColor="text-foreground"
                        />

                        <CustomEditInput
                            label="CEP"
                            registration={register('cep')}
                            value={formatCEP(watch('cep') || '')}
                            onChange={(e) =>
                                handleMaskedChange('cep', e, setValue)
                            }
                            error={errors.cep?.message}
                            maxLength={9}
                            textColor="text-foreground"
                        />

                        <CustomEditInput
                            label="Estado"
                            registration={register('state')}
                            error={errors.state?.message}
                            defaultValue={agency?.state}
                            textColor="text-foreground"
                            disabled
                        />

                        <CustomEditInput
                            label="Cidade"
                            registration={register('city')}
                            error={errors.city?.message}
                            defaultValue={agency?.city}
                            textColor="text-foreground"
                            disabled
                        />

                        <CustomEditInput
                            label="Bairro"
                            registration={register('district')}
                            error={errors.district?.message}
                            defaultValue={agency?.district}
                            textColor="text-foreground"
                            disabled
                        />

                        <CustomEditInput
                            label="Rua"
                            registration={register('street')}
                            error={errors.street?.message}
                            defaultValue={agency?.street}
                            textColor="text-foreground"
                            disabled
                        />

                        <CustomEditInput
                            label="Número"
                            registration={register('number')}
                            error={errors.number?.message}
                            defaultValue={agency?.number}
                            textColor="text-foreground"
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
