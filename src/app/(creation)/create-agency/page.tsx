'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { agencyProps } from '@/interfaces/agency';
import { fetchAddressByCep } from '@/utils/viacep';
import { cnpjMask } from '@/utils/masks/maskCNPJ';
import { cepMask } from '@/utils/masks/maskCEP';

export default function CreateProjectPage() {
    const router = useRouter();
    type CreateAgencyForm = Omit<agencyProps, 'id'>;
    const [form, setForm] = useState<CreateAgencyForm>({
        name: '',
        agencyNumber: '',
        cnpj: '',
        cep: '',
        state: '',
        city: '',
        district: '',
        street: '',
        number: '',
    });

    const handleChange =
        (field: keyof CreateAgencyForm) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            let value = e.target.value;

            switch (field) {
                case 'cnpj':
                    value = cnpjMask(value);
                    break;
                case 'cep':
                    value = cepMask(value);
                    break;
                default:
                    break;
            }

            setForm((prev) => ({ ...prev, [field]: value }));
        };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        document.cookie = `token=fake-token; path=/;`;
        router.push('/projects');
    };

    return (
        <div className="h-screen w-full flex items-center justify-center">
            <form
                onSubmit={handleLogin}
                className="space-y-4 bg-primary grid place-items-center shadow-md p-6 rounded-lg w-full max-w-sm md:max-w-4xl"
            >
                <h1 className="text-2xl text-white mb-4 text-center font-sans">
                    Adicionar Nova Agência
                </h1>

                <div className="w-full grid place-items-center gap-4">
                    <div className="grid grid-cols-2 w-full gap-6">
                        <CustomFormInput
                            icon={<LandmarkIcon />}
                            label="Nome da Agência*"
                            onChange={handleChange('name')}
                            value={form.name}
                            required
                        />
                        <CustomFormInput
                            icon={<HashIcon />}
                            label="Número da Agência*"
                            onChange={handleChange('agencyNumber')}
                            value={form.agencyNumber}
                            required
                        />
                        <CustomFormInput
                            icon={<FileTextIcon />}
                            label="CNPJ"
                            onChange={handleChange('cnpj')}
                            value={form.cnpj!}
                            maxLength={18}
                        />
                    </div>
                    <div className="w-full relative flex justify-start">
                        <hr className="w-full h-px absolute border-background top-1/2 left-0" />
                        <h2 className="text-2xl text-background font-sans bg-primary px-2 ml-6 z-0">
                            Endereço
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 w-full gap-6">
                        <CustomFormInput
                            icon={<MapPinIcon />}
                            label="CEP*"
                            onChange={handleChange('cep')}
                            onBlur={async () => {
                                const cleanedCep = form.cep.replace(/\D/g, '');
                                if (cleanedCep.length === 8) {
                                    const address = await fetchAddressByCep(
                                        form.cep,
                                    );
                                    if (address) {
                                        setForm((prev) => ({
                                            ...prev,
                                            state: address.state,
                                            city: address.city,
                                            district: address.district,
                                            street: address.street,
                                        }));
                                    }
                                }
                            }}
                            value={form.cep}
                            maxLength={9}
                            required
                        />
                        <CustomFormInput
                            icon={<PinIcon />}
                            label="Estado*"
                            onChange={handleChange('state')}
                            value={form.state}
                            required
                            disabled
                        />
                        <CustomFormInput
                            icon={<Building2Icon />}
                            label="Município*"
                            onChange={handleChange('city')}
                            value={form.city}
                            required
                            disabled
                        />
                        <CustomFormInput
                            icon={<MapPinnedIcon />}
                            label="Bairro*"
                            onChange={handleChange('district')}
                            value={form.district}
                            required
                            disabled
                        />
                        <CustomFormInput
                            icon={<Navigation2Icon />}
                            label="Rua*"
                            onChange={handleChange('street')}
                            value={form.street}
                            required
                            disabled
                        />
                        <CustomFormInput
                            icon={<HashIcon />}
                            label="Número*"
                            onChange={handleChange('number')}
                            value={form.number}
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
