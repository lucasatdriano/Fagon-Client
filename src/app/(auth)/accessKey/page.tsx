'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { CustomButton } from '../../../components/forms/CustomButton';
import { KeyRoundIcon } from 'lucide-react';
import { CustomFormInput } from '../../../components/forms/CustomFormInput';
import { accessKeySchema, AccessKeyFormData } from '../../../validations';
import InspectorModal from '../../../components/modals/InspectorModal';
import {
    AuthService,
    LoginResponse,
} from '../../../services/domains/authService';
import { toast } from 'sonner';
import { destroyCookie, setCookie } from 'nookies';

export default function AccessKeyPage() {
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loginData, setLoginData] = useState<LoginResponse | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AccessKeyFormData>({
        resolver: zodResolver(accessKeySchema),
        mode: 'onBlur',
    });

    const onSubmit = async (data: AccessKeyFormData) => {
        setLoading(true);

        try {
            destroyCookie(null, 'authToken', { path: '/' });
            destroyCookie(null, 'accessToken', { path: '/' });
            destroyCookie(null, 'projectId', { path: '/' });

            const response = await AuthService.login({
                accessKeyToken: data.accessKey,
            });

            setLoginData(response.data);

            setCookie(null, 'accessToken', response.data.access_token, {
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            });
            setCookie(null, 'projectId', response.data.projectId, {
                maxAge: 24 * 60 * 60,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            });

            setIsModalOpen(true);
        } catch {
            toast.error('Chave de acesso expirada ou não existente');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="min-h-svh w-full flex flex-col gap-10 md:gap-16 items-center justify-start pt-6 pb-12 md:pt-16 xl:pt-32">
                <Image
                    width={200}
                    height={200}
                    src="/images/logo-vertical.svg"
                    alt="Logo Fagon"
                />
                <form
                    onSubmit={handleSubmit(onSubmit, (errors) => {
                        console.error('Form validation errors:', errors);
                    })}
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

                    <div className="pt-6">
                        <CustomButton
                            type="submit"
                            fontSize="text-lg"
                            className="w-36 hover:bg-secondary-hover"
                            disabled={loading}
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </CustomButton>
                    </div>
                </form>
            </div>

            {loginData && (
                <InspectorModal
                    isOpen={isModalOpen}
                    setIsOpen={setIsModalOpen}
                    projectId={loginData.projectId}
                />
            )}
        </>
    );
}
