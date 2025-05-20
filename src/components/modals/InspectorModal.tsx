'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { CustomFormInput } from '../forms/CustomFormInput';
import { User2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { InspectorFormData, inspectorSchema } from '@/validations';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomButton } from '../forms/CustomButton';
import { parseCookies } from 'nookies';
import { ProjectProps } from '@/interfaces/project';

type Props = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
};

export default function InspectorModal({ isOpen, setIsOpen }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [project, setProject] = useState<ProjectProps>();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<InspectorFormData>({
        resolver: zodResolver(inspectorSchema),
        mode: 'onBlur',
    });

    useEffect(() => {
        if (isOpen) {
            const { token } = parseCookies();
            fetch('/api/project-from-token', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => setProject(data))
                .catch((err) => console.error('Erro ao buscar projeto:', err));
        }
    }, [isOpen]);

    const onSubmit = async (data: InspectorFormData) => {
        setLoading(true);

        try {
            const response = await fetch('/api/auth/access-key', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nameInspector: data.nameInspector }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || 'Chave de acesso inválida',
                );
            }

            document.cookie = `token=${(await response.json()).token}; path=/;`;
            setIsOpen(false);
            router.push('/projects');
        } catch (error: unknown) {
            setError('root', {
                type: 'manual',
                message:
                    error instanceof Error
                        ? error.message
                        : 'Erro desconhecido',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                onClose={() => {}}
                static
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-4 shadow-xl transition-all">
                                <Dialog.Title
                                    as="h1"
                                    className="text-xl font-medium text-center text-gray-900"
                                >
                                    {project
                                        ? `Projeto: ${project.upeCode}`
                                        : 'Carregando projeto...'}
                                </Dialog.Title>

                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                    className="mt-6 space-y-4 text-start"
                                >
                                    <label className="block text-sm ml-6 font-medium text-gray-700">
                                        Nome do Vistoriador:
                                    </label>
                                    <CustomFormInput
                                        icon={<User2Icon />}
                                        label="Nome do Vistoriador*"
                                        registration={register('nameInspector')}
                                        error={errors.nameInspector?.message}
                                        required
                                    />

                                    <div className="flex justify-center space-x-3 pt-4">
                                        <CustomButton type="submit">
                                            {loading
                                                ? 'Salvando...'
                                                : 'Salvar Informações'}
                                        </CustomButton>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
