'use client';

import { useState, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomEditInput } from '../../../components/forms/CustomEditInput';
import { CustomButton } from '../../../components/forms/CustomButton';
import {
    UpdateInspectorFormValues,
    updateInspectorSchema,
} from '../../../validations';
import { useParams } from 'next/navigation';
import { handleMaskedChange } from '../../../utils/helpers/handleMaskedInput';
import { Loader2Icon, SaveIcon, PlusIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { InspectorService } from '@/services/domains/inspectorService';
import { formatPhone, formatCEP } from '@/utils/formatters';
import { fetchAddressByCep } from '@/utils/viacep';

export default function InspectorEditPage() {
    const { inspectorId } = useParams();
    const id = inspectorId as string;
    const [isLoading, setIsLoading] = useState(true);
    const [inspector, setInspector] =
        useState<UpdateInspectorFormValues | null>(null);
    const [isFormModified, setIsFormModified] = useState(false);
    const [cityInputs, setCityInputs] = useState<string[]>(['']);
    const [isInitialized, setIsInitialized] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<UpdateInspectorFormValues>({
        resolver: zodResolver(updateInspectorSchema),
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
        if (isInitialized) {
            const nonEmptyCities = cityInputs.filter(
                (city) => city.trim() !== '',
            );
            setValue('selectedCities', nonEmptyCities);
            setIsFormModified(true);
        }
    }, [cityInputs, setValue, isInitialized]);

    useEffect(() => {
        const subscription = watch(() => {
            setIsFormModified(true);
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    const addCityInput = () => {
        setCityInputs([...cityInputs, '']);
    };

    const removeCityInput = (index: number) => {
        if (cityInputs.length > 1) {
            setCityInputs(cityInputs.filter((_, i) => i !== index));
        }
    };

    const updateCityInput = (index: number, value: string) => {
        const newCities = [...cityInputs];
        newCities[index] = value;
        setCityInputs(newCities);
    };

    useEffect(() => {
        const fetchInspectorData = async () => {
            try {
                setIsLoading(true);
                const response = await InspectorService.getById(id);
                const data = response.data;
                setInspector(data);

                setValue('name', data.name || '');
                setValue('phone', data.phone || '');
                setValue('cep', data.cep || '');
                setValue('state', data.state || '');
                setValue('city', data.city || '');
                setValue('district', data.district || '');
                setValue('street', data.street || '');
                setValue('selectedCities', data.selectedCities || []);

                if (data.selectedCities && data.selectedCities.length > 0) {
                    setCityInputs([...data.selectedCities]);
                } else {
                    setCityInputs(['']);
                }

                setIsInitialized(true);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInspectorData();
    }, [id, setValue]);

    const onSubmit: SubmitHandler<UpdateInspectorFormValues> = async (
        formData,
    ) => {
        try {
            setIsLoading(true);

            const updateData = {
                name: formData.name,
                phone: formData.phone?.replace(/\D/g, '') || undefined,
                cep: formData.cep?.replace(/\D/g, '') || undefined,
                state: formData.state,
                city: formData.city,
                district: formData.district,
                street: formData.street,
                selectedCities: formData.selectedCities?.filter(
                    (city) => city.trim() !== '',
                ),
            };

            const response = await InspectorService.update(id, updateData);

            if (response) {
                toast.success('Vistoriador atualizado com sucesso!');
                const updatedInspector = await InspectorService.getById(id);
                setInspector(updatedInspector.data);
                setIsFormModified(false);
            }
        } catch (error) {
            console.error(error);
            toast.error('Erro ao atualizar vistoriador');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !inspector) {
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
                        {inspector?.name}
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
                            label="Nome do Vistoriador"
                            registration={register('name')}
                            error={errors.name?.message}
                            id="InspectorNameInput"
                            defaultValue={watch('name')}
                        />

                        <CustomEditInput
                            label="Telefone do Vistoriador"
                            registration={register('phone')}
                            value={formatPhone(watch('phone') || '')}
                            onChange={(e) =>
                                handleMaskedChange('phone', e, setValue)
                            }
                            error={errors.phone?.message}
                            inputMode="tel"
                            id="InspectorPhoneInput"
                            maxLength={15}
                        />

                        <CustomEditInput
                            label="CEP do Vistoriador"
                            registration={register('cep')}
                            value={formatCEP(watch('cep') || '')}
                            onChange={(e) =>
                                handleMaskedChange('cep', e, setValue)
                            }
                            inputMode="numeric"
                            error={errors.cep?.message}
                            id="CPFInput"
                            maxLength={18}
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
                    </div>

                    <div className="w-full">
                        <div className="w-full relative flex justify-start mb-4">
                            <hr className="w-full h-px absolute border-foreground top-1/2 left-0" />
                            <h2 className="text-xl text-foreground font-sans bg-white px-2 ml-6 z-0">
                                Cidades Atendidas
                            </h2>
                        </div>

                        <div className="space-y-4 mt-6">
                            {cityInputs.map((city, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3"
                                >
                                    <div className="flex-1">
                                        <CustomEditInput
                                            label={
                                                index === 0
                                                    ? 'Cidade Atendida'
                                                    : `Cidade Atendida ${
                                                          index + 1
                                                      }`
                                            }
                                            value={city}
                                            onChange={(e) =>
                                                updateCityInput(
                                                    index,
                                                    e.target.value,
                                                )
                                            }
                                            error={
                                                index === 0 &&
                                                errors.selectedCities
                                                    ? errors.selectedCities.message?.toString()
                                                    : undefined
                                            }
                                            id={`city-input-${index}`}
                                        />
                                    </div>
                                    {cityInputs.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeCityInput(index)
                                            }
                                            className="p-2 text-red-500 hover:text-red-700 transition-colors mt-6"
                                            title="Remover cidade"
                                        >
                                            <XIcon size={20} />
                                        </button>
                                    )}
                                    {index === cityInputs.length - 1 && (
                                        <button
                                            type="button"
                                            onClick={addCityInput}
                                            className="p-2 text-green-600 hover:text-green-800 transition-colors relative group mt-6"
                                            title="Adicionar outra cidade"
                                        >
                                            <PlusIcon size={20} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center pt-8">
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
