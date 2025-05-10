'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CustomButton } from '@/components/forms/CustomButton';
import CustomAuthInput from '@/components/forms/CustomAuthInput';
import { LockIcon, MailIcon } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (email === 'admin@teste.com' && password === '123456') {
            document.cookie = `token=fake-token; path=/;`;
            router.push('/projects');
        } else {
            alert('Credenciais inválidas');
        }
    };

    return (
        <div className="h-screen w-full flex flex-col gap-16 items-center justify-start pt-36">
            <Image
                width={200}
                height={200}
                src="/images/logo-vertical.svg"
                alt="Logo Fagon"
                priority
            />
            <form
                onSubmit={handleLogin}
                className="space-y-4 bg-primary grid place-items-center shadow-md p-6 rounded-lg w-full max-w-sm"
            >
                <h1 className="text-3xl text-white mb-4 text-center font-sans">
                    Faça Login
                </h1>

                <div className="w-full grid place-items-center gap-8">
                    <CustomAuthInput
                        type="email"
                        icon={<MailIcon />}
                        label="Email*"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    ></CustomAuthInput>
                    <div className="w-full grid gap-0 place-items-end">
                        <CustomAuthInput
                            type="password"
                            icon={<LockIcon />}
                            label="Senha*"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        ></CustomAuthInput>
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
                        className="w-36"
                    >
                        Entrar
                    </CustomButton>
                    <CustomButton
                        type="button"
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
