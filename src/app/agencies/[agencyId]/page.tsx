'use client';

import { useState, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomEditInput } from '../../../components/forms/CustomEditInput';
import { CustomButton } from '../../../components/forms/CustomButton';
import {
    UpdateAgencyFormValues,
    updateAgencySchema,
} from '../../../validations';
import { AgencyService } from '../../../services/domains/agencyService';
import { useParams } from 'next/navigation';
import { formatCNPJ } from '../../../utils/formatters/formatCNPJ';
import { formatCEP } from '../../../utils/formatters/formatCEP';
import { formatNumberAgency } from '../../../utils/formatters/formatNumberAgency';
import { handleMaskedChange } from '../../../utils/helpers/handleMaskedInput';
import { Loader2Icon, SaveIcon } from 'lucide-react';
import { toast } from 'sonner';
import { fetchAddressByCep } from '../../../utils/viacep';

export default function AgencyEditPage() {
    const { agencyId } = useParams();
    const id = agencyId as string;
    const [isLoading, setIsLoading] = useState(true);
    const [agency, setAgency] = useState<UpdateAgencyFormValues | null>(null);
    const [isFormModified, setIsFormModified] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<UpdateAgencyFormValues>({
        resolver: zodResolver(updateAgencySchema),
    });

    const cepValue = watch('cep');

    useEffect(() => {
        async function fetchAddress() {
            const cleanedCep = cepValue?.replace(/\D/g, '') || '';
            if (cleanedCep.length === 8) {
                try {
                    const address = await fetchAddressByCep(cleanedCep);
                    if (address) {
                        if (address.state) setValue('state', address.state);
                        if (address.city) setValue('city', address.city);
                        if (address.district)
                            setValue('district', address.district);
                        if (address.street) setValue('street', address.street);
                        setIsFormModified(true);
                    }
                } catch (error) {
                    console.error('Erro ao buscar endereço:', error);
                }
            }
        }

        fetchAddress();
    }, [cepValue, setValue]);

    useEffect(() => {
        const subscription = watch(() => {
            setIsFormModified(true);
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    useEffect(() => {
        const fetchAgencyData = async () => {
            try {
                setIsLoading(true);
                const response = await AgencyService.getById(id);
                const data = response.data;
                setAgency(data);

                setValue('name', data.name);
                setValue(
                    'agencyNumber',
                    formatNumberAgency(data.agencyNumber.toString()),
                );
                setValue('cnpj', data.cnpj || '');
                setValue('cep', data.cep || '');
                setValue('state', data.state || '');
                setValue('city', data.city || '');
                setValue('district', data.district || '');
                setValue('street', data.street || '');
                setValue('number', data.number || '');
                setValue('complement', data.complement || '');
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAgencyData();
    }, [id, setValue]);

    const onSubmit: SubmitHandler<UpdateAgencyFormValues> = async (
        formData,
    ) => {
        try {
            setIsLoading(true);

            const updateData = {
                name: formData.name,
                agencyNumber: formData.agencyNumber,
                cnpj: formData.cnpj?.replace(/\D/g, '') || undefined,
                cep: formData.cep?.replace(/\D/g, ''),
                state: formData.state,
                city: formData.city,
                district: formData.district,
                street: formData.street,
                number: formData.number,
                complement: formData.complement,
            };

            const response = await AgencyService.update(id, updateData);

            if (response) {
                toast.success('Agência atualizada com sucesso!');
                const updatedAgency = await AgencyService.getById(id);
                setAgency(updatedAgency.data);
                setIsFormModified(false);
            }
        } catch (error) {
            console.error(error);
            toast.error('Erro ao atualizar agência');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !agency) {
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
                        Agência - {agency?.name}
                    </h1>
                </div>
                <div className="flex items-center justify-center">
                    <hr className="w-full" />
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="py-4 px-8 space-y-6"
                >
                    <div className="flex flex-col md:flex-row justify-between md:pb-4 gap-2">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Itaú Unibanco S/A
                        </h2>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Ag.{' '}
                            {agency?.agencyNumber &&
                                formatNumberAgency(
                                    agency.agencyNumber.toString(),
                                )}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <CustomEditInput
                            label="Nome da Agência"
                            registration={register('name')}
                            error={errors.name?.message}
                            id="AgencyNameInput"
                            defaultValue={watch('name')}
                        />

                        <CustomEditInput
                            label="Número da Agência"
                            registration={register('agencyNumber')}
                            error={errors.agencyNumber?.message}
                            id="AgencyNumberInput"
                            defaultValue={watch('agencyNumber')}
                        />

                        <CustomEditInput
                            label="CNPJ"
                            registration={register('cnpj')}
                            value={formatCNPJ(watch('cnpj') || '')}
                            onChange={(e) =>
                                handleMaskedChange('cnpj', e, setValue)
                            }
                            error={errors.cnpj?.message}
                            id="CNPJInput"
                            maxLength={18}
                        />

                        <CustomEditInput
                            label="CEP"
                            registration={register('cep')}
                            value={formatCEP(watch('cep') || '')}
                            onChange={(e) =>
                                handleMaskedChange('cep', e, setValue)
                            }
                            error={errors.cep?.message}
                            id="CEPInput"
                            maxLength={9}
                        />

                        <CustomEditInput
                            label="Estado"
                            registration={register('state')}
                            error={errors.state?.message}
                            id="StateInput"
                            value={watch('state')}
                        />

                        <CustomEditInput
                            label="Cidade"
                            registration={register('city')}
                            error={errors.city?.message}
                            id="CityInput"
                            value={watch('city')}
                        />

                        <CustomEditInput
                            label="Bairro"
                            registration={register('district')}
                            error={errors.district?.message}
                            id="DistrictInput"
                            value={watch('district')}
                        />

                        <CustomEditInput
                            label="Rua"
                            registration={register('street')}
                            error={errors.street?.message}
                            id="StreetInput"
                            value={watch('street')}
                        />

                        <CustomEditInput
                            label="Número"
                            registration={register('number')}
                            error={errors.number?.message}
                            id="NumberAgencyInput"
                            value={watch('number')}
                        />

                        <CustomEditInput
                            label="Complemento"
                            registration={register('complement')}
                            defaultValue={agency?.complement || ''}
                            error={errors.complement?.message}
                            id="ComplementInput"
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
