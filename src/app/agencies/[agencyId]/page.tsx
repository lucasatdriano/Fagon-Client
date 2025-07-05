'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { fetchAddressByCep } from '../../../utils/viacep';

export default function AgencyEditPage() {
    const { agencyId } = useParams();
    const id = agencyId as string;
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState('');
    const [agency, setAgency] = useState<UpdateAgencyFormValues | null>(null);
    const [isFormModified, setIsFormModified] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
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
                        setValue('state', address.state);
                        setValue('city', address.city);
                        setValue('district', address.district);
                        setValue('street', address.street);

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
        const checkFormChanges = (currentValues: UpdateAgencyFormValues) => {
            if (!agency) return false;

            return (
                currentValues.agencyNumber !== agency.agencyNumber ||
                (currentValues.cnpj || '') !== (agency.cnpj || '') ||
                (currentValues.cep || '') !== (agency.cep || '') ||
                (currentValues.state || '') !== (agency.state || '') ||
                (currentValues.city || '') !== (agency.city || '') ||
                (currentValues.district || '') !== (agency.district || '') ||
                (currentValues.street || '') !== (agency.street || '') ||
                (currentValues.number || '') !== (agency.number || '')
            );
        };

        const subscription = watch((value) => {
            setIsFormModified(
                checkFormChanges(value as UpdateAgencyFormValues),
            );
        });
        return () => subscription.unsubscribe();
    }, [watch, agency]);

    useEffect(() => {
        const fetchAgencyData = async () => {
            try {
                setIsLoading(true);
                const response = await AgencyService.getById(id);
                const data = response.data;
                setAgency(data);

                reset({
                    agencyNumber: data.agencyNumber,
                    cnpj: data.cnpj || '',
                    cep: data.cep || '',
                    state: data.state || '',
                    city: data.city || '',
                    district: data.district || '',
                    street: data.street || '',
                    number: data.number,
                });
            } catch (error) {
                setApiError('Falha ao carregar dados da agência');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAgencyData();
    }, [id, reset]);

    const onSubmit = async (formData: UpdateAgencyFormValues) => {
        try {
            setIsLoading(true);

            const updateData = {
                agencyNumber: formData.agencyNumber,
                cnpj: formData.cnpj?.replace(/\D/g, '') || undefined,
                cep: formData.cep?.replace(/\D/g, ''),
                state: formData.state,
                city: formData.city,
                district: formData.district,
                street: formData.street,
                number: formData.number,
            };

            const response = await AgencyService.update(id, updateData);

            if (response) {
                toast.success('Agência atualizada com sucesso!');
                const updatedAgency = await AgencyService.getById(id);
                setAgency(updatedAgency.data);
                setIsFormModified(false);
            }
        } catch (error) {
            setApiError('Erro ao salvar as alterações');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !agency) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2Icon className="animate-spin w-12 h-12 text-primary" />
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
                    onSubmit={handleSubmit(onSubmit, (errors) => {
                        console.error('Form validation errors:', errors);
                    })}
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
                            Ag.{' '}
                            {formatNumberAgency(
                                String(agency?.agencyNumber || ''),
                            )}
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
                            value={watch('state')}
                            textColor="text-foreground"
                        />

                        <CustomEditInput
                            label="Cidade"
                            registration={register('city')}
                            error={errors.city?.message}
                            value={watch('city')}
                            textColor="text-foreground"
                        />

                        <CustomEditInput
                            label="Bairro"
                            registration={register('district')}
                            error={errors.district?.message}
                            value={watch('district')}
                            textColor="text-foreground"
                        />

                        <CustomEditInput
                            label="Rua"
                            registration={register('street')}
                            error={errors.street?.message}
                            value={watch('street')}
                            textColor="text-foreground"
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
                        <CustomButton
                            type="submit"
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
