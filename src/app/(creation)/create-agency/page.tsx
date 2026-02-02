'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
    createAgencySchema,
    CreateAgencyFormValues,
} from '../../../validations';
import { CustomButton } from '../../../components/forms/CustomButton';
import { CustomFormInput } from '../../../components/forms/CustomFormInput';
import {
    Building2Icon,
    FileTextIcon,
    HashIcon,
    HomeIcon,
    LandmarkIcon,
    MapPinIcon,
    MapPinnedIcon,
    Navigation2Icon,
    PinIcon,
} from 'lucide-react';
import { fetchAddressByCep } from '../../../utils/viacep';
import { AgencyService } from '../../../services/domains/agencyService';
import { handleMaskedChange } from '../../../utils/helpers/handleMaskedInput';
import axios from 'axios';
import { CustomDropdownInput } from '@/components/forms/CustomDropdownInput';
import { states } from '@/constants';

export default function CreateAgencyPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CreateAgencyFormValues>({
        resolver: zodResolver(createAgencySchema),
    });

    const cepValue = watch('cep');

    useEffect(() => {
        async function fetchAddress() {
            const cleanedCep = cepValue?.replace(/\D/g, '') || '';
            if (cleanedCep.length === 8) {
                const address = await fetchAddressByCep(cepValue);
                if (address) {
                    const foundState = states.find(
                        (state) => state.label === address.state,
                    );

                    if (foundState) {
                        setValue('state', foundState.value);
                    } else {
                        const stateWithoutAccents = address.state
                            .normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, '');

                        const alternativeState = states.find(
                            (state) =>
                                state.label === address.state ||
                                state.value.toLowerCase() ===
                                    stateWithoutAccents.toLowerCase(),
                        );

                        if (alternativeState) {
                            setValue('state', alternativeState.value);
                        }
                    }

                    setValue('city', address.city);
                    setValue('district', address.district);
                    setValue('street', address.street);
                }
            }
        }
        fetchAddress();
    }, [cepValue, setValue]);

    const onSubmit: SubmitHandler<CreateAgencyFormValues> = async (data) => {
        setIsLoading(true);

        try {
            const payload = {
                name: data.name,
                agencyNumber: data.agencyNumber,
                cnpj: data.cnpj?.replace(/\D/g, '') || '',
                cep: data.cep.replace(/\D/g, ''),
                state: data.state,
                city: data.city,
                district: data.district,
                street: data.street,
                number: data.number,
                complement: data.complement || '',
            };

            await AgencyService.create(payload);

            toast.success('Agência criada com sucesso!');
            router.push('/agencies');
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
                    Adicionar Nova Agência
                </h1>

                <div className="w-full grid place-items-center gap-4">
                    <div className="grid md:grid-cols-2 w-full gap-6">
                        <CustomFormInput
                            icon={<LandmarkIcon />}
                            label="Nome da Agência*"
                            registration={register('name')}
                            error={errors.name?.message}
                            id="AgencyNameInput"
                        />

                        <CustomFormInput
                            icon={<HashIcon />}
                            label="Número da Agência*"
                            registration={register('agencyNumber')}
                            error={errors.agencyNumber?.message}
                            id="AgencyNumberInput"
                        />

                        <CustomFormInput
                            icon={<FileTextIcon />}
                            label="CNPJ"
                            registration={register('cnpj')}
                            value={watch('cnpj')}
                            onChange={(e) =>
                                handleMaskedChange('cnpj', e, setValue)
                            }
                            inputMode="numeric"
                            maxLength={18}
                            error={errors.cnpj?.message}
                            id="CNPJInput"
                        />
                    </div>

                    <div className="w-full relative flex justify-start">
                        <hr className="w-full h-px absolute border-foreground top-1/2 left-0" />
                        <h2 className="text-xl text-foreground font-sans bg-white px-2 ml-6 z-0">
                            Endereço
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 w-full gap-6">
                        <CustomFormInput
                            icon={<MapPinIcon />}
                            label="CEP*"
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
                            placeholder="Selecione o Estado da Agência*"
                            options={states}
                            selectedOptionValue={watch('state')}
                            onOptionSelected={(val) => {
                                setValue('state', val || '');
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
                            label="Bairro*"
                            registration={register('district')}
                            value={watch('district')}
                            error={errors.district?.message}
                            id="DistrictInput"
                        />

                        <CustomFormInput
                            icon={<Navigation2Icon />}
                            label="Rua*"
                            registration={register('street')}
                            value={watch('street')}
                            error={errors.street?.message}
                            id="StreetInput"
                        />

                        <CustomFormInput
                            icon={<HashIcon />}
                            label="Número*"
                            registration={register('number')}
                            onChange={(e) =>
                                handleMaskedChange('number', e, setValue)
                            }
                            value={watch('number')}
                            error={errors.number?.message}
                            id="NumberAgencyInput"
                        />

                        <CustomFormInput
                            icon={<HomeIcon />}
                            label="Complemento"
                            registration={register('complement')}
                            value={watch('complement')}
                            error={errors.complement?.message}
                            id="ComplementInput"
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
                            ? 'Adicionando Agência...'
                            : 'Adicionar Agência'}
                    </CustomButton>
                </div>
            </form>
        </div>
    );
}
