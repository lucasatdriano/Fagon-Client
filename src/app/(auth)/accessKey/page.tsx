'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { CustomButton } from '@/components/forms/CustomButton';
import { KeyRoundIcon } from 'lucide-react';
import { CustomFormInput } from '@/components/forms/CustomFormInput';
import { accessKeySchema, AccessKeyFormData } from '@/validations';

export default function AccessKeyPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<AccessKeyFormData>({
        resolver: zodResolver(accessKeySchema),
        mode: 'onBlur',
    });

    const onSubmit = async (data: AccessKeyFormData) => {
        setLoading(true);

        try {
            const response = await fetch('/api/auth/access-key', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ accessKey: data.accessKey }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || 'Chave de acesso inválida',
                );
            }

            document.cookie = `token=${(await response.json()).token}; path=/;`;
            router.push('/projects');
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError('root', {
                    type: 'manual',
                    message: error.message,
                });
            } else {
                setError('root', {
                    type: 'manual',
                    message: 'Erro desconhecido',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex flex-col gap-10 md:gap-16 items-center justify-start pt-6 md:pt-32">
            <Image
                width={200}
                height={200}
                src="/images/logo-vertical.svg"
                alt="Logo Fagon"
                priority
            />
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 bg-primary grid place-items-center shadow-md p-6 rounded-lg w-full max-w-sm md:max-w-md"
            >
                <h1 className="text-2xl text-white mb-4 text-center font-sans">
                    Insira sua Chave de Acesso
                </h1>

                <div className="w-full grid place-items-center gap-8">
                    <CustomFormInput
                        icon={<KeyRoundIcon />}
                        label="Chave de Acesso*"
                        registration={register('accessKey')}
                        error={errors.accessKey?.message}
                        required
                    />
                </div>

                {errors.root && (
                    <p className="text-red-500 text-sm mt-2 text-center">
                        {errors.root.message}
                    </p>
                )}

                <div className="pt-6">
                    <CustomButton
                        type="submit"
                        fontSize="text-lg"
                        className="w-36 hover:bg-secondary-hover"
                        disabled={loading}
                    >
                        {loading ? 'Carregando...' : 'Entrar'}
                    </CustomButton>
                </div>
            </form>
        </div>
    );
}
