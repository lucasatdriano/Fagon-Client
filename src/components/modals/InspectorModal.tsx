'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { CustomFormInput } from '../forms/CustomFormInput';
import { SaveIcon, User2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { InspectorFormData, inspectorSchema } from '../../validations';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomButton } from '../forms/CustomButton';
import { Project, ProjectService } from '../../services/domains/projectService';

type InspectorModalProps = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    projectId: string;
};

export default function InspectorModal({
    isOpen,
    setIsOpen,
    projectId,
}: InspectorModalProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [project, setProject] = useState<Project | null>(null);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        reset,
    } = useForm<InspectorFormData>({
        resolver: zodResolver(inspectorSchema),
        mode: 'onBlur',
    });

    useEffect(() => {
        if (isOpen && projectId) {
            const fetchProject = async () => {
                try {
                    setLoading(true);
                    const response = await ProjectService.getById(projectId);
                    setProject(response.data);
                    setFetchError(null);

                    if (response.data.inspectorName) {
                        reset({ nameInspector: response.data.inspectorName });
                    }
                } catch (err) {
                    console.error('Erro ao carregar projeto:', err);
                    setFetchError('Falha ao carregar projeto');
                } finally {
                    setLoading(false);
                }
            };

            fetchProject();
        }
    }, [isOpen, projectId, reset]);

    const onSubmit = async (data: InspectorFormData) => {
        setLoading(true);

        try {
            const inspectionDate = new Date().toISOString();

            const updateData = {
                inspectorName: data.nameInspector,
                inspectionDate: inspectionDate,
                status: 'vistoria_em_progresso',
            };

            await ProjectService.update(projectId, updateData);

            setIsOpen(false);
            router.push(`/projects/${projectId}/locations`);
        } catch (error: unknown) {
            setError('root', {
                type: 'manual',
                message:
                    error instanceof Error
                        ? error.message
                        : 'Erro ao salvar informações do vistoriador',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-50"
                onClose={() => null}
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
                                        ? `Projeto ${project.agency.city} -
                                              ${project.agency.district}`
                                        : fetchError || 'Carregando projeto...'}
                                </Dialog.Title>

                                <form
                                    onSubmit={handleSubmit(
                                        onSubmit,
                                        (errors) => {
                                            console.error(
                                                'Form validation errors:',
                                                errors,
                                            );
                                        },
                                    )}
                                    className="mt-6 space-y-4 text-start"
                                >
                                    <CustomFormInput
                                        icon={<User2Icon />}
                                        label="Nome do Vistoriador*"
                                        registration={register('nameInspector')}
                                        error={errors.nameInspector?.message}
                                        id="InspectorNameInput"
                                        defaultValue={project?.inspectorName}
                                        disabled={loading || !project}
                                        required
                                    />

                                    {errors.root?.message && (
                                        <p className="text-red-500 text-sm text-center">
                                            {errors.root.message}
                                        </p>
                                    )}

                                    <div className="flex justify-center space-x-3 pt-4">
                                        <CustomButton
                                            type="submit"
                                            icon={<SaveIcon />}
                                            disabled={loading || !project}
                                        >
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
