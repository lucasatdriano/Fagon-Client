'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CustomButton } from '@/components/forms/CustomButton';
import CustomAuthInput from '@/components/forms/CustomAuthInput';
import { LockIcon, MailIcon } from 'lucide-react';
import { LoginForm } from '@/interfaces/login';

export default function LoginPage() {
    const [form, setForm] = useState<LoginForm>({
        email: '',
        password: '',
    });

    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (form.email === 'admin@teste.com' && form.password === '123456') {
            document.cookie = `token=fake-token; path=/;`;
            router.push('/projects');
        } else {
            alert('Credenciais inválidas');
        }
    };

    const handleChange =
        (field: keyof LoginForm) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setForm((prev) => ({ ...prev, [field]: e.target.value }));
        };

    const handleNavegation = () => {
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
                onSubmit={handleLogin}
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
                        value={form.email}
                        onChange={handleChange('email')}
                        required
                    />
                    <div className="w-full grid gap-0 place-items-end">
                        <CustomAuthInput
                            type="password"
                            icon={<LockIcon />}
                            label="Senha*"
                            value={form.password}
                            onChange={handleChange('password')}
                            maxLength={14}
                            required
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
                <div className="grid gap-4 pt-4">
                    <CustomButton
                        type="submit"
                        fontSize="text-lg"
                        className="w-36 hover:bg-secondary-hover"
                    >
                        Entrar
                    </CustomButton>
                    <CustomButton
                        type="button"
                        onClick={handleNavegation}
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
