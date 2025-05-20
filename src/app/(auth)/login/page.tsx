'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { CustomButton } from '@/components/forms/CustomButton';
import { CustomAuthInput } from '@/components/forms/CustomAuthInput';
import { EditIcon, LockIcon, MailIcon } from 'lucide-react';
import { LoginFormData, loginSchema } from '@/validations';
import { CustomEditInput } from '@/components/forms/CustomEditInput';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onTouched',
        defaultValues: {
            email: 'João Silva',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro no login');
            }

            document.cookie = `token=${(await response.json()).token}; path=/;`;
            document.cookie = `role=${(await response.json()).role}; path=/;`;
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

    const handleNavigation = () => {
        router.push('/register');
    };

    return (
        <div className="h-screen w-full flex flex-col gap-10 items-center justify-start pt-6 md:pt-20">
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
                    Faça Login
                </h1>

                <div className="w-full grid place-items-center gap-8">
                    <CustomAuthInput
                        type="email"
                        icon={<MailIcon />}
                        label="Email*"
                        registration={register('email')}
                        error={errors.email?.message}
                    />
                    <CustomEditInput
                        label="Nome completo"
                        icon={<EditIcon />}
                        defaultValue="usuario@exemplo.com"
                        registration={register('email')}
                        className="mt-4"
                        required
                    />
                    <div className="w-full grid gap-0 place-items-end">
                        <CustomAuthInput
                            type="password"
                            icon={<LockIcon />}
                            label="Senha*"
                            registration={register('password')}
                            error={errors.password?.message}
                        />
                        <CustomButton
                            type="button"
                            ghost
                            fontSize="text-sm"
                            className="hover:border-transparent no-underline hover:underline font-poppins"
                        >
                            Esqueceu sua senha?
                        </CustomButton>
                    </div>
                </div>

                {errors.root && (
                    <p className="text-error text-sm mt-2 text-center">
                        {errors.root.message}
                    </p>
                )}

                <div className="grid gap-4 pt-4">
                    <CustomButton
                        type="submit"
                        fontSize="text-lg"
                        className="w-36 hover:bg-secondary-hover"
                        disabled={loading}
                    >
                        {loading ? 'Carregando...' : 'Entrar'}
                    </CustomButton>
                    <CustomButton
                        type="button"
                        onClick={handleNavigation}
                        ghost
                        fontSize="text-lg"
                        className="w-36"
                    >
                        Cadastre-se
                    </CustomButton>
                </div>
            </form>
        </div>
    );
}
