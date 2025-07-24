'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { CustomButton } from '../../../components/forms/CustomButton';
import { CustomAuthInput } from '../../../components/forms/CustomAuthInput';
import { LockIcon, MailIcon, UserIcon } from 'lucide-react';
import { RegisterFormData, registerSchema } from '../../../validations';
import { AuthService } from '../../../services/domains/authService';
import axios from 'axios';
import { toast } from 'sonner';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
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

            toast.success('Usuário cadastrado com sucesso');
            router.push('/login');
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    const errorData = error.response.data;

                    const errorMessage = errorData.message || errorData.error;
                    toast.error(errorMessage);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const handleNavigation = () => {
        router.push('/login');
    };

    return (
        <div className="min-h-svh w-full flex flex-col gap-10 items-center justify-start pt-6 pb-12 xl:pt-12">
            <Image
                width={200}
                height={200}
                src="/images/logo-vertical.svg"
                alt="Logo Fagon"
                priority
                className="w-auto h-44 md:h-52"
            />
            <form
                onSubmit={handleSubmit(onSubmit, (errors) => {
                    console.error('Form validation errors:', errors);
                })}
                className="space-y-4 bg-primary grid place-items-center shadow-md p-6 rounded-lg w-full max-w-sm md:max-w-md"
            >
                <h1 className="text-2xl text-white mb-4 text-center font-sans">
                    Faça Cadastro
                </h1>

                <div className="w-full grid place-items-center gap-8">
                    <CustomAuthInput
                        label="Nome*"
                        id="UserNameInput"
                        icon={<UserIcon />}
                        registration={register('name')}
                        error={errors.name?.message}
                        required
                    />

                    <CustomAuthInput
                        label="Email*"
                        type="email"
                        icon={<MailIcon />}
                        registration={register('email')}
                        error={errors.email?.message}
                        inputMode="email"
                        id="UserEmailInput"
                        required
                    />

                    <CustomAuthInput
                        type="password"
                        icon={<LockIcon />}
                        label="Senha*"
                        registration={register('password')}
                        error={errors.password?.message}
                        id="UserPasswordInput"
                        required
                    />

                    <CustomAuthInput
                        type="password"
                        icon={<LockIcon />}
                        label="Confirme sua senha*"
                        registration={register('confirmPassword')}
                        error={errors.confirmPassword?.message}
                        id="UserConfirmPasswordInput"
                        required
                    />
                </div>

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
