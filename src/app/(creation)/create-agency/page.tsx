'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createAgencySchema, CreateAgencyFormValues } from '@/validations'; // Importe seu schema Zod
import { CustomButton } from '@/components/forms/CustomButton';
import { CustomFormInput } from '@/components/forms/CustomFormInput';
import {
    Building2Icon,
    FileTextIcon,
    HashIcon,
    LandmarkIcon,
    MapPinIcon,
    MapPinnedIcon,
    Navigation2Icon,
    PinIcon,
} from 'lucide-react';
import { fetchAddressByCep } from '@/utils/viacep';
import { cnpjMask } from '@/utils/masks/maskCNPJ';
import { cepMask } from '@/utils/masks/maskCEP';

export default function CreateAgencyPage() {
    const router = useRouter();

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
                    setValue('state', address.state);
                    setValue('city', address.city);
                    setValue('district', address.district);
                    setValue('street', address.street);
                }
            }
        }
        fetchAddress();
    }, [cepValue, setValue]);

    function handleMaskedChange(
        field: keyof CreateAgencyFormValues,
        e: React.ChangeEvent<HTMLInputElement>,
    ) {
        let value = e.target.value;

        if (field === 'cnpj') {
            value = cnpjMask(value);
        } else if (field === 'cep') {
            value = cepMask(value);
        }

        setValue(field, value, { shouldValidate: true });
    }

    async function onSubmit(data: CreateAgencyFormValues) {
        console.log('Dados enviados:', data);

        // Simular login/fake token
        document.cookie = `token=fake-token; path=/;`;
        router.push('/projects');
    }

    return (
        <div className="h-screen w-full flex items-center justify-center">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 bg-white grid place-items-center shadow-md p-6 rounded-lg w-full max-w-sm md:max-w-4xl"
            >
                <h1 className="text-2xl text-foreground mb-4 text-center font-sans">
                    Adicionar Nova Agência
                </h1>

                <div className="w-full grid place-items-center gap-4">
                    <div className="grid grid-cols-2 w-full gap-6">
                        <CustomFormInput
                            icon={<LandmarkIcon />}
                            label="Nome da Agência*"
                            registration={register('name')}
                            error={errors.name?.message}
                        />
                        <CustomFormInput
                            icon={<HashIcon />}
                            label="Número da Agência*"
                            registration={register('agencyNumber')}
                            error={errors.agencyNumber?.message}
                        />
                        <CustomFormInput
                            icon={<FileTextIcon />}
                            label="CNPJ"
                            registration={register('cnpj')}
                            value={watch('cnpj')}
                            onChange={(e) => handleMaskedChange('cnpj', e)}
                            maxLength={18}
                            error={errors.cnpj?.message}
                        />
                    </div>

                    <div className="w-full relative flex justify-start">
                        <hr className="w-full h-px absolute border-foreground top-1/2 left-0" />
                        <h2 className="text-xl text-foreground font-sans bg-white px-2 ml-6 z-0">
                            Endereço
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 w-full gap-6">
                        <CustomFormInput
                            icon={<MapPinIcon />}
                            label="CEP*"
                            registration={register('cep')}
                            value={watch('cep')}
                            onChange={(e) => handleMaskedChange('cep', e)}
                            maxLength={9}
                            error={errors.cep?.message}
                            required
                        />
                        <CustomFormInput
                            icon={<PinIcon />}
                            label="Estado*"
                            registration={register('state')}
                            value={watch('state')}
                            disabled
                            error={errors.state?.message}
                        />
                        <CustomFormInput
                            icon={<Building2Icon />}
                            label="Município*"
                            registration={register('city')}
                            value={watch('city')}
                            disabled
                            error={errors.city?.message}
                        />
                        <CustomFormInput
                            icon={<MapPinnedIcon />}
                            label="Bairro*"
                            registration={register('district')}
                            value={watch('district')}
                            disabled
                            error={errors.district?.message}
                        />
                        <CustomFormInput
                            icon={<Navigation2Icon />}
                            label="Rua*"
                            registration={register('street')}
                            value={watch('street')}
                            disabled
                            error={errors.street?.message}
                        />
                        <CustomFormInput
                            icon={<HashIcon />}
                            label="Número*"
                            registration={register('number')}
                            error={errors.number?.message}
                            required
                        />
                    </div>
                </div>

                <div className="grid gap-4 pt-4">
                    <CustomButton
                        type="submit"
                        fontSize="text-lg"
                        className="hover:bg-secondary-hover"
                    >
                        Adicionar Agência
                    </CustomButton>
                </div>
            </form>
        </div>
    );
}
