'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { CustomFormInput } from '../forms/CustomFormInput';
import {
    BrickWall,
    DraftingCompassIcon,
    UnfoldVerticalIcon,
} from 'lucide-react';
import { CustomButton } from '../forms/CustomButton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pavement } from '@/interfaces/pavement';
import { ProjectInfoFormData, projectInfoSchema } from '@/validations';

interface ProjectInformationModalProps {
    projectId: string;
}

export default function ProjectInformationModal({
    projectId,
}: ProjectInformationModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm<ProjectInfoFormData>({
        resolver: zodResolver(projectInfoSchema),
    });

    const mockPavements: Pavement[] = [
        { id: '1', pavement: 'Térreo', height: '3.6', area: '' },
        { id: '2', pavement: '1° Pavimento', height: '3.2', area: '' },
        { id: '3', pavement: '2° Pavimento', height: '3.2', area: '' },
    ];

    const [pavements, setPavements] = useState<Pavement[]>(mockPavements);

    function closeModal() {
        setIsOpen(false);
        reset();
    }

    function openModal() {
        setIsOpen(true);
        setValue('pavements', mockPavements);
    }

    const handleAreaChange = (id: string, value: string) => {
        const updatedPavements = pavements.map((pav) =>
            pav.id === id ? { ...pav, area: value } : pav,
        );
        setPavements(updatedPavements);
        setValue('pavements', updatedPavements);
    };

    const onSubmit = (data: ProjectInfoFormData) => {
        console.log('Dados validados:', {
            projectId,
            ...data,
        });
        closeModal();
    };

    return (
        <>
            <button
                type="button"
                onClick={openModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
                Adicionar Informações
            </button>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-xl font-bold leading-6 text-gray-900 border-b pb-2"
                                    >
                                        Informações Adicionais do Projeto
                                    </Dialog.Title>

                                    <form
                                        onSubmit={handleSubmit(onSubmit)}
                                        className="mt-4 space-y-6"
                                    >
                                        <div>
                                            <CustomFormInput
                                                icon={<BrickWall />}
                                                label="Tipo da estrutura*"
                                                registration={register(
                                                    'structureType',
                                                )}
                                                error={
                                                    errors.structureType
                                                        ?.message
                                                }
                                                required
                                            />
                                        </div>

                                        {pavements.map((pavement, index) => (
                                            <div key={pavement.id}>
                                                <CustomFormInput
                                                    icon={
                                                        <DraftingCompassIcon />
                                                    }
                                                    label={`Área do ${pavement.pavement}(m²)*`}
                                                    type="text"
                                                    value={pavement.area}
                                                    onChange={(e) =>
                                                        handleAreaChange(
                                                            pavement.id,
                                                            e.target.value,
                                                        )
                                                    }
                                                    error={
                                                        errors.pavements?.[
                                                            index
                                                        ]?.area?.message
                                                    }
                                                    required
                                                />
                                            </div>
                                        ))}

                                        <div>
                                            <CustomFormInput
                                                icon={<UnfoldVerticalIcon />}
                                                label="Valor Piso a Piso(m)*"
                                                type="text"
                                                registration={register(
                                                    'floorHeight',
                                                )}
                                                error={
                                                    errors.floorHeight?.message
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="flex justify-center space-x-3 pt-4 border-t">
                                            <CustomButton type="submit">
                                                Salvar e Gerar PDF
                                            </CustomButton>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
