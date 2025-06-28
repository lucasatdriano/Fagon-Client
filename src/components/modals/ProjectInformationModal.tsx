'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { CustomFormInput } from '../forms/CustomFormInput';
import {
    BrickWall,
    DraftingCompassIcon,
    UnfoldVerticalIcon,
} from 'lucide-react';
import { CustomButton } from '../forms/CustomButton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProjectInfoFormData, projectInfoSchema } from '@/validations';
import { ProjectService } from '@/services/domains/projectService';
import { PdfService } from '@/services/domains/pdfService';
import { toast } from 'sonner';
import { PavementService } from '@/services/domains/pavementService';

interface ProjectInformationModalProps {
    projectId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface PavementUpdate {
    id: string;
    pavement: string;
    area?: string;
}

export default function ProjectInformationModal({
    projectId,
    isOpen,
    onClose,
    onSuccess,
}: ProjectInformationModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        reset,
    } = useForm<ProjectInfoFormData>({
        resolver: zodResolver(projectInfoSchema),
    });

    const [pavements, setPavements] = useState<PavementUpdate[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadPavements = async () => {
            setIsLoading(true);
            try {
                const pavementsData = await PavementService.getByProject(
                    projectId,
                );
                const formattedPavements = Array.isArray(pavementsData)
                    ? pavementsData.map((p) => ({
                          id: p.id,
                          pavement: p.pavement,
                          area: p.area || '',
                      }))
                    : [];

                setPavements(formattedPavements);
                setValue('pavements', formattedPavements);
            } catch (error) {
                console.error('Erro ao carregar pavimentos:', error);
                toast.error('Erro ao carregar informações dos pavimentos');
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen) {
            loadPavements();
        }
    }, [projectId, isOpen, setValue]);

    const handleAreaChange = (id: string, value: string) => {
        const updatedPavements = pavements.map((pav) =>
            pav.id === id ? { ...pav, area: value } : pav,
        );
        setPavements(updatedPavements);
        setValue('pavements', updatedPavements);
    };

    const onSubmit = async (data: ProjectInfoFormData) => {
        try {
            // Converte floorHeight para number
            const floorHeightNumber = parseFloat(data.floorHeight);

            // 1. Atualiza o projeto com os dados adicionais
            await ProjectService.update(projectId, {
                structureType: data.structureType,
                floorHeight: floorHeightNumber,
                pavements: data.pavements?.map((p) => ({
                    id: p.id,
                    pavement: p.pavement,
                    area: p.area,
                })),
            });

            // 2. Gera o PDF
            await PdfService.generate({
                projectId,
                pdfType: 'laudo_avaliacao',
            });

            toast.success('Laudo de avaliação gerado com sucesso!');
            onSuccess();
            onClose();
            reset();
        } catch (error) {
            toast.error('Erro ao gerar laudo de avaliação');
            console.error(error);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
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
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 border-b pb-4"
                                >
                                    Informações para Laudo de Avaliação
                                </Dialog.Title>

                                {isLoading ? (
                                    <div className="flex justify-center items-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    </div>
                                ) : (
                                    <form
                                        onSubmit={handleSubmit(onSubmit)}
                                        className="mt-4 space-y-4"
                                    >
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <CustomFormInput
                                                icon={
                                                    <BrickWall className="h-5 w-5" />
                                                }
                                                label="Tipo da estrutura*"
                                                registration={register(
                                                    'structureType',
                                                )}
                                                error={
                                                    errors.structureType
                                                        ?.message
                                                }
                                                placeholder="Ex: Concreto armado"
                                                required
                                            />

                                            <CustomFormInput
                                                icon={
                                                    <UnfoldVerticalIcon className="h-5 w-5" />
                                                }
                                                label="Valor Piso a Piso (m)*"
                                                type="number"
                                                step="0.01"
                                                registration={register(
                                                    'floorHeight',
                                                    {
                                                        setValueAs: (v) =>
                                                            v === ''
                                                                ? undefined
                                                                : parseFloat(v),
                                                    },
                                                )}
                                                error={
                                                    errors.floorHeight?.message
                                                }
                                                placeholder="Ex: 3.20"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-medium text-gray-900">
                                                Áreas dos Pavimentos (m²)
                                            </h4>
                                            {pavements.length > 0 ? (
                                                pavements.map(
                                                    (pavement, index) => (
                                                        <CustomFormInput
                                                            key={pavement.id}
                                                            icon={
                                                                <DraftingCompassIcon className="h-5 w-5" />
                                                            }
                                                            label={`Área do ${pavement.pavement}*`}
                                                            type="number"
                                                            step="0.01"
                                                            value={
                                                                pavement.area ||
                                                                ''
                                                            }
                                                            onChange={(e) =>
                                                                handleAreaChange(
                                                                    pavement.id,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            error={
                                                                errors
                                                                    .pavements?.[
                                                                    index
                                                                ]?.area?.message
                                                            }
                                                            placeholder="Digite a área"
                                                            required
                                                        />
                                                    ),
                                                )
                                            ) : (
                                                <p className="text-gray-500">
                                                    Nenhum pavimento encontrado
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex justify-end space-x-3 pt-4 border-t">
                                            <CustomButton
                                                onClick={onClose}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
                                            >
                                                Cancelar
                                            </CustomButton>
                                            <CustomButton
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="px-4 py-2 text-sm"
                                            >
                                                {isSubmitting
                                                    ? 'Gerando...'
                                                    : 'Gerar Laudo'}
                                            </CustomButton>
                                        </div>
                                    </form>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
