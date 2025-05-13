'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CustomButton } from '@/components/forms/CustomButton';
import CustomAuthInput from '@/components/forms/CustomAuthInput';
import { LockIcon, MailIcon, UserIcon } from 'lucide-react';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (email === 'admin@teste.com' && password === '123456') {
            document.cookie = `token=fake-token; path=/;`;
            router.push('/projects');
        } else {
            alert('Credenciais inválidas');
        }
    };

    const handleNavegation = () => {
        router.push('/login');
    };

    return (
        <div className="h-screen w-full flex flex-col gap-10 items-center justify-start pt-6 md:pt-12">
            <Image
                width={200}
                height={200}
                src="/images/logo-vertical.svg"
                alt="Logo Fagon"
                priority
            />
            <form
                onSubmit={handleRegister}
                className="space-y-4 bg-primary grid place-items-center shadow-md p-6 rounded-lg w-full max-w-sm md:max-w-md"
            >
                <h1 className="text-2xl text-white mb-4 text-center font-sans">
                    Faça Cadastro
                </h1>
                <div className="w-full grid place-items-center gap-8">
                    <CustomAuthInput
                        icon={<UserIcon />}
                        label="Nome*"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    ></CustomAuthInput>
                    <CustomAuthInput
                        type="email"
                        icon={<MailIcon />}
                        label="Email*"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    ></CustomAuthInput>
                    <CustomAuthInput
                        type="password"
                        icon={<LockIcon />}
                        label="Senha*"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        maxLength={14}
                        required
                    ></CustomAuthInput>
                    <CustomAuthInput
                        type="password"
                        icon={<LockIcon />}
                        label="Confirme sua senha*"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        maxLength={14}
                        required
                    ></CustomAuthInput>
                </div>
                <div className="grid gap-4 pt-8">
                    <CustomButton
                        type="submit"
                        fontSize="text-lg"
                        className="w-48 hover:bg-secondary-hover"
                    >
                        Cadastrar
                    </CustomButton>
                    <CustomButton
                        type="button"
                        onClick={handleNavegation}
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
