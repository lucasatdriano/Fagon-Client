'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomEditInput } from '@/components/forms/CustomEditInput';
import { CustomButton } from '@/components/forms/CustomButton';
import { UpdateAgencyFormValues, updateAgencySchema } from '@/validations';

export default function AgencyEditPage({ params }: { params: { id: string } }) {
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState('');
    const [isDirty, setIsDirty] = useState(false);
    const [initialValues, setInitialValues] =
        useState<UpdateAgencyFormValues | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<UpdateAgencyFormValues>({
        resolver: zodResolver(updateAgencySchema),
    });

    const formValues = watch();

    useEffect(() => {
        if (initialValues) {
            const hasChanged = Object.keys(initialValues).some(
                (key) =>
                    formValues[key as keyof UpdateAgencyFormValues] !==
                    initialValues[key as keyof UpdateAgencyFormValues],
            );
            setIsDirty(hasChanged);
        }
    }, [formValues, initialValues]);

    useEffect(() => {
        const fetchAgencyData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/agencies/${params.id}`);
                const data = await response.json();

                if (response.ok) {
                    const initialData = {
                        agencyNumber: data.agency_number.toString(),
                        cnpj: data.cnpj || '',
                        cep: data.cep,
                        state: data.state,
                        city: data.city,
                        district: data.district,
                        street: data.street,
                        number: data.number.toString(),
                    };

                    setInitialValues(initialData);

                    Object.entries(initialData).forEach(([key, value]) => {
                        setValue(key as keyof UpdateAgencyFormValues, value);
                    });
                } else {
                    setApiError('Falha ao carregar dados da agência');
                }
            } catch (error) {
                setApiError('Erro na conexão com o servidor');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAgencyData();
    }, [params.id, setValue]);

    const onSubmit = async (data: UpdateAgencyFormValues) => {
        try {
            const response = await fetch(`/api/agencies/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    agency_number: data.agencyNumber,
                    cnpj: data.cnpj || null,
                    cep: data.cep,
                    state: data.state,
                    city: data.city,
                    district: data.district,
                    street: data.street,
                    number: data.number,
                }),
            });

            if (response.ok) {
                setInitialValues(data);
                setIsDirty(false);
                alert('Agência atualizada com sucesso!');
            } else {
                throw new Error('Falha ao atualizar agência');
            }
        } catch (error) {
            setApiError('Erro ao salvar as alterações');
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
            <div className="w-3/5 bg-white rounded-lg shadow-md overflow-hidden">
                {/* <div className="flex items-center justify-center py-4 px-12">
                    <h1 className="text-2xl font-bold">
                        Agência - {city} - {district}
                    </h1>
                </div> */}
                <div className="flex items-center justify-center py-4 px-12">
                    <h1 className="text-2xl font-bold">
                        Agência - Salvador - Pituba
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
                        {/* <h2 className="text-xl font-semibold text-gray-800">
                            Ag. {agencyNumber}
                        </h2> */}
                        <h2 className="text-xl font-semibold text-gray-800">
                            Ag. 0334
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <CustomEditInput
                            label="Número da Agência"
                            registration={register('agencyNumber')}
                            error={errors.agencyNumber?.message}
                            defaultValue="0334"
                            textColor="text-foreground"
                        />

                        <CustomEditInput
                            label="CNPJ"
                            registration={register('cnpj')}
                            error={errors.cnpj?.message}
                            defaultValue="60.701.190/0758-80"
                            textColor="text-foreground"
                        />

                        <CustomEditInput
                            label="CEP"
                            registration={register('cep')}
                            error={errors.cep?.message}
                            defaultValue="41830-001"
                            textColor="text-foreground"
                        />

                        <CustomEditInput
                            label="Estado"
                            registration={register('state')}
                            error={errors.state?.message}
                            defaultValue="Bahia"
                            textColor="text-foreground"
                            disabled
                        />

                        <CustomEditInput
                            label="Cidade"
                            registration={register('city')}
                            error={errors.city?.message}
                            defaultValue="Salvador"
                            textColor="text-foreground"
                            disabled
                        />

                        <CustomEditInput
                            label="Bairro"
                            registration={register('district')}
                            error={errors.district?.message}
                            defaultValue="Pituba"
                            textColor="text-foreground"
                            disabled
                        />

                        <CustomEditInput
                            label="Rua"
                            registration={register('street')}
                            error={errors.street?.message}
                            defaultValue="Av. Manoel Dias da Silva"
                            textColor="text-foreground"
                            disabled
                        />

                        <CustomEditInput
                            label="Número"
                            registration={register('number')}
                            error={errors.number?.message}
                            defaultValue="1832"
                            textColor="text-foreground"
                        />
                    </div>

                    <div className="flex justify-center pt-4">
                        <CustomButton type="submit" disabled={!isDirty}>
                            Salvar Informações
                        </CustomButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
