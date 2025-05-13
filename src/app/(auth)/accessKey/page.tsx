'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CustomButton } from '@/components/forms/CustomButton';
import { KeyRoundIcon } from 'lucide-react';
import CustomFormInput from '@/components/forms/CustomFormInput';

export default function AccessKeyPage() {
    const [accessKey, setAccessKey] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (accessKey === 'admin@teste.com') {
            document.cookie = `token=fake-token; path=/;`;
            router.push('/projects');
        } else {
            alert('Credenciais inválidas');
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
                onSubmit={handleLogin}
                className="space-y-4 bg-primary grid place-items-center shadow-md p-6 rounded-lg w-full max-w-sm md:max-w-md"
            >
                <h1 className="text-2xl text-white mb-4 text-center font-sans">
                    Insira sua Chave de Acesso
                </h1>

                <div className="w-full grid place-items-center gap-8">
                    <CustomFormInput
                        icon={<KeyRoundIcon />}
                        label="Chave de Acesso*"
                        value={accessKey}
                        onChange={(e) => setAccessKey(e.target.value)}
                        required
                    ></CustomFormInput>
                </div>
                <div className="pt-6">
                    <CustomButton
                        type="submit"
                        fontSize="text-lg"
                        className="w-36 hover:bg-secondary-hover"
                    >
                        Entrar
                    </CustomButton>
                </div>
            </form>
        </div>
    );
}
