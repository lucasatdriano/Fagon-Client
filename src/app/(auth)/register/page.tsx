'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { CustomButton } from '@/components/forms/CustomButton';
import { CustomAuthInput } from '@/components/forms/CustomAuthInput';
import { LockIcon, MailIcon, UserIcon } from 'lucide-react';
import { RegisterFormData, registerSchema } from '@/validations';
import { AuthService } from '@/services/domains/authService';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('token='))
            ?.split('=')[1];

        if (token) {
            router.push('/projects');
            return;
        }
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: 'onBlur',
    });

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true);

        try {
            await AuthService.register({
                name: data.name,
                email: data.email,
                password: data.password,
            });

            router.push('/login');
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

    const handleNavigation = () => {
        router.push('/login');
    };

    return (
        <div className="h-screen w-full flex flex-col gap-10 items-center justify-start pt-6 md:pt-12">
            <Image
                width={0}
                height={0}
                src="/images/logo-vertical.svg"
                alt="Logo Fagon"
                priority
                className="w-44 h-44 md:w-56 md:h-56"
            />
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 bg-primary grid place-items-center shadow-md p-6 rounded-lg w-full max-w-sm md:max-w-md"
            >
                <h1 className="text-2xl text-white mb-4 text-center font-sans">
                    Faça Cadastro
                </h1>

                <div className="w-full grid place-items-center gap-8">
                    <CustomAuthInput
                        icon={<UserIcon />}
                        label="Nome*"
                        registration={register('name')}
                        error={errors.name?.message}
                        required
                    />

                    <CustomAuthInput
                        type="email"
                        icon={<MailIcon />}
                        label="Email*"
                        registration={register('email')}
                        error={errors.email?.message}
                        required
                    />

                    <CustomAuthInput
                        type="password"
                        icon={<LockIcon />}
                        label="Senha*"
                        registration={register('password')}
                        error={errors.password?.message}
                        required
                    />

                    <CustomAuthInput
                        type="password"
                        icon={<LockIcon />}
                        label="Confirme sua senha*"
                        registration={register('confirmPassword')}
                        error={errors.confirmPassword?.message}
                        required
                    />
                </div>

                {errors.root && (
                    <p className="text-error text-sm mt-2 text-center">
                        {errors.root.message}
                    </p>
                )}

                <div className="grid gap-4 pt-8">
                    <CustomButton
                        type="submit"
                        fontSize="text-lg"
                        className="w-48 hover:bg-secondary-hover"
                        disabled={loading}
                    >
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </CustomButton>

                    <CustomButton
                        type="button"
                        onClick={handleNavigation}
                        ghost
                        fontSize="text-lg"
                        className="w-48"
                    >
                        Voltar ao Login
                    </CustomButton>
                </div>
            </form>
        </div>
    );
}
