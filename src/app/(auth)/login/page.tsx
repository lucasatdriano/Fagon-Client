'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { CustomButton } from '@/components/forms/CustomButton';
import { CustomAuthInput } from '@/components/forms/CustomAuthInput';
import { LockIcon, MailIcon } from 'lucide-react';
import { LoginFormData, loginSchema } from '@/validations';
import { AuthService } from '@/services/domains/authService';
import { toast } from 'sonner';

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
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);

        try {
            const response = await AuthService.login({
                ...data,
                accessKeyToken: undefined,
            });

            document.cookie = `authToken=${response.data.access_token}; path=/;`;
            router.push('/projects');
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : 'Erro desconhecido';
            setError('root', {
                type: 'manual',
                message,
            });
            toast.error(
                error instanceof Error ? error.message : 'Erro desconhecido',
            );
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
                onSubmit={handleSubmit(onSubmit, (errors) => {
                    console.error('Form validation errors:', errors);
                })}
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
                        inputMode="email"
                        error={errors.email?.message}
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
                        {loading ? 'Entrando...' : 'Entrar'}
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
