'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
    createInspectorSchema,
    CreateInspectorFormValues,
} from '../../../validations';
import { CustomButton } from '../../../components/forms/CustomButton';
import { CustomFormInput } from '../../../components/forms/CustomFormInput';
import {
    Building2Icon,
    MapPinIcon,
    MapPinnedIcon,
    Navigation2Icon,
    PhoneIcon,
    PinIcon,
    UserIcon,
    PlusIcon,
    XIcon,
} from 'lucide-react';
import { fetchAddressByCep } from '../../../utils/viacep';
import { handleMaskedChange } from '../../../utils/helpers/handleMaskedInput';
import axios from 'axios';
import { InspectorService } from '@/services/domains/inspectorService';
import { CustomDropdownInput } from '@/components/forms/CustomDropdownInput';
import { states } from '@/constants/states';

export default function CreateInspectorPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [cityInputs, setCityInputs] = useState<string[]>(['']);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CreateInspectorFormValues>({
        resolver: zodResolver(createInspectorSchema),
    });

    const cepValue = watch('cep');

    useEffect(() => {
        async function fetchAddress() {
            const cleanedCep = cepValue?.replace(/\D/g, '') || '';
            if (cleanedCep.length === 8) {
                const address = await fetchAddressByCep(cepValue);
                if (address) {
                    setValue('state', address.state);
                    setValue('city', address.city);
                    setValue('district', address.district);
                    setValue('street', address.street);
                }
            }
        }
        fetchAddress();
    }, [cepValue, setValue]);

    useEffect(() => {
        const nonEmptyCities = cityInputs.filter((city) => city.trim() !== '');
        setValue('selectedCities', nonEmptyCities);
    }, [cityInputs, setValue]);

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

    const onSubmit: SubmitHandler<CreateInspectorFormValues> = async (data) => {
        setIsLoading(true);
        try {
            const payload = {
                name: data.name,
                phone: data.phone.replace(/\D/g, ''),
                cep: data.cep.replace(/\D/g, ''),
                state: data.state,
                city: data.city,
                district: data.district,
                street: data.street,
                selectedCities: data.selectedCities.filter(
                    (city) => city.trim() !== '',
                ),
            };

            await InspectorService.create(payload);

            toast.success('Vistoriador criado com sucesso!');
            router.push('/inspectors');
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
                    Adicionar Novo Vistoriador
                </h1>

                <div className="w-full grid place-items-center gap-4">
                    <div className="grid md:grid-cols-2 w-full gap-6">
                        <CustomFormInput
                            icon={<UserIcon />}
                            label="Nome do Vistoriador*"
                            registration={register('name')}
                            error={errors.name?.message}
                            id="InspectorNameInput"
                        />

                        <CustomFormInput
                            icon={<PhoneIcon />}
                            label="Telefone do Vistoriador*"
                            registration={register('phone')}
                            value={watch('phone')}
                            onChange={(e) =>
                                handleMaskedChange('phone', e, setValue)
                            }
                            inputMode="tel"
                            id="InspectorPhoneInput"
                            maxLength={15}
                            error={errors.phone?.message}
                        />
                    </div>

                    <div className="w-full">
                        <div className="w-full relative flex justify-start mb-4">
                            <hr className="w-full h-px absolute border-foreground top-1/2 left-0" />
                            <h2 className="text-xl text-foreground font-sans bg-white px-2 ml-6 z-0">
                                Cidades Atendidas
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {cityInputs.map((city, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    <CustomFormInput
                                        icon={<MapPinnedIcon />}
                                        label={
                                            index === 0
                                                ? 'Cidade Atendida'
                                                : `Cidade Atendida ${index + 1}`
                                        }
                                        value={city}
                                        onChange={(e) =>
                                            updateCityInput(
                                                index,
                                                e.target.value,
                                            )
                                        }
                                        error={
                                            index === 0
                                                ? errors.selectedCities?.message?.toString()
                                                : undefined
                                        }
                                        className="flex-1"
                                        id="CitiesServedInput"
                                    />
                                    {cityInputs.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeCityInput(index)
                                            }
                                            className="p-2 text-red-500 hover:text-red-700 transition-colors"
                                            title="Remover cidade"
                                        >
                                            <XIcon size={20} />
                                        </button>
                                    )}
                                    {index === cityInputs.length - 1 && (
                                        <button
                                            type="button"
                                            onClick={addCityInput}
                                            className="p-2 text-green-600 hover:text-green-800 transition-colors relative group"
                                            title="Adicionar outra cidade"
                                        >
                                            <PlusIcon size={20} />
                                            <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                Adicionar outra cidade
                                            </span>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-full relative flex justify-start">
                        <hr className="w-full h-px absolute border-foreground top-1/2 left-0" />
                        <h2 className="text-xl text-foreground font-sans bg-white px-2 ml-6 z-0">
                            Endereço do Vistoriador
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 w-full gap-6">
                        <CustomFormInput
                            icon={<MapPinIcon />}
                            label="CEP"
                            registration={register('cep')}
                            value={watch('cep')}
                            onChange={(e) =>
                                handleMaskedChange('cep', e, setValue)
                            }
                            inputMode="numeric"
                            maxLength={9}
                            error={errors.cep?.message}
                            id="CEPInput"
                        />

                        <CustomDropdownInput
                            icon={<PinIcon />}
                            placeholder="Estado*"
                            options={states}
                            selectedOptionValue={watch('state')}
                            onOptionSelected={(val) => {
                                if (val) {
                                    setValue('state', val);
                                }
                            }}
                            error={errors.state?.message}
                            className="col-span-2 md:col-span-1"
                        />

                        <CustomFormInput
                            icon={<Building2Icon />}
                            label="Município*"
                            registration={register('city')}
                            value={watch('city')}
                            error={errors.city?.message}
                            id="CityInput"
                        />

                        <CustomFormInput
                            icon={<MapPinnedIcon />}
                            label="Bairro"
                            registration={register('district')}
                            value={watch('district')}
                            error={errors.district?.message}
                            id="DistrictInput"
                        />

                        <CustomFormInput
                            icon={<Navigation2Icon />}
                            label="Rua"
                            registration={register('street')}
                            value={watch('street')}
                            error={errors.street?.message}
                            id="StreetInput"
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
                            ? 'Adicionando Vistoriador...'
                            : 'Adicionar Vistoriador'}
                    </CustomButton>
                </div>
            </form>
        </div>
    );
}
